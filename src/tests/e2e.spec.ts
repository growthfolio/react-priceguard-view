/**
 * End-to-End tests for critical user journeys
 */

import { test, expect } from '@playwright/test';

// Test login flow
test.describe('Authentication Flow', () => {
  test('should allow user to login with Google', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to login if not authenticated
    await expect(page).toHaveURL(/.*\/login/);
    
    // Check login page elements
    await expect(page.getByText('Entrar com Google')).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
    
    // Mock successful Google login (in a real test, you'd use actual OAuth)
    await page.route('**/api/auth/google', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              picture: 'https://example.com/avatar.jpg'
            },
            tokens: {
              access_token: 'mock_access_token',
              refresh_token: 'mock_refresh_token'
            }
          }
        })
      });
    });
    
    // Click login button
    await page.getByRole('button', { name: /entrar/i }).click();
    
    // Should redirect to dashboard after successful login
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Check user is logged in
    await expect(page.getByText('Test User')).toBeVisible();
  });

  test('should handle login failure gracefully', async ({ page }) => {
    await page.goto('/login');
    
    // Mock failed login
    await page.route('**/api/auth/google', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Invalid credentials'
        })
      });
    });
    
    await page.getByRole('button', { name: /entrar/i }).click();
    
    // Should show error message
    await expect(page.getByText(/erro/i)).toBeVisible();
    
    // Should stay on login page
    await expect(page).toHaveURL(/.*\/login/);
  });
});

// Test dashboard functionality
test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('priceGuard_auth_token', 'mock_token');
      localStorage.setItem('priceGuard_user_data', JSON.stringify({
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
  });

  test('should display dashboard with key metrics', async ({ page }) => {
    // Mock dashboard API
    await page.route('**/api/dashboard/overview', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            totalAlerts: 5,
            activeAlerts: 2,
            totalNotifications: 10,
            unreadNotifications: 3,
            portfolioValue: 50000,
            portfolioChange: 2.5
          }
        })
      });
    });

    await page.goto('/dashboard');
    
    // Check dashboard elements
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('5')).toBeVisible(); // Total alerts
    await expect(page.getByText('2')).toBeVisible(); // Active alerts
    await expect(page.getByText('$50,000')).toBeVisible(); // Portfolio value
    await expect(page.getByText('+2.5%')).toBeVisible(); // Portfolio change
  });

  test('should navigate between sections', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate to alerts
    await page.getByRole('link', { name: /alertas/i }).click();
    await expect(page).toHaveURL(/.*\/alerts/);
    
    // Navigate to notifications
    await page.getByRole('link', { name: /notificações/i }).click();
    await expect(page).toHaveURL(/.*\/notifications/);
    
    // Navigate back to dashboard
    await page.getByRole('link', { name: /dashboard/i }).click();
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});

// Test alerts functionality
test.describe('Alerts Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('priceGuard_auth_token', 'mock_token');
    });

    // Mock alerts API
    await page.route('**/api/alerts', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              alerts: [
                {
                  id: '1',
                  symbol: 'BTCUSD',
                  condition: 'price_above',
                  value: 50000,
                  is_active: true,
                  created_at: '2025-01-01T00:00:00Z'
                },
                {
                  id: '2',
                  symbol: 'ETHUSD',
                  condition: 'price_below',
                  value: 3000,
                  is_active: false,
                  created_at: '2025-01-01T00:00:00Z'
                }
              ],
              pagination: {
                page: 1,
                limit: 10,
                total: 2,
                totalPages: 1
              }
            }
          })
        });
      }
    });
  });

  test('should display alerts list', async ({ page }) => {
    await page.goto('/alerts');
    
    // Check alerts page elements
    await expect(page.getByText('Alertas')).toBeVisible();
    await expect(page.getByText('BTCUSD')).toBeVisible();
    await expect(page.getByText('ETHUSD')).toBeVisible();
    await expect(page.getByText('$50,000')).toBeVisible();
    await expect(page.getByText('$3,000')).toBeVisible();
  });

  test('should create new alert', async ({ page }) => {
    await page.goto('/alerts');
    
    // Mock create alert API
    await page.route('**/api/alerts', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: '3',
              symbol: 'ADAUSD',
              condition: 'price_above',
              value: 2,
              is_active: true,
              created_at: new Date().toISOString()
            }
          })
        });
      }
    });
    
    // Click create alert button
    await page.getByRole('button', { name: /criar alerta/i }).click();
    
    // Fill alert form (assuming modal or form appears)
    await page.selectOption('[name="symbol"]', 'ADAUSD');
    await page.selectOption('[name="condition"]', 'price_above');
    await page.fill('[name="value"]', '2');
    
    // Submit form
    await page.getByRole('button', { name: /salvar/i }).click();
    
    // Check success message
    await expect(page.getByText(/alerta criado/i)).toBeVisible();
  });

  test('should toggle alert status', async ({ page }) => {
    await page.goto('/alerts');
    
    // Mock toggle API
    await page.route('**/api/alerts/1/toggle', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { is_active: false }
        })
      });
    });
    
    // Click toggle button for first alert
    await page.getByTestId('alert-toggle-1').click();
    
    // Check status changed
    await expect(page.getByTestId('alert-status-1')).toHaveText('Inativo');
  });
});

// Test notifications
test.describe('Notifications', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('priceGuard_auth_token', 'mock_token');
    });

    // Mock notifications API
    await page.route('**/api/notifications', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            notifications: [
              {
                id: '1',
                message: 'BTCUSD atingiu $50,000',
                type: 'alert',
                priority: 'high',
                is_read: false,
                created_at: '2025-01-01T00:00:00Z'
              },
              {
                id: '2',
                message: 'Sistema atualizado',
                type: 'system',
                priority: 'low',
                is_read: true,
                created_at: '2025-01-01T00:00:00Z'
              }
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 2,
              totalPages: 1
            }
          }
        })
      });
    });
  });

  test('should display notifications list', async ({ page }) => {
    await page.goto('/notifications');
    
    await expect(page.getByText('Notificações')).toBeVisible();
    await expect(page.getByText('BTCUSD atingiu $50,000')).toBeVisible();
    await expect(page.getByText('Sistema atualizado')).toBeVisible();
  });

  test('should mark notification as read', async ({ page }) => {
    await page.goto('/notifications');
    
    // Mock mark as read API
    await page.route('**/api/notifications/1/read', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { is_read: true }
        })
      });
    });
    
    // Click on unread notification
    await page.getByTestId('notification-1').click();
    
    // Check notification is marked as read
    await expect(page.getByTestId('notification-1')).not.toHaveClass(/unread/);
  });

  test('should show notification badge in navbar', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check notification badge shows unread count
    await expect(page.getByTestId('notification-badge')).toHaveText('1');
    
    // Click notifications bell
    await page.getByTestId('notification-bell').click();
    
    // Check notification dropdown appears
    await expect(page.getByTestId('notification-dropdown')).toBeVisible();
    await expect(page.getByText('BTCUSD atingiu $50,000')).toBeVisible();
  });
});

// Test theme switching
test.describe('Theme System', () => {
  test('should switch between light and dark themes', async ({ page }) => {
    await page.goto('/');
    
    // Check initial theme (should be system default)
    const html = page.locator('html');
    
    // Click theme toggle
    await page.getByTestId('theme-toggle').click();
    
    // Check theme changed
    await expect(html).toHaveClass(/dark/);
    
    // Click again to switch to light
    await page.getByTestId('theme-toggle').click();
    await expect(html).toHaveClass(/light/);
  });

  test('should persist theme preference', async ({ page }) => {
    await page.goto('/');
    
    // Switch to dark theme
    await page.getByTestId('theme-toggle').click();
    
    // Reload page
    await page.reload();
    
    // Theme should be persisted
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

// Test responsive design
test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard');
    
    // Check mobile menu button is visible
    await expect(page.getByTestId('mobile-menu-button')).toBeVisible();
    
    // Click mobile menu
    await page.getByTestId('mobile-menu-button').click();
    
    // Check mobile menu appears
    await expect(page.getByTestId('mobile-menu')).toBeVisible();
    
    // Check navigation items in mobile menu
    await expect(page.getByTestId('mobile-nav-dashboard')).toBeVisible();
    await expect(page.getByTestId('mobile-nav-alerts')).toBeVisible();
  });

  test('should work on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/dashboard');
    
    // Check layout adapts to tablet size
    await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    
    // Check navigation is still visible
    await expect(page.getByTestId('main-navigation')).toBeVisible();
  });
});

// Performance tests
test.describe('Performance', () => {
  test('should load dashboard quickly', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Measure page load time
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();
    
    const loadTime = endTime - startTime;
    
    // Should load within reasonable time (adjust threshold as needed)
    expect(loadTime).toBeLessThan(3000); // 3 seconds
  });

  test('should handle large datasets efficiently', async ({ page }) => {
    // Mock large dataset
    await page.route('**/api/alerts', async route => {
      const alerts = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i + 1}`,
        symbol: `SYMBOL${i + 1}`,
        condition: 'price_above',
        value: 1000 + i,
        is_active: i % 2 === 0,
        created_at: new Date().toISOString()
      }));

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            alerts,
            pagination: {
              page: 1,
              limit: 50,
              total: 1000,
              totalPages: 20
            }
          }
        })
      });
    });

    await page.goto('/alerts');
    
    // Check that page renders without timeout
    await expect(page.getByText('Alertas')).toBeVisible({ timeout: 5000 });
    
    // Check pagination works
    await expect(page.getByText('Página 1 de 20')).toBeVisible();
  });
});
