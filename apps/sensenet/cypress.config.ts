/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 12000,
  screenshotOnRunFailure: false,
  video: false,

  env: {
    repoUrl: 'https://daily.test.sensenet.cloud',
    identityServer: 'https://daily-is.test.sensenet.cloud',
    users: {
      admin: {
        clientId: 'J6IRgrjcydea2Z1N',
        clientSecret: 'heIP9iGXs76nmYYsIQAOZwoaGFDX8iu6UHnqoE32PYwdY1QD8qNPfLOM5X4xuFmQ',
        id: "/Root/IMS/Public('businesscat')",
      },
      superAdmin: {
        clientId: 'A5E6uTwVnZpuOddm',
        clientSecret: 'WmjbMMPMM8yALI8NrhNmQb4uLUn7SkDQB3O834Wyu3eoMjNy4vLn7uYdpawnGloO',
        id: "/Root/IMS/BuiltIn/Portal/('Admin')",
      },
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
    baseUrl: 'https://admin.test.sensenet.com',
  },
})
