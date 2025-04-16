'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';

interface SecurityQuestion {
    question: string;
    answer: string;
}

const MAX_ANSWER_LENGTH = 100;
const MIN_ANSWER_LENGTH = 2;

export default function SecurityQuestions() {
    const { data: session } = useSession();
    const [questions, setQuestions] = useState<string[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<SecurityQuestion[]>([
        { question: '', answer: '' },
        { question: '', answer: '' },
        { question: '', answer: '' }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>(['', '', '']);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await fetch('/api/auth/security/questions');
            const data = await response.json();
            if (data.success) {
                setQuestions(data.questions);
            } else {
                setError(data.message || 'Failed to load security questions');
            }
        } catch (err) {
            setError('Failed to load security questions');
        }
    };

    const validateAnswer = (answer: string): string => {
        if (!answer.trim()) {
            return 'Answer is required';
        }
        if (answer.trim().length < MIN_ANSWER_LENGTH) {
            return `Answer must be at least ${MIN_ANSWER_LENGTH} characters`;
        }
        if (answer.trim().length > MAX_ANSWER_LENGTH) {
            return `Answer must be less than ${MAX_ANSWER_LENGTH} characters`;
        }
        return '';
    };

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...selectedQuestions];
        newQuestions[index] = { ...newQuestions[index], question: value };
        setSelectedQuestions(newQuestions);

        // Clear validation error when question changes
        const newValidationErrors = [...validationErrors];
        newValidationErrors[index] = '';
        setValidationErrors(newValidationErrors);
    };

    const handleAnswerChange = (index: number, value: string) => {
        const newQuestions = [...selectedQuestions];
        newQuestions[index] = { ...newQuestions[index], answer: value };
        setSelectedQuestions(newQuestions);

        // Validate answer
        const newValidationErrors = [...validationErrors];
        newValidationErrors[index] = validateAnswer(value);
        setValidationErrors(newValidationErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate all questions and answers
        const newValidationErrors = selectedQuestions.map(q => validateAnswer(q.answer));
        setValidationErrors(newValidationErrors);

        if (newValidationErrors.some(error => error)) {
            setError('Please fix validation errors before submitting');
            setLoading(false);
            return;
        }

        // Validate all questions are different
        const uniqueQuestions = new Set(selectedQuestions.map(q => q.question));
        if (uniqueQuestions.size !== 3) {
            setError('Please select different questions for each entry');
            setLoading(false);
            return;
        }

        if (selectedQuestions.some(q => !q.question || !q.answer.trim())) {
            setError('Please provide answers for all selected questions');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/security/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ questions: selectedQuestions }),
            });

            const data = await response.json();
            if (data.success) {
                setSuccess('Security questions updated successfully');
                // Reset form
                setSelectedQuestions([
                    { question: '', answer: '' },
                    { question: '', answer: '' },
                    { question: '', answer: '' }
                ]);
                setValidationErrors(['', '', '']);
            } else {
                setError(data.message || 'Failed to update security questions');
            }
        } catch (err) {
            setError('Failed to update security questions');
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return <div>Please sign in to manage security questions.</div>;
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Security Questions</h2>
            <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded flex items-start">
                <FaInfoCircle className="mt-1 mr-2 flex-shrink-0" />
                <p className="text-sm">
                    Please select three different security questions and provide answers.
                    Your answers should be:
                    <ul className="list-disc ml-5 mt-2">
                        <li>At least {MIN_ANSWER_LENGTH} characters long</li>
                        <li>Less than {MAX_ANSWER_LENGTH} characters</li>
                        <li>Easy for you to remember but hard for others to guess</li>
                    </ul>
                </p>
            </div>
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center">
                    <FaTimes className="mr-2" />
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex items-center">
                    <FaCheck className="mr-2" />
                    {success}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {selectedQuestions.map((sq, index) => (
                    <div key={index} className="mb-6">
                        <label className="block mb-2">
                            Question {index + 1}:
                            <select
                                value={sq.question}
                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                                className={`w-full mt-1 p-2 border rounded ${!sq.question ? 'border-gray-300' : 'border-green-500'
                                    }`}
                                required
                            >
                                <option value="">Select a question</option>
                                {questions.map((q, i) => (
                                    <option key={i} value={q}>
                                        {q}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block mt-2">
                            Answer:
                            <input
                                type="text"
                                value={sq.answer}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                className={`w-full mt-1 p-2 border rounded ${validationErrors[index]
                                        ? 'border-red-500'
                                        : sq.answer.trim()
                                            ? 'border-green-500'
                                            : 'border-gray-300'
                                    }`}
                                required
                                minLength={MIN_ANSWER_LENGTH}
                                maxLength={MAX_ANSWER_LENGTH}
                            />
                        </label>
                        {validationErrors[index] && (
                            <p className="mt-1 text-sm text-red-600">
                                {validationErrors[index]}
                            </p>
                        )}
                    </div>
                ))}
                <button
                    type="submit"
                    disabled={loading || validationErrors.some(error => error)}
                    className={`w-full py-2 px-4 rounded ${loading || validationErrors.some(error => error)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white font-semibold transition-colors duration-200`}
                >
                    {loading ? 'Updating...' : 'Update Security Questions'}
                </button>
            </form>
        </div>
    );
} 