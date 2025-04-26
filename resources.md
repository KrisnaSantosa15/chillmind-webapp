# ChillMind Webapp Resources

## Project Overview

ChillMind is a mental wellness application for students, offering personalized mental health tracking, analysis, and recommendations. The webapp provides a comprehensive assessment system, journaling features, and personalized activities to help students monitor and improve their mental health.

## Current Implementation

### Core Features

1. **Mental Health Assessments predicted by machine learning model**
   - PHQ-9 (Depression Assessment)
   - GAD-7 (Anxiety Assessment)
   - PSS (Perceived Stress Scale)
   - Assessment results with visualizations
   - Machine learning model for predicting mental health conditions

2. **User Experience**
   - Responsive design for mobile and desktop
   - Dark/light theme toggle with persistence between page navigation
   - Step-by-step onboarding flow

3. **User Interface**
   - Modern, calming design with animated elements
   - Gradient and shadow effects for depth
   - Accessible UI components

### Folder Structure

```
chillmind-webapp/
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── auth/         # Authentication pages (login, register)
│   │   ├── dashboard/    # User dashboard
│   │   ├── onboarding/   # Assessment process
│   │   │   ├── demographics/  # User information collection
│   │   │   ├── gad7/          # Anxiety assessment
│   │   │   ├── phq9/          # Depression assessment
│   │   │   ├── pss/           # Stress assessment
│   │   │   └── results/       # Assessment results visualization
│   │   └── page.tsx      # Landing page
│   ├── components/       # Reusable components
│   │   ├── layout/       # Layout components (Header, Footer)
│   │   └── ui/           # UI components (Button, ThemeToggle, etc.)
│   └── globals.css       # Global CSS including theme variables
```

## Technology Stack

1. **Framework**
   - [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation
   - [React](https://reactjs.org/) - UI library

2. **Styling**
   - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

3. **Typography**
   - [Geist](https://vercel.com/font) - Sans-serif font by Vercel

## Design Resources

1. **Icons**
   - [Heroicons](https://heroicons.com/) - Used for UI icons (e.g., sun/moon for theme toggle)
   - Usage: `import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'`

2. **Color Scheme**
   - Primary: `#6b7fd7` (light mode), `#8ca0ec` (dark mode)
   - Secondary: `#64c9b9` (light mode), `#70d8c9` (dark mode)
   - Background: `#f8f9fb` (light mode), `#131526` (dark mode)
   - Foreground: `#2a2f45` (light mode), `#f1f5f9` (dark mode)

3. **Design Inspirations**
   - [Headspace](https://www.headspace.com/) - Mental wellness app with calming UI
   - [Calm](https://www.calm.com/) - Meditation app with soothing color palette
   - [MakeHeadway](https://www.makeheadway.com/) - Mental health app with calming UI
   - [Mental Health Website](https://dribbble.com/shots/21680614-Mental-Health-Website) - Modern, clean design with focus on accessibility
   - [Mental Health Branding](https://dribbble.com/shots/21424175-Mental-Health-Branding-Website) - Professional branding with warm color scheme
   - [Mindfulme](https://dribbble.com/shots/25069007-Mindfulme-AI-Driven-Mental-Health-Landing-Page) - AI-focused mental health platform with intuitive UX
   - [Mind Easy](https://dribbble.com/shots/20055453-Mind-Easy-Self-care-Website) - Self-care focused design with gentle gradients
   - [Mental Health Landing](https://dribbble.com/shots/18746818-Mental-Health-Landing-Design-Concept) - Minimalist approach with emphasis on typography
   - [Tinkle](https://dribbble.com/shots/21813993-TINKLE-Meditational-Course-Website) - Meditation course platform with organic shapes
   - [Mental Health](https://dribbble.com/shots/19873767-Mental-health) - Bold, contemporary design with strong visual hierarchy

## Implementation Notes

1. **Theme System**
   - Theme toggle implemented in `src/components/ui/ThemeToggle.tsx`
   - Theme persistence achieved through localStorage
   - Initial theme loading script in `src/app/layout.tsx`
   - CSS variables in `src/app/globals.css`

2. **Assessment Logic**
   - Scores calculated client-side and stored in localStorage
   - PHQ-9: Depression assessment with scoring 0-27
   - GAD-7: Anxiety assessment with scoring 0-21
   - PSS: Stress assessment with scoring 0-40 (including reverse scoring)

## What's Next

1. **Backend Integration**
   - Implement machine learning model for predicting mental health conditions in results page
   - Implement API routes for saving assessment results
   - User authentication and profile management
   - Data persistence with database integration

2. **Feature Enhancements**
   - Journal feature with sentiment analysis
   - Activity recommendations based on assessment results
   - Progress tracking and visualization
   - Reminders and notifications

3. **Content Development**
   - Mental health resources and articles
   - Guided meditation and relaxation exercises
   - Educational content about mental wellness

4. **Technical Improvements**
   - Unit and integration testing
   - Accessibility audit and improvements
   - Performance optimization
   - Server-side rendering optimization

## External Resources

1. **Mental Health Assessment Tools**
   - [PHQ-9](https://www.apa.org/depression-guideline/patient-health-questionnaire.pdf) - Depression assessment tool
   - [GAD-7](https://adaa.org/sites/default/files/GAD-7_Anxiety-updated_0.pdf) - Anxiety assessment tool
   - [PSS](https://www.das.nh.gov/wellness/docs/percieved%20stress%20scale.pdf) - Perceived Stress Scale

2. **UI Resources**
   - [Tailwind UI](https://tailwindui.com/) - Component inspirations
   - [Shadcn UI](https://ui.shadcn.com/) - Accessible component examples
   - [Radix UI](https://www.radix-ui.com/) - Headless UI component library

3. **Design Tools**
   - [Figma](https://www.figma.com/) - UI design and prototyping
   - [Coolors](https://coolors.co/) - Color palette generation
   - [Unsplash](https://unsplash.com/) - Free high-quality images

4. **Animation Resources**
   - [Motion One](https://motion.dev/) - Web animation library
   - [CSS Tricks - Animations](https://css-tricks.com/almanac/properties/a/animation/) - CSS animation reference

## Recommended Reading

1. **Mental Health UX**
   - [Designing for Mental Health](https://www.smashingmagazine.com/2022/10/designing-mental-health-applications-ethical-considerations/)
   - [Digital Mental Health Design](https://www.uxmatters.com/mt/archives/2020/06/designing-digital-mental-health-applications.php)

2. **Accessibility**
   - [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
   - [Inclusive Design Principles](https://inclusivedesignprinciples.org/)

3. **Next.js & React Best Practices**
   - [Next.js Documentation](https://nextjs.org/docs)
   - [React Patterns](https://reactpatterns.com/) 