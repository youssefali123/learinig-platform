import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiPlus, HiTrash, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const QuizBuilder = () => {
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState({
        title: '', description: '', timeLimit: 15, passingScore: 70,
        questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10, explanation: '' }],
    });

    const addQuestion = () => {
        setQuizData((prev) => ({
            ...prev,
            questions: [...prev.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10, explanation: '' }],
        }));
    };

    const removeQuestion = (i) => {
        setQuizData((prev) => ({ ...prev, questions: prev.questions.filter((_, idx) => idx !== i) }));
    };

    const updateQuestion = (i, field, value) => {
        const q = [...quizData.questions];
        q[i][field] = value;
        setQuizData((prev) => ({ ...prev, questions: q }));
    };

    const updateOption = (qi, oi, value) => {
        const q = [...quizData.questions];
        q[qi].options[oi] = value;
        setQuizData((prev) => ({ ...prev, questions: q }));
    };

    const handleSave = () => {
        toast.success('Quiz created successfully! 🎉');
        navigate('/instructor/dashboard');
    };

    const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm';

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-2xl font-bold text-text-primary">Quiz <span className="gradient-text">Builder</span></h1>
                <p className="text-text-secondary text-sm mt-1">Create MCQ quizzes for your courses</p>
            </motion.div>

            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6">
                <h3 className="text-sm font-semibold text-text-secondary mb-4">Quiz Details</h3>
                <div className="space-y-4">
                    <div><label className="text-sm font-medium text-text-secondary">Title</label><input type="text" value={quizData.title} onChange={(e) => setQuizData({ ...quizData, title: e.target.value })} placeholder="e.g., React Fundamentals Quiz" className={inputClass} /></div>
                    <div><label className="text-sm font-medium text-text-secondary">Description</label><textarea value={quizData.description} onChange={(e) => setQuizData({ ...quizData, description: e.target.value })} rows={2} placeholder="Quiz description..." className={inputClass + ' resize-none'} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium text-text-secondary">Time Limit (min)</label><input type="number" value={quizData.timeLimit} onChange={(e) => setQuizData({ ...quizData, timeLimit: Number(e.target.value) })} className={inputClass} /></div>
                        <div><label className="text-sm font-medium text-text-secondary">Passing Score (%)</label><input type="number" value={quizData.passingScore} onChange={(e) => setQuizData({ ...quizData, passingScore: Number(e.target.value) })} className={inputClass} /></div>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
                {quizData.questions.map((q, qi) => (
                    <motion.div key={qi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-text-secondary">Question {qi + 1}</h3>
                            <div className="flex items-center gap-2">
                                <input type="number" value={q.points} onChange={(e) => updateQuestion(qi, 'points', Number(e.target.value))}
                                    className="w-20 px-3 py-1.5 rounded-lg border border-border text-xs outline-none" />
                                <span className="text-xs text-gray-400">pts</span>
                                {quizData.questions.length > 1 && (
                                    <button onClick={() => removeQuestion(qi)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><HiTrash className="w-4 h-4" /></button>
                                )}
                            </div>
                        </div>
                        <input type="text" value={q.question} onChange={(e) => updateQuestion(qi, 'question', e.target.value)}
                            placeholder="Enter your question..." className={inputClass + ' mb-4'} />
                        <div className="space-y-2">
                            {q.options.map((opt, oi) => (
                                <div key={oi} className="flex items-center gap-2">
                                    <button onClick={() => updateQuestion(qi, 'correctAnswer', oi)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${q.correctAnswer === oi ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-emerald-100'}`}>
                                        {q.correctAnswer === oi ? <HiCheck className="w-4 h-4" /> : String.fromCharCode(65 + oi)}
                                    </button>
                                    <input type="text" value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)}
                                        placeholder={`Option ${String.fromCharCode(65 + oi)}`} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary-400" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-3"><input type="text" value={q.explanation} onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)}
                            placeholder="Explanation (shown after submission)" className={inputClass} /></div>
                    </motion.div>
                ))}
            </div>

            <div className="flex items-center justify-between mt-6">
                <button onClick={addQuestion} className="flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-text-secondary hover:border-primary-300 hover:text-primary-600 transition-all">
                    <HiPlus className="w-4 h-4" /> Add Question
                </button>
                <button onClick={handleSave} className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all">
                    Save Quiz
                </button>
            </div>
        </div>
    );
};

export default QuizBuilder;

