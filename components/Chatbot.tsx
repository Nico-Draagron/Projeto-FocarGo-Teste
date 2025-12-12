

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Button } from './UI';

export const RecyclingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'model', text: "Hello! I'm EcoBot 🌱 I can see and hear! Send a photo, audio, or text.", timestamp: new Date().toISOString() }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // Voice State
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // --- TEXT TO SPEECH (Accessibility) ---
    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop previous speech

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1.1; 
            
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) || voices.find(v => v.lang === 'en-US');
            if (voice) utterance.voice = voice;

            window.speechSynthesis.speak(utterance);
        }
    };

    // --- VOICE RECORDING ---
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.current.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    handleSend({ audio: base64 });
                };
                reader.readAsDataURL(blob);
                stream.getTracks().forEach(t => t.stop());
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (e) {
            console.error("Mic error", e);
            alert("Enable microphone permission to use voice mode.");
        }
    };

    const stopRecording = () => {
        mediaRecorder.current?.stop();
        setIsRecording(false);
    };

    // --- SEND MESSAGE ---
    const handleSend = async (payload?: { text?: string, audio?: string }) => {
        const textToSend = payload?.text || input;
        const audioToSend = payload?.audio;

        if ((!textToSend && !audioToSend) || isLoading) return;

        // Optimistic update
        const userMsgText = textToSend || (audioToSend ? "🎤 Audio sent..." : "");
        const userMsg: ChatMessage = { 
            id: Date.now().toString(), 
            role: 'user', 
            text: userMsgText, 
            timestamp: new Date().toISOString() 
        };
        
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const responseText = await chatWithGemini(messages, { 
                text: textToSend, 
                audio: audioToSend 
            });
            
            const botMsg: ChatMessage = { 
                id: (Date.now() + 1).toString(), 
                role: 'model', 
                text: responseText, 
                timestamp: new Date().toISOString() 
            };
            
            setMessages(prev => [...prev, botMsg]);
            
            // AUTOMATIC AUDIO RESPONSE (Accessibility)
            if (audioToSend) {
                speak(responseText);
            }

        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button 
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-24 right-4 z-40 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-teal to-accent rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-3xl text-white"
            >
                {isOpen ? '✕' : '💬'}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-40 right-4 z-40 w-[90vw] md:w-96 h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-teal to-teal-dark p-4 flex items-center gap-3 shadow-md">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">🤖</div>
                            <div>
                                <h3 className="font-bold text-white leading-tight">EcoBot</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] text-white/80 font-medium">Online • Voice Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div 
                                        className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                                            msg.role === 'user' 
                                            ? 'bg-teal text-white rounded-tr-none' 
                                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    
                                    {/* Listen Button */}
                                    {msg.role === 'model' && (
                                        <button 
                                            onClick={() => speak(msg.text)}
                                            className="mt-1 text-teal hover:text-teal-dark text-[10px] font-bold flex items-center gap-1 ml-1 bg-teal/5 px-2 py-1 rounded-full transition-colors"
                                            aria-label="Listen response"
                                        >
                                            🔊 Listen
                                        </button>
                                    )}
                                </div>
                            ))}
                            
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex gap-1">
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-white border-t border-gray-100">
                            <div className="flex gap-2 items-end">
                                {/* Microphone Button */}
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onMouseDown={startRecording}
                                    onMouseUp={stopRecording}
                                    onTouchStart={startRecording}
                                    onTouchEnd={stopRecording}
                                    className={`w-12 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm transition-all ${
                                        isRecording 
                                        ? 'bg-red-500 text-white animate-pulse shadow-red-200' 
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                    title="Hold to speak"
                                >
                                    {isRecording ? '🎙️' : '🎤'}
                                </motion.button>

                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend({ text: input })}
                                    placeholder={isRecording ? "Listening..." : "Type..."}
                                    disabled={isRecording}
                                    className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal/50 outline-none transition-all"
                                />
                                
                                <button 
                                    onClick={() => handleSend({ text: input })}
                                    disabled={!input.trim() || isLoading || isRecording}
                                    className="bg-teal hover:bg-teal-dark disabled:opacity-50 disabled:cursor-not-allowed text-white w-12 h-11 rounded-xl flex items-center justify-center transition-colors shadow-lg"
                                >
                                    ➤
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
