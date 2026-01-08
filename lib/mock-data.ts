// Mock data for the SkillSwap platform

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  credits: number
  badges: Badge[]
  skillsTeach: Skill[]
  skillsLearn: Skill[]
}

export interface Skill {
  id: string
  name: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  category: string
  testResult?: {
    score: number
    passed: boolean
    date: string
  }
  testRating?: number
  testReview?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
}

export interface Match {
  id: string
  mentor: {
    id: string
    name: string
    avatar: string
    rating: number
  }
  skill: string
  proficiency: string
  matchScore: number
  category: string
}

export interface Session {
  id: string
  skill: string
  type: "online" | "offline"
  date: string
  time: string
  location?: string
  meetingLink?: string
  mentor: string
  mentee: string
  status: "scheduled" | "completed" | "cancelled"
}

export interface Community {
  id: string
  name: string
  description: string
  members: number
  category: string
  icon: string
}

export interface Post {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  comments: number
}

// Current logged-in user
export const currentUser: User = {
  id: "1",
  name: "Rufiya",
  email: "rufiya@university.edu",
  avatar: "/student-avatar.png",
  credits: 250,
  badges: [
    {
      id: "b1",
      name: "Top Mentor",
      description: "Taught 10+ sessions",
      icon: "🏆",
      earnedAt: "2024-01-15",
    },
    {
      id: "b2",
      name: "Fast Learner",
      description: "Completed 5 skills",
      icon: "⚡",
      earnedAt: "2024-02-20",
    },
    {
      id: "b3",
      name: "Community Leader",
      description: "Active in 3+ circles",
      icon: "👥",
      earnedAt: "2024-03-10",
    },
  ],
  skillsTeach: [
    { id: "s1", name: "React Development", level: "Advanced", category: "Coding" },
    { id: "s2", name: "UI/UX Design", level: "Intermediate", category: "Design" },
    { id: "s3", name: "Public Speaking", level: "Expert", category: "Soft Skills" },
  ],
  skillsLearn: [
    { id: "s4", name: "Machine Learning", level: "Beginner", category: "AI/ML" },
    { id: "s5", name: "Photography", level: "Beginner", category: "Creative" },
    { id: "s6", name: "Spanish", level: "Intermediate", category: "Language" },
  ],
}

// AI-recommended matches
export const aiMatches: Match[] = [
  {
    id: "m1",
    mentor: {
      id: "u2",
      name: "Sarah Johnson",
      avatar: "/diverse-female-student.png",
      rating: 4.9,
    },
    skill: "Machine Learning Basics",
    proficiency: "Expert",
    matchScore: 95,
    category: "AI/ML",
  },
  {
    id: "m2",
    mentor: {
      id: "u3",
      name: "Marcus Kim",
      avatar: "/male-student-studying.png",
      rating: 4.8,
    },
    skill: "Photography Fundamentals",
    proficiency: "Advanced",
    matchScore: 92,
    category: "Creative",
  },
  {
    id: "m3",
    mentor: {
      id: "u4",
      name: "Elena Rodriguez",
      avatar: "/latina-student.jpg",
      rating: 5.0,
    },
    skill: "Spanish Conversation",
    proficiency: "Native",
    matchScore: 88,
    category: "Language",
  },
  {
    id: "m4",
    mentor: {
      id: "u5",
      name: "David Park",
      avatar: "/asian-student-studying.png",
      rating: 4.7,
    },
    skill: "Python for ML",
    proficiency: "Expert",
    matchScore: 85,
    category: "AI/ML",
  },
]

// Communities
export const communities: Community[] = [
  {
    id: "c1",
    name: "Web Development Circle",
    description: "Learn and share modern web development techniques",
    members: 324,
    category: "Coding",
    icon: "💻",
  },
  {
    id: "c2",
    name: "Design Thinkers",
    description: "UI/UX design principles and portfolio reviews",
    members: 198,
    category: "Design",
    icon: "🎨",
  },
  {
    id: "c3",
    name: "Public Speaking Masters",
    description: "Build confidence and improve presentation skills",
    members: 156,
    category: "Soft Skills",
    icon: "🎤",
  },
  {
    id: "c4",
    name: "AI & Machine Learning",
    description: "Explore ML algorithms and AI applications",
    members: 412,
    category: "AI/ML",
    icon: "🤖",
  },
  {
    id: "c5",
    name: "Photography Club",
    description: "Share photos and learn techniques",
    members: 267,
    category: "Creative",
    icon: "📸",
  },
]

// Community posts
export const communityPosts: Post[] = [
  {
    id: "p1",
    author: "Sarah Johnson",
    avatar: "/diverse-students-studying.png",
    content:
      "Just finished an amazing session on neural networks! Happy to help anyone getting started with ML basics.",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5,
  },
  {
    id: "p2",
    author: "Marcus Kim",
    avatar: "/photographer.png",
    content: "Golden hour photography tips: The best time is actually 30 mins before sunset. Here are my settings...",
    timestamp: "5 hours ago",
    likes: 42,
    comments: 12,
  },
  {
    id: "p3",
    author: "Elena Rodriguez",
    avatar: "/diverse-classroom-teacher.png",
    content: "Looking for a language exchange partner! I can teach Spanish, want to practice Mandarin.",
    timestamp: "1 day ago",
    likes: 18,
    comments: 8,
  },
]

// Sessions
export const sessions: Session[] = [
  {
    id: "ses1",
    skill: "Machine Learning Basics",
    type: "online",
    date: "2024-12-20",
    time: "14:00",
    meetingLink: "https://meet.example.com/ml-basics",
    mentor: "Sarah Johnson",
    mentee: "Rufiya",
    status: "scheduled",
  },
  {
    id: "ses2",
    skill: "React Development",
    type: "offline",
    date: "2024-12-18",
    time: "16:30",
    location: "Campus Library, Room 204",
    mentor: "Rufiya",
    mentee: "John Doe",
    status: "scheduled",
  },
]

// All available skills for autocomplete
export const allSkills = [
  "React Development",
  "Python Programming",
  "Machine Learning",
  "UI/UX Design",
  "Photography",
  "Public Speaking",
  "Spanish",
  "French",
  "German",
  "Content Writing",
  "Video Editing",
  "Graphic Design",
  "Data Analysis",
  "Mobile Development",
  "Game Development",
]
