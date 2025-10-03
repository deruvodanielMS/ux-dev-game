# E2E Testing Guide - Quick Reference

Simple guide for E2E testing with Playwright in the UX Dev Game project.

## 🎯 What We Test

- **Login Flow**: Welcome page, login button interactions
- **Dashboard Access**: Authentication redirects and basic navigation
- **Main User Journey**: Login → Dashboard → Players list

## 🧪 Current Test Files

- `login.spec.ts` - Login flow and welcome page
- `dashboard-players.spec.ts` - Dashboard access and players API calls

## 📁 Test Structure

```
e2e/
├── login.spec.ts          # Login flow tests
├── dashboard-players.spec.ts  # Dashboard & API tests
├── pages/WelcomePage.ts   # Page Object for welcome page
└── global.d.ts            # TypeScript declarations
```

## 🔧 Key Patterns

### Selectors

Use `data-testid` attributes for stable element targeting:

```typescript
// In component
<button data-testid="login-button">Login</button>

// In test
await page.locator('[data-testid="login-button"]').click();
```

### Page Objects

```typescript
class WelcomePage {
  constructor(private page: Page) {}

  get loginButton() {
    return this.page.getByTestId('login-button');
  }

  async clickLogin() {
    await this.loginButton.click();
  }
}
```

## 🔐 Authentication Testing

**Current Strategy**: Keep it simple

- ✅ **Login flow**: Test welcome page and login button interactions
- ⚠️ **Dashboard**: Skip auth-dependent tests (Auth0 not configured)
- 🎯 **Focus**: Core user journey without complex auth mocking

### Mock Pattern (when needed)

```typescript
test.skip('auth test', async ({ page }) => {
  await page.addInitScript(() => {
    window.__mockAuth0 = {
      isAuthenticated: true,
      user: {
        sub: 'test',
        name: 'Test',
        email: 'test@test.com',
        picture: 'pic.jpg',
      },
    };
  });
  // ... test code
});
```

## ⚙️ Commands

```bash
# Run tests
npm run test:e2e         # All E2E tests
npm run test:e2e:ui      # Interactive mode
npm run test:e2e:debug   # Debug mode

# MCP Server (for agents)
npm run mcp:start        # Interactive browser control
```

## 🐛 Common Issues

**Port 5173 in use**: Kill Node processes with `powershell "Get-Process -Name node | Stop-Process -Force"`

**Tests timeout**: Server management is handled by Playwright automatically

**Auth failures**: Expected without Auth0 configuration - tests skip gracefully

## 📝 Adding New Tests

1. Add `data-testid` to components
2. Use Page Object pattern for reusable interactions
3. Keep tests simple and focused on main user journeys
4. Skip auth-dependent tests with `test.skip()` if Auth0 not configured

---

**Keep it simple**: Focus on core flows, skip complex scenarios, let Playwright handle the infrastructure.

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
