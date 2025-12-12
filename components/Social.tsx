

import React, { useState } from 'react';
import { Post, Comment, Challenge } from '../types';
import { Card, Button } from './UI';
import { HeartIcon } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

// --- ENGAGEMENT BAR ---
const EngagementBar = ({ post, onLike, onComment }: { post: Post, onLike: (id: string) => void, onComment: (id: string) => void }) => {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
      onLike(post.id);
  };
  
  return (
    <div className="flex items-center gap-6 pt-4 border-t border-gray-100 mt-4">
      <button 
        onClick={handleLike}
        className={`flex items-center gap-2 transition-all ${
          liked ? 'text-red-500 scale-105' : 'text-gray-400 hover:text-red-500'
        }`}
      >
        <motion.div whileTap={{ scale: 1.5 }}>
            <HeartIcon filled={liked} />
        </motion.div>
        <span className="text-sm font-bold">{likeCount}</span>
      </button>

      <button 
        onClick={() => onComment(post.id)}
        className="flex items-center gap-2 text-gray-400 hover:text-teal transition-colors"
      >
        <span className="text-xl">💬</span>
        <span className="text-sm font-bold">{post.comments.length}</span>
      </button>

      <button 
        className="flex items-center gap-2 text-gray-400 hover:text-purple transition-colors"
      >
        <span className="text-xl">🔄</span>
        <span className="text-sm font-bold">{post.shares}</span>
      </button>
    </div>
  );
};

// --- COMMENT SECTION ---
const CommentSection = ({ comments }: { comments: Comment[] }) => {
    if (comments.length === 0) return null;
    
    return (
        <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-xl">
            {comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-sm">
                        {comment.author.avatar}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm">
                        <span className="font-bold text-gray-800">{comment.author.name}</span>
                        {' '}
                        <span className="text-gray-600">{comment.text}</span>
                        </p>
                        <div className="flex gap-4 mt-1 text-xs text-gray-400">
                             <span>{comment.timestamp}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- POST CARDS ---

const AchievementPost = ({ post }: { post: Post }) => (
    <div className="relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl shadow-sm border border-gray-100">
                {post.author?.avatar}
            </div>
            <div>
                <h4 className="font-bold text-dark text-sm">{post.author?.name}</h4>
                <p className="text-xs text-gray-500">Level {post.author?.level} • {post.timestamp}</p>
            </div>
        </div>
        
        <p className="text-gray-600 mb-4">unlocked an EPIC achievement! 🎉</p>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg border-2 border-yellow-500/30">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="relative z-10 flex items-center gap-4">
                 <div className="text-5xl bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
                     {post.content.icon}
                 </div>
                 <div>
                     <h3 className="font-black text-xl text-yellow-400 tracking-wide uppercase">{post.content.title}</h3>
                     <div className="h-0.5 w-full bg-gradient-to-r from-yellow-500 to-transparent my-2"></div>
                     <p className="text-gray-300 text-sm mb-2">{post.content.description}</p>
                     <p className="text-xs font-bold text-teal-300 bg-teal-900/50 px-2 py-1 rounded inline-block">
                         {post.content.rewards}
                     </p>
                 </div>
             </div>
        </div>
    </div>
);

const ChallengePost = ({ post }: { post: Post }) => {
    const progress = Math.min((post.content.goal.current / post.content.goal.target) * 100, 100);
    
    return (
        <div>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="text-teal">📌 Official Challenge</span>
                <span>• {post.timestamp}</span>
            </div>

            <div className="bg-white rounded-2xl border-2 border-teal/10 overflow-hidden">
                <div className="bg-teal/5 p-6 border-b border-teal/10">
                     <h3 className="text-2xl font-black text-dark mb-1 flex items-center gap-2">
                         {post.content.title} 
                         <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">LIVE</span>
                     </h3>
                     <p className="text-gray-600 font-medium">{post.content.description}</p>
                </div>
                
                <div className="p-6">
                     <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
                         <span>Community Progress</span>
                         <span>{progress.toFixed(0)}%</span>
                     </div>
                     <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                         <div 
                            className="h-full bg-gradient-to-r from-teal to-accent"
                            style={{ width: `${progress}%` }}
                         />
                     </div>
                     <div className="flex justify-between text-xs text-gray-400 font-medium mb-6">
                         <span>{post.content.goal.current.toLocaleString()} {post.content.goal.metric}</span>
                         <span>Goal: {post.content.goal.target.toLocaleString()}</span>
                     </div>

                     <div className="bg-gray-50 rounded-xl p-4 mb-6">
                         <p className="text-xs font-bold text-gray-400 uppercase mb-2">Rewards</p>
                         <div className="flex justify-between items-center text-sm">
                             <span className="font-bold text-dark">Individual: <span className="text-teal">{post.content.rewards.individual}</span></span>
                             <span className="font-bold text-dark">Global: <span className="text-purple">{post.content.rewards.community}</span></span>
                         </div>
                     </div>

                     <Button className="w-full">JOIN NOW 🚀</Button>
                </div>
            </div>
        </div>
    );
};

const TipPost = ({ post }: { post: Post }) => (
    <div>
        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span className="text-yellow-500">💡 EcoTip</span>
            <span>• {post.timestamp}</span>
        </div>
        
        <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100 flex gap-4 items-start">
            <div className="text-5xl bg-white p-2 rounded-2xl shadow-sm">{post.content.icon}</div>
            <div>
                <h3 className="text-lg font-black text-yellow-800 mb-2">{post.content.title}</h3>
                <p className="text-yellow-900/80 font-medium leading-relaxed italic">"{post.content.tip}"</p>
            </div>
        </div>
    </div>
);

const ImpactPost = ({ post }: { post: Post }) => (
    <div>
        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span className="text-green-600">🌍 Global Impact</span>
            <span>• {post.timestamp}</span>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 text-center border border-green-100">
             <div className="inline-block bg-white p-4 rounded-full shadow-md text-4xl mb-4">🌳</div>
             <h3 className="text-3xl font-black text-dark mb-6">{post.content.title}</h3>
             
             <div className="grid grid-cols-3 gap-4 divide-x divide-gray-200">
                 <div>
                     <div className="text-xl font-black text-teal">{post.content.stats.co2}</div>
                     <div className="text-[10px] font-bold text-gray-400 uppercase">CO2 Saved</div>
                 </div>
                 <div>
                     <div className="text-xl font-black text-teal">{post.content.stats.items.toLocaleString()}</div>
                     <div className="text-[10px] font-bold text-gray-400 uppercase">Items</div>
                 </div>
                 <div>
                     <div className="text-xl font-black text-teal">{post.content.stats.trees}</div>
                     <div className="text-[10px] font-bold text-gray-400 uppercase">Trees</div>
                 </div>
             </div>
        </div>
    </div>
);

// --- MAIN POST CARD WRAPPER ---
export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    return (
        <Card className="hover:shadow-md transition-shadow">
            {post.type === 'achievement' && <AchievementPost post={post} />}
            {post.type === 'challenge' && <ChallengePost post={post} />}
            {post.type === 'tip' && <TipPost post={post} />}
            {post.type === 'impact' && <ImpactPost post={post} />}
            
            <EngagementBar 
                post={post} 
                onLike={(id) => console.log('like', id)} 
                onComment={(id) => console.log('comment', id)} 
            />
            
            <CommentSection comments={post.comments} />
        </Card>
    );
};

// --- CHALLENGE RAIL CARD ---
export const ChallengeRailCard: React.FC<{ challenge: Challenge }> = ({ challenge }) => (
    <div className="min-w-[280px] bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group">
        <div className="absolute top-0 right-0 bg-teal text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">
            {challenge.deadline}
        </div>
        
        <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl bg-gray-50 p-2 rounded-xl group-hover:scale-110 transition-transform">{challenge.icon}</div>
            <div>
                <h4 className="font-bold text-dark text-sm leading-tight">{challenge.title}</h4>
                <p className="text-xs text-gray-500">{challenge.participants} participating</p>
            </div>
        </div>
        
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
             <div 
                className="h-full bg-teal" 
                style={{ width: `${(challenge.goal.current / challenge.goal.target) * 100}%` }} 
             />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-400">
             <span>{Math.round((challenge.goal.current / challenge.goal.target) * 100)}%</span>
             <span>Reward: {challenge.rewards.individual}</span>
        </div>
    </div>
);

// --- CREATE POST MODAL ---
export const CreatePostModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => void }) => {
  const [type, setType] = useState<'achievement' | 'milestone' | 'tip'>('achievement');
  const [content, setContent] = useState("");

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">New Post</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">×</button>
        </div>

        {/* Post Type */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-50 rounded-xl">
          {['achievement', 'milestone', 'tip'].map(t => (
            <button 
              key={t}
              onClick={() => setType(t as any)}
              className={`flex-1 py-2 rounded-lg font-bold text-sm capitalize transition-all ${
                type === t 
                  ? 'bg-white text-teal shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your recycling story..."
          className="w-full h-32 border-2 border-gray-100 rounded-2xl p-4 resize-none focus:border-teal focus:outline-none transition-colors mb-2"
          maxLength={280}
        />

        <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
          <span className={content.length > 250 ? 'text-red-500' : ''}>{content.length}/280</span>
          <button 
            onClick={() => { onSubmit({ type, content }); onClose(); }}
            disabled={!content.trim()}
            className="bg-gradient-to-r from-teal to-teal-light text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 hover:shadow-lg hover:scale-105 transition-all"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
