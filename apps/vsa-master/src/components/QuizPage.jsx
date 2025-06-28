import React, { useState } from 'react';
import { quizQuestions } from '../data/vsaData';

const QuizPage = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const handleAnswer = (optionIndex) => { setSelectedAnswer(optionIndex); if (optionIndex === quizQuestions[currentQuestion].correct) { setScore(prev => prev + 1); }};
    const handleNext = () => { if (currentQuestion < quizQuestions.length - 1) { setCurrentQuestion(prev => prev + 1); setSelectedAnswer(null);} else { setShowResult(true); }};
    const handleReset = () => { setCurrentQuestion(0); setSelectedAnswer(null); setScore(0); setShowResult(false); };
    if (showResult) {
        return ( <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center animate-fade-in max-w-2xl mx-auto"> <h2 className="text-3xl font-bold text-white">Kết Quả</h2> <p className="mt-4 text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-emerald-400 text-transparent bg-clip-text">{score} / {quizQuestions.length}</p> <p className="mt-2 text-gray-400 text-lg">{score / quizQuestions.length >= 0.75 ? "Tuyệt vời! Bạn đã nắm rất vững kiến thức." : "Cố gắng lên! Hãy ôn lại các khái niệm nhé."}</p> <button onClick={handleReset} className="mt-8 bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-600 transition-colors cursor-pointer">Làm Lại</button> </div>);
    }
    const question = quizQuestions[currentQuestion];
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 md:p-8 animate-fade-in max-w-2xl mx-auto">
            <p className="text-sm text-gray-400">Câu {currentQuestion + 1} của {quizQuestions.length}</p>
            <h2 className="mt-2 text-xl md:text-2xl font-bold text-white">{question.question}</h2>
            <div className="mt-6 space-y-4">
                {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index; const isCorrect = question.correct === index;
                    let optionClass = 'bg-gray-800 border-gray-700 hover:bg-gray-700/50 hover:border-cyan-400';
                    if (selectedAnswer !== null) { if(isCorrect) optionClass = 'bg-emerald-500/20 border-emerald-500'; else if (isSelected && !isCorrect) optionClass = 'bg-red-500/20 border-red-500'; }
                    return (<button key={index} onClick={() => handleAnswer(index)} disabled={selectedAnswer !== null} className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${optionClass}`}>{option}</button>);
                })}
            </div>
            {selectedAnswer !== null && (
                <div className="mt-6 p-4 bg-gray-900/50 rounded-lg animate-fade-in">
                    <p className="font-bold text-emerald-400">Giải thích:</p>
                    <p className="mt-2 text-gray-300">{question.explanation}</p>
                    <button onClick={handleNext} className="mt-4 w-full bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-600 transition-colors cursor-pointer">{currentQuestion < quizQuestions.length - 1 ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}</button>
                </div>
            )}
        </div>
    );
};

export default QuizPage; 