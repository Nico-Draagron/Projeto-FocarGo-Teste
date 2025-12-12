
import React, { useState, useEffect } from 'react';
import { UserState, INITIAL_USER_STATE, ViewState, ScanResult, Reward, LevelConfig } from './types';
import { LEVELS, REWARDS, BOSS_BATTLE_MOCK, QUEST_POOL, MOCK_POSTS, MOCK_CHALLENGES, COLLECTION_POINTS } from './gamificationData';
import { analyzeWasteMultimodal } from './services/geminiService';
import { HomeIcon, CameraIcon, ChartIcon, ShopIcon, UserIcon, BookIcon, MapIcon, SocialIcon, TrophyIcon, LightningIcon } from './components/Icons';
import { Logo } from './components/Logo';
import { Card, Button, Badge, SectionTitle } from './components/UI';
import { SkillTreeView, QuestCard, BossBattleCard, LifeSystem, StreakWidget } from './components/Gamification';
import { CameraMode, VoiceMode, TextMode } from './components/ScanModes'; 
import { RecyclingChatbot } from './components/Chatbot'; 
import { PostCard, ChallengeRailCard, CreatePostModal } from './components/Social';
import { ProfileView } from './components/Profile'; // NEW
import { MapView } from './components/Map'; // NEW
import { LevelUpModal } from './components/Modals';
import { motion } from 'framer-motion';

// --- ANIMATION COMPONENTS ---
const Counter = ({ value, prefix = "", suffix = "", decimals = 0 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      const current = start + (end - start) * easeOut;
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{prefix}{displayValue.toFixed(decimals)}{suffix}</span>;
};

// --- LAYOUT COMPONENT ---
interface LayoutProps {
  children?: React.ReactNode;
  currentView: ViewState;
  setView: (v: ViewState) => void;
  user: UserState;
}

const Layout = ({ children, currentView, setView, user }: LayoutProps) => {
  const navItems = [
    { id: 'Home', icon: HomeIcon, label: 'Início' },
    { id: 'Scan', icon: CameraIcon, label: 'Scan' },
    { id: 'Map', icon: MapIcon, label: 'Mapa' }, // Added Map
    { id: 'Social', icon: SocialIcon, label: 'Social' },
    { id: 'Quests', icon: TrophyIcon, label: 'Missões' }, 
    { id: 'Skills', icon: LightningIcon, label: 'Skills' }, 
    { id: 'Market', icon: ShopIcon, label: 'Loja' },
    { id: 'Profile', icon: UserIcon, label: 'Perfil' },
  ];

  return (
    <div className="min-h-screen bg-light flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 w-full h-16 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 flex items-center justify-between px-4">
        <div className="flex items-center gap-2" onClick={() => setView('Home')}>
          <Logo className="w-8 h-8" />
          <span className="font-black text-xl text-teal tracking-tight">FocarGo</span>
        </div>
        <div className="flex items-center gap-3">
           <LifeSystem current={user.lives} max={user.maxLives} />
           <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden border border-gray-200" onClick={() => setView('Profile')}>
             <div className="w-full h-full bg-teal text-white flex items-center justify-center text-xs font-bold">
                 {user.avatar ? <span>👤</span> : 'AG'} 
             </div>
           </div>
        </div>
      </header>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-100 flex-col z-50">
        <div className="p-6 flex items-center gap-3 mb-2 cursor-pointer" onClick={() => setView('Home')}>
           <Logo className="w-10 h-10 animate-float" />
           <span className="font-black text-2xl text-teal tracking-tight">FocarGo</span>
        </div>
        <div className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-teal/10 text-teal-dark font-black' 
                    : 'text-gray-500 hover:bg-gray-50 font-medium hover:text-dark'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal rounded-r-full" />}
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <Icon active={isActive} />
                </div>
                <span className="tracking-wide">{item.label}</span>
              </button>
            )
          })}
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 cursor-pointer" onClick={() => setView('Profile')}>
           <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Seu Progresso</span>
              <span className="text-xs font-black text-teal">{user.level} 🔥</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-bold shadow-md">
                   {user.avatar ? '👤' : 'AG'}
              </div>
              <div className="flex-1">
                 <p className="text-sm font-black text-dark truncate">{user.name || "Alex Green"}</p>
                 <p className="text-xs text-gray-500 font-medium">Eco {user.levelTitle}</p>
              </div>
           </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-20 md:pt-8 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Desktop Header Info */}
        <div className="hidden md:flex justify-end items-center gap-6 mb-8">
            <LifeSystem current={user.lives} max={user.maxLives} />
            <div className="flex items-center gap-2 bg-teal/10 px-3 py-1.5 rounded-xl border border-teal/20">
                <span className="text-lg">💰</span>
                <span className="font-black text-teal-dark">{user.balance}</span>
            </div>
        </div>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full h-16 bg-white border-t border-gray-100 flex justify-around items-center z-50 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 5).map((item) => {
           const isActive = currentView === item.id;
           const Icon = item.icon;
           return (
             <button
               key={item.id}
               onClick={() => setView(item.id as ViewState)}
               className={`flex flex-col items-center justify-center w-full h-full pt-1 relative ${isActive ? 'text-teal' : 'text-gray-400'}`}
             >
               {isActive && <motion.div layoutId="nav-pill" className="absolute -top-1 w-8 h-1 bg-teal rounded-full" />}
               <div className={`transition-all duration-200 ${isActive ? '-translate-y-1 scale-110' : ''}`}>
                 <Icon active={isActive} />
               </div>
               <span className={`text-[10px] font-bold mt-0.5 ${isActive ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
             </button>
           )
        })}
      </nav>
    </div>
  );
};

// --- VIEWS ---

const HomeView = ({ user, setView }: { user: UserState, setView: (v: ViewState) => void }) => {
  const progressPercent = Math.min((user.xp / user.xpToNextLevel) * 100, 100);

  return (
    <div className="space-y-8 animate-in fade-in pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-[32px] bg-dark shadow-2xl col-span-1 md:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-dark via-teal to-purple-dark opacity-90"></div>
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left text-white space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                    <span className="text-xl">🛡️</span>
                    <span className="font-bold text-sm tracking-wide">LEVEL {user.level} - {user.levelTitle.toUpperCase()}</span>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">Bem-vindo, {user.name || "Guardian"}!</h1>
                    <div className="max-w-md">
                        <div className="flex justify-between text-xs font-bold text-teal-light uppercase mb-2">
                            <span>{user.xp} XP</span>
                            <span>Próximo: {user.xpToNextLevel} XP</span>
                        </div>
                        <div className="h-4 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-teal to-accent shadow-[0_0_15px_rgba(95,212,94,0.5)]" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-auto">
                <button onClick={() => setView('Scan')} className="group relative w-full md:w-64 aspect-[4/3] md:aspect-square bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-100 group-hover:opacity-0 transition-opacity"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-light to-teal opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center text-teal-dark group-hover:bg-teal group-hover:text-white transition-colors duration-300">
                        <CameraIcon active={true} />
                    </div>
                    <div className="text-center relative z-10">
                        <h3 className="text-xl font-black text-dark group-hover:text-teal-dark mb-1">Escanear</h3>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-teal">Ganhe Ecoins</span>
                    </div>
                </button>
            </div>
            </div>
        </div>

        {/* STREAK WIDGET */}
        <StreakWidget streak={user.currentStreak} freezeCount={user.streakFreeze} />

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-4">
             <Card onClick={() => setView('Map')} className="cursor-pointer hover:bg-blue/5 border-blue/10">
                 <div className="text-3xl mb-2">🗺️</div>
                 <h3 className="font-bold text-dark">Mapa</h3>
                 <p className="text-xs text-gray-500">Pontos de Coleta</p>
             </Card>
             <Card onClick={() => setView('Social')} className="cursor-pointer hover:bg-teal/5 border-teal/10">
                 <div className="text-3xl mb-2">👥</div>
                 <h3 className="font-bold text-dark">Comunidade</h3>
                 <p className="text-xs text-gray-500">Desafios & Feed</p>
             </Card>
        </div>
      </div>
    </div>
  );
};

// --- NEW SOCIAL VIEW ---
const SocialView = () => {
    const [posts, setPosts] = useState(MOCK_POSTS);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleCreatePost = (data: any) => {
        // Mock creating a new post
        const newPost = {
            id: Date.now().toString(),
            type: data.type,
            author: { name: "Você", avatar: "👤", level: 6 },
            timestamp: "Agora",
            likes: 0,
            shares: 0,
            comments: [],
            content: {
                title: "Novo Post",
                description: data.content,
                // Add default icon for demo
                icon: data.type === 'tip' ? '💡' : '🎉' 
            }
        };
        // @ts-ignore
        setPosts([newPost, ...posts]);
    };

    return (
        <div className="pb-24">
            {showCreateModal && <CreatePostModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreatePost} />}

            <div className="flex justify-between items-center mb-6">
                <SectionTitle title="Comunidade" subtitle="Participe, aprenda e inspire" />
                <Button onClick={() => setShowCreateModal(true)} size="sm">
                    + Novo Post
                </Button>
            </div>

            {/* Challenges Rail */}
            <div className="mb-8 overflow-x-auto no-scrollbar pb-2">
                <div className="flex gap-4 w-max">
                    {MOCK_CHALLENGES.map(c => (
                        <ChallengeRailCard key={c.id} challenge={c} />
                    ))}
                </div>
            </div>

            {/* Feed */}
            <div className="space-y-6 max-w-2xl mx-auto">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

// --- SCAN VIEW (Reused) ---
const ScanView = ({ onScanComplete }: { onScanComplete: (res: ScanResult) => void }) => {
    const [mode, setMode] = useState<'camera' | 'voice' | 'text'>('camera');
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'result'>('idle');
    const [result, setResult] = useState<ScanResult | null>(null);

    const handleAnalysis = async (input: { image?: string, audio?: string, text?: string }) => {
        setStatus('analyzing');
        try {
            const res = await analyzeWasteMultimodal(input);
            setResult(res);
            setStatus('result');
        } catch (e) {
            console.error(e);
            setStatus('idle');
            alert("Erro na análise. Tente novamente.");
        }
    };

    if (status === 'analyzing') {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-teal rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-dark">Analisando com Gemini 3</h2>
                    <p className="text-gray-500">Processando multimodalmente...</p>
                </div>
            </div>
        );
    }

    if (status === 'result' && result) {
        return (
            <div className="pb-24 animate-in slide-up">
                 <div className="flex items-center justify-between mb-6">
                     <button onClick={() => setStatus('idle')} className="text-gray-500 font-bold hover:text-dark">← Voltar</button>
                     <span className="text-xs font-bold text-teal bg-teal/10 px-3 py-1 rounded-full">Confiança {Math.round(result.confidence_score)}%</span>
                 </div>

                 <Card className={`mb-6 border-l-8 ${result.recyclable ? 'border-l-green-500' : 'border-l-gray-400'}`}>
                     <div className="flex items-start gap-4">
                         <div className="text-6xl">{result.bin_emoji}</div>
                         <div>
                             <p className="text-xs font-bold uppercase text-gray-400">Identificado</p>
                             <h2 className="text-3xl font-black text-dark leading-tight">{result.material}</h2>
                             <p className="font-medium text-gray-600">{result.category} • {result.bin_color}</p>
                         </div>
                     </div>
                 </Card>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                     <Card className="bg-light border-none">
                         <h4 className="font-bold text-dark mb-2">💡 Explicação</h4>
                         <p className="text-sm text-gray-700">{result.educational_explanation}</p>
                     </Card>
                     <Card className="bg-light border-none">
                         <h4 className="font-bold text-dark mb-2">🌍 Impacto</h4>
                         <div className="flex gap-4">
                             <div>
                                 <span className="block text-xl font-black text-teal">{result.environmental_impact.co2_saved_kg}</span>
                                 <span className="text-[10px] uppercase font-bold text-gray-500">CO2</span>
                             </div>
                             <div>
                                 <span className="block text-xl font-black text-orange-500">{result.environmental_impact.energy_saved}</span>
                                 <span className="text-[10px] uppercase font-bold text-gray-500">Energia</span>
                             </div>
                         </div>
                     </Card>
                 </div>
                 
                 <Button onClick={() => onScanComplete(result)} className="w-full py-4 text-lg shadow-xl">
                     Resgatar +{result.ecoins_earned} Ecoins 💰
                 </Button>
            </div>
        );
    }

    return (
        <div className="pb-24">
            <SectionTitle title="Scan Multimodal" subtitle="Escolha como identificar o resíduo" />
            
            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-2xl mb-6">
                {(['camera', 'voice', 'text'] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                            mode === m 
                            ? 'bg-white text-teal shadow-md' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {m === 'camera' ? '📷 Câmera' : m === 'voice' ? '🎤 Voz' : '⌨️ Texto'}
                    </button>
                ))}
            </div>

            {/* Mode Content */}
            <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                {mode === 'camera' && <CameraMode onCapture={(img) => handleAnalysis({ image: img })} />}
                {mode === 'voice' && <VoiceMode onVoiceCapture={(aud) => handleAnalysis({ audio: aud })} />}
                {mode === 'text' && <TextMode onTextSubmit={(txt) => handleAnalysis({ text: txt })} />}
            </motion.div>
        </div>
    );
};

const SkillsView = ({ user }: { user: UserState }) => (
    <div className="pb-20">
        <div className="bg-gradient-to-r from-teal to-teal-dark p-8 rounded-3xl text-white mb-8 shadow-xl">
             <h1 className="text-3xl font-black mb-2">Árvore de Habilidades</h1>
             <p className="opacity-90">Evolua seu conhecimento em cada material para ganhar bônus de XP e Ecoins.</p>
        </div>
        <SkillTreeView progress={user.skillTrees} />
    </div>
);

const QuestsView = ({ user }: { user: UserState }) => (
    <div className="pb-20 space-y-8">
         <SectionTitle title="Missões Diárias" subtitle="Reseta em 14h 30m" />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {user.dailyQuests.map(q => <QuestCard key={q.id} quest={q} />)}
         </div>

         <SectionTitle title="Missões Semanais" />
         <div className="grid grid-cols-1 gap-4">
             {user.weeklyQuests.map(q => <QuestCard key={q.id} quest={q} />)}
         </div>
         
         <SectionTitle title="Boss Lendário" subtitle="Evento da Comunidade" />
         <BossBattleCard boss={BOSS_BATTLE_MOCK} />
    </div>
);

// --- APP COMPONENT ---

export default function App() {
  const [view, setView] = useState<ViewState>('Home');
  const [user, setUser] = useState<UserState>(INITIAL_USER_STATE); 
  const [levelUpData, setLevelUpData] = useState<LevelConfig | null>(null);

  // Level Up Check Logic
  const checkLevelUp = (currentXp: number, currentLevel: number) => {
      const nextLevelConfig = LEVELS.find(l => l.level === currentLevel + 1);
      if (nextLevelConfig && currentXp >= nextLevelConfig.xpRequired) {
          // Level Up!
          setLevelUpData(nextLevelConfig);
          return {
              newLevel: nextLevelConfig.level,
              newTitle: nextLevelConfig.title,
              newXpThreshold: LEVELS.find(l => l.level === nextLevelConfig.level + 1)?.xpRequired || 99999
          };
      }
      return null;
  };

  const handleUpdateUser = (updates: Partial<UserState>) => {
      setUser(prev => ({ ...prev, ...updates }));
  };

  const handleScanComplete = (result: ScanResult) => {
    setUser(prev => {
      const newXp = prev.xp + 50;
      const levelUp = checkLevelUp(newXp, prev.level);
      
      const newState = {
        ...prev,
        balance: prev.balance + result.ecoins_earned,
        xp: newXp,
        itemsIdentified: prev.itemsIdentified + 1,
        co2SavedTotal: parseFloat((prev.co2SavedTotal + parseFloat(result.environmental_impact.co2_saved_kg.replace(/[^0-9.]/g, ''))).toFixed(2)),
        // Update Skill Tree (simplified logic for demo)
        skillTrees: {
            ...prev.skillTrees,
            [result.material.toLowerCase()]: prev.skillTrees[result.material.toLowerCase()] 
                ? { 
                    ...prev.skillTrees[result.material.toLowerCase()], 
                    itemsIdentified: prev.skillTrees[result.material.toLowerCase()].itemsIdentified + 1 
                  }
                : prev.skillTrees[result.material.toLowerCase()]
        }
      };

      if (levelUp) {
          newState.level = levelUp.newLevel;
          newState.levelTitle = levelUp.newTitle;
          newState.xpToNextLevel = levelUp.newXpThreshold;
          newState.balance += levelUpData?.rewards?.ecoins || 0; // Will be applied visually in modal, but logic here
          newState.lives = prev.maxLives; // Refill lives on level up
      }

      return newState;
    });
    setView('Home');
  };

  return (
    <>
        {levelUpData && (
            <LevelUpModal 
                newLevel={levelUpData} 
                onClose={() => setLevelUpData(null)} 
            />
        )}
        
        {/* Floating Chatbot always available */}
        <RecyclingChatbot />

        <Layout currentView={view} setView={setView} user={user}>
            {view === 'Home' && <HomeView user={user} setView={setView} />}
            {view === 'Skills' && <SkillsView user={user} />}
            {view === 'Quests' && <QuestsView user={user} />}
            {view === 'Social' && <SocialView />}
            {view === 'Map' && <MapView collectionPoints={COLLECTION_POINTS} />}
            {view === 'Profile' && <ProfileView user={user} onUpdateUser={handleUpdateUser} />}
            
            {view === 'Scan' && (
                <ScanView onScanComplete={handleScanComplete} />
            )}
            
            {view === 'Market' && (
                <div className="pb-20">
                    <SectionTitle title="Loja" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {REWARDS.map(r => (
                            <Card key={r.id}>
                                <div className="text-4xl mb-4">{r.image}</div>
                                <h3 className="font-bold">{r.name}</h3>
                                <p className="text-teal font-black">{r.price} ecoins</p>
                                <Button className="w-full mt-4" disabled={user.balance < r.price}>Resgatar</Button>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            {/* Placeholders */}
            {['Learn', 'Impact'].includes(view) && (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                    <div className="text-4xl mb-4">🚧</div>
                    <p className="font-bold">Em construção: Módulo {view}</p>
                </div>
            )}
        </Layout>
    </>
  );
}
