import { defineConfig, devices } from '@playwright/test'

// E2E_PORT lets the suite run while another project's server holds the default port.
const PORT = process.env.E2E_PORT ?? '3200'

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 300_000,
  },
  projects: [
    // iPhone-sized viewport in Chromium: Playwright's WebKit on Windows mis-scales with OS DPI (clientWidth 326 for a 390 viewport).
    { name: 'mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 } },
  ],
})
