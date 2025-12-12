
import { LevelConfig, Achievement, Quest, Lesson, SkillNodeConfig, Reward, Post, CollectionPoint, BossBattle, Challenge } from './types';

// --- LEVELS ---
export const LEVELS: LevelConfig[] = [
  { level: 1, title: "Seedling", xpRequired: 0, totalXpThreshold: 0, rewards: { ecoins: 0, unlocks: [] }, icon: "🌱" },
  { level: 2, title: "Sprout", xpRequired: 100, totalXpThreshold: 100, rewards: { ecoins: 50, unlocks: ["quiz"] }, icon: "🌿" },
  { level: 3, title: "Growing", xpRequired: 200, totalXpThreshold: 300, rewards: { ecoins: 75, unlocks: [] }, icon: "🪴" },
  { level: 4, title: "Blooming", xpRequired: 350, totalXpThreshold: 650, rewards: { ecoins: 100, unlocks: ["skills"] }, icon: "🌸" },
  { level: 5, title: "Flourishing", xpRequired: 500, totalXpThreshold: 1150, rewards: { ecoins: 150, unlocks: [] }, icon: "🌺" },
  { level: 6, title: "Guardian", xpRequired: 750, totalXpThreshold: 1900, rewards: { ecoins: 200, unlocks: ["challenges"] }, icon: "🛡️" },
  { level: 7, title: "Protector", xpRequired: 1000, totalXpThreshold: 2900, rewards: { ecoins: 250, unlocks: [] }, icon: "🦸" },
  { level: 8, title: "Defender", xpRequired: 1500, totalXpThreshold: 4400, rewards: { ecoins: 300, unlocks: ["adv_lessons"] }, icon: "⚔️" },
  { level: 9, title: "Champion", xpRequired: 2000, totalXpThreshold: 6400, rewards: { ecoins: 400, unlocks: [] }, icon: "🏆" },
  { level: 10, title: "Master", xpRequired: 3000, totalXpThreshold: 9400, rewards: { ecoins: 500, unlocks: ["mentor"] }, icon: "👑" },
];

// --- SKILL TREES NODES ---
export const SKILL_NODES: SkillNodeConfig[] = [
    { id: 1, title: "Novice", description: "Start your journey", icon: "🎓", requiredItems: 0, rewards: { ecoinsBonusMultiplier: 1.0 } },
    { id: 2, title: "Apprentice", description: "Learn common types", icon: "🔨", requiredItems: 10, rewards: { ecoinsBonusMultiplier: 1.2, unlockFeature: "Identify Subtypes" } },
    { id: 3, title: "Specialist", description: "Master sorting", icon: "🔬", requiredItems: 50, rewards: { ecoinsBonusMultiplier: 1.5, badge: "Pro" } },
    { id: 4, title: "Expert", description: "Detect contamination", icon: "🕵️", requiredItems: 100, rewards: { ecoinsBonusMultiplier: 1.8, unlockFeature: "Contamination Lens" } },
    { id: 5, title: "Master", description: "Teach others", icon: "🧙‍♂️", requiredItems: 200, rewards: { ecoinsBonusMultiplier: 2.5, badge: "Master" } }
];

export const MATERIAL_CONFIG: Record<string, {color: string, icon: string, name: string}> = {
    plastic: { color: '#E74C3C', icon: '🔴', name: 'Plástico' },
    glass: { color: '#2ECC71', icon: '🟢', name: 'Vidro' },
    metal: { color: '#F39C12', icon: '🟡', name: 'Metal' },
    paper: { color: '#3498DB', icon: '🔵', name: 'Papel' },
    organic: { color: '#8D6E63', icon: '🟤', name: 'Orgânico' },
    electronic: { color: '#9B59B6', icon: '⚡', name: 'Eletrônicos' },
};

// --- BOSS BATTLE ---
export const BOSS_BATTLE_MOCK: BossBattle = {
  id: "boss_contamination",
  title: "Rei da Contaminação",
  description: "A comunidade precisa identificar corretamente 500 itens contaminados para derrotar este monstro de chorume!",
  difficulty: "legendary",
  icon: "👹",
  progress: 342,
  goal: 500,
  rewards: {
    xp: 1000,
    ecoins: 500,
    items: ["title_contamination_slayer", "avatar_golden_seal"]
  },
  participants: 1247,
  timeLeft: "12d 5h",
  isActive: true
};

// --- ACHIEVEMENTS ---
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "dedicated",
    title: "Dedicated",
    description: "Identify 10 items",
    category: "identification",
    rarity: "common",
    icon: "🎯",
    requirement: { type: "count", value: 10 },
    rewards: { xp: 50, ecoins: 25 }
  },
  // ... existing achievements
];

// --- CHALLENGE POOL (QUESTS) ---
export const QUEST_POOL: Quest[] = [
    { id: 'dq1', type: 'daily', title: 'Scanner Casual', description: 'Identify 3 items', difficulty: 'easy', icon: '📸', progress: 0, goal: 3, rewards: {xp: 50, ecoins: 30}, timeLeft: '14h', completed: false },
    // ... more quests
];

// --- LESSONS ---
export const LESSONS: Lesson[] = [
    {
        id: "plastic_101",
        title: "Plastic Basics",
        description: "Learn to identify PET, HDPE and PP.",
        duration: "5 min",
        difficulty: "beginner",
        xpReward: 50,
        ecoinsReward: 25,
        exercises: [
            {
                id: "e1",
                type: "multiple_choice",
                question: "Which of these is typically made of PET (Type 1) plastic?",
                options: [{id: "A", text: "Soda Bottle"}, {id: "B", text: "Yogurt Cup"}, {id: "C", text: "Plastic Bag"}],
                correctAnswer: "A",
                explanation: "PET (Polyethylene Terephthalate) is the standard for clear soda and water bottles."
            }
        ]
    }
];

// --- REWARDS ---
export const REWARDS: Reward[] = [
  {
    id: "natura_discount",
    name: "Natura: 20% OFF",
    description: "Válido em produtos sustentáveis",
    category: "discount",
    price: 200,
    image: "🌿",
    partner: "Natura",
    stock: 500,
    tags: ["popular", "partner"],
    redemptionType: "code",
    instructions: "Use o código no checkout da Natura.com.br"
  },
  {
    id: "ifood_credit",
    name: "iFood: R$10 de Desconto",
    description: "Válido em pedidos acima de R$30",
    category: "discount",
    price: 250,
    image: "🍔",
    partner: "iFood",
    stock: 1000,
    tags: ["popular"],
    redemptionType: "code",
    instructions: "Aplique o cupom no app iFood"
  },
  {
    id: "plant_tree",
    name: "Plantar 1 Árvore",
    description: "Árvore nativa plantada em seu estado",
    category: "donation",
    price: 500,
    image: "🌳",
    partner: "SOS Mata Atlântica",
    stock: "unlimited",
    tags: ["impact", "popular"],
    redemptionType: "donation",
    instructions: "Você receberá um certificado digital"
  },
  {
    id: "cert_expert",
    name: "Certificado Expert",
    description: "Reconhecimento digital de expertise",
    category: "digital",
    price: 100,
    image: "🎓",
    stock: "unlimited",
    tags: ["popular"],
    redemptionType: "download",
    instructions: "Baixe o PDF no seu perfil"
  }
];

// --- POSTS ---
export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    type: "challenge",
    timestamp: "3h ago",
    likes: 230,
    shares: 89,
    comments: [],
    isPinned: true,
    content: {
      title: "ZERO GLASS WEEK",
      description: "Identify 10 glass items by Sunday!",
      goal: { metric: "items", target: 1000, current: 423 },
      rewards: { individual: "+150 ecoins", community: "100 Trees Planted 🌳" },
      participants: 1247
    }
  },
  {
    id: "p2",
    type: "achievement",
    author: {
        name: "Maria Silva",
        avatar: "👩‍🔬",
        level: 8
    },
    timestamp: "2h ago",
    likes: 45,
    shares: 3,
    comments: [
        { id: "c1", author: { name: "Pedro", avatar: "👨‍🌾" }, text: "Incrível! Parabéns Maria!", timestamp: "1h ago" }
    ],
    content: {
        title: "PLASTIC PRO",
        description: "Identified 100 plastic items",
        icon: "🔴",
        rewards: "+300 XP • +150 EcoCoins"
    }
  },
  {
    id: "p3",
    type: "tip",
    timestamp: "6h ago",
    likes: 156,
    shares: 45,
    comments: [],
    content: {
        title: "DID YOU KNOW?",
        tip: "Pizza boxes are often NOT recyclable due to grease contamination. Clean boxes can go in paper recycling!",
        icon: "🍕"
    }
  },
  {
    id: "p4",
    type: "impact",
    timestamp: "12h ago",
    likes: 1240,
    shares: 356,
    comments: [],
    content: {
      title: "100 TREES PLANTED!",
      stats: { trees: 100, co2: "12,500kg saved", items: 8432 }
    }
  }
];

export const MOCK_CHALLENGES: Challenge[] = [
    {
        id: "c1",
        title: "Zero Glass Week",
        description: "Identify 10 glass items",
        icon: "🍾",
        goal: { target: 1000, current: 423, metric: "items" },
        participants: 1247,
        rewards: { individual: "+150 ecoins", community: "100 Trees" },
        deadline: "Sunday"
    },
    {
        id: "c2",
        title: "Plastic Free",
        description: "Recycle 50 plastic bottles",
        icon: "🥤",
        goal: { target: 5000, current: 3100, metric: "items" },
        participants: 890,
        rewards: { individual: "+300 ecoins", community: "Beach Cleanup" },
        deadline: "Friday"
    }
];

// --- COLLECTION POINTS ---
export const COLLECTION_POINTS: CollectionPoint[] = [
  {
    id: "coop_vm",
    name: "Cooperativa Vila Mariana",
    type: "cooperative",
    address: "Rua Domingos de Morais, 2187",
    location: { lat: -23.5881, lng: -46.6383 },
    acceptedMaterials: ["plastic", "glass", "metal", "paper"],
    specialMaterials: [],
    hours: "Mon-Fri: 8am-5pm",
    phone: "(11) 5571-1234",
    description: "Family cooperative. Accepts all basic recyclables.",
    rating: 4.7,
    verified: true,
    photo: "🦭"
  }
];
