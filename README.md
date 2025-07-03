# 🌿 MindFullMe

**MindFullMe** is a web-based Mental Health Companion application designed to help users manage stress, track mood patterns, and build positive self-care habits. With daily check-ins, personalized AI-powered wellness suggestions, and a supportive peer community, MindFullMe promotes mindfulness and emotional well-being.

---

## ✨ Features

- **🧠 Daily Mood Tracker**
  - Emoji/slider-based mood input
  - Optional journaling for reflection
  - Calendar view to track emotional trends

- **🤖 AI-Powered Self-Care Suggestions**
  - Personalized wellness advice based on mood history
  - Includes breathing exercises, mindfulness tips, and gratitude journaling prompts

- **💬 Anonymous Peer Support Community**
  - Text-based forum with complete anonymity
  - Positive-only reactions to create a safe, empathetic space

- **🏆 Gamification & Progress Tracking**
  - Points, badges, and streaks for daily check-ins and self-care activities
  - Visual dashboards to track mental wellness over time

---

## ⚙️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Plain CSS (no Tailwind), custom components and gradients
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose
- **Authentication**: JWT-based login/signup (with MongoDB user storage)

---


---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mindfullme.git
cd mindfullme
npm install
# or
yarn install

# .env.local
MONGODB_URI=mongodb+srv://<your-mongodb-uri>
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_auth_secret


npm run dev
# or
yarn dev
