import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AIInterviewerProps {
    currentQuestion?: string;
    questionType?: string;
    questionNumber?: number;
    totalQuestions?: number;
    feedback?: {
        progress: number;
        averageScore: string;
        feedback: string;
    };
    isProcessing?: boolean;
}

export default function AIInterviewer({
    currentQuestion,
    questionType,
    questionNumber,
    totalQuestions,
    feedback,
    isProcessing = false,
}: AIInterviewerProps) {
    return (
        <div className="space-y-6">
            {/* AI Assistant Card */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold">AI Interviewer</h3>
                        <p className="text-indigo-100 text-sm">
                            {isProcessing ? 'Processing...' : 'Ready'}
                        </p>
                    </div>
                </div>

                {isProcessing && (
                    <div className="flex items-center gap-2 text-indigo-100">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Analyzing your response...</span>
                    </div>
                )}

                {feedback && !isProcessing && (
                    <div className="space-y-3 mt-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-indigo-100">Progress</span>
                            <span className="font-semibold">{feedback.progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                                className="bg-white h-2 rounded-full transition-all duration-500"
                                style={{ width: `${feedback.progress}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-indigo-100">Average Score</span>
                            <span className="font-semibold">{feedback.averageScore}/10</span>
                        </div>
                        <p className="text-indigo-100 text-sm mt-3">{feedback.feedback}</p>
                    </div>
                )}
            </motion.div>

            {/* Current Question Card */}
            {currentQuestion && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={questionNumber}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-semibold">{questionNumber}</span>
                            </div>
                            {questionType && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                                    {questionType}
                                </span>
                            )}
                            {totalQuestions && (
                                <span className="text-gray-500 text-sm ml-auto">
                                    {questionNumber} of {totalQuestions}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-900 text-lg leading-relaxed">{currentQuestion}</p>
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Tips Card */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
            >
                <h3 className="text-blue-900 font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Interview Tips
                </h3>
                <ul className="space-y-2 text-blue-800 text-sm">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Speak clearly and at a moderate pace</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Provide specific examples when possible</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Take a moment to think before answering</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Be authentic and honest in your responses</span>
                    </li>
                </ul>
            </motion.div>

            {/* Connection Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-gray-600">AI Connected</span>
                </div>
            </div>
        </div>
    );
}
