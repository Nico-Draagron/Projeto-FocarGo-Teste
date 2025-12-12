export type ViewState = 'Home' | 'Scan' | 'Impact' | 'Market' | 'Profile' | 'Learn' | 'Social' | 'Map';

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

export interface SkillTreeLevel {
  id: number;
  title: string;
  requirementCount: number;
  rewards: {
    xpBonus: number;
    ecoinsBonus: number;
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

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  progress: number;
  goal: number;
  rewards: { xp: number; ecoins: number };
  completed: boolean;
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

export interface Post {
  id: string;
  type: "achievement" | "challenge" | "research" | "impact" | "tip" | "partner";
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorLevel?: number;
  timestamp: string;
  content: any;
  likes: number;
  shares: number;
  isPinned?: boolean;
  likedByMe?: boolean;
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
  dailyChallenges: DailyChallenge[];
  
  // Education
  lessons: {
    [key: string]: LessonProgress;
  };
  lives: number;
  lastLifeRegen: string;

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
  lastActivityDate: string;
  activityLog: string[]; // dates 'YYYY-MM-DD'

  // History
  history: Array<{
    id: string;
    type: 'scan' | 'quiz' | 'levelup' | 'achievement' | 'redeem' | 'lesson';
    text: string;
    reward?: number;
    xp?: number;
    timestamp: string;
    icon: string;
  }>;
}

export const INITIAL_USER_STATE: UserState = {
  balance: 1240,
  xp: 1245,
  level: 6,
  levelTitle: "Guardian 🛡️",
  xpToNextLevel: 1900,
  skillTrees: {
    plastic: { material: 'plastic', currentLevel: 2, itemsIdentified: 21 },
    glass: { material: 'glass', currentLevel: 1, itemsIdentified: 12 },
    metal: { material: 'metal', currentLevel: 1, itemsIdentified: 8 },
    paper: { material: 'paper', currentLevel: 1, itemsIdentified: 6 },
    organic: { material: 'organic', currentLevel: 0, itemsIdentified: 0 },
    electronic: { material: 'electronic', currentLevel: 0, itemsIdentified: 0 },
  },
  achievements: [],
  dailyChallenges: [],
  lessons: {},
  lives: 5,
  lastLifeRegen: new Date().toISOString(),
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
  lastActivityDate: new Date().toISOString(),
  activityLog: [],
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