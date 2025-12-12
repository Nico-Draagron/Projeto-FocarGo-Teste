import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { UserState, INITIAL_USER_STATE, ViewState, ScanResult, Lesson, Reward, Post, CollectionPoint } from './types';
import { LEVELS, ACHIEVEMENTS, CHALLENGE_POOL, SKILL_TREE_LEVELS, MATERIAL_CONFIG, LESSONS, REWARDS, MOCK_POSTS, COLLECTION_POINTS } from './gamificationData';
import { HomeIcon, CameraIcon, ChartIcon, ShopIcon, UserIcon, LeafIcon, LightningIcon, CheckIcon, TrophyIcon, BookIcon, HeartIcon, LockIcon, MapIcon, SocialIcon } from './components/Icons';
import { analyzeWasteImage } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

// --- VIEW COMPONENTS (Normally separate files, kept here for structure reqs) ---

// MARKET VIEW
const MarketView = ({ user, onRedeem }: { user: UserState, onRedeem: (reward: Reward) => void }) => {
  const [filter, setFilter] = useState('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const filteredRewards = REWARDS.filter(r => filter === 'all' || r.category === filter);

  return (
    <div className="pt-24 pb-32 px-5 min-h-screen bg-gray-50">
      <div className="flex justify-between items-end mb-6">
        <div>
           <h1 className="text-3xl font-black text-gray-800">Rewards</h1>
           <p className="text-gray-500 text-sm">Spend your hard earned ecoins</p>
        </div>
        <div className="bg-teal/10 px-3 py-1 rounded-lg text-teal-dark font-black">
           {user.balance} 💰
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
         {['all', 'digital', 'discount', 'physical', 'donation'].map(cat => (
             <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap ${filter === cat ? 'bg-teal text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'}`}
             >
                 {cat}
             </button>
         ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
          {filteredRewards.map(reward => {
              const canAfford = user.balance >= reward.price;
              return (
                  <div key={reward.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden group">
                      <div className="absolute top-2 right-2 text-xs font-bold bg-gray-100 px-2 py-1 rounded-full text-gray-500 capitalize">{reward.category}</div>
                      <div className="text-4xl mb-4 self-center group-hover:scale-110 transition-transform duration-300">{reward.image}</div>
                      <h3 className="font-bold text-gray-800 text-sm mb-1 leading-tight line-clamp-2">{reward.name}</h3>
                      <p className="text-teal font-black text-lg mb-3">{reward.price} 💰</p>
                      
                      <div className="mt-auto">
                        <button
                            onClick={() => setSelectedReward(reward)}
                            className={`w-full py-2 rounded-xl font-bold text-xs ${canAfford ? 'bg-teal text-white hover:bg-teal-dark' : 'bg-gray-100 text-gray-400'}`}
                        >
                            {canAfford ? 'Redeem' : `Need ${reward.price - user.balance}`}
                        </button>
                      </div>
                  </div>
              )
          })}
      </div>

      {/* Redeem Modal */}
      {selectedReward && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative">
                  <button onClick={() => setSelectedReward(null)} className="absolute top-4 right-4 text-gray-400">✕</button>
                  <div className="text-center mb-6">
                      <div className="text-6xl mb-4">{selectedReward.image}</div>
                      <h2 className="text-xl font-black text-gray-800 mb-2">{selectedReward.name}</h2>
                      <p className="text-gray-500 text-sm">{selectedReward.description}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl mb-6 flex justify-between items-center">
                      <span className="text-gray-600 font-bold">Cost</span>
                      <span className="text-teal font-black text-xl">{selectedReward.price} 💰</span>
                  </div>

                  {user.balance >= selectedReward.price ? (
                      <button 
                        onClick={() => { onRedeem(selectedReward); setSelectedReward(null); }}
                        className="w-full bg-teal text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform"
                      >
                          Confirm Redemption
                      </button>
                  ) : (
                      <button disabled className="w-full bg-gray-200 text-gray-400 py-3 rounded-xl font-bold">Insufficient Funds</button>
                  )}
              </div>
          </div>
      )}
    </div>
  );
}

// SOCIAL VIEW
const SocialView = () => {
  return (
    <div className="pt-24 pb-32 px-0 bg-gray-50 min-h-screen">
      <div className="px-5 mb-6">
         <h1 className="text-3xl font-black text-gray-800">Community</h1>
         <p className="text-gray-500 text-sm">Challenges & Updates</p>
      </div>

      {/* Challenges Rail */}
      <div className="flex gap-4 overflow-x-auto pb-6 px-5 no-scrollbar mb-2">
          {MOCK_POSTS.filter(p => p.type === 'challenge').map(post => (
              <div key={post.id} className="min-w-[280px] bg-gradient-to-br from-purple-dark to-purple p-5 rounded-[24px] text-white shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 text-6xl opacity-10">🎯</div>
                  <div className="text-xs font-bold bg-white/20 inline-block px-2 py-1 rounded-lg mb-2">PINNED CHALLENGE</div>
                  <h3 className="font-bold text-xl mb-1">{post.content.title}</h3>
                  <p className="text-purple-100 text-sm mb-4">{post.content.description}</p>
                  <div className="bg-black/20 rounded-full h-2 mb-2 overflow-hidden">
                      <div className="bg-accent h-full" style={{width: '42%'}}></div>
                  </div>
                  <div className="flex justify-between text-xs font-medium opacity-80">
                      <span>423 Participants</span>
                      <span>Goal: {post.content.goal.target}</span>
                  </div>
                  <button className="w-full mt-4 bg-white text-purple-dark py-2 rounded-xl font-bold text-sm">Join Challenge</button>
              </div>
          ))}
      </div>

      {/* Feed */}
      <div className="space-y-4 px-5">
          {MOCK_POSTS.filter(p => p.type !== 'challenge').map(post => (
              <div key={post.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">{post.authorAvatar}</div>
                      <div>
                          <p className="font-bold text-gray-800 text-sm">{post.authorName}</p>
                          <p className="text-xs text-gray-400">{post.timestamp}</p>
                      </div>
                  </div>

                  {post.type === 'achievement' && (
                       <div className="bg-gradient-to-r from-teal/10 to-teal/5 p-4 rounded-xl border border-teal/10 mb-4 flex items-center gap-4">
                           <div className="text-4xl">{post.content.achievement.icon}</div>
                           <div>
                               <p className="text-teal-dark font-bold text-sm">Unlocked: {post.content.achievement.title}</p>
                               <p className="text-xs text-gray-500">{post.content.achievement.description}</p>
                           </div>
                       </div>
                  )}

                  {post.type === 'impact' && (
                       <div className="bg-gradient-to-br from-green-50 to-teal/10 p-4 rounded-xl mb-4 text-center">
                           <div className="text-4xl mb-2">🌳</div>
                           <h4 className="font-black text-xl text-teal-dark">{post.content.title}</h4>
                           <p className="text-gray-600 text-sm">{post.content.stats.co2}</p>
                       </div>
                  )}
                  
                  {post.type === 'tip' && (
                       <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-4">
                           <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">💡 {post.content.title}</h4>
                           <p className="text-sm text-gray-700 italic">"{post.content.tip}"</p>
                       </div>
                  )}

                  <div className="flex items-center gap-6 pt-2 border-t border-gray-50">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                          <HeartIcon filled={false} /> <span className="text-xs font-bold">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400">
                          <span className="text-lg">💬</span> <span className="text-xs font-bold">Comment</span>
                      </button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}

// MAP VIEW
const MapView = () => {
    const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);

    return (
        <div className="pt-24 pb-32 h-screen flex flex-col bg-gray-50">
             <div className="px-5 mb-4 shrink-0">
                <h1 className="text-3xl font-black text-gray-800">Recycle Map</h1>
                <p className="text-gray-500 text-sm">Find where to drop off waste</p>
             </div>

             {/* Filters */}
             <div className="px-5 mb-4 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
                 {['All', 'Co-ops', 'E-Waste', 'Glass', 'Meds'].map(f => (
                     <button key={f} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 whitespace-nowrap">
                         {f}
                     </button>
                 ))}
             </div>

             {/* Mock Map Area */}
             <div className="flex-1 bg-gray-200 relative overflow-hidden">
                 {/* This would be the Google Map */}
                 <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-23.5505,-46.6333&zoom=13&size=600x600&maptype=roadmap&key=YOUR_API_KEY_HERE')] bg-cover bg-center opacity-50 grayscale"></div>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <p className="bg-white/80 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur">Map View (Mock)</p>
                 </div>

                 {/* Mock Pins */}
                 {COLLECTION_POINTS.map((pt, i) => (
                     <button 
                        key={pt.id}
                        onClick={() => setSelectedPoint(pt)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
                        style={{ top: `${40 + (i * 15)}%`, left: `${30 + (i * 20)}%` }}
                     >
                         <div className="text-3xl drop-shadow-md">{pt.photo}</div>
                     </button>
                 ))}
             </div>

             {/* List Overlay / Bottom Sheet */}
             <div className="bg-white rounded-t-[32px] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-6 -mt-6 relative z-10 min-h-[200px]">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                  {selectedPoint ? (
                      <div className="animate-in slide-in-from-bottom">
                          <button onClick={() => setSelectedPoint(null)} className="text-sm text-gray-400 mb-2">← Back to list</button>
                          <div className="flex justify-between items-start mb-4">
                              <div>
                                  <h2 className="text-xl font-black text-gray-800">{selectedPoint.name}</h2>
                                  <p className="text-sm text-gray-500">{selectedPoint.address}</p>
                              </div>
                              <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">{selectedPoint.type}</div>
                          </div>
                          <div className="flex gap-2 mb-4">
                              {selectedPoint.acceptedMaterials.map(m => (
                                  <span key={m} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs" title={m}>
                                      {MATERIAL_CONFIG[m]?.icon}
                                  </span>
                              ))}
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{selectedPoint.description}</p>
                          <button className="w-full bg-teal text-white py-3 rounded-xl font-bold">Navigate</button>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          <h3 className="font-bold text-gray-400 uppercase text-xs">Nearby Points</h3>
                          {COLLECTION_POINTS.map(pt => (
                              <button key={pt.id} onClick={() => setSelectedPoint(pt)} className="flex items-center gap-4 w-full text-left">
                                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100">{pt.photo}</div>
                                  <div className="flex-1">
                                      <h4 className="font-bold text-gray-800 text-sm">{pt.name}</h4>
                                      <p className="text-xs text-gray-400">1.2km away</p>
                                  </div>
                                  <div className="text-gray-300">→</div>
                              </button>
                          ))}
                      </div>
                  )}
             </div>
        </div>
    );
}

// --- APP COMPONENT ---

export default function App() {
  const [view, setView] = useState<ViewState>('Home');
  const [user, setUser] = useState<UserState>(() => {
      const saved = localStorage.getItem('ecocoins_user_state');
      return saved ? JSON.parse(saved) : INITIAL_USER_STATE;
  });
  
  // Modals & Active States
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [achievementUnlock, setAchievementUnlock] = useState<string | null>(null);

  useEffect(() => {
      localStorage.setItem('ecocoins_user_state', JSON.stringify(user));
  }, [user]);

  const addXP = (amount: number) => {
      let newXP = user.xp + amount;
      let newLevel = user.level;
      let newTitle = user.levelTitle;
      
      const nextLevelConfig = LEVELS.find(l => l.level === user.level + 1);
      
      if (nextLevelConfig && newXP >= nextLevelConfig.totalXpThreshold) {
          newLevel = nextLevelConfig.level;
          newTitle = nextLevelConfig.title;
          setLevelUp(newLevel);
          setUser(prev => ({ ...prev, balance: prev.balance + nextLevelConfig.rewards.ecoins }));
      }
      
      ACHIEVEMENTS.forEach(ach => {
          if (user.achievements.some(a => a.id === ach.id)) return;
          let unlocked = false;
          if (ach.requirement.type === 'count' && user.itemsIdentified >= ach.requirement.value) unlocked = true;
          if (unlocked) {
              setAchievementUnlock(ach.id);
              newXP += ach.rewards.xp;
              setUser(prev => ({
                  ...prev, 
                  achievements: [...prev.achievements, { id: ach.id, unlockedAt: new Date().toISOString() }],
                  balance: prev.balance + ach.rewards.ecoins
              }));
          }
      });
      return { newXP, newLevel, newTitle };
  };

  const handleScanComplete = (result: ScanResult) => {
    const { newXP, newLevel, newTitle } = addXP(50);
    const category = result.category.toLowerCase();
    const currentSkill = user.skillTrees[category];
    let newSkillState = { ...user.skillTrees };
    if (currentSkill) {
        newSkillState[category] = { ...currentSkill, itemsIdentified: currentSkill.itemsIdentified + 1 };
    }

    setUser(prev => ({
      ...prev,
      xp: newXP,
      level: newLevel,
      levelTitle: newTitle,
      balance: prev.balance + result.ecoins_earned,
      itemsIdentified: prev.itemsIdentified + 1,
      co2SavedTotal: parseFloat((prev.co2SavedTotal + parseFloat(result.environmental_impact.co2_saved_kg.replace(/[^0-9.]/g, ''))).toFixed(2)),
      materialCounts: { ...prev.materialCounts, [category as any]: (prev.materialCounts[category as any] || 0) + 1 },
      skillTrees: newSkillState,
      history: [{ id: Date.now().toString(), type: 'scan', text: `Identified ${result.material}`, reward: result.ecoins_earned, xp: 50, timestamp: new Date().toISOString(), icon: result.bin_emoji }, ...prev.history]
    }));
    setView('Home');
  };

  const handleLessonComplete = (score: number) => {
      const { newXP, newLevel, newTitle } = addXP(activeLesson!.xpReward);
      setUser(prev => ({
          ...prev, xp: newXP, level: newLevel, levelTitle: newTitle, balance: prev.balance + activeLesson!.ecoinsReward,
          history: [{ id: Date.now().toString(), type: 'lesson', text: `Completed ${activeLesson!.title}`, reward: activeLesson!.ecoinsReward, xp: activeLesson!.xpReward, timestamp: new Date().toISOString(), icon: '🎓' }, ...prev.history]
      }));
      setActiveLesson(null);
  };

  const handleRedeem = (reward: Reward) => {
      if (user.balance >= reward.price) {
          setUser(prev => ({
              ...prev,
              balance: prev.balance - reward.price,
              history: [{ id: Date.now().toString(), type: 'redeem', text: `Redeemed ${reward.name}`, reward: -reward.price, timestamp: new Date().toISOString(), icon: '🎁' }, ...prev.history],
              redemptionHistory: [...prev.redemptionHistory, {
                  id: Date.now().toString(),
                  rewardId: reward.id,
                  rewardName: reward.name,
                  code: `ECO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                  date: new Date().toISOString(),
                  status: 'active',
                  price: reward.price,
                  image: reward.image
              }]
          }));
      }
  };

  return (
    <div className="min-h-screen font-sans bg-[#F5F1E8] text-[#1A1A1A]">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal/5 rounded-full blur-3xl -mr-[200px] -mt-[200px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple/5 rounded-full blur-3xl -ml-[150px] -mb-[150px]"></div>
      </div>
      <Header user={user} />
      <main className="max-w-md mx-auto min-h-screen bg-white/50 backdrop-blur-sm shadow-2xl overflow-hidden relative z-10">
        {view === 'Home' && <HomeView user={user} setView={setView} />}
        {view === 'Learn' && <LearnView user={user} onStartLesson={setActiveLesson} />}
        {view === 'Scan' && <ScanView onScanComplete={handleScanComplete} />}
        {view === 'Impact' && <ImpactView user={user} />}
        {view === 'Market' && <MarketView user={user} onRedeem={handleRedeem} />}
        {view === 'Social' && <SocialView />}
        {view === 'Map' && <MapView />}
        {view === 'Profile' && <ProfileView user={user} />}
      </main>
      {activeLesson && <LessonPlayer lesson={activeLesson} user={user} onClose={() => setActiveLesson(null)} onComplete={handleLessonComplete} />}
      {levelUp && <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />}
      <BottomNav current={view} setView={setView} />
    </div>
  );
}

// --- HELPER VIEWS (Normally separate files, kept here for structure reqs) ---

// Fix: Added missing Header component
const Header = ({ user }: { user: UserState }) => (
    <header className="fixed top-0 left-0 w-full h-20 bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-6 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
            <div className="text-teal p-1.5 bg-teal/10 rounded-lg"><LeafIcon /></div>
            <span className="font-black text-xl tracking-tight text-gray-800">Eco<span className="text-teal">Coins</span></span>
        </div>
        <div className="flex items-center gap-3">
             <div className="bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100 flex items-center gap-1.5">
                <span className="text-sm">💰</span>
                <span className="text-xs font-black text-yellow-700">{user.balance}</span>
             </div>
             <div className="w-9 h-9 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center text-xl">
                👤
            </div>
        </div>
    </header>
);

const HomeView = ({ user, setView }: { user: UserState; setView: (v: ViewState) => void }) => (
    <div className="pt-24 pb-32 px-5 space-y-6">
      <div className="bg-gradient-to-br from-teal via-[#2AC096] to-accent rounded-[32px] p-6 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div><p className="text-teal-100 font-medium text-sm mb-1 uppercase">Welcome back</p><h1 className="text-3xl font-black">Eco {user.levelTitle}</h1></div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30 flex items-center gap-2"><span>🔥</span><span className="font-bold">{user.currentStreak} Days</span></div>
          </div>
          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold mb-2 opacity-90"><span>Level {user.level}</span><span>{user.xp} / {user.xpToNextLevel} XP</span></div>
            <div className="bg-black/20 rounded-full h-3 w-full overflow-hidden p-[2px]"><div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}></div></div>
          </div>
          <button onClick={() => setView('Scan')} className="w-full bg-white text-teal-dark py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3"><CameraIcon active={true} /><span>Identify Waste</span></button>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-gray-800 text-lg mb-3">Daily Challenges</h3>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {CHALLENGE_POOL.slice(0, 3).map((c, i) => (
                <div key={i} className={`min-w-[200px] p-4 rounded-[20px] shadow-sm border bg-white`}><h4 className="font-bold text-gray-800 mb-1">{c.title}</h4><p className="text-xs text-gray-500">+{c.rewards.xp} XP</p></div>
            ))}
        </div>
      </div>
    </div>
);

const LearnView = ({ user, onStartLesson }: { user: UserState, onStartLesson: (l: Lesson) => void }) => (
    <div className="pt-24 pb-32 px-5">
        <h1 className="text-2xl font-black text-gray-800 mb-6">Learning Paths</h1>
        <div className="grid gap-6">{Object.entries(MATERIAL_CONFIG).map(([key, config]) => (
            <div key={key} className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4"><div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white shadow-md" style={{backgroundColor: config.color}}>{config.icon}</div><div><h3 className="font-bold text-gray-800">{config.name} Mastery</h3></div></div>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">{key === 'plastic' && LESSONS.map((lesson, idx) => (<button key={lesson.id} onClick={() => onStartLesson(lesson)} className="min-w-[140px] p-3 rounded-2xl border-2 text-left bg-gray-50"><p className="font-bold text-sm text-gray-800">{lesson.title}</p></button>))}</div>
            </div>
        ))}</div>
    </div>
);

const ScanView = ({ onScanComplete }: { onScanComplete: (result: ScanResult) => void }) => {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'result'>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => { setImage(reader.result as string); analyze(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };
  const analyze = async (base64: string) => { setStatus('analyzing'); try { const data = await analyzeWasteImage(base64); setResult(data); setStatus('result'); } catch (err) { console.error(err); setStatus('idle'); } };

  if (status === 'result' && result) {
    return (
      <div className="fixed inset-0 z-[60] bg-white overflow-y-auto animate-in slide-in-from-bottom">
        <div className="relative">
          <div className="h-64 w-full relative"><img src={image!} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40"></div><button onClick={() => { setStatus('idle'); setImage(null); }} className="absolute top-4 right-4 text-white">✕</button></div>
          <div className="px-6 py-8 space-y-8 -mt-6 bg-white rounded-t-[32px] relative">
            <h2 className="text-3xl font-black text-gray-800">{result.material}</h2>
            <div className={`p-4 rounded-2xl border-2 flex items-center gap-4 ${result.recyclable ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <div className="text-2xl">{result.bin_emoji}</div><div><p className="font-bold text-lg">{result.bin_color}</p></div>
            </div>
            <button onClick={() => onScanComplete(result)} className="w-full bg-teal text-white py-4 rounded-2xl font-black text-lg shadow-lg">Claim +{result.ecoins_earned} EcoCoins</button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col pt-20 pb-24 px-6 bg-white justify-center items-center">
        {status === 'analyzing' ? <div className="text-2xl font-black text-teal animate-pulse">Analyzing...</div> : 
        <label className="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer border-4 border-dashed border-teal/20 hover:bg-teal/5 transition-all"><CameraIcon active={true} /><input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" /></label>}
    </div>
  );
};

const ImpactView = ({ user }: { user: UserState }) => (
    <div className="pt-24 pb-32 px-5 space-y-6">
        <div className="grid grid-cols-2 gap-3">
             <div className="bg-gradient-to-br from-teal to-teal-light p-5 rounded-[24px] text-white shadow-lg"><div className="text-3xl font-black">{user.itemsIdentified}</div><div className="text-xs">Items Recycled</div></div>
             <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm"><div className="text-3xl font-black text-gray-800">{user.co2SavedTotal}</div><div className="text-xs text-gray-400">kg CO2 Saved</div></div>
        </div>
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50"><h3 className="font-bold text-gray-800 mb-6">Material Breakdown</h3><div className="space-y-4">{Object.entries(user.materialCounts).map(([k, v]) => <div key={k} className="flex justify-between"><span>{k}</span><span>{v}</span></div>)}</div></div>
    </div>
);

const ProfileView = ({ user }: { user: UserState }) => (
    <div className="pt-24 pb-32 px-5">
        <div className="flex items-center gap-4 mb-8"><div className="w-20 h-20 bg-gray-200 rounded-full"></div><div><h2 className="text-2xl font-black">Alex Green</h2><p className="text-teal">{user.levelTitle}</p></div></div>
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white p-4 rounded-2xl border"><div className="font-black text-xl">{user.currentStreak} Days</div><div className="text-xs text-gray-400">Streak</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="font-black text-xl">{user.redemptionHistory.length}</div><div className="text-xs text-gray-400">Redemptions</div></div>
        </div>
        <h3 className="font-bold mb-4">Redemption History</h3>
        <div className="space-y-2">{user.redemptionHistory.map(r => <div key={r.id} className="bg-white p-3 rounded-xl border flex justify-between"><span>{r.rewardName}</span><span className="text-xs bg-gray-100 px-2 py-1 rounded">{r.code}</span></div>)}</div>
    </div>
);

const LessonPlayer = ({ lesson, onClose, onComplete, user }: any) => (
    <div className="fixed inset-0 z-[60] bg-white p-6 flex flex-col">
        <div className="flex justify-between mb-8"><button onClick={onClose}>✕</button><span>❤️ {user.lives}</span></div>
        <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
        <div className="flex-1">Question placeholder...</div>
        <button onClick={() => onComplete(10)} className="w-full bg-teal text-white py-4 rounded-xl font-bold">Complete (Mock)</button>
    </div>
);

const LevelUpModal = ({ level, onClose }: any) => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80"><div className="bg-white p-8 rounded-3xl text-center"><h2 className="text-3xl font-black mb-4">Level Up!</h2><button onClick={onClose} className="bg-teal text-white px-6 py-2 rounded-xl">Yay!</button></div></div>
);

const BottomNav = ({ current, setView }: any) => (
    <nav className="fixed bottom-0 left-0 w-full h-[80px] bg-white shadow-lg border-t border-gray-50 flex justify-around items-center z-50 pb-4">
        {[{id:'Home', icon:HomeIcon}, {id:'Learn', icon:BookIcon}, {id:'Scan', icon:CameraIcon}, {id:'Market', icon:ShopIcon}, {id:'Social', icon:SocialIcon}, {id:'Map', icon:MapIcon}, {id:'Profile', icon:UserIcon}].map(i => (
            <button key={i.id} onClick={() => setView(i.id)} className={`p-2 rounded-xl transition-all ${current === i.id ? 'bg-teal/10 text-teal -translate-y-2' : 'text-gray-400'}`}><i.icon active={current === i.id} /></button>
        ))}
    </nav>
);