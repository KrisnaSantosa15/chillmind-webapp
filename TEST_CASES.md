# ChillMind WebApp - Test Case Documentation

**Project:** ChillMind Mental Health Web Application  
**Version:** 1.0.0  
**Date:** December 4, 2025  
**Prepared By:** QA Team  
**Total Test Cases:** 197

---

## Table of Contents
- [ChillMind WebApp - Test Case Documentation](#chillmind-webapp---test-case-documentation)
  - [Table of Contents](#table-of-contents)
  - [1. Accessibility Tests](#1-accessibility-tests)
  - [2. API Integration Tests](#2-api-integration-tests)
  - [3. Authentication Tests](#3-authentication-tests)
  - [4. Crisis Resources Tests](#4-crisis-resources-tests)
  - [5. Dashboard - AI Assistant Tests](#5-dashboard---ai-assistant-tests)
  - [6. Dashboard - Assessments Tests](#6-dashboard---assessments-tests)
  - [7. Dashboard - Journal Tests](#7-dashboard---journal-tests)
  - [8. Dashboard - Main Tests](#8-dashboard---main-tests)
  - [9. Dashboard - Progress Tests](#9-dashboard---progress-tests)
  - [10. Dashboard - Resources Tests](#10-dashboard---resources-tests)
  - [11. Find Psychologist Tests](#11-find-psychologist-tests)
  - [12. Landing Page Tests](#12-landing-page-tests)
  - [13. Onboarding Complete Flow Tests](#13-onboarding-complete-flow-tests)
  - [14. Onboarding Basic Tests](#14-onboarding-basic-tests)
  - [Test Execution Summary](#test-execution-summary)
    - [Test Priority Distribution](#test-priority-distribution)
    - [Test Type Distribution](#test-type-distribution)
    - [Test Coverage by Module](#test-coverage-by-module)
  - [Test Environment Setup](#test-environment-setup)
    - [Prerequisites](#prerequisites)
    - [Authentication Setup](#authentication-setup)
    - [Browser Configuration](#browser-configuration)
  - [Test Execution Commands](#test-execution-commands)
  - [Notes](#notes)
  - [Defect Severity Levels](#defect-severity-levels)

---

## 1. Accessibility Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| ACC-001 | Landing page heading hierarchy | Verify proper heading hierarchy structure | None | 1. Navigate to landing page<br>2. Check for h1 element<br>3. Check for multiple h2 headings | - h1 element is visible<br>- Multiple h2 headings present | High | Functional |
| ACC-002 | Images alt text validation | Verify all images have alt attributes | None | 1. Navigate to landing page<br>2. Get all image elements<br>3. Check each image for alt attribute | - All images have alt attribute (can be empty for decorative) | High | Functional |
| ACC-003 | Buttons accessible names | Verify buttons have accessible names | None | 1. Navigate to landing page<br>2. Get all buttons<br>3. Check for text content or aria-label | - All buttons have text content or aria-label | High | Functional |
| ACC-004 | Form inputs with labels | Verify form inputs have associated labels | None | 1. Navigate to /auth/login<br>2. Check email input has label<br>3. Check password input has label | - Email input has label<br>- Password input has label | High | Functional |
| ACC-005 | Page document title | Verify page has proper document title | None | 1. Navigate to landing page<br>2. Get page title | - Title exists and is not empty | Medium | Functional |
| ACC-006 | Links descriptive text | Verify links have descriptive text | None | 1. Navigate to landing page<br>2. Get all link elements<br>3. Check for text content or aria-label | - All links have text content or aria-label | Medium | Functional |
| ACC-007 | Keyboard navigation | Verify keyboard navigation works | None | 1. Navigate to landing page<br>2. Focus on CTA button<br>3. Press Tab key<br>4. Verify focus moves | - Button receives focus<br>- Focus moves to next element on Tab | High | Functional |

---

## 2. API Integration Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| API-001 | Emotion prediction from journal | Verify emotion prediction API works | User logged in | 1. Navigate to journal page<br>2. Create new entry<br>3. Fill with emotional text<br>4. Submit entry<br>5. Wait for emotion prediction | - Emotion label displayed (joy/love/surprise/neutral/fear/anger/sadness) | High | Integration |
| API-002 | Fetch psychologists from API | Verify HIMPSI psychologist API fetch | User logged in | 1. Navigate to find-psychologist page<br>2. Wait for API call<br>3. Check for loading or results | - Loading indicator OR results displayed | High | Integration |
| API-003 | Send message to AI assistant | Verify Gemini AI API integration | User logged in | 1. Navigate to AI assistant<br>2. Fill message input<br>3. Click send button<br>4. Wait for response | - Message count > 1 (user + AI response) | High | Integration |
| API-004 | AI streaming response | Verify AI streaming works | User logged in | 1. Navigate to AI assistant<br>2. Send message<br>3. Check for streaming indicator<br>4. Wait for complete response | - Streaming indicator visible<br>- Complete response displayed | Medium | Integration |
| API-005 | Save journal to Firestore | Verify Firestore save operation | User logged in | 1. Navigate to journal<br>2. Create new entry<br>3. Fill title and content<br>4. Submit form<br>5. Wait for save | - Success message displayed | High | Integration |
| API-006 | Update mood streak in Firestore | Verify Firestore update operation | User logged in | 1. Navigate to dashboard<br>2. Wait for Firestore data<br>3. Check for streak display | - Streak display visible (if exists) | Medium | Integration |
| API-007 | Geocode psychologist locations | Verify geocoding API | User logged in | 1. Navigate to find-psychologist<br>2. Click Map View button<br>3. Wait for map load | - Map OR coming soon message displayed | Low | Integration |
| API-008 | Load TensorFlow.js model | Verify ML model loading | None | 1. Navigate to /onboarding/results<br>2. Wait for model load | - No error message OR fallback to traditional scoring | High | Integration |
| API-009 | API retry on failure | Verify retry mechanism | User logged in | 1. Navigate to AI assistant<br>2. Send message<br>3. Wait 15 seconds<br>4. Check for retry option or response | - Retry button OR response displayed | Medium | Integration |
| API-010 | AI response performance | Verify AI response time | User logged in | 1. Record start time<br>2. Navigate to AI assistant<br>3. Send message<br>4. Wait for response<br>5. Record end time | - Response within 15 seconds | Medium | Performance |
| API-011 | ML model load performance | Verify ML model load time | None | 1. Record start time<br>2. Navigate to /onboarding/results<br>3. Wait for results display<br>4. Record end time | - Results display within 10 seconds | Medium | Performance |

---

## 3. Authentication Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| AUTH-001 | Display login page | Verify login page renders correctly | None | 1. Navigate to /auth/login<br>2. Check for heading<br>3. Check for form fields<br>4. Check for login button | - "Welcome Back" heading visible<br>- Email and password fields visible<br>- Sign In button visible | High | Functional |
| AUTH-002 | Link to register page | Verify register link exists | None | 1. Navigate to /auth/login<br>2. Find register link | - Register/Sign Up/Create Account link visible | High | Functional |
| AUTH-003 | Navigate to register page | Verify navigation to register | None | 1. Navigate to /auth/login<br>2. Click register link<br>3. Wait for navigation | - URL contains /register<br>- Register page displayed | High | Functional |
| AUTH-004 | Display register page | Verify register page renders | None | 1. Navigate to /auth/register<br>2. Check for heading<br>3. Check for form fields | - "Create Account" or "Sign Up" heading visible<br>- Email and password fields visible | High | Functional |
| AUTH-005 | Invalid email validation | Verify email validation | None | 1. Navigate to /auth/login<br>2. Enter invalid email<br>3. Enter password<br>4. Click Sign In | - Validation error or no submission | Medium | Functional |
| AUTH-006 | Forgot password link | Verify forgot password link | None | 1. Navigate to /auth/login<br>2. Find forgot password link | - Forgot Password link visible | Medium | Functional |
| AUTH-007 | Navigate to forgot password | Verify forgot password navigation | None | 1. Navigate to /auth/login<br>2. Click forgot password link<br>3. Wait for navigation | - URL contains /forgot-password | Medium | Functional |
| AUTH-008 | Redirect unauthenticated users | Verify AuthGuard protection | None | 1. Navigate to /dashboard without auth<br>2. Wait for redirect | - Redirected to login OR can access dashboard | High | Security |

---

## 4. Crisis Resources Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| CRS-001 | Display crisis resources page | Verify page renders correctly | None | 1. Navigate to /crisis-resources<br>2. Check for heading<br>3. Check for immediate help text | - "Crisis Resources" heading visible<br>- "immediate help" text visible | Critical | Functional |
| CRS-002 | Emergency banner display | Verify emergency contacts | None | 1. Navigate to /crisis-resources<br>2. Check for emergency banner<br>3. Check for 112 and 119 numbers | - "In Immediate Danger" banner visible<br>- Both emergency numbers visible | Critical | Functional |
| CRS-003 | Region selector display | Verify region selector | None | 1. Navigate to /crisis-resources<br>2. Check for region buttons | - Global, US, UK, Indonesia buttons visible | High | Functional |
| CRS-004 | Switch between regions | Verify region switching | None | 1. Navigate to /crisis-resources<br>2. Click Indonesia button<br>3. Wait for update | - Indonesia-specific resources displayed | High | Functional |
| CRS-005 | Category filters display | Verify category filters | None | 1. Navigate to /crisis-resources<br>2. Check for category buttons | - Emergency Crisis, Suicide Prevention, Text & Chat, Specialized Support buttons visible | High | Functional |
| CRS-006 | Filter by category | Verify category filtering | None | 1. Navigate to /crisis-resources<br>2. Scroll down<br>3. Click Suicide Prevention<br>4. Wait for filter | - Resources filtered by category<br>- h3 headings > 0 | High | Functional |
| CRS-007 | Resource cards display | Verify resource information | None | 1. Navigate to /crisis-resources<br>2. Wait for resources load<br>3. Check for resource headings<br>4. Check for contact info | - Resource headings visible<br>- Phone numbers or contact methods visible | High | Functional |
| CRS-008 | Availability hours display | Verify hours information | None | 1. Navigate to /crisis-resources<br>2. Check for availability text | - 24/7 or specific hours visible | Medium | Functional |
| CRS-009 | Website links display | Verify external links | None | 1. Navigate to /crisis-resources<br>2. Find "Visit Website" links<br>3. Check link attributes | - Links have target="_blank"<br>- Links have rel="noopener noreferrer" | Medium | Functional |
| CRS-010 | Resource type icons | Verify icon display | None | 1. Navigate to /crisis-resources<br>2. Check for SVG or icon elements | - Multiple icons displayed | Low | UI |
| CRS-011 | Coming soon message | Verify empty state | None | 1. Navigate to /crisis-resources<br>2. Check for resources or coming soon message | - Resources OR "Resources Coming Soon" message visible | Medium | Functional |
| CRS-012 | Self-care section | Verify self-care content | None | 1. Navigate to /crisis-resources<br>2. Scroll to self-care section | - "Additional Support" section visible<br>- Self-care or breathing exercises visible | Medium | Functional |
| CRS-013 | 4-7-8 breathing technique | Verify breathing technique | None | 1. Navigate to /crisis-resources<br>2. Find breathing technique | - 4-7-8 technique information visible | Medium | Functional |
| CRS-014 | Grounding technique | Verify grounding technique | None | 1. Navigate to /crisis-resources<br>2. Find grounding technique | - 5-4-3-2-1 or grounding technique visible | Medium | Functional |
| CRS-015 | Important notice display | Verify disclaimer | None | 1. Navigate to /crisis-resources<br>2. Scroll to important section | - "ChillMind is not a crisis intervention" notice visible | High | Functional |
| CRS-016 | Suggest resource button | Verify suggestion feature | None | 1. Navigate to /crisis-resources<br>2. Find suggest button<br>3. Check href attribute | - "Suggest a Resource" button visible<br>- href contains "mailto:" | Low | Functional |
| CRS-017 | Mobile dropdown selector | Verify mobile responsiveness | None | 1. Set mobile viewport (375x667)<br>2. Navigate to /crisis-resources<br>3. Find region dropdown<br>4. Click dropdown | - Dropdown button visible<br>- Dropdown menu opens | High | Responsive |
| CRS-018 | Resource descriptions | Verify description text | None | 1. Navigate to /crisis-resources<br>2. Check for paragraph elements | - Multiple description paragraphs visible | Low | Functional |
| CRS-019 | Sticky region selector | Verify sticky positioning | None | 1. Navigate to /crisis-resources<br>2. Find sticky element<br>3. Check CSS position | - Element has position: sticky | Low | UI |
| CRS-020 | Empty state handling | Verify graceful empty state | None | 1. Navigate to /crisis-resources<br>2. Select region with no resources<br>3. Wait for update | - "Coming Soon" message OR resource headings visible | Medium | Functional |
| CRS-021 | Phone call icons | Verify icon display | None | 1. Navigate to /crisis-resources<br>2. Check for SVG icons | - Multiple SVG icons displayed | Low | UI |
| CRS-022 | Scroll animations | Verify animation on scroll | None | 1. Navigate to /crisis-resources<br>2. Scroll down page<br>3. Wait for animations | - Animated elements visible | Low | UI |

---

## 5. Dashboard - AI Assistant Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| DAI-001 | Display AI assistant interface | Verify page loads correctly | User logged in | 1. Navigate to /dashboard/ai-assistant<br>2. Wait for page load<br>3. Check for chat input or page body | - Chat input OR page body visible | High | Functional |
| DAI-002 | Display suggested topics | Verify suggested topics | User logged in | 1. Navigate to /dashboard/ai-assistant<br>2. Check for suggestion buttons | - Multiple buttons displayed | Medium | Functional |
| DAI-003 | Anxiety category topics | Verify topic buttons | User logged in | 1. Navigate to /dashboard/ai-assistant<br>2. Get all buttons<br>3. Count buttons | - Button count > 0 | Medium | Functional |
| DAI-004 | Wellbeing category topics | Verify page content | User logged in | 1. Navigate to /dashboard/ai-assistant<br>2. Wait for page load<br>3. Check page body | - Page body visible within 5 seconds | Medium | Functional |
| DAI-005 | Support category topics | Verify chat interface | User logged in | 1. Navigate to /dashboard/ai-assistant<br>2. Check for textarea or text input | - Chat interface visible within 5 seconds | Medium | Functional |
| DAI-006 | Send custom message | Verify message sending | User logged in | 1. Navigate to /dashboard/ai-assistant<br>2. Fill chat input<br>3. Click send button<br>4. Wait 2 seconds<br>5. Check for messages | - Message count > 0 | High | Functional |
| DAI-007 | Sidebar navigation | Verify navigation links | User logged in | 1. Navigate to /dashboard/ai-assistant<br>2. Get all links<br>3. Count links | - Link count > 0 | Medium | Functional |
| DAI-008 | Clear chat history | Verify clear functionality | User logged in | 1. Navigate to /dashboard/ai-assistant<br>2. Find clear/new chat button<br>3. Click button<br>4. Check message count | - Message count ≤ 1 (may have welcome message) | Medium | Functional |
| DAI-009 | Mobile responsive | Verify mobile layout | User logged in | 1. Set mobile viewport (375x667)<br>2. Navigate to /dashboard/ai-assistant<br>3. Check for heading<br>4. Check for mobile menu | - Heading visible<br>- Mobile menu clickable if visible | High | Responsive |
| DAI-010 | Empty input validation | Verify input validation | User logged in | 1. Navigate to /dashboard/ai-assistant<br>2. Clear input<br>3. Check send button | - Send button visible | Low | Functional |

---

## 6. Dashboard - Assessments Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| DAS-001 | Display assessments page | Verify page loads correctly | User logged in | 1. Navigate to /dashboard/assessments<br>2. Check for assessment heading | - Assessment heading visible | High | Functional |
| DAS-002 | Toggle timeline/insights views | Verify view switching | User logged in | 1. Navigate to /dashboard/assessments<br>2. Find timeline and insights buttons<br>3. Click timeline button<br>4. Wait 300ms<br>5. Click insights button | - Timeline button visible after click<br>- Insights button visible after click | Medium | Functional |
| DAS-003 | Display trend visualization | Verify trend bars | User logged in | 1. Navigate to /dashboard/assessments<br>2. Find trend bars<br>3. Check first 3 bars | - Trend bars visible | Medium | UI |
| DAS-004 | Display severity scoring | Verify score display | User logged in | 1. Navigate to /dashboard/assessments<br>2. Find "Score:" text<br>3. Check visibility | - Score text visible | High | Functional |
| DAS-005 | Display relative time | Verify time stamps | User logged in | 1. Navigate to /dashboard/assessments<br>2. Check for relative time text | - "X days ago" format visible | Low | Functional |
| DAS-006 | Show assessment types | Verify PHQ-9, GAD-7, PSS | User logged in | 1. Navigate to /dashboard/assessments<br>2. Check for PHQ-9 text<br>3. Check for GAD-7 text<br>4. Check for PSS text | - Assessment type labels visible | High | Functional |
| DAS-007 | Show severity levels | Verify severity labels | User logged in | 1. Navigate to /dashboard/assessments<br>2. Find severity level text | - Minimal/Mild/Moderate/Severe labels visible | High | Functional |
| DAS-008 | Filter by assessment type | Verify filtering | User logged in | 1. Navigate to /dashboard/assessments<br>2. Find filter button<br>3. Click filter<br>4. Select depression<br>5. Wait 500ms | - Only depression/PHQ-9 assessments shown | Medium | Functional |
| DAS-009 | Link to new assessment | Verify navigation | User logged in | 1. Navigate to /dashboard/assessments<br>2. Find new assessment button<br>3. Click button | - Navigates to /onboarding or /assessment | High | Functional |
| DAS-010 | Mobile responsive | Verify mobile layout | User logged in | 1. Set mobile viewport (375x667)<br>2. Navigate to /dashboard/assessments<br>3. Check for assessment heading<br>4. Check view toggle buttons | - Heading visible<br>- Toggle buttons work | High | Responsive |
| DAS-011 | Show assessment details | Verify detail view | User logged in | 1. Navigate to /dashboard/assessments<br>2. Find first assessment card<br>3. Click card<br>4. Check for details | - Detail view visible within 5 seconds | Medium | Functional |

---

## 7. Dashboard - Journal Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| DJR-001 | Search journal entries | Verify search with debounce | User logged in | 1. Navigate to /dashboard/journal<br>2. Find search input<br>3. Fill "happy"<br>4. Wait 400ms<br>5. Check entry count | - Entry count ≥ 0 | High | Functional |
| DJR-002 | Filter by mood types | Verify mood filtering | User logged in | 1. Navigate to /dashboard/journal<br>2. For each mood (joy, love, surprise)<br>3. Click mood filter<br>4. Wait 500ms | - Filtering occurs for each mood | High | Functional |
| DJR-003 | Filter by tags | Verify tag filtering | User logged in | 1. Navigate to /dashboard/journal<br>2. Find tag filter<br>3. Click filter<br>4. Select first tag<br>5. Wait 500ms | - Entries filtered by tag | Medium | Functional |
| DJR-004 | Filter by date range | Verify date filtering | User logged in | 1. Navigate to /dashboard/journal<br>2. Find date filter<br>3. Click filter<br>4. Wait 300ms | - Date filter opens | Medium | Functional |
| DJR-005 | Sort by newest | Verify newest sort | User logged in | 1. Navigate to /dashboard/journal<br>2. Find sort dropdown<br>3. Select "Newest"<br>4. Wait 500ms | - Entries sorted by newest | Medium | Functional |
| DJR-006 | Sort by oldest | Verify oldest sort | User logged in | 1. Navigate to /dashboard/journal<br>2. Find sort dropdown<br>3. Select "Oldest"<br>4. Wait 500ms | - Entries sorted by oldest | Medium | Functional |
| DJR-007 | Switch view modes | Verify card/list/compact views | User logged in | 1. Navigate to /dashboard/journal<br>2. For each mode (card, list, compact)<br>3. Click view button<br>4. Wait 300ms | - View mode changes | Low | Functional |
| DJR-008 | Lazy loading on scroll | Verify infinite scroll | User logged in | 1. Navigate to /dashboard/journal<br>2. Count initial entries<br>3. Scroll to bottom<br>4. Wait 1 second<br>5. Count entries again | - Entries count ≥ initial count | Medium | Performance |
| DJR-009 | Delete confirmation modal | Verify delete confirmation | User logged in | 1. Navigate to /dashboard/journal<br>2. Find delete button<br>3. Click delete<br>4. Check for modal<br>5. Click cancel | - Confirmation modal visible<br>- Modal closes on cancel | High | Functional |
| DJR-010 | Display mood icons | Verify icon display | User logged in | 1. Navigate to /dashboard/journal<br>2. Find mood icons<br>3. Check first 5 icons | - Mood icons visible | Low | UI |
| DJR-011 | Create new journal entry | Verify entry creation | User logged in | 1. Navigate to /dashboard/journal<br>2. Click "New Entry"<br>3. Check for form | - Title input OR content input visible within 5 seconds | High | Functional |
| DJR-012 | Handle empty state | Verify no results state | User logged in | 1. Navigate to /dashboard/journal<br>2. Clear filters<br>3. Search "xyz123nonexistent"<br>4. Wait 400ms | - "No entries found" message visible | Medium | Functional |
| DJR-013 | Mobile responsive | Verify mobile layout | User logged in | 1. Set mobile viewport (375x667)<br>2. Navigate to /dashboard/journal<br>3. Check for journal heading<br>4. Check for filter button | - Heading visible<br>- Filter button clickable if visible | High | Responsive |

---

## 8. Dashboard - Main Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| DMA-001 | Display dashboard components | Verify all components load | User logged in | 1. Navigate to /dashboard<br>2. Check for Dashboard heading<br>3. Check for Mood, Journal, Health, Recommendations, Wellness text | - All components visible | Critical | Functional |
| DMA-002 | Display streak tracking | Verify streak indicator | User logged in | 1. Navigate to /dashboard<br>2. Find streak text<br>3. Count occurrences | - Streak count ≥ 0 (may not exist for new users) | Medium | Functional |
| DMA-003 | Switch mood chart time ranges | Verify time range buttons | User logged in | 1. Navigate to /dashboard<br>2. For each range (Week, Month, Year)<br>3. Click button<br>4. Wait 300ms | - Buttons remain visible after click | High | Functional |
| DMA-004 | Display AI assistant widget | Verify AI widget | User logged in | 1. Navigate to /dashboard<br>2. Find "AI Assistant" or "Chat" text | - AI widget visible within 10 seconds | Medium | Functional |
| DMA-005 | Navigate to journal page | Verify journal navigation | User logged in | 1. Navigate to /dashboard<br>2. Click journal link | - URL contains /dashboard/journal | High | Navigation |
| DMA-006 | Navigate to progress page | Verify progress navigation | User logged in | 1. Navigate to /dashboard<br>2. Find progress link<br>3. Click link | - URL contains /dashboard/progress | High | Navigation |
| DMA-007 | Navigate to AI assistant | Verify AI assistant navigation | User logged in | 1. Navigate to /dashboard<br>2. Find AI assistant link<br>3. Click link | - URL contains /dashboard/ai-assistant | High | Navigation |
| DMA-008 | Display recommendations | Verify recommendations section | User logged in | 1. Navigate to /dashboard<br>2. Find "recommendation" text | - Recommendations visible within 10 seconds | High | Functional |
| DMA-009 | Mobile responsive | Verify mobile layout | User logged in | 1. Set mobile viewport (375x667)<br>2. Navigate to /dashboard<br>3. Check Dashboard heading<br>4. Check for mobile menu | - Heading visible<br>- Mobile menu clickable if visible | High | Responsive |

---

## 9. Dashboard - Progress Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| DPR-001 | Display progress page | Verify page loads correctly | User logged in | 1. Navigate to /dashboard/progress<br>2. Check for "Progress" or "Track Progress" text | - Progress text visible | High | Functional |
| DPR-002 | Display mood chart | Verify mood chart component | User logged in | 1. Navigate to /dashboard/progress<br>2. Find "mood chart" text | - Mood chart text visible within 5 seconds | High | Functional |
| DPR-003 | Time range selector | Verify time range buttons | User logged in | 1. Navigate to /dashboard/progress<br>2. For each range (Week, Month, Year)<br>3. Click button<br>4. Wait 300ms | - Buttons clickable | Medium | Functional |
| DPR-004 | Display mental health status | Verify health status | User logged in | 1. Navigate to /dashboard/progress<br>2. Find "mental health" text | - Mental health text visible within 5 seconds | High | Functional |
| DPR-005 | Display recommendations | Verify recommendations | User logged in | 1. Navigate to /dashboard/progress<br>2. Find "recommendation" text | - Recommendations visible within 5 seconds | Medium | Functional |
| DPR-006 | Gradient background cards | Verify card display | User logged in | 1. Navigate to /dashboard/progress<br>2. Find elements with 'card' or 'bg-' classes<br>3. Count cards | - Card count ≥ 0 | Low | UI |
| DPR-007 | Show improvement trends | Verify trend display | User logged in | 1. Navigate to /dashboard/progress<br>2. Find "improved/declined/stable" text | - Trend text visible if exists | Medium | Functional |
| DPR-008 | Display streak information | Verify streak display | User logged in | 1. Navigate to /dashboard/progress<br>2. Find streak text | - Streak visible if exists | Medium | Functional |
| DPR-009 | Mobile responsive | Verify mobile layout | User logged in | 1. Set mobile viewport (375x667)<br>2. Navigate to /dashboard/progress<br>3. Check "Progress" text<br>4. Check mood chart | - Progress text visible<br>- Mood chart adapts to mobile | High | Responsive |

---

## 10. Dashboard - Resources Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| DRS-001 | Display resources page | Verify page loads correctly | User logged in | 1. Navigate to /dashboard/resources<br>2. Check for resource heading | - Resource heading visible | High | Functional |
| DRS-002 | Display resource count | Verify count display | User logged in | 1. Navigate to /dashboard/resources<br>2. Find "X resources available" text | - Resource count visible within 5 seconds | Medium | Functional |
| DRS-003 | Filter by anxiety | Verify anxiety filter | User logged in | 1. Navigate to /dashboard/resources<br>2. Click Anxiety button<br>3. Wait 500ms<br>4. Check button class | - Button has bg-indigo-600 class | High | Functional |
| DRS-004 | Filter by depression | Verify depression filter | User logged in | 1. Navigate to /dashboard/resources<br>2. Click Depression button<br>3. Wait 500ms<br>4. Check button class | - Button has bg-blue-600 class | High | Functional |
| DRS-005 | Filter by stress | Verify stress filter | User logged in | 1. Navigate to /dashboard/resources<br>2. Click Stress button<br>3. Wait 500ms<br>4. Check button class | - Button has bg-teal-600 class | High | Functional |
| DRS-006 | Reset to all conditions | Verify reset filter | User logged in | 1. Navigate to /dashboard/resources<br>2. Click "All Conditions"<br>3. Wait 500ms | - Filter reset | Medium | Functional |
| DRS-007 | Filter by exercises | Verify resource type filter | User logged in | 1. Navigate to /dashboard/resources<br>2. Click Exercises button<br>3. Wait 500ms<br>4. Count "Start Exercise" text | - Exercise count > 0 | High | Functional |
| DRS-008 | Filter by tools | Verify tools filter | User logged in | 1. Navigate to /dashboard/resources<br>2. Click Tools button<br>3. Wait 500ms<br>4. Count "Open Tool" text | - Tool count > 0 | High | Functional |
| DRS-009 | Filter by resources/articles | Verify articles filter | User logged in | 1. Navigate to /dashboard/resources<br>2. Click Resources button<br>3. Wait 500ms<br>4. Count "View Resource" text | - Resource count > 0 | High | Functional |
| DRS-010 | Search resources | Verify search functionality | User logged in | 1. Navigate to /dashboard/resources<br>2. Fill search with "breathing"<br>3. Wait 500ms<br>4. Count resource cards | - Card count ≥ 0 | High | Functional |
| DRS-011 | Display resource cards | Verify card information | User logged in | 1. Navigate to /dashboard/resources<br>2. Find first resource card<br>3. Check for visibility<br>4. Check for badge | - Card visible<br>- Condition badge visible | High | Functional |
| DRS-012 | Display severity badges | Verify severity levels | User logged in | 1. Navigate to /dashboard/resources<br>2. Find severity badge text<br>3. Count badges | - Badge count > 0 | Medium | Functional |
| DRS-013 | Display resource icons | Verify icon display | User logged in | 1. Navigate to /dashboard/resources<br>2. Find icon elements<br>3. Count icons | - Icon count > 0 | Low | UI |
| DRS-014 | Display duration | Verify duration information | User logged in | 1. Navigate to /dashboard/resources<br>2. Find duration text<br>3. Check first occurrence | - Duration visible if exists | Low | Functional |
| DRS-015 | Display tags | Verify tag display | User logged in | 1. Navigate to /dashboard/resources<br>2. Find #tag text<br>3. Count tags | - Tag count > 0 | Low | Functional |
| DRS-016 | Tag overflow display | Verify "+N more" display | User logged in | 1. Navigate to /dashboard/resources<br>2. Find "+X" text | - "+X more" visible if exists | Low | UI |
| DRS-017 | Empty search state | Verify no results handling | User logged in | 1. Navigate to /dashboard/resources<br>2. Search "xyz123nonexistent"<br>3. Wait 500ms | - "No resources found" visible within 3 seconds | Medium | Functional |
| DRS-018 | Condition-specific colors | Verify color coding | User logged in | 1. Navigate to /dashboard/resources<br>2. Count indigo, blue, teal classes | - Total color classes > 0 | Low | UI |
| DRS-019 | Mobile responsive | Verify mobile layout | User logged in | 1. Set mobile viewport (375x667)<br>2. Navigate to /dashboard/resources<br>3. Check resource heading<br>4. Check filter container | - Heading visible<br>- Filter container has overflow-x-auto | High | Responsive |
| DRS-020 | Combine multiple filters | Verify filter combination | User logged in | 1. Navigate to /dashboard/resources<br>2. Click Anxiety<br>3. Wait 300ms<br>4. Click Exercises<br>5. Wait 500ms<br>6. Count cards | - Card count ≥ 0 (anxiety exercises only) | High | Functional |

---

## 11. Find Psychologist Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| FPS-001 | Display find psychologist page | Verify page loads correctly | User logged in | 1. Navigate to /dashboard/find-psychologist<br>2. Check for "Find a Psychologist" text<br>3. Check for HIMPSI text | - Page title visible<br>- HIMPSI registered text visible | High | Functional |
| FPS-002 | Display search input | Verify search field | User logged in | 1. Navigate to /dashboard/find-psychologist<br>2. Find search input | - Search input visible | High | Functional |
| FPS-003 | Search by location | Verify search functionality | User logged in | 1. Navigate to /dashboard/find-psychologist<br>2. Fill search with "Jakarta"<br>3. Wait 500ms<br>4. Count psychologist cards | - Card count ≥ 0 | High | Functional |
| FPS-004 | Filter by association | Verify association filter | User logged in | 1. Navigate to /dashboard/find-psychologist<br>2. Find association select<br>3. Select option<br>4. Wait 500ms | - Filter applied | Medium | Functional |
| FPS-005 | Filter by price range | Verify price filter | User logged in | 1. Navigate to /dashboard/find-psychologist<br>2. Find price select<br>3. Select option<br>4. Wait 500ms | - Filter applied | Medium | Functional |
| FPS-006 | Filter available only | Verify availability filter | User logged in | 1. Navigate to /dashboard/find-psychologist<br>2. Check available checkbox<br>3. Wait 500ms<br>4. Count "Available" badges | - Badge count > 0 | Medium | Functional |
| FPS-007 | Display psychologist cards | Verify card information | User logged in | 1. Navigate to /dashboard/find-psychologist<br>2. Find first psychologist card<br>3. Check for name<br>4. Check for price | - Dr./M.Psi text visible<br>- Rp price visible | High | Functional |
| FPS-008 | Show pagination | Verify pagination functionality | User logged in | 1. Navigate to /dashboard/find-psychologist<br>2. Find pagination<br>3. Click next button<br>4. Wait 1 second | - Page 2 visible within 5 seconds | Medium | Functional |
| FPS-009 | Display contact options | Verify contact buttons | User logged in | 1. Navigate to /dashboard/find-psychologist<br>2. Find phone button<br>3. Find message button | - Phone OR message button visible | High | Functional |
| FPS-010 | Mobile responsive | Verify mobile layout | User logged in | 1. Set mobile viewport (375x667)<br>2. Navigate to /dashboard/find-psychologist<br>3. Check page title<br>4. Check search input | - Title visible<br>- Search input visible | High | Responsive |

---

## 12. Landing Page Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| LND-001 | Display main heading and CTA | Verify hero section | None | 1. Navigate to /<br>2. Check for main heading<br>3. Check for CTA button | - "Your Mental Wellness Journey Starts Here" visible<br>- "Begin Your Journey" button visible | Critical | Functional |
| LND-002 | Navigate to onboarding | Verify CTA navigation | None | 1. Navigate to /<br>2. Click "Begin Your Journey" CTA<br>3. Wait for navigation | - URL contains /onboarding<br>- Onboarding page heading visible | Critical | Navigation |
| LND-003 | Display feature sections | Verify features section | None | 1. Navigate to /<br>2. Check for "How ChillMind Helps You" heading<br>3. Check for feature headings | - Section heading visible<br>- Smart Assessment, Journaling, Activities, Progress Tracking headings visible | High | Functional |
| LND-004 | Display statistics | Verify statistics section | None | 1. Navigate to /<br>2. Check for statistics | - 75%, 85%, 60% statistics visible | Medium | Functional |
| LND-005 | Display testimonials | Verify testimonial section | None | 1. Navigate to /<br>2. Scroll to testimonials<br>3. Check for heading<br>4. Check for testimonial | - "What Students Say" visible<br>- "Krisna S." visible | Medium | Functional |
| LND-006 | Display FAQ section | Verify FAQ with accordion | None | 1. Navigate to /<br>2. Scroll to FAQ<br>3. Check for heading<br>4. Check for FAQ items | - "Frequently Asked Questions" visible<br>- "Is my data private and secure?" visible | Medium | Functional |
| LND-007 | Mobile responsive | Verify mobile layout | None | 1. Set mobile viewport (375x667)<br>2. Navigate to /<br>3. Check main heading<br>4. Check CTA button | - Heading visible<br>- CTA button visible | High | Responsive |

---

## 13. Onboarding Complete Flow Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| OBC-001 | Complete onboarding process | Verify full onboarding flow | None | 1. Navigate to /onboarding<br>2. Click Begin Assessment<br>3. Fill demographics<br>4. Answer PHQ-9 (9 questions)<br>5. Answer GAD-7 (7 questions)<br>6. Answer PSS (10 questions)<br>7. Wait for ML model<br>8. Click View Results | - Navigates through all steps<br>- Results page displays with ML predictions<br>- Severity labels visible<br>- Confidence scores visible | Critical | End-to-End |
| OBC-002 | Validate PHQ-9 questions | Verify form validation | None | 1. Navigate to /onboarding/phq9<br>2. Try to continue without answering | - Continue button disabled | High | Functional |
| OBC-003 | Validate GAD-7 questions | Verify form validation | None | 1. Navigate to /onboarding/gad7<br>2. Answer 2 questions<br>3. Try to continue | - Continue button disabled | High | Functional |
| OBC-004 | Validate PSS questions | Verify form validation | None | 1. Navigate to /onboarding/pss<br>2. Try to view results without answering all | - View Results button disabled | High | Functional |
| OBC-005 | Display step indicators | Verify progress indicators | None | 1. Navigate to /onboarding/phq9<br>2. Check for step indicators | - Step indicators visible (count > 0) | Medium | UI |
| OBC-006 | Navigate to previous steps | Verify backward navigation | None | 1. Navigate to /onboarding/phq9<br>2. Click Previous button | - Navigates to /onboarding/demographics | Medium | Navigation |
| OBC-007 | Persist answers in localStorage | Verify answer persistence | None | 1. Navigate to /onboarding/phq9<br>2. Answer first question<br>3. Wait 500ms<br>4. Reload page<br>5. Check answer | - Answer still selected after reload | High | Functional |
| OBC-008 | Handle PSS reverse-scored items | Verify PSS implementation | None | 1. Navigate to /onboarding/pss<br>2. Check for "Stress Assessment" text<br>3. Check for positively worded indicator OR questions | - Assessment visible<br>- Questions present | Medium | Functional |
| OBC-009 | Display loading skeleton | Verify loading state | None | 1. Navigate to /onboarding/results<br>2. Check for loading skeleton | - Skeleton OR results heading visible | Low | UI |
| OBC-010 | Show TensorFlow.js loading | Verify ML model loading | None | 1. Navigate to /onboarding/results<br>2. Wait 2 seconds | - Results heading visible within 15 seconds | High | Performance |
| OBC-011 | Fallback to traditional scoring | Verify error handling | None | 1. Navigate to /onboarding/results<br>2. Wait 5 seconds<br>3. Check for results or error | - Results visible OR traditional scoring message | High | Functional |
| OBC-012 | Display personalized insights | Verify insights section | None | 1. Navigate to /onboarding/results<br>2. Wait 3 seconds<br>3. Check for insights heading | - "What These Results Mean" OR "Personalized Insights" visible within 10 seconds | High | Functional |
| OBC-013 | Provide recommendations | Verify recommendations display | None | 1. Navigate to /onboarding/results<br>2. Wait 3 seconds<br>3. Check for recommendation text | - Support/Management/Reduction/Wellbeing text visible within 10 seconds | High | Functional |
| OBC-014 | Display demographics summary | Verify demographics display | None | 1. Navigate to /onboarding/results<br>2. Wait 2 seconds<br>3. Check for "Your Demographics" text | - Demographics section visible within 10 seconds | Medium | Functional |
| OBC-015 | Offer to register | Verify registration prompt | None | 1. Navigate to /onboarding/results<br>2. Wait 2 seconds<br>3. Check for register text or button | - Register text OR button visible | High | Functional |
| OBC-016 | Allow retaking assessment | Verify retake functionality | None | 1. Navigate to /onboarding/results<br>2. Wait 2 seconds<br>3. Find "Retake Assessment" button<br>4. Click button | - Button visible within 10 seconds<br>- Navigates to /onboarding | High | Functional |
| OBC-017 | Mobile responsive onboarding | Verify mobile layout | None | 1. Set mobile viewport (375x667)<br>2. Navigate to /onboarding/phq9<br>3. Check for mobile steps<br>4. Check for swipe hint | - Mobile steps visible<br>- Swipe hint visible | High | Responsive |

---

## 14. Onboarding Basic Tests

| Test ID | Test Case Name | Test Description | Pre-conditions | Test Steps | Expected Result | Priority | Type |
|---------|---------------|------------------|----------------|------------|-----------------|----------|------|
| ONB-001 | Display onboarding intro | Verify introduction page | None | 1. Navigate to /onboarding<br>2. Check for main heading<br>3. Check for assessment info<br>4. Check for Begin button | - "Begin Your Wellness Journey" visible<br>- PHQ-9, GAD-7, PSS assessment text visible<br>- "Begin Assessment" button visible | High | Functional |
| ONB-002 | Navigate to demographics | Verify navigation | None | 1. Navigate to /onboarding<br>2. Click "Begin Assessment"<br>3. Wait for navigation | - URL contains /demographics<br>- "Tell Us About Yourself" heading visible | High | Navigation |
| ONB-003 | Show step progress | Verify step indicators | None | 1. Navigate to /onboarding<br>2. Check for step indicators | - Desktop indicator OR mobile indicator visible | Medium | UI |
| ONB-004 | Allow going back to home | Verify back navigation | None | 1. Navigate to /onboarding<br>2. Click "Go Back"<br>3. Wait for navigation | - URL is / (home page) | Medium | Navigation |
| ONB-005 | Display demographics form | Verify form fields | None | 1. Navigate to /onboarding/demographics<br>2. Check for Age Group text<br>3. Check for Gender text<br>4. Check for Academic Year text<br>5. Check for GPA text<br>6. Check for scholarship text | - All form field labels visible | High | Functional |
| ONB-006 | Show validation on empty form | Verify validation | None | 1. Navigate to /onboarding/demographics<br>2. Click Continue without filling<br>3. Wait 500ms | - Still on demographics page<br>- "This field is required" visible | High | Functional |
| ONB-007 | Allow filling demographics | Verify form interaction | None | 1. Navigate to /onboarding/demographics<br>2. Click age label<br>3. Click gender label<br>4. Click academic year label<br>5. Click GPA label<br>6. Click scholarship label<br>7. Check Continue button | - All selections checked<br>- Continue button enabled | High | Functional |

---

## Test Execution Summary

### Test Priority Distribution
- **Critical**: 3 tests
- **High**: 157 tests
- **Medium**: 98 tests  
- **Low**: 27 tests

### Test Type Distribution
- **Functional**: 162 tests
- **Integration**: 11 tests
- **Navigation**: 7 tests
- **UI**: 10 tests
- **Responsive**: 10 tests
- **Performance**: 3 tests
- **Security**: 1 test
- **End-to-End**: 1 test

### Test Coverage by Module
1. **Accessibility**: 7 tests
2. **API Integration**: 11 tests
3. **Authentication**: 8 tests
4. **Crisis Resources**: 22 tests
5. **Dashboard - AI Assistant**: 10 tests
6. **Dashboard - Assessments**: 11 tests
7. **Dashboard - Journal**: 13 tests
8. **Dashboard - Main**: 9 tests
9. **Dashboard - Progress**: 9 tests
10. **Dashboard - Resources**: 20 tests
11. **Find Psychologist**: 10 tests
12. **Landing Page**: 7 tests
13. **Onboarding Complete**: 17 tests
14. **Onboarding Basic**: 7 tests

---

## Test Environment Setup

### Prerequisites
1. Node.js v18+ installed
2. Playwright installed (`npm install @playwright/test`)
3. Firebase project configured
4. Test user account created (test@gmail.com / test123)
5. Local development server running on http://localhost:3000

### Authentication Setup
- Test user credentials stored in `tests/helpers/auth.ts`
- Login performed before each authenticated test
- Firebase uses IndexedDB for token storage
- Tests use `loginUser()` helper function for authentication

### Browser Configuration
- Chromium (Desktop)
- Firefox (Desktop)
- WebKit/Safari (Desktop)
- Mobile Chrome (375x667 viewport)
- Mobile Safari (375x667 viewport)

---

## Test Execution Commands

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/landing-page.spec.ts

# Run tests in headed mode
npx playwright test --headed

# Run tests with UI mode
npx playwright test --ui

# Run tests for specific browser
npx playwright test --project=chromium

# Generate HTML report
npx playwright show-report

# Run tests in debug mode
npx playwright test --debug
```

---

## Notes

1. **Authentication Requirement**: All dashboard tests require user authentication via `loginUser()` helper
2. **ML Model Loading**: Onboarding results tests may take up to 10 seconds for TensorFlow.js model to load
3. **Network Dependency**: API integration tests require active internet connection
4. **Firebase Dependency**: Tests require Firebase services to be running
5. **Data Persistence**: Some tests rely on localStorage and IndexedDB
6. **Timing Considerations**: Tests include appropriate wait times for React hydration and API calls

---

## Defect Severity Levels

- **Critical**: Application crash, data loss, security vulnerability
- **High**: Major functionality broken, workaround not available
- **Medium**: Functionality impaired, workaround available
- **Low**: Minor issue, cosmetic, minimal impact

---