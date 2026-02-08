"use client";
import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Mail, MessageCircle } from 'lucide-react';

const Questions = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqsList = [
        {
            q: "What is the AI Interview Coach?",
            a: "The AI Interview Coach is an advanced platform that uses artificial intelligence to simulate real-life job interviews. It provides instant feedback on your responses, helping you prepare for actual interviews by improving your communication and critical thinking skills.",
            icon: HelpCircle
        },
        {
            q: "How does the AI evaluate my answers?",
            a: "The AI evaluates your responses based on various factors like relevance, clarity, communication style, and domain knowledge. It uses natural language processing (NLP) algorithms to assess your answers and provide constructive feedback.",
            icon: MessageCircle
        },
        {
            q: "Can the AI simulate interviews for different job roles?",
            a: "Yes! The platform offers tailored interview simulations for a variety of industries and job roles, ranging from technical positions to managerial and creative roles. Simply choose your target role, and the AI will ask relevant questions.",
            icon: HelpCircle
        },
        {
            q: "Is my personal data and interview performance secure?",
            a: "Absolutely. We prioritize your privacy and ensure that all personal data and interview recordings are encrypted and stored securely. Your information will never be shared with third parties without your consent.",
            icon: MessageCircle
        },
        {
            q: "How can I improve my interview performance using this platform?",
            a: "After each simulated interview, the AI will provide detailed feedback on your performance. This includes areas for improvement, such as communication style, technical knowledge, and body language (if applicable). You can track your progress over time and practice accordingly.",
            icon: HelpCircle
        },  
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#faf6f1] via-[#f5ebe0] to-white py-16 relative">
            {/* Decorative blur elements */}
            <div className='absolute top-20 right-10 w-96 h-96 bg-[#c5d5d0] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float' />
            <div className='absolute bottom-20 left-10 w-96 h-96 bg-[#f4cdb8] rounded-full mix-blend-multiply filter blur-3xl opacity-20' style={{animationDelay: '2s'}} />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2d5f5f] to-[#4a6b5b] rounded-[40%_60%_50%_50%/60%_40%_60%_40%] mb-6 shadow-soft">
                        <HelpCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-normal text-[#1a4d4d] mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-[#6b7280] max-w-2xl mx-auto font-light leading-relaxed">
                        Find answers to common questions about our platform. Can't find what you're looking for? We're here to help.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4 mb-16">
                    {faqsList.map((item, idx) => {
                        const Icon = item.icon;
                        const isOpen = openIndex === idx;
                        
                        return (
                            <div
                                key={idx}
                                className="bg-white/80 backdrop-blur-xl rounded-[30px] border-2 border-[#e5d5c8] overflow-hidden hover:shadow-lg hover:border-[#4a6b5b] transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/60 transition-all duration-300 group"
                                >
                                    <div className="flex items-center space-x-4 flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            isOpen 
                                                ? 'bg-[#2d5f5f] shadow-soft' 
                                                : 'bg-[#f5ebe0] group-hover:bg-[#f4cdb8]'
                                        }`}>
                                            <Icon className={`w-6 h-6 transition-colors duration-300 ${
                                                isOpen ? 'text-white' : 'text-[#4a6b5b]'
                                            }`} />
                                        </div>
                                        <h3 className={`text-lg md:text-xl font-medium transition-colors duration-300 ${
                                            isOpen ? 'text-[#2d5f5f]' : 'text-[#1a4d4d] group-hover:text-[#2d5f5f]'
                                        }`}>
                                            {item.q}
                                        </h3>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isOpen 
                                            ? 'bg-[#2d5f5f] rotate-180' 
                                            : 'bg-[#f5ebe0] group-hover:bg-[#f4cdb8]'
                                    }`}>
                                        <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${
                                            isOpen ? 'text-white' : 'text-[#4a6b5b]'
                                        }`} />
                                    </div>
                                </button>
                                
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="px-8 pb-6 pt-2">
                                        <div className="pl-16 pr-14">
                                            <p className="text-[#6b7280] text-base leading-relaxed font-light">
                                                {item.a}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Contact CTA Section */}
               
            </div>
        </div>
    );
};

export default Questions;
