import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiClock, HiCheckCircle, HiXCircle, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import { startQuiz, setAnswer, nextQuestion, prevQuestion, goToQuestion, decrementTimer, submitQuiz, resetQuiz } from '../../features/quizSlice';
import { getQuiz } from '../../data/quizzes';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const QuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentQuiz, currentQuestionIndex, answers, timeRemaining, isSubmitted, score } = useSelector((s) => s.quiz);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const quiz = getQuiz(id);
        if (quiz) dispatch(startQuiz(quiz));
        return () => dispatch(resetQuiz());
    }, [id, dispatch]);

    useEffect(() => {
        if (!currentQuiz || isSubmitted) return;
        const timer = setInterval(() => {
            dispatch(decrementTimer());
        }, 1000);
        return () => clearInterval(timer);
    }, [currentQuiz, isSubmitted, dispatch]);

    useEffect(() => {
        if (timeRemaining === 0 && currentQuiz && !isSubmitted) {
            dispatch(submitQuiz());
            toast('â° Time\'s up! Quiz submitted automatically.');
        }
    }, [timeRemaining, currentQuiz, isSubmitted, dispatch]);

    if (!currentQuiz) return <div className="text-center py-20"><p className="text-xl text-text-secondary">Loading quiz...</p></div>;

    const question = currentQuiz.questions[currentQuestionIndex];
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const answeredCount = Object.keys(answers).length;

    const handleSubmit = () => {
        dispatch(submitQuiz());
        setShowConfirm(false);
        toast.success('Quiz submitted! 🎉');
    };

    if (isSubmitted && score) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                <div className={`bg-card rounded-3xl shadow-xl border p-8 text-center ${score.passed ? 'border-emerald-200' : 'border-red-200'}`}>
                    <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${score.passed ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        {score.passed ? <HiCheckCircle className="w-14 h-14 text-emerald-500" /> : <HiXCircle className="w-14 h-14 text-red-500" />}
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">{score.passed ? 'Congratulations! 🎉' : 'Keep Trying! 💪'}</h2>
                    <p className="text-text-secondary mb-6">{score.passed ? 'You passed the quiz!' : `You need ${currentQuiz.passingScore}% to pass.`}</p>
                    <div className="text-6xl font-bold mb-2 gradient-text">{score.percentage}%</div>
                    <p className="text-sm text-text-secondary mb-6">{score.correct}/{score.total} correct â€¢ {score.earnedPoints}/{score.totalPoints} points</p>

                    {/* Review Answers */}
                    <div className="text-left mt-8 space-y-4">
                        <h3 className="text-lg font-bold text-text-primary">Review Answers</h3>
                        {currentQuiz.questions.map((q, i) => {
                            const userAnswer = answers[q.id];
                            const isCorrect = userAnswer === q.correctAnswer;
                            return (
                                <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                    <p className="text-sm font-medium text-text-primary mb-2">{i + 1}. {q.question}</p>
                                    <p className="text-xs text-text-secondary">Your answer: <span className={`font-semibold ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>{q.options[userAnswer] || 'Not answered'}</span></p>
                                    {!isCorrect && <p className="text-xs text-emerald-600 mt-1">Correct: <span className="font-semibold">{q.options[q.correctAnswer]}</span></p>}
                                    <p className="text-xs text-gray-400 mt-1 italic">{q.explanation}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-3 justify-center mt-8">
                        <button onClick={() => { dispatch(resetQuiz()); dispatch(startQuiz(getQuiz(id))); }}
                            className="px-6 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors">Retake Quiz</button>
                        <button onClick={() => navigate(-1)}
                            className="px-6 py-2.5 border border-border text-text-secondary rounded-xl text-sm font-medium hover:bg-surface transition-colors">Back to Course</button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">{currentQuiz.title}</h1>
                    <p className="text-sm text-text-secondary">{currentQuiz.description}</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-semibold text-sm ${timeRemaining < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-text-secondary'}`}>
                    <HiClock className="w-4 h-4" />
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
            </div>

            {/* Progress */}
            <div className="flex gap-1.5 mb-6">
                {currentQuiz.questions.map((q, i) => (
                    <button key={q.id} onClick={() => dispatch(goToQuestion(i))}
                        className={`flex-1 h-2 rounded-full transition-all ${i === currentQuestionIndex ? 'bg-primary-500' : answers[q.id] !== undefined ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                ))}
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="bg-card rounded-2xl border border-border p-8 shadow-sm">
                    <p className="text-xs text-primary-600 font-semibold mb-2">Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</p>
                    <h2 className="text-lg font-semibold text-text-primary mb-6">{question.question}</h2>
                    <div className="space-y-3">
                        {question.options.map((option, i) => (
                            <button key={i} onClick={() => dispatch(setAnswer({ questionId: question.id, answerIndex: i }))}
                                className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm transition-all ${answers[question.id] === i ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-border text-text-secondary hover:border-primary-200 hover:bg-primary-100 dark:bg-primary-900/40 dark:hover:bg-primary-900/30/50'}`}>
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-xs font-semibold mr-3">{String.fromCharCode(65 + i)}</span>
                                {option}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
                <button onClick={() => dispatch(prevQuestion())} disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl text-sm font-medium text-text-secondary hover:bg-surface disabled:opacity-40 transition-all">
                    <HiArrowLeft className="w-4 h-4" /> Previous
                </button>
                <p className="text-sm text-gray-400">{answeredCount}/{currentQuiz.questions.length} answered</p>
                {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
                    <button onClick={() => dispatch(nextQuestion())}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-all">
                        Next <HiArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button onClick={() => setShowConfirm(true)}
                        className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all">
                        Submit Quiz
                    </button>
                )}
            </div>

            <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Submit Quiz?">
                <div className="p-6 text-center">
                    <p className="text-text-secondary mb-2">You answered <b>{answeredCount}</b> out of <b>{currentQuiz.questions.length}</b> questions.</p>
                    {answeredCount < currentQuiz.questions.length && <p className="text-sm text-amber-600 mb-4">âš ï¸ Some questions are unanswered.</p>}
                    <div className="flex gap-3 justify-center mt-4">
                        <button onClick={() => setShowConfirm(false)} className="px-5 py-2 border border-border rounded-xl text-sm font-medium text-text-secondary">Cancel</button>
                        <button onClick={handleSubmit} className="px-5 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium">Submit</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default QuizPage;

