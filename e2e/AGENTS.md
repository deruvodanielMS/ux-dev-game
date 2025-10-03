# E2E Testing Guide for Agents

Agent-focused guide for E2E testing with Playwright in the UX Dev Game project.

## 1. Testing Philosophy

**Goal**: Ensure critical user journeys work end-to-end across browsers before code reaches production.

**Strategy**:

- **Pre-push automation**: E2E tests run automatically before push via Husky hooks
- **Stable selectors**: Use `data-testid` attributes instead of brittle text/class selectors
- **Page Object Model**: Encapsulate page interactions for maintainability
- **Cross-browser coverage**: Test on Chromium, Firefox, and WebKit
- **Conditional execution**: Skip auth-dependent tests when Auth0 not configured

## 2. Project Structure

```
e2e/
├── AGENTS.md              # This guide
├── pages/                 # Page Object Model classes
│   ├── WelcomePage.ts     # Landing page interactions
│   ├── HeaderPage.ts      # Navigation and auth buttons
│   └── DashboardPage.ts   # Main app functionality (auth required)
├── login.spec.ts          # Authentication flow tests
└── dashboard-players.spec.ts  # Player management tests (auth dependent)
```

## 3. Page Object Model Pattern

### 3.1 Structure

Each page class encapsulates:

- **Selectors**: `data-testid` based locators
- **Actions**: User interactions (click, fill, navigate)
- **Assertions**: Expected states and content
- **Error handling**: Graceful failures with descriptive messages

### 3.2 Example Pattern

```typescript
export class WelcomePage {
  constructor(private page: Page) {}

  // Selectors (private, descriptive names)
  private getLoginButton = () => this.page.getByTestId('login-button');

  // Actions (public methods)
  async clickLogin(): Promise<void> {
    await this.getLoginButton().click();
  }

  // Assertions (public methods)
  async expectVisible(): Promise<void> {
    await expect(this.getLoginButton()).toBeVisible();
  }
}
```

### 3.3 Naming Conventions

- **Classes**: `PascalCase` + `Page` suffix (e.g., `WelcomePage`)
- **Files**: Match class name (e.g., `WelcomePage.ts`)
- **Methods**: `camelCase` with clear intent (`clickLogin`, `expectVisible`)
- **Selectors**: Private getter methods (`getLoginButton`)

## 4. Selector Strategy

### 4.1 Priority Order

1. **`data-testid`** (preferred): Stable, semantic, test-specific
2. **Accessible attributes** (fallback): `role`, `aria-label`
3. **Text content** (last resort): Only for unique, stable text

### 4.2 data-testid Conventions

- **Format**: `kebab-case` descriptive names
- **Uniqueness**: Each ID should be unique within the page
- **Semantic**: Describe the element's purpose, not appearance
- **Examples**: `login-button`, `user-avatar`, `player-card`, `game-board`

### 4.3 Component Integration

Components must forward `data-testid` through props:

```typescript
// Button component example
export const Button = ({ children, ...rest }: ButtonProps) => (
  <button {...rest}>{children}</button>
);
```

## 5. Authentication Testing

### 5.1 Current State

- **Login flow**: ✅ 5/6 tests passing (1 skipped for Auth0 config)
- **Dashboard features**: ⚠️ Skip when auth fails (not breaking CI)
- **Fallback strategy**: localStorage + conditional test execution

### 5.2 Test Categories

1. **Public flows** (no auth required): Welcome page, login initiation
2. **Auth-dependent flows** (conditional): Dashboard, player management, game features

### 5.3 Error Handling Pattern

```typescript
test('dashboard feature', async ({ page }) => {
  // Attempt authentication
  const success = await attemptLogin(page);

  if (!success) {
    test.skip('Skipping: Auth0 not configured or login failed');
  }

  // Continue with authenticated test
});
```

## 6. Test Configuration

### 6.1 Environment Setup

- **Dev server**: Auto-started by pre-push hook on `localhost:5173`
- **Base URL**: Configured in `playwright.config.ts`
- **Timeout**: 30s for server startup, standard timeouts for tests
- **Retries**: 2 retries on CI, 0 locally for faster feedback

### 6.2 Browsers

- **Chromium**: Primary development target
- **Firefox**: Cross-browser compatibility
- **WebKit**: Safari compatibility (especially for mobile users)

### 6.3 Reporters

- **Local development**: HTML reporter with trace viewer
- **CI/Pre-push**: List reporter for clean terminal output
- **On failure**: Screenshots, videos, traces automatically captured

## 7. Writing New Tests

### 7.1 Agent Checklist

1. **Identify user journey**: What critical path are you testing?
2. **Check existing pages**: Can you reuse existing Page Objects?
3. **Add data-testids**: Ensure components have stable selectors
4. **Create/extend Page Object**: Follow established patterns
5. **Handle authentication**: Skip gracefully if auth required but not available
6. **Test across browsers**: Ensure cross-browser compatibility
7. **Update documentation**: Add to this guide if introducing new patterns

### 7.2 Test Structure Template

```typescript
import { test, expect } from '@playwright/test';
import { WelcomePage } from './pages/WelcomePage';

test.describe('Feature Name', () => {
  test('should do something important', async ({ page }) => {
    // Arrange
    const welcomePage = new WelcomePage(page);
    await page.goto('/');

    // Act
    await welcomePage.clickLogin();

    // Assert
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

## 8. Common Patterns

### 8.1 Navigation

```typescript
// Always use page objects for navigation
await page.goto('/');
const welcomePage = new WelcomePage(page);
await welcomePage.clickLogin();
```

### 8.2 Waiting for Elements

```typescript
// Use Playwright's auto-waiting
await page.getByTestId('dynamic-content').waitFor();
await expect(page.getByTestId('loading')).not.toBeVisible();
```

### 8.3 Form Interactions

```typescript
// Fill forms through page objects
await loginPage.fillEmail('test@example.com');
await loginPage.fillPassword('password');
await loginPage.submitForm();
```

## 9. Debugging

### 9.1 Local Debugging

```bash
npm run test:e2e:debug    # Opens Playwright Inspector
npm run test:e2e:ui       # Visual test runner
```

### 9.2 CI Debugging

- Check screenshots in test results
- Review trace files for step-by-step reproduction
- Use `console.log` in tests for debugging output

### 9.3 Common Issues

- **Element not found**: Check if `data-testid` exists in DOM
- **Timing issues**: Use `waitFor()` or `expect().toBeVisible()`
- **Auth failures**: Verify environment variables and Auth0 configuration

## 10. Git Integration

### 10.1 Pre-push Hook

- **Location**: `.husky/pre-push`
- **Process**: Start dev server → Run E2E tests → Cleanup → Block push if tests fail
- **Timeout**: 30s for server startup
- **Cross-platform**: Works on Windows, macOS, Linux

### 10.2 CI Considerations

- **Headless mode**: Automatic in CI environments
- **Parallel execution**: Disabled on CI for stability
- **Retries**: 2 attempts for flaky tests
- **Artifacts**: Screenshots and videos saved on failure

## 11. Maintenance

### 11.1 When to Update Tests

- **UI changes**: Update selectors if components change
- **New features**: Add test coverage for critical paths
- **Breaking changes**: Update Page Objects before components
- **Flaky tests**: Investigate and fix timing issues

### 11.2 Performance Considerations

- **Selective testing**: Don't test every edge case in E2E
- **Fast feedback**: Unit tests for logic, E2E for user journeys
- **Parallel execution**: Local development can run tests in parallel

## 12. Future Enhancements

### 12.1 Potential Improvements

- **Visual regression testing**: Screenshot comparisons
- **API mocking**: Controlled test data
- **Database seeding**: Consistent test state
- **Mobile testing**: Touch interactions and responsive layouts

### 12.2 Integration Opportunities

- **Storybook**: Component testing integration
- **Accessibility**: Automated a11y testing in E2E flows
- **Performance**: Lighthouse integration for performance metrics

## 13. Playwright MCP Integration

### 13.1 What is Playwright MCP?

Playwright MCP (Model Context Protocol) allows LLMs to directly control Playwright for:

- **Live browser automation**: Control real browsers during conversations
- **Interactive debugging**: Test selectors and interactions in real-time
- **Dynamic test creation**: Generate and execute tests on-the-fly
- **Visual feedback**: See exactly what's happening in the browser

### 13.2 Starting MCP Server

```bash
# Start MCP server (blocks terminal - use separate window)
npm run mcp:start

# Server runs on: http://localhost:3000
# Default host: 0.0.0.0 (accessible from network)
```

### 13.3 MCP Capabilities for Agents

When MCP server is running, agents can:

#### Browser Control

```typescript
// Navigate to pages
await page.goto('http://localhost:5173');

// Interact with elements
await page.getByTestId('login-button').click();
await page.fill('[data-testid="email-input"]', 'test@example.com');

// Take screenshots
await page.screenshot({ path: 'current-state.png' });
```

#### Selector Validation

```typescript
// Test if selectors work
const loginButton = page.getByTestId('login-button');
await loginButton.isVisible(); // true/false

// Get element text content
const buttonText = await loginButton.textContent();
console.log(buttonText); // "Login"
```

#### Live Test Development

```typescript
// Create and run tests immediately
test('live test creation', async ({ page }) => {
  await page.goto('/');

  // Agent can see if this works in real-time
  await page.getByTestId('new-selector').click();

  // Instant feedback on success/failure
  await expect(page).toHaveURL('/dashboard');
});
```

### 13.4 MCP Workflow for Agents

#### 1. Development Phase

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start MCP server
npm run mcp:start

# Terminal 3: Available for other commands
```

#### 2. Interactive Testing

- **Agent**: Controls browser through MCP
- **Visual feedback**: See interactions in real browser window
- **Immediate validation**: Test selectors work before writing full tests
- **Screenshot capture**: Document current state for debugging

#### 3. Test Generation

- **Live experimentation**: Try different selectors/interactions
- **Instant feedback**: Know immediately if approach works
- **Refined output**: Generate working tests based on successful interactions

### 13.5 MCP Best Practices for Agents

#### Setup Validation

```typescript
// Always verify page loaded correctly
await page.waitForLoadState('networkidle');
await expect(page).toHaveTitle(/UX Dev Game/);
```

#### Selector Testing

```typescript
// Test selectors before using in tests
const element = page.getByTestId('target-element');
const isVisible = await element.isVisible();
const text = await element.textContent();

if (!isVisible) {
  // Try alternative selectors
  const fallback = page.getByRole('button', { name: /login/i });
}
```

#### State Verification

```typescript
// Verify application state at each step
await page.screenshot({ path: 'step-1-initial.png' });

await page.getByTestId('login-button').click();

await page.screenshot({ path: 'step-2-after-click.png' });
```

### 13.6 MCP Debugging Workflow

#### Issue Investigation

1. **Start MCP server**: `npm run mcp:start`
2. **Navigate to problem area**: Use MCP to go to failing page
3. **Inspect elements**: Check if selectors exist in DOM
4. **Try interactions**: Test different approaches live
5. **Capture evidence**: Screenshots of working/failing states
6. **Generate solution**: Create working test based on findings

#### Element Discovery

```typescript
// When data-testid is missing, explore alternatives
const element = await page.locator('button:has-text("Login")').first();
const elementInfo = {
  tagName: await element.evaluate((el) => el.tagName),
  className: await element.getAttribute('class'),
  textContent: await element.textContent(),
  id: await element.getAttribute('id'),
};

console.log('Element info:', elementInfo);
```

### 13.7 MCP Integration with Page Objects

#### Live Page Object Development

```typescript
// Test Page Object methods in real-time
class WelcomePage {
  constructor(private page: Page) {}

  async clickLogin() {
    // Test this interaction through MCP first
    await this.page.getByTestId('login-button').click();
  }

  async expectVisible() {
    // Verify this assertion works
    await expect(this.page.getByTestId('login-button')).toBeVisible();
  }
}

// MCP can instantiate and test immediately
const welcomePage = new WelcomePage(page);
await welcomePage.clickLogin(); // See result instantly
```

### 13.8 MCP Security & Limitations

#### Security Considerations

- **Local development only**: MCP server for development, not production
- **Trusted networks**: Default 0.0.0.0 host allows network access
- **Resource usage**: Browser instances consume memory/CPU

#### Current Limitations

- **Single browser context**: One active session at a time
- **Authentication state**: May need to re-authenticate between sessions
- **Network dependency**: Requires dev server running

### 13.9 MCP Troubleshooting

#### Common Issues

```bash
# Port already in use
npx kill-port 3000
npm run mcp:start

# MCP server not responding
# Check if dev server is running on localhost:5173
npm run dev

# Browser not launching
# Ensure Playwright browsers are installed
npx playwright install
```

#### Debug Commands

```bash
# Check MCP server status
curl http://localhost:3000/health

# Verify Playwright installation
npx playwright --version

# Check available browsers
npx playwright install --dry-run
```

## 14. Commands Reference

```bash
# Run all E2E tests
npm run test:e2e

# Interactive mode
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# CI-friendly output
npm run test:e2e:ci

# View reports
npm run test:e2e:report

# Start MCP server for agent interaction
npm run mcp:start

# Test pre-push hook manually
.husky/pre-push
```

## 15. Agent Guidelines

### 15.1 When Adding Tests

- **Follow Page Object Model**: Don't put selectors directly in tests
- **Use data-testid**: Add to components if missing
- **Handle auth gracefully**: Skip when not available
- **Test critical paths**: Focus on user journeys, not implementation details

### 15.2 When Debugging Tests

- **Check component changes**: Ensure data-testids still exist
- **Verify server startup**: Dev server must be running on localhost:5173
- **Review authentication**: Auth0 configuration affects many tests

### 15.3 When Modifying Components

- **Preserve data-testids**: Don't break existing selectors
- **Forward props**: Ensure `{...rest}` spreading in reusable components
- **Test after changes**: Run E2E tests to verify no regressions

### 15.4 When Using MCP

- **Start with exploration**: Use MCP to understand current page state
- **Validate selectors**: Test data-testids exist before writing tests
- **Capture evidence**: Take screenshots to document findings
- **Iterate quickly**: Use live feedback to refine approaches
- **Clean up**: Close browser contexts when done to free resources
- **Preserve data-testids**: Don't break existing selectors
- **Forward props**: Ensure `{...rest}` spreading in reusable components
- **Test after changes**: Run E2E tests to verify no regressions

---

**Remember**: E2E tests are the safety net for user-facing functionality. Keep them stable, maintainable, and focused on real user workflows.

Last updated: October 2025
