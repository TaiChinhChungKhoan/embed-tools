import React from 'react';
import { BookOpen, Search, CheckCircle } from './Icons';

const Header = ({ activeSection, setActiveSection }) => {
    const navItems = [
        { id: 'learn', label: 'Học VSA', icon: <BookOpen className="w-5 h-5 mr-2" /> },
        { id: 'lookup', label: 'Tra Cứu', icon: <Search className="w-5 h-5 mr-2" /> },
        { id: 'quiz', label: 'Kiểm Tra', icon: <CheckCircle className="w-5 h-5 mr-2" /> },
    ];
    
    return (
        <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-cyan-500/10">
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 text-transparent bg-clip-text">
                            VSA Master
                        </h1>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <button 
                                    key={item.id} 
                                    onClick={() => setActiveSection(item.id)} 
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 cursor-pointer ${
                                        activeSection === item.id 
                                            ? 'bg-cyan-500/10 text-cyan-300' 
                                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                    }`}
                                >
                                    {item.icon}{item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header; 