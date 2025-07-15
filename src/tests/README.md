# 🧪 Testing Setup and Documentation

## Overview

This document provides setup instructions and guidelines for testing in the PriceGuard application.

## 🔧 Setup

### Unit Tests (Vitest)

Unit tests are already configured and can be run with:

```bash
npm run test
```

### E2E Tests (Playwright)

To set up E2E tests with Playwright:

1. **Install Playwright:**
```bash
npm install -D @playwright/test
npx playwright install
```

2. **Create Playwright config:**
```javascript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

3. **Add test scripts to package.json:**
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

4. **Run E2E tests:**
```bash
npm run test:e2e
```

## 📁 Test Structure

```
src/tests/
├── services.test.tsx          # Service unit tests
├── e2e.spec.ts               # E2E test scenarios
├── components/               # Component tests
│   ├── ui.test.tsx
│   └── notifications.test.tsx
└── hooks/                    # Hook tests
    └── usePerformance.test.tsx
```

## 🧪 Test Categories

### 1. Unit Tests
- **Services**: API clients, caching, authentication
- **Components**: UI components with React Testing Library
- **Hooks**: Custom hooks functionality
- **Utils**: Helper functions and utilities

### 2. Integration Tests
- **Context interactions**: Multiple contexts working together
- **Service integrations**: API + Cache + Auth flow
- **Component + Hook combinations**

### 3. E2E Tests
- **User journeys**: Login, dashboard, alerts, notifications
- **Cross-browser compatibility**
- **Mobile responsiveness**
- **Performance benchmarks**

## 🎯 Testing Guidelines

### Unit Tests
```tsx
// Example: Testing a service
describe('CacheService', () => {
  beforeEach(() => {
    cacheService.clear();
    vi.clearAllMocks();
  });

  it('should cache and retrieve data', () => {
    const testData = { id: 1, name: 'Test' };
    cacheService.set('key', testData);
    
    expect(cacheService.get('key')).toEqual(testData);
  });
});
```

### Component Tests
```tsx
// Example: Testing a component
describe('OptimizedCard', () => {
  it('should render with correct props', () => {
    render(
      <OptimizedCard
        title="Test Card"
        value="$1,000"
        change={{ value: 5, percentage: true }}
      />
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
    expect(screen.getByText('+5.00%')).toBeInTheDocument();
  });
});
```

### E2E Tests
```typescript
// Example: Testing user flow
test('should complete alert creation flow', async ({ page }) => {
  await page.goto('/alerts');
  
  await page.getByRole('button', { name: /criar alerta/i }).click();
  await page.fill('[name="symbol"]', 'BTCUSD');
  await page.fill('[name="value"]', '50000');
  await page.getByRole('button', { name: /salvar/i }).click();
  
  await expect(page.getByText(/alerta criado/i)).toBeVisible();
});
```

## 🚀 Performance Testing

### Metrics to Track
- **Page Load Times**: < 3 seconds
- **Cache Operations**: < 50ms for 100 items
- **Render Performance**: < 16ms per frame
- **Bundle Size**: Track with webpack-bundle-analyzer

### Performance Tests
```typescript
test('should load dashboard within 3 seconds', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(3000);
});
```

## 🏗️ Test Data Management

### Mock Data
- Use consistent mock data across tests
- Store in dedicated `__mocks__` directories
- Version control test fixtures

### API Mocking
```typescript
// Service tests
vi.mock('../services/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

// E2E tests
await page.route('**/api/alerts', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(mockAlertsData)
  });
});
```

## 📊 Coverage Goals

- **Unit Tests**: > 80% coverage
- **Integration Tests**: Cover all critical user flows
- **E2E Tests**: Cover all main user journeys

## 🔍 Debugging

### Unit Tests
```bash
# Run specific test
npm test -- --run services.test.tsx

# Watch mode
npm test -- --watch

# Debug mode
npm test -- --inspect-brk
```

### E2E Tests
```bash
# Debug specific test
npm run test:e2e:debug -- --grep "login"

# Run with UI mode
npm run test:e2e:ui

# Generate test report
npm run test:e2e -- --reporter=html
```

## 🔧 CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm test
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/
```

## 📝 Best Practices

1. **Write tests first** (TDD) for critical functionality
2. **Mock external dependencies** (APIs, services)
3. **Use descriptive test names** that explain the behavior
4. **Keep tests independent** and idempotent
5. **Clean up after tests** (clear cache, reset mocks)
6. **Test error scenarios** as well as happy paths
7. **Use proper assertions** that provide clear failure messages
8. **Group related tests** in describe blocks
9. **Use test data builders** for complex objects
10. **Monitor test performance** and optimize slow tests

## 🔗 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

**Note**: This testing setup provides comprehensive coverage for the PriceGuard application, ensuring reliability and maintainability as the codebase grows.
