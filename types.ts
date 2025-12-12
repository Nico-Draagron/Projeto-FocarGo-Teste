

export type ViewState = 'Home' | 'Scan' | 'Impact' | 'Market' | 'Profile' | 'Learn' | 'Social' | 'Map' | 'Skills' | 'Quests';

export interface ScanResult {
  material: string;
  material_details: string;
  category: string;
  bin_color: string;
  bin_emoji: string;
  recyclable: boolean;
  contamination_detected: boolean;
  contamination_details: string | null;
  cleaning_required: boolean;
  cleaning_instructions: string | null;
  educational_explanation: string;
  scientific_fact: string;
  environmental_impact: {
    co2_saved_kg: string;
    energy_saved: string;
    recycling_time: string;
    water_saved: string | null;
  };
  journey_story: string;
  cooperative_impact: string;
  ecoins_earned: number;
  tips: string[];
  confidence_score: number;
}

// --- AVATAR TYPES ---
export interface AvatarConfig {
  baseCharacter: 'seal' | 'tree' | 'leaf' | 'drop' | 'flower';
  skinColor: string;
  accessories: {
    hat: 'none' | 'cap' | 'crown' | 'flowers';
    glasses: 'none' | 'sunglasses' | 'nerd' | 'vr';
    outfit: 'none' | 'tshirt' | 'hoodie' | 'superhero';
  };
  backgroundColor: string;
  unlocked: string[]; // IDs of unlocked items
}

// --- CHAT TYPES ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isLoading?: boolean;
}

// --- GAMIFICATION TYPES ---

export interface LevelConfig {
  level: number;
  title: string;
  xpRequired: number;
  totalXpThreshold: number;
  rewards: {
    ecoins: number;
    unlocks: string[];
  };
  icon: string;
}

export interface SkillNodeConfig {
  id: number;
  title: string;
  description: string;
  icon: string;
  requiredItems: number;
  rewards: {
    ecoinsBonusMultiplier: number; // e.g., 1.2 for 20% bonus
    badge?: string;
    unlockFeature?: string;
  };
}

export interface SkillTreeProgress {
  material: string;
  currentLevel: number;
  itemsIdentified: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'identification' | 'material' | 'accuracy' | 'streak' | 'social' | 'impact';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  requirement: {
    type: 'count' | 'streak' | 'material_count' | 'co2';
    value: number;
    material?: string;
  };
  rewards: {
    xp: number;
    ecoins: number;
  };
}

export interface Quest {
  id: string;
  type: 'daily' | 'weekly';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
  progress: number;
  goal: number;
  rewards: {
    xp: number;
    ecoins: number;
    items?: string[];
  };
  timeLeft: string; // Mocked for UI
  completed: boolean;
}

export interface BossBattle {
  id: string;
  title: string;
  description: string;
  difficulty: 'legendary';
  icon: string;
  progress: number; // Global progress
  goal: number;
  rewards: {
    xp: number;
    ecoins: number;
    items: string[];
  };
  participants: number;
  timeLeft: string;
  isActive: boolean;
}

// --- EDUCATION TYPES ---

export type ExerciseType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'drag_drop';

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  image?: string;
  options?: Array<{ id: string; text: string }>;
  correctAnswer: string | boolean;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  ecoinsReward: number;
  exercises: Exercise[];
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
}

// --- MARKET TYPES ---

export interface Reward {
  id: string;
  name: string;
  description: string;
  category: "digital" | "discount" | "physical" | "donation" | "experience";
  price: number;
  image: string;
  partner?: string;
  stock: number | "unlimited";
  requirements?: {
    minLevel?: number;
    achievements?: string[];
  };
  tags: string[];
  instructions: string;
  redemptionType: "code" | "download" | "delivery" | "donation" | "booking";
}

export interface Redemption {
  id: string;
  rewardId: string;
  rewardName: string;
  code: string;
  date: string;
  status: "active" | "used" | "expired";
  price: number;
  image: string;
}

// --- SOCIAL TYPES ---

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  type: "achievement" | "challenge" | "impact" | "tip" | "showcase";
  author?: {
    name: string;
    avatar: string;
    level: number;
  };
  timestamp: string;
  content: any; // Flexible content based on type
  likes: number;
  comments: Comment[];
  shares: number;
  isPinned?: boolean;
  likedByMe?: boolean;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    icon: string;
    goal: {
        target: number;
        current: number;
        metric: string;
    };
    participants: number;
    rewards: {
        individual: string;
        community: string;
    };
    deadline: string;
    image?: string;
}

// --- MAP TYPES ---

export interface CollectionPoint {
  id: string;
  name: string;
  type: "cooperative" | "electronics" | "ecopoint" | "pharmacy";
  address: string;
  location: { lat: number; lng: number };
  acceptedMaterials: string[];
  specialMaterials: string[];
  hours: string;
  phone: string;
  description: string;
  rating: number;
  verified: boolean;
  photo: string;
}

// --- STATE ---

export interface UserState {
  // Profile
  name: string;
  avatar: AvatarConfig;

  // Economy
  balance: number;

  // Gamification Core
  xp: number;
  level: number;
  levelTitle: string;
  xpToNextLevel: number;
  
  // Advanced Gamification
  skillTrees: {
    [key: string]: SkillTreeProgress;
  };
  achievements: Array<{ id: string; unlockedAt: string }>;
  
  // Quests
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  
  // Education
  lessons: {
    [key: string]: LessonProgress;
  };
  lives: number;
  maxLives: number;
  lastLifeRegen: string; // ISO Date

  // Market
  redemptionHistory: Redemption[];
  wishlist: string[];

  // Social
  likedPosts: string[];

  // Stats
  itemsIdentified: number;
  co2SavedTotal: number;
  cooperativeIncomeTotal: number;
  
  // Material Counts
  materialCounts: {
    plastic: number;
    glass: number;
    metal: number;
    paper: number;
    organic: number;
    electronic: number;
    trash: number;
  };

  // Streak
  currentStreak: number;
  longestStreak: number;
  streakFreeze: number; // Number of freezes available
  lastActivityDate: string;
  activityLog: string[]; // dates 'YYYY-MM-DD'

  // History
  history: Array<{
    id: string;
    type: 'scan' | 'quiz' | 'levelup' | 'achievement' | 'redeem' | 'lesson' | 'quest' | 'boss';
    text: string;
    reward?: number;
    xp?: number;
    timestamp: string;
    icon: string;
  }>;
}

export const INITIAL_USER_STATE: UserState = {
  name: "Username",
  avatar: {
    baseCharacter: 'seal',
    skinColor: '#ffffff',
    accessories: {
        hat: 'none',
        glasses: 'none',
        outfit: 'none'
    },
    backgroundColor: '#0F8F6D',
    unlocked: ['base_seal', 'base_tree', 'base_leaf', 'base_drop', 'base_flower', 'hat_none', 'glasses_none', 'outfit_none']
  },
  balance: 1240,
  xp: 1245,
  level: 6,
  levelTitle: "Guardian",
  xpToNextLevel: 1900,
  skillTrees: {
    plastic: { material: 'plastic', currentLevel: 2, itemsIdentified: 21 },
    glass: { material: 'glass', currentLevel: 1, itemsIdentified: 12 },
    metal: { material: 'metal', currentLevel: 1, itemsIdentified: 8 },
    paper: { material: 'paper', currentLevel: 1, itemsIdentified: 6 },
    organic: { material: 'organic', currentLevel: 0, itemsIdentified: 0 },
    electronic: { material: 'electronic', currentLevel: 0, itemsIdentified: 0 },
  },
  achievements: [
      { id: 'dedicated', unlockedAt: new Date().toISOString() }
  ],
  dailyQuests: [
    { id: 'dq1', type: 'daily', title: 'Casual Scanner', description: 'Identify 3 items today', difficulty: 'easy', icon: '📸', progress: 1, goal: 3, rewards: { xp: 50, ecoins: 30 }, timeLeft: '14h 30m', completed: false },
    { id: 'dq2', type: 'daily', title: 'Glass Recycler', description: 'Find 1 glass item', difficulty: 'medium', icon: '🍾', progress: 0, goal: 1, rewards: { xp: 100, ecoins: 50 }, timeLeft: '14h 30m', completed: false }
  ],
  weeklyQuests: [
    { id: 'wq1', type: 'weekly', title: 'Plastic Hunter', description: 'Identify 20 plastic items', difficulty: 'medium', icon: '🔴', progress: 12, goal: 20, rewards: { xp: 300, ecoins: 200, items: ['badge_plastic_hunter'] }, timeLeft: '3d 8h', completed: false }
  ],
  lessons: {},
  lives: 4,
  maxLives: 5,
  lastLifeRegen: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
  redemptionHistory: [],
  wishlist: [],
  likedPosts: [],
  itemsIdentified: 47,
  co2SavedTotal: 8.2,
  cooperativeIncomeTotal: 12.45,
  materialCounts: {
    plastic: 21,
    glass: 12,
    metal: 8,
    paper: 6,
    organic: 0,
    electronic: 0,
    trash: 0,
  },
  currentStreak: 12,
  longestStreak: 15,
  streakFreeze: 2,
  lastActivityDate: new Date().toISOString(),
  activityLog: [
      "2023-10-01", "2023-10-02", "2023-10-05", "2023-10-06", "2023-10-07",
      "2023-10-08", "2023-10-09", "2023-10-10", "2023-10-11", "2023-10-12",
      "2023-10-13", "2023-10-14" // Current streak simulation
  ],
  history: [
    {
      id: '1',
      type: 'scan',
      text: 'Recycled PET Bottle',
      reward: 15,
      xp: 30,
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      icon: '🧴'
    }
  ]
};
