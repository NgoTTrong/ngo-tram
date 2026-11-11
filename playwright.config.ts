import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:3100' },
  webServer: {
    command: 'npm run build && npx next start -p 3100',
    url: 'http://localhost:3100/vi',
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
  projects: [
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
  ],
})
