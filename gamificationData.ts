import { LevelConfig, Achievement, DailyChallenge, Lesson, SkillTreeLevel, Reward, Post, CollectionPoint } from './types';

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

// --- SKILL TREES ---
export const SKILL_TREE_LEVELS: SkillTreeLevel[] = [
    { id: 1, title: "Novice", requirementCount: 5, rewards: { xpBonus: 1.0, ecoinsBonus: 0 } },
    { id: 2, title: "Apprentice", requirementCount: 20, rewards: { xpBonus: 1.2, ecoinsBonus: 5 } },
    { id: 3, title: "Specialist", requirementCount: 50, rewards: { xpBonus: 1.5, ecoinsBonus: 10 } },
    { id: 4, title: "Expert", requirementCount: 100, rewards: { xpBonus: 1.8, ecoinsBonus: 15 } },
    { id: 5, title: "Master", requirementCount: 200, rewards: { xpBonus: 2.0, ecoinsBonus: 25 } }
];

export const MATERIAL_CONFIG: Record<string, {color: string, icon: string, name: string}> = {
    plastic: { color: '#E74C3C', icon: '🔴', name: 'Plastic' },
    glass: { color: '#2ECC71', icon: '🟢', name: 'Glass' },
    metal: { color: '#F39C12', icon: '🟡', name: 'Metal' },
    paper: { color: '#3498DB', icon: '🔵', name: 'Paper' },
    organic: { color: '#8D6E63', icon: '🟤', name: 'Organic' },
    electronic: { color: '#9B59B6', icon: '⚡', name: 'E-Waste' },
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
  {
    id: "plastic_pro",
    title: "Plastic Pro",
    description: "Identify 50 plastic items",
    category: "material",
    rarity: "epic",
    icon: "🔴",
    requirement: { type: "material_count", value: 50, material: "plastic" },
    rewards: { xp: 300, ecoins: 150 }
  },
  {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Reach a 7 day streak",
    category: "streak",
    rarity: "rare",
    icon: "🔥",
    requirement: { type: "streak", value: 7 },
    rewards: { xp: 100, ecoins: 50 }
  },
  {
    id: "carbon_saver",
    title: "Carbon Saver",
    description: "Save 10kg of CO2",
    category: "impact",
    rarity: "legendary",
    icon: "🌍",
    requirement: { type: "co2", value: 10 },
    rewards: { xp: 500, ecoins: 250 }
  }
];

// --- DAILY CHALLENGES POOL ---
export const CHALLENGE_POOL: DailyChallenge[] = [
    { id: 'c1', title: 'Casual Scanner', description: 'Identify 3 items', difficulty: 'easy', progress: 0, goal: 3, rewards: {xp: 50, ecoins: 30}, completed: false },
    { id: 'c2', title: 'Plastic Hunter', description: 'Identify 2 plastic items', difficulty: 'medium', progress: 0, goal: 2, rewards: {xp: 100, ecoins: 50}, completed: false },
    { id: 'c3', title: 'Quiz Whiz', description: 'Complete 1 lesson', difficulty: 'medium', progress: 0, goal: 1, rewards: {xp: 100, ecoins: 50}, completed: false },
    { id: 'c4', title: 'Eco Warrior', description: 'Identify 5 items', difficulty: 'hard', progress: 0, goal: 5, rewards: {xp: 200, ecoins: 100}, completed: false },
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
            },
            {
                id: "e2",
                type: "true_false",
                question: "Dirty plastic food containers should be rinsed before recycling.",
                correctAnswer: true,
                explanation: "Food residue can contaminate the recycling batch. A quick rinse makes a huge difference!"
            },
            {
                id: "e3",
                type: "fill_blank",
                question: "The standard bin color for plastic in Brazil is ____.",
                correctAnswer: "Red",
                explanation: "Red (Vermelho) is the designated color for plastic waste bins."
            }
        ]
    },
    {
        id: "glass_mastery",
        title: "Glass Cycle",
        description: "Why glass is the infinite material.",
        duration: "7 min",
        difficulty: "beginner",
        xpReward: 75,
        ecoinsReward: 35,
        exercises: [
             {
                id: "e1",
                type: "true_false",
                question: "Glass can be recycled indefinitely without losing quality.",
                correctAnswer: true,
                explanation: "Glass is 100% recyclable and never degrades in quality during the process."
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
  },
  {
    id: "thermos_bottle",
    name: "Garrafa Térmica 500ml",
    description: "Inox, mantém temperatura por 12h",
    category: "physical",
    price: 400,
    image: "🧊",
    stock: 50,
    tags: ["eco-friendly", "limited"],
    redemptionType: "delivery",
    instructions: "Preencha o endereço de entrega"
  }
];

// --- POSTS ---
export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    type: "challenge",
    authorId: "sys",
    authorName: "EcoCoins Oficial",
    authorAvatar: "⚡",
    timestamp: "3h ago",
    content: {
      title: "Zero Glass Week",
      description: "Identify 10 glass items by Sunday!",
      goal: { type: "community", target: 1000, current: 423 },
      rewards: { individual: "+150 ecoins", community: "100 Trees Planted" }
    },
    likes: 230,
    shares: 89,
    isPinned: true
  },
  {
    id: "p2",
    type: "achievement",
    authorId: "u2",
    authorName: "Maria Silva",
    authorAvatar: "👩",
    authorLevel: 8,
    timestamp: "2h ago",
    content: {
      achievement: { title: "Plastic Pro", icon: "🔴", rarity: "epic", description: "Identified 100 plastic items" },
      message: "unlocked an epic achievement!"
    },
    likes: 45,
    shares: 3
  },
  {
    id: "p3",
    type: "tip",
    authorId: "sys",
    authorName: "EcoCoins Tips",
    authorAvatar: "💡",
    timestamp: "6h ago",
    content: {
      title: "Tip of the Day",
      tip: "Pizza boxes are often NOT recyclable due to grease contamination.",
      image: "🍕"
    },
    likes: 156,
    shares: 45
  },
  {
    id: "p4",
    type: "impact",
    authorId: "sys",
    authorName: "Community Impact",
    authorAvatar: "🌍",
    timestamp: "12h ago",
    content: {
      title: "100 Trees Planted!",
      stats: { trees: 100, co2: "12,500kg saved" }
    },
    likes: 1240,
    shares: 356
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
  },
  {
    id: "elect_paulista",
    name: "Paulista Electronics Point",
    type: "electronics",
    address: "Av. Paulista, 1230",
    location: { lat: -23.5629, lng: -46.6544 },
    acceptedMaterials: [],
    specialMaterials: ["electronics", "batteries"],
    hours: "Daily: 10am-10pm",
    phone: "(11) 3251-5678",
    description: "Specialized in e-waste.",
    rating: 4.9,
    verified: true,
    photo: "⚡"
  },
  {
    id: "eco_jardins",
    name: "EcoPoint Jardins",
    type: "ecopoint",
    address: "Rua Augusta, 2690",
    location: { lat: -23.5619, lng: -46.6608 },
    acceptedMaterials: ["plastic", "glass", "metal", "paper"],
    specialMaterials: ["oil"],
    hours: "24 hours",
    phone: "(11) 3061-9000",
    description: "Municipal ecopoint.",
    rating: 4.5,
    verified: true,
    photo: "♻️"
  }
];