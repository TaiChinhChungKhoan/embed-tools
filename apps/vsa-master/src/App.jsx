import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import LearningPage from './components/LearningPage';
import LookupPage from './components/LookupPage';
import QuizPage from './components/QuizPage';

// --- MAIN APP COMPONENT ---
export default function App() {
    const [activeSection, setActiveSection] = useState('learn');
    
    const renderSection = () => { 
        switch (activeSection) { 
            case 'learn': return <LearningPage />; 
            case 'lookup': return <LookupPage />; 
            case 'quiz': return <QuizPage />; 
            default: return <LearningPage />; 
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
            <Header activeSection={activeSection} setActiveSection={setActiveSection} />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {renderSection()}
            </main>
            <footer className="text-center py-6 text-gray-500 text-sm">
                <p>Xây dựng với React & Tailwind CSS. Chúc bạn học tốt!</p>
            </footer>
        </div>
    );
}