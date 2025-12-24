# Jest Unit Testing Documentation for ChillMind WebApp

## Overview
This document provides comprehensive documentation for the whitebox testing implementation using Jest for the ChillMind mental health web application.

## Test Coverage Summary

### 1. **Component Tests**
Located in: `src/components/*/tests__/`

#### Button Component (`src/components/ui/__tests__/Button.test.tsx`)
- **Total Tests**: 28
- **Status**: ✅ All tests passing
- **Coverage Areas**:
  - Rendering Tests (3 tests)
  - Variant Styling Tests (4 tests)
  - Size Styling Tests (3 tests)
  - Loading State Tests (4 tests)
  - Disabled State Tests (3 tests)
  - Icon Tests (2 tests)
  - Click Handler Tests (2 tests)
  - Custom Props Tests (3 tests)
  - Edge Cases (4 tests)

**Key Test Cases**:
- Renders button with default props and primary variant
- Tests all button variants with proper styling (primary, secondary, outline, accent)
- Tests all button sizes (sm, md, lg) with correct CSS classes
- Validates loading state displays spinner and disables button
- Ensures disabled state prevents onClick execution
- Tests icon rendering and spacing (mr-2)
- Tests onClick handler invocation and event passing
- Tests custom className merging and prop spreading
- Edge cases: loading with icon, disabled styling, button state

#### MoodTracker Component (`src/components/dashboard/__tests__/MoodTracker.test.tsx`)
- **Total Tests**: 28+
- **Status**: ✅ All tests passing
- **Coverage Areas**:
  - Initial Rendering Tests (4 tests)
  - Mood Selection State Tests (6 tests - one for each mood: Angry, Sad, Neutral, Happy, Excited, plus initial state)
  - Mood State Management Tests (2 tests)
  - Mood Styling Tests (5 tests - color schemes for each mood)
  - Grid Layout Tests (2 tests)
  - Complete Check-in Button Tests (2 tests)
  - Accessibility Tests (3 tests)
  - Component Structure Tests (4 tests)

**Key Test Cases**:
- Renders "Daily Check-in" heading and "How are you feeling?" question
- Renders all 5 mood options (Angry, Sad, Neutral, Happy, Excited)
- Tests individual mood selection (each mood clickable and highlighted)
- Validates only one mood selected at a time (deselects previous)
- Tests mood toggle sequence (multiple selection changes)
- Verifies color schemes: angry (red), sad (yellow), neutral (gray), happy (green), excited (purple)
- Tests grid layout with 5 columns (grid-cols-5)
- Validates "Complete Check-in" button rendering and styling
- Tests button roles and accessibility features

### 2. **Utility Function Tests**
Located in: `src/lib/__tests__/`

#### journalStorage Utilities (`src/lib/__tests__/journalStorage.test.ts`)
- **Total Tests**: 62
- **Status**: ✅ All tests passing
- **Coverage Areas**:
  - emotionToMood Function Tests (8 tests)
  - emotionToValue Function Tests (10 tests)
  - fallbackPredictEmotion Function Tests (44 tests):
    - Joy Detection (3+ tests)
    - Love Detection (3+ tests)
    - Surprise Detection (3+ tests)
    - Fear Detection (3+ tests)
    - Anger Detection (3+ tests)
    - Sadness Detection (3+ tests)
    - Neutral Detection (3+ tests)
    - Edge Cases: empty strings, special characters, unicode, newlines, mixed emotions
    - Case-insensitive matching
    - Whole-word boundary validation

**Key Test Cases**:
- Maps all emotions correctly: joy→joy, love→love, anger→anger, sadness→sadness, fear→fear, surprise→surprise, neutral→neutral
- Tests emotion values: joy=6, love=5, surprise=4, neutral=3.5, fear=3, anger=2, sadness=1
- Tests fallback prediction with keyword matching ("happy", "excited", "wonderful" → joy)
- Validates case-insensitive detection ("JOY", "Love", "ANGER")
- Tests edge cases: empty strings, special characters, unicode, very long text
- Tests whole-word boundary matching ("anger" vs "danger")
- Tests handling of multiple emotion keywords in same text
- Default to neutral for unknown emotions or empty input

#### Auth Utilities (`src/lib/__tests__/auth.test.ts`)
- **Total Tests**: 35+
- **Status**: ✅ All tests passing (console.log warnings expected for auth error testing)
- **Coverage Areas**:
  - authenticateRequest Function Tests (10 tests)
    - Firebase Admin initialization checks
    - Authorization header validation
    - Bearer token format validation
    - Token extraction and verification
    - Error handling for invalid/expired tokens
  - createAuthErrorResponse Function Tests (8 tests)
    - Error response creation with custom messages
    - Response format validation
    - Content-type headers
    - Special character handling
  - validateUserAccess Function Tests (10+ tests)
    - User ownership validation
    - UID matching tests
    - Null/undefined handling
  - Integration Tests (3+ tests)
  - Edge Cases and Error Handling (4+ tests)

**Key Test Cases**:
- Tests JWT token extraction from "Authorization: Bearer <token>" header
- Validates Bearer token format (must start with "Bearer ")
- Tests token verification using Firebase Admin verifyIdToken()
- Tests error handling: no header, empty header, invalid format, expired token
- Tests Firebase Admin not initialized scenario (returns null)
- Tests creation of 401 error responses with custom messages
- Validates response content-type is application/json
- Tests user access validation (UID matching)
- Tests null/undefined handling (null===null returns true, null==="user" returns false)
- Integration tests for complete authentication flow

#### emotionInsights Utilities (`src/lib/__tests__/emotionInsights.test.ts`)
- **Total Tests**: 30+
- **Status**: ✅ All tests passing
- **Coverage Areas**:
  - getEmotionInsight Structure Tests (5 tests)
    - Return type validation (EmotionInsight object)
    - Property existence (title, description, copingStrategy, reflectionPrompt)
    - Non-empty content validation
  - Emotion-Specific Insights Tests (7 tests)
    - Joy, Love, Sadness, Anger, Fear, Surprise, Neutral insights
  - Insight Level Progression Tests (4 tests)
    - Basic level (count ≤ 5): "Understanding" prefix
    - Intermediate level (5 < count ≤ 10): deeper exploration
    - Advanced level (count > 10): includes factoids
  - Firestore Integration Tests (4+ tests)
    - Query emotion counts
    - Increment counts after insights
    - Create new documents for new users
    - Error handling
  - Content Quality Tests (5+ tests)
    - Actionable coping strategies
    - Thought-provoking reflection prompts
    - Consistency across calls
  - Edge Cases (5+ tests)

**Key Test Cases**:
- Validates EmotionInsight object structure (title, description, copingStrategy, reflectionPrompt)
- Tests emotion-specific content for all 7 emotions (joy, love, sadness, anger, fear, surprise, neutral)
- Tests progression: basic ("Understanding [emotion]") → intermediate → advanced (with factoids)
- Tests Firestore integration: queries `emotionCounts` collection, increments counts
- Creates new Firestore document if user has no emotion counts yet
- Tests advanced insights include scientific factoids
- Validates coping strategies are actionable and specific
- Tests reflection prompts are thought-provoking
- Tests error handling when Firestore operations fail
- Validates consistency (same emotion returns similar insight structure)

### 3. **API Route Tests**
Located in: `src/app/api/*/__tests__/`

#### Journals API (`src/app/api/journals/__tests__/route.test.ts`)
- **Total Tests**: 35+
- **Status**: ✅ All tests passing
- **Coverage Areas**:
  - GET /api/journals:
    - Authentication Tests (3 tests): 401 when unauthenticated, calls authenticateRequest
    - Query Parameters Tests (6 tests): default limit 50, custom limit, invalid/negative/zero limits
    - Data Retrieval Tests (6 tests): empty array, existing entries, Firestore transformation
    - Response Format Tests (5 tests): JSON response, success flag, data array, count, status 200
    - Error Handling Tests (4+ tests): 500 status when Firestore fails
  - POST /api/journals:
    - Authentication Tests (2 tests): 401 when unauthenticated
    - Request Validation Tests (6+ tests): required fields (content, mood), empty content returns 400
    - Response Format Tests (3+ tests): 201 status, JSON response, success flag
  - Edge Cases: Concurrent requests, multi-user scenarios (2+ tests)

**Key Test Cases**:
- Tests GET requires authentication (returns 401 if not authenticated)
- Tests query parameter: default limit=50, accepts custom limit, handles invalid values
- Tests Firestore data retrieval and transformation to JournalEntry format
- Validates response format: `{ success: true, data: [], count: 0 }`
- Tests POST validation: requires `content` (string) and `mood` (string), tags optional
- Tests empty content returns 400 with error message
- Tests successful POST returns 201 status
- Tests error handling: Firestore failures return 500 status
- Tests concurrent GET requests (Promise.all)
- Tests multi-user scenarios (different UIDs)

## Test Configuration

### Jest Configuration (`jest.config.js`)
```javascript
- Test environment: jsdom (for React components)
- Module name mapper: @/ → src/
- Setup files: jest.setup.js
- Coverage thresholds: 50% for all metrics
- Excludes: Playwright tests in /tests/ directory
```

### Setup File (`jest.setup.js`)
- Imports @testing-library/jest-dom matchers
- Mocks Next.js router (useRouter, usePathname, useSearchParams)
- Mocks Firebase modules
- Mocks window.matchMedia for responsive tests
- Suppresses console errors in tests

## Running Tests

### Commands
```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:unit:watch

# Run tests with coverage report
npm run test:unit:coverage

# Run all tests (unit + e2e)
npm run test:all

# Run specific test file
npx jest src/lib/__tests__/auth.test.ts

# Run tests matching pattern
npx jest --testNamePattern="should authenticate"
```

## Test Statistics

### Total Test Suite
- **Total Test Files**: 6
- **Total Test Cases**: 230
- **Test Status**: ✅ **All tests passing (100% success rate)**
- **Test Execution Time**: ~2 seconds
- **Components Tested**: 2 (Button, MoodTracker)
- **Utility Modules Tested**: 3 (journalStorage, auth, emotionInsights)
- **API Routes Tested**: 1 (journals)

### Test Results Summary
```
Test Suites: 6 passed, 6 total
Tests:       230 passed, 230 total
Snapshots:   0 total
Time:        2.043 s
```

### Code Coverage Goals
- **Branches**: 50%
- **Functions**: 50%
- **Lines**: 50%
- **Statements**: 50%

## Whitebox Testing Approach

### What is Whitebox Testing?
Whitebox testing (also called glass-box or structural testing) is a testing method where the internal structure, design, and code of the application are known to the tester. Tests are designed based on:
- Internal logic paths
- Code structure
- Conditional statements
- Loops and branches
- Function implementations

### Our Whitebox Testing Strategy

#### 1. **Internal Logic Testing**
- Testing all conditional branches in functions
- Testing loop iterations and edge cases
- Testing error handling paths
- Example: `fallbackPredictEmotion` tests all emotion detection branches

#### 2. **State Management Testing**
- Testing component state transitions
- Testing state updates and side effects
- Example: MoodTracker tests selection state changes

#### 3. **Data Flow Testing**
- Testing data transformations
- Testing function parameter variations
- Example: `emotionToValue` tests all emotion mappings

#### 4. **Integration Points Testing**
- Testing interactions between functions
- Testing API contract adherence
- Example: Auth tests verify full authentication flow

#### 5. **Boundary Value Testing**
- Testing minimum/maximum values
- Testing empty/null/undefined inputs
- Example: Testing empty strings, very long text, special characters

#### 6. **Error Path Testing**
- Testing error conditions
- Testing exception handling
- Example: API tests verify 401/500 error responses

## Best Practices Applied

1. **Descriptive Test Names**: Each test clearly describes what it's testing
2. **Arrange-Act-Assert Pattern**: Tests follow AAA structure
3. **Isolation**: Each test is independent and doesn't rely on others
4. **Mocking**: External dependencies are mocked (Firebase, APIs)
5. **Coverage**: Tests cover happy paths, edge cases, and error scenarios
6. **Maintainability**: Tests are organized by feature/component
7. **Documentation**: Tests serve as living documentation of behavior

## Future Enhancements

1. Add snapshot testing for component rendering
2. Increase coverage to 80%+
3. Add performance testing for critical paths
4. Add mutation testing to verify test quality
5. Add visual regression testing
6. Integrate with CI/CD pipeline
7. Add test reports generation

## Maintenance Guidelines

1. **Update tests when code changes**: Keep tests in sync with implementation
2. **Add tests for new features**: Maintain test coverage
3. **Refactor tests**: Keep tests clean and maintainable
4. **Review test failures**: Investigate and fix failing tests promptly
5. **Monitor coverage**: Ensure coverage doesn't decrease

## Conclusion

This comprehensive test suite provides strong confidence in the ChillMind application's core functionality. The whitebox testing approach ensures that internal logic is thoroughly validated, edge cases are handled, and the code behaves correctly under various conditions.

### Current Test Health
- ✅ **All 230 tests passing** (100% success rate)
- ✅ **All 6 test suites passing**
- ✅ **Zero test failures**
- ✅ **Average execution time: 2 seconds**
- ✅ **Key modules achieving 91-100% code coverage**

---

**Last Updated**: December 24, 2025
**Last Test Run**: December 24, 2025 - All tests passing ✅
**Test Framework**: Jest 30.1.3
**Testing Library**: @testing-library/react
**Total Tests**: 230
**Test Status**: All tests passing
**Coverage Status**: Core modules well-covered (Button: 100%, MoodTracker: 100%, auth: 100%, journals API: 91.11%)
