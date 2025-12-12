

import React, { useState } from 'react';
import { UserState, AvatarConfig } from '../types';
import { Card, Button, SectionTitle } from './UI';
import { ACHIEVEMENTS, MATERIAL_CONFIG } from '../gamificationData';
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- AVATAR RENDERER ---
export const AvatarRenderer = ({ config, size = 'medium', className = '' }: { config: AvatarConfig, size?: 'small' | 'medium' | 'large', className?: string }) => {
    const sizeClasses = {
        small: 'w-10 h-10',
        medium: 'w-24 h-24',
        large: 'w-full h-full'
    };

    return (
        <div 
            className={`relative rounded-full overflow-hidden flex items-center justify-center border-4 border-white shadow-inner ${sizeClasses[size]} ${className}`}
            style={{ backgroundColor: config.backgroundColor }}
        >
            {/* Simple character representation using emoji or SVG shapes would be better, but sticking to emoji for robustness if assets missing */}
            <span className={`${size === 'large' ? 'text-9xl' : size === 'medium' ? 'text-5xl' : 'text-xl'} filter drop-shadow-lg`}>
                {config.baseCharacter === 'seal' && '🦭'}
                {config.baseCharacter === 'tree' && '🌳'}
                {config.baseCharacter === 'leaf' && '🍃'}
                {config.baseCharacter === 'drop' && '💧'}
                {config.baseCharacter === 'flower' && '🌻'}
            </span>
            
            {/* Accessories Overlays */}
            {config.accessories.hat !== 'none' && (
                <div className="absolute top-0 left-0 right-0 text-center">
                    <span className={`${size === 'large' ? 'text-8xl' : size === 'medium' ? 'text-4xl' : 'text-sm'} -translate-y-2 inline-block`}>
                        {config.accessories.hat === 'cap' && '🧢'}
                        {config.accessories.hat === 'crown' && '👑'}
                        {config.accessories.hat === 'flowers' && '🌸'}
                    </span>
                </div>
            )}
             {config.accessories.glasses !== 'none' && (
                <div className="absolute top-1/2 left-0 right-0 text-center -translate-y-1">
                    <span className={`${size === 'large' ? 'text-6xl' : size === 'medium' ? 'text-3xl' : 'text-xs'} inline-block`}>
                        {config.accessories.glasses === 'sunglasses' && '🕶️'}
                        {config.accessories.glasses === 'nerd' && '👓'}
                        {config.accessories.glasses === 'vr' && '🥽'}
                    </span>
                </div>
            )}
        </div>
    );
};

// --- AVATAR EDITOR ---
export const AvatarEditor = ({ current, onSave, onClose }: { current: AvatarConfig, onSave: (config: AvatarConfig) => void, onClose: () => void }) => {
    const [avatar, setAvatar] = useState(current);

    const getHatIcon = (hat: string) => ({ none: '🚫', cap: '🧢', crown: '👑', flowers: '🌸' }[hat]);
    const getGlassesIcon = (g: string) => ({ none: '🚫', sunglasses: '🕶️', nerd: '👓', vr: '🥽' }[g]);
    const getCharacterIcon = (c: string) => ({ seal: '🦭', tree: '🌳', leaf: '🍃', drop: '💧', flower: '🌻' }[c]);

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-400">×</button>
                <h2 className="text-3xl font-black text-gray-800 mb-6">Avatar Studio</h2>

                {/* Preview */}
                <div className="flex justify-center mb-8">
                    <div className="w-48 h-48 rounded-full border-8 border-gray-100 shadow-xl overflow-hidden relative">
                         <AvatarRenderer config={avatar} size="large" />
                    </div>
                </div>

                {/* Options Grid */}
                <div className="space-y-6">
                    {/* Base Character */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">Character</h3>
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {['seal', 'tree', 'leaf', 'drop', 'flower'].map(char => (
                                <button 
                                    key={char}
                                    onClick={() => setAvatar({...avatar, baseCharacter: char as any})}
                                    className={`w-16 h-16 rounded-2xl border-2 flex-shrink-0 flex items-center justify-center text-3xl transition-all ${
                                        avatar.baseCharacter === char 
                                        ? 'border-teal bg-teal/10 scale-105 shadow-md' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {getCharacterIcon(char)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Accessories */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">Accessories</h3>
                        
                        {/* Hats */}
                        <div className="mb-4">
                            <p className="text-xs text-gray-400 font-bold mb-2">Hats</p>
                            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                {['none', 'cap', 'crown', 'flowers'].map(hat => {
                                    const unlocked = avatar.unlocked.includes(`hat_${hat}`) || hat === 'none';
                                    return (
                                        <button 
                                            key={hat}
                                            onClick={() => unlocked && setAvatar({...avatar, accessories: {...avatar.accessories, hat: hat as any}})}
                                            disabled={!unlocked}
                                            className={`w-16 h-16 rounded-2xl border-2 flex-shrink-0 flex items-center justify-center text-2xl transition-all relative ${
                                                avatar.accessories.hat === hat 
                                                ? 'border-purple bg-purple/10 scale-105' 
                                                : 'border-gray-200'
                                            } ${!unlocked ? 'opacity-40 cursor-not-allowed' : 'hover:border-purple/50'}`}
                                        >
                                            {getHatIcon(hat)}
                                            {!unlocked && <span className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">🔒</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Glasses */}
                        <div>
                             <p className="text-xs text-gray-400 font-bold mb-2">Glasses</p>
                             <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                {['none', 'sunglasses', 'nerd', 'vr'].map(glasses => {
                                    const unlocked = avatar.unlocked.includes(`glasses_${glasses}`) || glasses === 'none';
                                    return (
                                        <button 
                                            key={glasses}
                                            onClick={() => unlocked && setAvatar({...avatar, accessories: {...avatar.accessories, glasses: glasses as any}})}
                                            disabled={!unlocked}
                                            className={`w-16 h-16 rounded-2xl border-2 flex-shrink-0 flex items-center justify-center text-2xl transition-all relative ${
                                                avatar.accessories.glasses === glasses 
                                                ? 'border-purple bg-purple/10 scale-105' 
                                                : 'border-gray-200'
                                            } ${!unlocked ? 'opacity-40 cursor-not-allowed' : 'hover:border-purple/50'}`}
                                        >
                                            {getGlassesIcon(glasses)}
                                            {!unlocked && <span className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">🔒</span>}
                                        </button>
                                    );
                                })}
                             </div>
                        </div>
                    </div>

                    {/* Color Palette */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">Background</h3>
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {['#0F8F6D', '#7A3EB1', '#5FD45E', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#6B7280'].map(color => (
                                <button 
                                    key={color}
                                    onClick={() => setAvatar({...avatar, backgroundColor: color})}
                                    className={`w-12 h-12 rounded-full border-4 flex-shrink-0 transition-all ${
                                        avatar.backgroundColor === color 
                                        ? 'border-white scale-110 shadow-md ring-2 ring-gray-200' 
                                        : 'border-transparent'
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
                    <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button onClick={() => onSave(avatar)} className="flex-1 shadow-xl">Save Avatar ✨</Button>
                </div>
            </div>
        </div>
    );
};

// --- DETAILED STATS VIEW ---
const StatCard = ({ icon, value, label, color }: { icon: string, value: string | number, label: string, color: string }) => (
    <div className={`bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mb-2 bg-${color}-100`}>
            {icon}
        </div>
        <div className="font-black text-xl text-dark mb-1">{value}</div>
        <div className="text-xs font-bold text-gray-400 uppercase">{label}</div>
    </div>
);

export const DetailedStatsView = ({ user }: { user: UserState }) => {
    // Prepare data for chart
    const materialData = Object.entries(user.materialCounts).map(([key, count]) => ({
        name: MATERIAL_CONFIG[key]?.name || key,
        count: count,
        color: MATERIAL_CONFIG[key]?.color || '#ccc'
    })).filter(d => d.count > 0);

    // Activity Heatmap helper (mock logic for demo)
    const getLast30Days = () => {
        const dates = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    };
    const last30Days = getLast30Days();
    const getActivityColor = (log: string[], day: string) => {
        return log.includes(day) ? 'bg-teal' : 'bg-gray-100';
    };

    return (
        <div className="space-y-6 animate-in slide-up pb-10">
            <h3 className="text-xl font-black text-dark mb-4">Detailed Stats</h3>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon="♻️" value={user.itemsIdentified} label="Recycled Items" color="teal" />
                <StatCard icon="🌍" value={`${user.co2SavedTotal}kg`} label="CO₂ Saved" color="green" />
                <StatCard icon="🔥" value={user.currentStreak} label="Day Streak" color="orange" />
                <StatCard icon="💰" value={user.balance} label="EcoCoins" color="yellow" />
            </div>

            {/* Material Breakdown Chart */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-800 mb-6">Recycled Materials</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={materialData}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                cursor={{fill: '#f3f4f6'}}
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {materialData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Activity Heatmap */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-800 mb-6">Activity (30 Days)</h3>
                <div className="grid grid-cols-7 gap-2">
                    {last30Days.map(day => (
                        <div 
                            key={day}
                            className={`aspect-square rounded-md ${getActivityColor(user.activityLog, day)} transition-colors hover:scale-110`}
                            title={day}
                        />
                    ))}
                </div>
            </div>

            {/* Achievements Showcase */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-gray-800">Achievements</h3>
                    <span className="text-sm font-bold text-teal bg-teal/10 px-2 py-1 rounded-lg">
                        {user.achievements.length}/{ACHIEVEMENTS.length}
                    </span>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                    {ACHIEVEMENTS.map(ach => {
                        const unlocked = user.achievements.some(a => a.id === ach.id);
                        return (
                            <div 
                                key={ach.id}
                                className={`aspect-square rounded-2xl flex items-center justify-center text-3xl relative transition-all ${
                                    unlocked 
                                        ? 'bg-gradient-to-br from-teal/10 to-purple/10 border-2 border-teal/20 shadow-sm hover:scale-105' 
                                        : 'bg-gray-50 border border-gray-100 grayscale opacity-50'
                                }`}
                                title={ach.title}
                            >
                                <span>{ach.icon}</span>
                                {!unlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-2xl">
                                        <span className="text-lg">🔒</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- PROFILE VIEW ---
export const ProfileView = ({ user, onUpdateUser }: { user: UserState, onUpdateUser: (u: Partial<UserState>) => void }) => {
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [activeTab, setActiveTab] = useState<'stats' | 'history'>('stats');

    return (
        <div className="pb-24">
            {isEditingAvatar && (
                <AvatarEditor 
                    current={user.avatar} 
                    onClose={() => setIsEditingAvatar(false)} 
                    onSave={(newAvatar) => {
                        onUpdateUser({ avatar: newAvatar });
                        setIsEditingAvatar(false);
                    }}
                />
            )}

            {/* Header Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-teal to-accent opacity-10"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 mt-4">
                    <div className="relative group cursor-pointer" onClick={() => setIsEditingAvatar(true)}>
                        <AvatarRenderer config={user.avatar} size="medium" className="ring-4 ring-white shadow-xl" />
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border border-gray-100 group-hover:scale-110 transition-transform">
                            ✏️
                        </div>
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl font-black text-dark">{user.name || "Username"}</h2>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                             <span className="text-purple font-bold">🛡️ {user.levelTitle}</span>
                             <span className="text-gray-300">•</span>
                             <span className="text-gray-500 font-medium">Level {user.level}</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-3 italic">"Recycling is my superpower! 🌱"</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="font-black text-xl text-teal">{user.itemsIdentified}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase">Items</div>
                        </div>
                        <div className="w-px bg-gray-200"></div>
                        <div className="text-center">
                             <div className="font-black text-xl text-dark">{user.currentStreak}🔥</div>
                             <div className="text-[10px] font-bold text-gray-400 uppercase">Streak</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                 <button 
                    onClick={() => setActiveTab('stats')}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'stats' ? 'bg-white text-teal shadow-sm' : 'text-gray-400'}`}
                 >
                     📊 Stats
                 </button>
                 <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'history' ? 'bg-white text-teal shadow-sm' : 'text-gray-400'}`}
                 >
                     📜 History
                 </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'stats' ? (
                        <DetailedStatsView user={user} />
                    ) : (
                        <div className="space-y-4">
                            {user.history.length === 0 && <p className="text-center text-gray-400 py-10">No recent activity.</p>}
                            {user.history.map(item => (
                                <Card key={item.id} className="flex items-center gap-4 py-4">
                                    <div className="text-2xl bg-gray-50 p-3 rounded-full">{item.icon}</div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-dark">{item.text}</h4>
                                        <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    {item.reward && <span className="text-teal font-black text-sm">+{item.reward} 💰</span>}
                                    {item.xp && <span className="text-purple font-black text-sm">+{item.xp} XP</span>}
                                </Card>
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
