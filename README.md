# ChillMind: Mental Wellness Platform for Students

ChillMind is a personalized mental health monitoring platform designed specifically for students. It integrates machine learning and sentiment analysis to help track mental health conditions such as depression, anxiety, and stress through surveys, journaling, and provides personalized activity recommendations.

## Features

- **Smart Mental Health Assessment**: AI-powered analysis using standardized psychological measures (PHQ-9, GAD-7, PSS)
- **Interactive Journaling**: Express thoughts through guided journaling with sentiment analysis 
- **Personalized Recommendations**: Get tailored activity suggestions based on your mental health needs
- **Visual Progress Tracking**: Track your mental health journey over time with interactive charts
- **Private & Secure**: Your mental health data remains private and secure

## Tech Stack

- **Frontend**: Next.js, TailwindCSS, Framer Motion
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Machine Learning**: Sentiment analysis for journal entries and machine learning model for predicting mental health conditions
- **Deployment**: Vercel

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
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── api/          # API Routes
│   ├── auth/         # Authentication pages
│   ├── dashboard/    # Dashboard pages
│   ├── journal/      # Journal feature pages
│   ├── onboarding/   # Onboarding flow
│   └── page.tsx      # Landing page
├── components/       # UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── models/           # TypeScript interfaces
├── services/         # API services
└── utils/            # Helper functions
```

## Implemented Pages

- Landing page
- Authentication Pages (Login/Register)
- Onboarding Assessment (PHQ-9, GAD-7, PSS)

## Acknowledgments

- Mental health question sets adapted from clinical scales (PHQ-9, GAD-7, PSS)
- Design inspiration from modern mental wellness applications
