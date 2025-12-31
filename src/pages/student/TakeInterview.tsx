import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Mic, MicOff, Camera, CameraOff, MessageSquare, Clock, CheckCircle2, Send, Sparkles } from 'lucide-react';

export default function TakeInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interview = {
    id: parseInt(id || '1'),
    company: 'Tech Corp',
    position: 'Senior Frontend Developer',
    type: 'AI Technical Interview',
    duration: 45,
    totalQuestions: 10,
  };

  const questions = [
    {
      id: 1,
      type: 'technical',
      question: 'Explain the difference between useMemo and useCallback hooks in React. When would you use each?',
      timeLimit: 5,
    },
    {
      id: 2,
      type: 'technical',
      question: 'How would you optimize the performance of a React application with a large list of items?',
      timeLimit: 5,
    },
    {
      id: 3,
      type: 'behavioral',
      question: 'Tell me about a time when you had to solve a challenging technical problem. What was your approach?',
      timeLimit: 5,
    },
  ];

  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isStarted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleNextQuestion = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer('');
        setIsSubmitting(false);
      } else {
        // Interview complete
        navigate('/student/interviews');
      }
    }, 1500);
  };

  const handleSubmitInterview = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/student/interviews');
    }, 2000);
  };

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
              <Video className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-gray-900 mb-2">Ready to Start Your AI Interview?</h1>
            <p className="text-gray-600">
              {interview.company} - {interview.position}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-purple-50 border border-purple-200 rounded-xl text-center">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-gray-900 mb-1">{interview.duration} Minutes</h3>
              <p className="text-gray-600">Total Duration</p>
            </div>
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-gray-900 mb-1">{interview.totalQuestions} Questions</h3>
              <p className="text-gray-600">To Answer</p>
            </div>
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
              <Sparkles className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-gray-900 mb-1">AI Powered</h3>
              <p className="text-gray-600">Smart Assessment</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-blue-900 mb-4">Before You Start:</h3>
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
                <span>You can skip questions, but try to answer all of them</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/student/interviews')}
              className="flex-1 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStart}
              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Start Interview
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

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
                  <span className="text-gray-900">{formatTime(timeLeft)}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Video Feed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Camera {isCameraOn ? 'Active' : 'Off'}</p>
              </div>
            </div>
            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isMicOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {isMicOn ? (
                  <Mic className="w-6 h-6 text-white" />
                ) : (
                  <MicOff className="w-6 h-6 text-white" />
                )}
              </button>
              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isCameraOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {isCameraOn ? (
                  <Camera className="w-6 h-6 text-white" />
                ) : (
                  <CameraOff className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white">{currentQuestion + 1}</span>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg">
                  {questions[currentQuestion].type}
                </span>
              </div>
              <h3 className="text-gray-900 mb-6">{questions[currentQuestion].question}</h3>

              <div className="space-y-4">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here or speak to record..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                  disabled={isSubmitting}
                />

                <div className="flex gap-3">
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      <button
                        onClick={handleNextQuestion}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : 'Next Question'}
                        <Send className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleSubmitInterview}
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Complete Interview'}
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Assistant */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6" />
              <h3>AI Assistant</h3>
            </div>
            <p className="text-indigo-100 mb-4">
              I'm analyzing your responses in real-time. Speak clearly and be authentic!
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-100">
                <CheckCircle2 className="w-4 h-4" />
                <span>Good pace</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-100">
                <CheckCircle2 className="w-4 h-4" />
                <span>Clear communication</span>
              </div>
            </div>
          </motion.div>

          {/* Questions Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <h3 className="text-gray-900 mb-4">Progress</h3>
            <div className="space-y-3">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    index < currentQuestion
                      ? 'bg-green-50 border border-green-200'
                      : index === currentQuestion
                      ? 'bg-indigo-50 border border-indigo-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index < currentQuestion
                        ? 'bg-green-600'
                        : index === currentQuestion
                        ? 'bg-indigo-600'
                        : 'bg-gray-300'
                    }`}
                  >
                    {index < currentQuestion ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={
                      index <= currentQuestion ? 'text-gray-900' : 'text-gray-500'
                    }
                  >
                    Question {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
