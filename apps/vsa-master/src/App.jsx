import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import LearningPage from './components/LearningPage';
import LookupPage from './components/LookupPage';
import QuizPage from './components/QuizPage';
import iframeUtils from '@embed-tools/iframe-utils';

// --- MAIN APP COMPONENT ---
export default function App() {
    const [activeSection, setActiveSection] = useState('learn');
    const isEmbedded = iframeUtils.isEmbedded();
    
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
            {!isEmbedded && (
                <footer className="text-center mt-12 mb-8 text-xs text-gray-500 max-w-4xl mx-auto px-4">
                    <p>
                        © {new Date().getFullYear()} <a href="https://taichinhchungkhoan.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">Taichinhchungkhoan.com</a>
                    </p>
                    <p className="mt-1">Taichinhchungkhoan.com - Nền tảng kiến thức và công cụ tài chính cho người Việt</p>
                    <p className="mt-2">Sử dụng phương pháp VSA (Volume Spread Analysis) để phân tích thị trường chứng khoán.</p>
                    <p className="mt-2">
                        <strong>Tuyên bố miễn trừ trách nhiệm:</strong> Ứng dụng này được tạo ra cho mục đích tham khảo và giáo dục về phân tích kỹ thuật.
                        Thông tin cung cấp không được coi là lời khuyên đầu tư chuyên nghiệp.
                        Luôn tham khảo ý kiến chuyên gia tài chính và nghiên cứu kỹ lưỡng trước khi ra quyết định đầu tư.
                    </p>
                </footer>
            )}
        </div>
    );
}