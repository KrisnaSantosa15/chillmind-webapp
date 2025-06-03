# ChillMind: Comprehensive Mental Wellness Platform for Students

ChillMind is a fully-featured, AI-powered mental health monitoring and support platform designed specifically for students. The platform combines advanced machine learning models, sentiment analysis, and professional-grade assessment tools to provide comprehensive mental health tracking, personalized insights, and evidence-based recommendations through an intuitive, secure interface. ChillMind using **Micro Interactive Education** concept for Journaling features, allowing students to reflect on their mental health in a structured, engaging way.

## Repos:
- [ChillMind Web App](https://github.com/KrisnaSantosa15/chillmind-webapp)
- [ChillMind Models](https://github.com/KrisnaSantosa15/chillmind-models)

## 🌟 Key Features

### 📊 **Advanced Mental Health Assessments**
- **Standardized Clinical Tools**: Complete implementation of PHQ-9 (Depression), GAD-7 (Anxiety), and PSS (Stress) assessments
- **ML-Powered Predictions**: Real-time machine learning model integration for mental health condition prediction
- **Comprehensive Results**: Detailed scoring, severity classification, and personalized insights
- **Progress Monitoring**: Track assessment results over time with comparative analysis

### 📝 **Smart Journaling System**
- **AI Emotion Detection**: Advanced sentiment analysis and emotion prediction using ML models
- **Multiple View Modes**: Grid, list, and detailed journal entry viewing options
- **Advanced Search & Filtering**: Search by content, filter by emotions, date ranges, and sentiment
- **Infinite Scroll**: Seamless browsing through journal history

### 📈 **Comprehensive Progress Tracking**
- **Wellbeing Statistics**: Multi-metric dashboard with mood trends, journal consistency, and assessment progress
- **Interactive Mood Charts**: Visual mood tracking with multiple time range selections (7 days, 30 days, 90 days)
- **Streak Tracking**: Journaling streaks and consistency monitoring

### 🗺️ **Professional Support Finder**
- **Psychologist Directory**: Comprehensive database of HIMPSI-registered mental health professionals
- **Interactive Map**: Geolocation-based professional finder with map and list views (Future feature)
- **Advanced Filtering**: Search by location, specialization, and availability
- **Contact Integration**: Direct access to professional contact information

### 📚 **Mental Health Resources**
- **Comprehensive Library**: Curated collection of mental health tools, exercises, and educational content
- **Interactive Exercises**: Guided breathing exercises, mindfulness practices, and coping strategies
- **Educational Articles**: Evidence-based mental health information and self-help guides

### 🤖 **Interactive AI Assistant**
- **Gemini AI Integration**: Powered by Google's Gemini API for intelligent conversations
- **Streaming Responses**: Real-time AI response generation with typing indicators
- **Quick Suggestions**: Context-aware conversation starters and helpful prompts
- **Mental Health Focus**: Specialized responses for mental wellness topics

### 🎨 **Modern User Experience**
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Persistent theme switching with user preference storage
- **Intuitive Navigation**: Clean, accessible dashboard with logical information architecture
- **Real-time Updates**: Live data synchronization across all features

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS, Framer Motion, Lucide Icons
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **AI Integration**: Google Gemini API, TensorFlow.js
- **Machine Learning**: Custom ML models for emotion prediction and mental health assessment
- **Data Visualization**: Recharts, Chart.js
- **Deployment**: Vercel
- **Development**: ESLint, TypeScript, PostCSS

## 🔧 Architecture

### Frontend Architecture
- **Next.js App Router**: Modern React framework with file-based routing
- **Component-Based Design**: Modular, reusable UI components
- **TypeScript**: Full type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first styling with custom design system
- **Context API**: Global state management for authentication and user data

### Backend Integration
- **Firebase Authentication**: Secure user authentication with email/password
- **Firestore Database**: Real-time NoSQL database for user data and journal entries
- **Firebase Storage**: Secure file storage for user-generated content
- **API Routes**: Server-side API endpoints for external integrations

### AI & ML Integration
- **TensorFlow.js**: Client-side ML model inference for emotion prediction
- **Gemini API**: Advanced AI assistant with streaming capabilities
- **Sentiment Analysis**: Real-time emotion detection in journal entries
- **Predictive Analytics**: ML-powered mental health condition prediction

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/krisnasantosa15/chillmind-webapp.git
   cd chillmind-webapp
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Gemini API Configuration
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_SYSTEM_INSTRUCTION="You are an AI assistant for ChillMind, a mental wellness platform for students..."

   # Firebase Configuration (Client-side)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Configuration (Server-side)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY_ID=your_private_key_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----"
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_CLIENT_ID=your_client_id
   ```

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Server-side API Routes
│   │   ├── emotion-prediction/ # ML emotion prediction endpoint
│   │   ├── gemini/        # AI assistant API integration
│   │   ├── geocode/       # Location services for psychologist finder (Future feature)
│   │   ├── journals/      # Journal data management API
│   │   ├── psychologists/ # Professional directory API
│   │   └── user/          # User data management
│   ├── auth/              # Authentication pages (Login/Register)
│   ├── dashboard/         # Main application dashboard
│   │   ├── ai-assistant/  # AI chat interface
│   │   ├── assessments/   # Mental health assessment tools
│   │   ├── find-psychologist/ # Professional finder
│   │   ├── journal/       # Advanced journaling system
│   │   ├── progress/      # Progress tracking and analytics
│   │   ├── resources/     # Mental health resources library
│   │   └── coming-soon/   # Future features placeholder
│   ├── onboarding/        # User onboarding flow
│   │   ├── demographics/  # User information collection
│   │   ├── gad7/         # GAD-7 anxiety assessment
│   │   ├── phq9/         # PHQ-9 depression assessment
│   │   ├── pss/          # Perceived Stress Scale
│   │   └── results/      # Assessment results and insights
│   └── page.tsx          # Landing page
├── components/            # Reusable UI Components
│   ├── auth/             # Authentication-related components
│   ├── dashboard/        # Dashboard-specific components
│   │   ├── AIAssistant.tsx        # AI chat interface
│   │   ├── AIAssistantWidget.tsx  # Dashboard AI widget
│   │   ├── EmotionInsightCard.tsx # Emotion analysis cards
│   │   ├── JournalSection.tsx     # Journal management
│   │   ├── MoodChart.tsx          # Mood visualization
│   │   ├── WellbeingStats.tsx     # Progress statistics
│   │   └── ...
│   ├── layout/           # Layout components (Header, Footer, Navigation)
│   └── ui/               # Generic UI components (buttons, inputs, etc.)
├── lib/                  # Core Library Functions
│   ├── auth.ts           # Authentication utilities
│   ├── firebase.ts       # Firebase configuration
│   ├── journalStorage.ts # Journal data management with ML
│   ├── model.ts          # ML model integration
│   ├── psychologistApi.ts # Professional directory API
│   └── ...
├── data/                 # Static data and configurations
└── styles/               # Additional styles for AI components
```

## 🔌 API Endpoints Documentation

ChillMind provides a comprehensive REST API that powers all client-side features. Our API is built with Next.js API Routes and provides secure, authenticated endpoints for all platform functionality.

### 🔐 Authentication
All API endpoints (except emotion prediction) require authentication via Firebase JWT tokens. Include the Authorization header:
```
Authorization: Bearer <firebase_jwt_token>
```

### 📝 Journal Management API

#### **GET `/api/journals`** - Retrieve Journal Entries
Fetch user's journal entries with optional pagination.

**Query Parameters:**
- `limit` (optional): Number of entries to return (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "journal_id_123",
      "content": "Today I felt really good about my progress...",
      "mood": "joy",
      "tags": ["progress", "achievement"],
      "date": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 25
}
```

#### **POST `/api/journals`** - Create New Journal Entry
Create a new journal entry with automatic emotion detection.

**Request Body:**
```json
{
  "content": "Journal entry content...",
  "mood": "joy",
  "tags": ["gratitude", "reflection"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new_journal_id",
    "content": "Journal entry content...",
    "mood": "joy",
    "tags": ["gratitude", "reflection"],
    "date": "2024-01-15T10:30:00.000Z"
  },
  "message": "Journal entry created successfully"
}
```

#### **GET `/api/journals/[id]`** - Get Specific Journal Entry
Retrieve a specific journal entry by ID.

#### **PUT `/api/journals/[id]`** - Update Journal Entry
Update an existing journal entry.

#### **DELETE `/api/journals/[id]`** - Delete Journal Entry
Remove a journal entry from the database.

### 📊 User Analytics API

#### **GET `/api/user/mood-chart`** - Mood Chart Data
Get mood tracking data for visualizations.

**Query Parameters:**
- `timeRange`: `week` | `month` | `year`

**Response:**
```json
{
  "success": true,
  "data": {
    "labels": ["Jan 1", "Jan 2", "Jan 3", ...],
    "data": [4.5, 3.2, 5.1, 4.8, ...]
  }
}
```

#### **GET `/api/user/streak`** - Get User Streak
Retrieve current journaling streak.

**Response:**
```json
{
  "success": true,
  "data": {
    "days": 15,
    "lastUpdate": "2024-01-15T10:30:00.000Z"
  }
}
```

#### **POST `/api/user/streak`** - Update User Streak
Update journaling streak (automatically called on journal creation).

### 🤖 AI Assistant API

#### **POST `/api/gemini`** - AI Assistant Chat
Get AI responses for mental health support.

**Request Body:**
```json
{
  "prompt": "I'm feeling anxious about my upcoming exams. Any advice?"
}
```

**Response:**
```json
{
  "text": "It's completely normal to feel anxious about exams. Here are some strategies that might help..."
}
```

#### **POST `/api/gemini/stream`** - Streaming AI Chat
Real-time streaming AI responses for better user experience.

**Request Body:**
```json
{
  "prompt": "How can I manage stress better?"
}
```

**Response:** Server-Sent Events stream with text chunks.

### 🧠 Machine Learning API

#### **POST `/api/emotion-prediction`** - Emotion Analysis
Analyze text content to predict emotional state.

**Request Body:**
```json
{
  "text": "I am very excited! I just got accepted into my dream university!"
}
```

**Response:**
```json
{
	"emotion": "joy",
	"confidence": 0.9811326861381531,
	"all_probabilities": {
		"sadness": 0.0030074797105044127,
		"joy": 0.9811326861381531,
		"love": 0.0032457043416798115,
		"anger": 0.007577741984277964,
		"fear": 0.002951824339106679,
		"surprise": 0.0020846014376729727
	}
}

```

### 🏥 Professional Directory API

#### **GET `/api/psychologists`** - HIMPSI Psychologist Directory
Proxy API for accessing HIMPSI (Indonesian Psychology Association) professional directory.

**Query Parameters:**
- `endpoint`: API endpoint to query
- `params`: URL-encoded query parameters

**Example:**
```
/api/psychologists?endpoint=anggota/public&params=page[size]=10&filter[kota_id]=123
```

### 🌍 Location Services API

#### **GET `/api/geocode`** - Address Geocoding (Future Feature)
Convert addresses to coordinates for map features.

**Query Parameters:**
- `address`: Address to geocode (automatically adds "Indonesia" for better results)

**Response:**
```json
{
  "lat": -6.2088,
  "lon": 106.8456
}
```

---

## 🚀 Usage Guide

1. **Getting Started**: Create an account or log in to access the platform
2. **Initial Assessment**: Complete the onboarding assessments (PHQ-9, GAD-7, PSS) for baseline mental health evaluation
3. **Dashboard Navigation**: Explore different features through the intuitive dashboard
4. **Daily Journaling**: Start writing in the journal with automatic emotion analysis
5. **AI Assistant**: Use the AI chat for mental health support and guidance
6. **Progress Tracking**: Monitor your mental health journey through the progress page
7. **Professional Support**: Find qualified psychologists through the professional finder
8. **Resources**: Access mental health tools and educational content

## 📋 Development Roadmap (Future Works)

### 🗺️ **Find Nearest Psychologist Map**
We will provide a feature to find the nearest psychologists based on user location using digital maps like Google Maps to deliver a more interactive and user-friendly experience.

### 💬 **Ask Psychologist**
In the future, we will provide features for users to interact with available psychologists for Q&A sessions and chatting according to their needs on the ChillMind platform, enabling direct consultation with professionals.

### 👥 **Community Features**
We will provide features that allow users to connect with each other, share experiences, and provide mutual support in their personal development journey. This feature will include discussion forums, interest groups, and potential virtual or in-person community events in the future.

### 🤝 **Peer Pairing**
We will provide a pairing feature with people who have similar mental health conditions, so they can share experiences and support each other through 10-minute chat sessions (to avoid unwanted situations).

### 💎 **Subscription & Premium Features**
In the future, this website will have subscription features that can be used by users to gain access to premium features such as advanced assessment insights, enhanced journaling, peer pairing, and premium resources in the form of articles or videos.

### 🚀 **Additional Technical Roadmap**
- [ ] Mobile app development (React Native)
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Advanced ML models for personalization
- [ ] Real-time notification system
- [ ] Voice journaling capabilities

## 📄 License

This project is licensed under the CC25-CF133 Capstone Team Private License - see the [LICENSE](LICENSE) file for details.

---

**Note**: ChillMind is designed to support mental wellness but is not a replacement for professional mental health treatment. If you're experiencing a mental health crisis, please contact your local emergency services or a mental health crisis hotline.
