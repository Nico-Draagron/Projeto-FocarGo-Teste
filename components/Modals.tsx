

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelConfig } from '../types';
import { Button } from './UI';

interface LevelUpModalProps {
    newLevel: LevelConfig;
    onClose: () => void;
}

export const LevelUpModal = ({ newLevel, onClose }: LevelUpModalProps) => {
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-gradient-to-br from-purple-dark via-purple to-black text-white rounded-3xl p-8 md:p-12 max-w-md w-full text-center relative overflow-hidden shadow-2xl border border-purple/30"
                >
                    {/* Particles background simulation */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                         <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
                         <div className="absolute bottom-20 right-20 w-3 h-3 bg-teal rounded-full animate-pulse"></div>
                         <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                    </div>

                    <div className="relative z-10">
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-8xl mb-6 filter drop-shadow-lg"
                        >
                            {newLevel.icon}
                        </motion.div>
                        
                        <motion.h2 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500"
                        >
                            LEVEL UP!
                        </motion.h2>
                        
                        <p className="text-2xl font-bold text-white mb-8">
                            You are now a <span className="text-teal-400">{newLevel.title}</span>
                        </p>
                        
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/10">
                            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Rewards</p>
                            <div className="flex justify-center gap-8 text-3xl font-black">
                                <div className="flex flex-col items-center">
                                    <span className="text-yellow-400">+{newLevel.rewards.ecoins}</span>
                                    <span className="text-[10px] text-gray-300 font-medium">ECOINS</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-purple-300">MAX</span>
                                    <span className="text-[10px] text-gray-300 font-medium">LIVES</span>
                                </div>
                            </div>
                            
                            {newLevel.rewards.unlocks.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <p className="text-[10px] text-gray-400 uppercase mb-2">Unlocked</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {newLevel.rewards.unlocks.map(unlock => (
                                            <span key={unlock} className="bg-teal/20 border border-teal/40 px-3 py-1 rounded-full text-xs font-bold text-teal-200">
                                                🔓 {unlock.toUpperCase()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button 
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-teal to-accent hover:from-teal-light hover:to-accent-hover text-dark py-4 rounded-xl font-black text-lg shadow-xl hover:scale-105 transition-transform"
                        >
                            CONTINUE JOURNEY 🚀
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
