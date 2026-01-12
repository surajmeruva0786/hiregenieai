import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, Send, Sparkles, AlertCircle } from 'lucide-react';
import VideoCall from '../../components/interview/VideoCall';
import AIInterviewer from '../../components/interview/AIInterviewer';
import { useInterview } from '../../hooks/useInterview';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function TakeInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [interview, setInterview] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { getInterview, startRealtimeSession, loading } = useInterview();
  const {
    isConnected,
    connect,
    disconnect,
    joinInterview,
    startRealtimeSession: wsStartSession,
    submitAnswer: wsSubmitAnswer,
    requestFeedback,
    on,
    off,
  } = useWebSocket();

  // Load interview data
  useEffect(() => {
    if (id) {
      loadInterview();
    }
  }, [id]);

  // Connect WebSocket
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Setup WebSocket listeners
  useEffect(() => {
    if (!isConnected) return;

    on('session-started', (data: any) => {
      setSessionId(data.sessionId);
      if (data.firstQuestion) {
        setQuestions([data.firstQuestion]);
        setCurrentQuestion(0);
      }
    });

    on('answer-evaluated', (data: any) => {
      setIsSubmitting(false);

      if (data.isComplete) {
        // Interview complete
        navigate('/student/interviews');
      } else if (data.followUpQuestion) {
        // Add follow-up question
        setQuestions(prev => [...prev, { content: data.followUpQuestion, speaker: 'interviewer' }]);
      } else if (data.nextQuestion) {
        // Move to next question
        setCurrentQuestion(prev => prev + 1);
      }
    });

    on('feedback-update', (data: any) => {
      setFeedback(data);
    });

    on('error', (data: any) => {
      setError(data.message);
      setIsSubmitting(false);
    });

    return () => {
      off('session-started');
      off('answer-evaluated');
      off('feedback-update');
      off('error');
    };
  }, [isConnected, on, off, navigate]);

  // Timer
  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isStarted, timeLeft]);

  // Request feedback periodically
  useEffect(() => {
    if (isStarted && sessionId) {
      const interval = setInterval(() => {
        requestFeedback(sessionId);
      }, 10000); // Every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isStarted, sessionId, requestFeedback]);

  const loadInterview = async () => {
    try {
      const data = await getInterview(id!);
      setInterview(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    try {
      setIsStarted(true);

      // Join interview room
      if (id) {
        const userId = localStorage.getItem('userId') || 'user-1';
        joinInterview(id, userId);

        // Start real-time session
        wsStartSession(id);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !sessionId) return;

    setIsSubmitting(true);
    try {
      wsSubmitAnswer(sessionId, userAnswer, false);
      setUserAnswer('');
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (loading && !interview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-red-900 text-xl font-semibold mb-2">Error Loading Interview</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/student/interviews')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ready to Start Your AI Interview?</h1>
            <p className="text-gray-600">
              {interview?.jobId || 'Position'} - AI Technical Interview
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-purple-50 border border-purple-200 rounded-xl text-center">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">45 Minutes</h3>
              <p className="text-gray-600">Total Duration</p>
            </div>
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <CheckCircle2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">5-10 Questions</h3>
              <p className="text-gray-600">To Answer</p>
            </div>
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
              <Sparkles className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Powered</h3>
              <p className="text-gray-600">Smart Assessment</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Before You Start:</h3>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Make sure you're in a quiet place with good internet connection</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Enable your camera and microphone for the best experience</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Answer questions clearly and take your time</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>The AI will adapt questions based on your responses</span>
              </li>
            </ul>
          </div>

          {!isConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800 text-sm">Connecting to interview server...</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/student/interviews')}
              className="flex-1 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleStart}
              disabled={!isConnected}
              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnected ? 'Start Interview' : 'Connecting...'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Interview Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timer & Progress */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <span className="text-lg font-semibold text-gray-900">{formatTime(timeLeft)}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">
                  Question {currentQuestion + 1}
                </span>
              </div>
              {feedback && (
                <div className="text-sm text-gray-600">
                  Score: <span className="font-semibold text-indigo-600">{feedback.averageScore}/10</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Video Feed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-video"
          >
            <VideoCall />
          </motion.div>

          {/* Answer Input */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>

              <div className="space-y-4">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                  disabled={isSubmitting}
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || !userAnswer.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Answer
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar - AI Interviewer */}
        <div>
          <AIInterviewer
            currentQuestion={currentQ?.content}
            questionType={interview?.interviewType}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            feedback={feedback}
            isProcessing={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
