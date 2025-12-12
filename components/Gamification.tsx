import React from 'react';
import { Card, Button } from './UI';
import { MATERIAL_CONFIG, SKILL_NODES } from '../gamificationData';
import { SkillTreeProgress, Quest, BossBattle } from '../types';
import { LockIcon, CheckIcon, TrophyIcon, LightningIcon } from './Icons';
import { motion } from 'framer-motion';

// --- LIFE SYSTEM ---
export const LifeSystem = ({ current, max }: { current: number, max: number }) => (
  <div className="flex items-center gap-2 bg-red-50 border-2 border-red-100 rounded-full px-3 py-1.5 shadow-sm">
    <motion.span 
        animate={{ scale: current < 2 ? [1, 1.2, 1] : 1 }} 
        transition={{ repeat: Infinity, duration: 1 }}
        className="text-red-500 font-black text-lg"
    >
        ❤️
    </motion.span>
    <span className="font-bold text-red-700 text-sm">{current}/{max}</span>
  </div>
);

// --- STREAK WIDGET ---
export const StreakWidget = ({ streak, freezeCount }: { streak: number, freezeCount: number }) => (
  <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg transform transition-transform hover:scale-[1.02]">
    <div className="absolute -top-4 -right-4 text-9xl opacity-10 rotate-12">🔥</div>
    <div className="relative z-10 flex justify-between items-end">
        <div>
            <p className="text-xs font-bold uppercase opacity-80 mb-1">Sequência Atual</p>
            <p className="text-5xl font-black mb-1 flex items-baseline gap-2">
                {streak} <span className="text-xl font-bold opacity-80">dias</span>
            </p>
        </div>
        <div className="text-right">
             {freezeCount > 0 && (
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold">
                    <span>🧊</span>
                    <span>{freezeCount} Proteções</span>
                </div>
            )}
        </div>
    </div>
    {/* Visual progress dots for week */}
    <div className="flex gap-2 mt-4 relative z-10">
        {[...Array(7)].map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i < (streak % 7) || (streak > 0 && (streak % 7 === 0)) ? 'bg-white' : 'bg-black/20'}`}></div>
        ))}
    </div>
  </div>
);

// --- SKILL TREE ---
export const SkillTreeView = ({ progress }: { progress: Record<string, SkillTreeProgress> }) => {
    return (
        <div className="space-y-8 animate-in fade-in">
            {Object.entries(progress).map(([matKey, prog]) => {
                // Only show active materials (those with at least some progress or valid keys)
                if (!MATERIAL_CONFIG[matKey]) return null;
                const config = MATERIAL_CONFIG[matKey];

                return (
                    <div key={matKey} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{backgroundColor: `${config.color}20`}}>
                                {config.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-dark">{config.name} Mastery</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase">Level {prog.currentLevel} • {prog.itemsIdentified} Itens Identificados</p>
                            </div>
                         </div>
                         
                         {/* Nodes */}
                         <div className="relative">
                            {/* Connecting Line */}
                            <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-100 -translate-y-1/2 rounded-full"></div>
                            <div className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-teal to-accent -translate-y-1/2 rounded-full transition-all duration-1000" style={{ width: `${(prog.currentLevel / 5) * 100}%` }}></div>

                            <div className="relative z-10 flex justify-between">
                                {SKILL_NODES.map((node) => {
                                    const isUnlocked = prog.currentLevel >= node.id;
                                    const isNext = prog.currentLevel + 1 === node.id;

                                    return (
                                        <div key={node.id} className="flex flex-col items-center group">
                                            <div 
                                                className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center text-xl md:text-2xl transition-all duration-300 ${
                                                    isUnlocked 
                                                    ? 'bg-white border-teal text-teal shadow-lg scale-110' 
                                                    : isNext 
                                                        ? 'bg-gray-50 border-teal/50 text-gray-400 animate-pulse' 
                                                        : 'bg-gray-100 border-gray-200 text-gray-300'
                                                }`}
                                            >
                                                {isUnlocked ? node.icon : <LockIcon />}
                                            </div>
                                            <div className={`mt-2 text-[10px] md:text-xs font-bold text-center transition-opacity ${isUnlocked ? 'text-teal' : 'text-gray-400'}`}>
                                                {node.title}
                                            </div>
                                            {/* Tooltip-like info */}
                                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-dark text-white text-xs p-2 rounded-lg pointer-events-none transition-opacity w-32 text-center z-20">
                                                {node.description}
                                                <div className="text-accent mt-1">{node.requiredItems} items</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                         </div>
                    </div>
                );
            })}
        </div>
    );
};

// --- QUEST CARD ---
export const QuestCard: React.FC<{ quest: Quest }> = ({ quest }) => {
    const percent = Math.min((quest.progress / quest.goal) * 100, 100);
    
    return (
        <Card className={`relative overflow-hidden ${quest.completed ? 'bg-green-50 border-green-200' : ''}`}>
             <div className="flex justify-between items-start mb-3 relative z-10">
                 <div className="flex items-center gap-3">
                     <div className="text-3xl bg-white rounded-xl p-2 shadow-sm">{quest.icon}</div>
                     <div>
                         <h4 className="font-bold text-dark leading-tight">{quest.title}</h4>
                         <p className="text-xs text-gray-500">{quest.description}</p>
                     </div>
                 </div>
                 <div className="text-right">
                     <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${
                         quest.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
                         quest.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                         'bg-red-100 text-red-600'
                     }`}>
                         {quest.difficulty}
                     </span>
                     <p className="text-[10px] font-bold text-gray-400 mt-1">🕒 {quest.timeLeft}</p>
                 </div>
             </div>

             <div className="space-y-1 relative z-10">
                 <div className="flex justify-between text-xs font-bold">
                     <span className="text-teal">{quest.progress} / {quest.goal}</span>
                     <span className="text-gray-400">{percent.toFixed(0)}%</span>
                 </div>
                 <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                        className={`h-full rounded-full transition-all duration-1000 ${quest.completed ? 'bg-green-500' : 'bg-gradient-to-r from-teal to-accent'}`} 
                        style={{ width: `${percent}%` }}
                    />
                 </div>
             </div>

             <div className="mt-4 flex items-center gap-3 relative z-10">
                 <span className="text-xs font-bold text-gray-400">Recompensas:</span>
                 <span className="text-xs font-black text-purple">+{quest.rewards.xp} XP</span>
                 <span className="text-xs font-black text-teal">+{quest.rewards.ecoins} 💰</span>
             </div>
        </Card>
    );
};

// --- BOSS BATTLE CARD ---
export const BossBattleCard = ({ boss }: { boss: BossBattle }) => {
    return (
        <div className="relative rounded-3xl overflow-hidden bg-dark text-white p-6 md:p-8 border-4 border-purple-500 shadow-2xl">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black opacity-90"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                         <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">Boss Battle</span>
                         <span className="text-purple-300 text-xs font-bold">⏱️ {boss.timeLeft} restantes</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                        {boss.title}
                    </h2>
                    <p className="text-gray-300 font-medium leading-relaxed max-w-lg">
                        {boss.description}
                    </p>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-bold text-purple-200">
                             <span>HP Global</span>
                             <span>{boss.progress} / {boss.goal}</span>
                        </div>
                        <div className="h-6 bg-black/50 rounded-full overflow-hidden border border-purple-500/30">
                             <div 
                                className="h-full bg-gradient-to-r from-red-600 via-red-500 to-purple-500 transition-all duration-1000 relative"
                                style={{ width: `${(boss.progress / boss.goal) * 100}%` }}
                             >
                                 <div className="absolute inset-0 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%]"></div>
                             </div>
                        </div>
                        <p className="text-xs text-gray-500 text-right">{boss.participants.toLocaleString()} Guardiões lutando agora</p>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                         {boss.rewards.items.map(item => (
                             <span key={item} className="bg-white/10 border border-white/20 px-3 py-1 rounded-lg text-xs font-bold text-yellow-300">
                                 🏆 {item.replace(/_/g, ' ').toUpperCase()}
                             </span>
                         ))}
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="text-9xl animate-bounce-slow filter drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                        {boss.icon}
                    </div>
                    <Button className="mt-6 bg-red-600 hover:bg-red-700 text-white border-none shadow-[0_0_20px_rgba(220,38,38,0.4)] w-full md:w-auto">
                        ENTRAR NA BATALHA ⚔️
                    </Button>
                </div>
            </div>
        </div>
    );
};