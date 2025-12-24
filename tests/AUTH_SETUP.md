# Playwright Authentication Setup

## Overview
This project uses Playwright's authentication setup to handle login once and reuse the authenticated state across all tests.

## How It Works

1. **Setup Project** (`tests/auth.setup.ts`):
   - Runs before all other tests
   - Logs in with test credentials
   - Saves authentication state to `playwright/.auth/user.json`

2. **Test Projects**:
   - All browser projects depend on the setup project
   - Load the saved authentication state
   - Tests run as authenticated user

## Configuration Steps

### 1. Create Test Account First

**IMPORTANT**: Before running tests, you MUST create a test account:

1. Start your dev server: `npm run dev`
2. Open http://localhost:3000/auth/register
3. Create account with:
   - Email: `test@chillmind.app` (or your choice)
   - Password: `Test@1234` (or your choice)
4. **Complete the onboarding flow** (Demographics, PHQ-9, GAD-7, PSS, Results)
5. Verify you can access the dashboard

### 2. Update Test Credentials

Edit `tests/auth.setup.ts` line 13-14 with your test account:

```typescript
await page.getByLabel(/Email/i).fill("test@chillmind.app");
await page.getByLabel(/Password/i).fill("Test@1234");
```

**Current credentials in auth.setup.ts:**
- Email: `test@gmail.com`
- Password: `test123`
- **⚠️ These are placeholder values - CHANGE THEM!**

### 3. Environment Variables (Optional)

For CI/CD, store credentials as environment variables:

```bash
# .env.test (do NOT commit)
TEST_USER_EMAIL=test@chillmind.app
TEST_USER_PASSWORD=your_secure_password
```

Then update `auth.setup.ts`:
```typescript
await page.getByLabel(/Email/i).fill(process.env.TEST_USER_EMAIL || "test@example.com");
await page.getByLabel(/Password/i).fill(process.env.TEST_USER_PASSWORD || "password");
```

## Running Tests

### Run All Tests (with authentication)
```bash
npm test
```

### Run Only Setup
```bash
npx playwright test --project=setup
```

### Run Specific Test File
```bash
npx playwright test tests/dashboard-main.spec.ts
```

### Debug Authentication
```bash
npx playwright test tests/auth.setup.ts --debug
```

## Test Categories

### Authenticated Tests
These tests require login and use the saved auth state:
- `dashboard-main.spec.ts`
- `dashboard-journal.spec.ts`
- `dashboard-ai-assistant.spec.ts`
- `dashboard-assessments.spec.ts`
- `dashboard-progress.spec.ts`
- `dashboard-resources.spec.ts`
- `find-psychologist.spec.ts`
- `api-integration.spec.ts`

### Unauthenticated Tests
These tests don't need login:
- `auth.spec.ts` - Login/Register pages
- `landing-page.spec.ts` - Public landing page
- `onboarding.spec.ts` - Guest onboarding
- `onboarding-complete.spec.ts` - Guest onboarding flow
- `crisis-resources.spec.ts` - Public crisis resources
- `accessibility.spec.ts` - Accessibility checks

## Troubleshooting

### Authentication Fails
1. Check test credentials are correct
2. Ensure Firebase is running
3. Check network connectivity
4. Verify test user exists and is active

### Tests Still Fail After Authentication
1. Clear auth state: `rm -rf playwright/.auth`
2. Run setup again: `npx playwright test --project=setup`
3. Check localStorage persistence in your app

### Timeout During Login
- Increase timeout in `auth.setup.ts`:
  ```typescript
  await page.waitForURL("**/dashboard", { timeout: 30000 });
  ```

### CI/CD Issues
- Store test credentials as GitHub Secrets
- Run `npm test` in CI workflow
- Ensure Firebase emulator or real Firebase is accessible

## Best Practices

1. **Separate Test Data**: Use a dedicated test account, not real user data
2. **Secure Credentials**: Never commit passwords, use environment variables
3. **Stable State**: Ensure test account has consistent data (completed onboarding, etc.)
4. **Cleanup**: Consider adding teardown to reset test data after runs
5. **Isolation**: Each test should be independent and not rely on previous test state

## File Structure

```
playwright/
  .auth/
    user.json          # Saved authentication state (gitignored)
tests/
  auth.setup.ts        # Authentication setup script
  *.spec.ts            # Test files (use auth state automatically)
playwright.config.ts   # Playwright configuration with setup project
```

## Additional Resources

- [Playwright Authentication Guide](https://playwright.dev/docs/auth)
- [Firebase Test Setup](https://firebase.google.com/docs/emulator-suite)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
