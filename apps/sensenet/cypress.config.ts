/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 12000,
  screenshotOnRunFailure: false,
  video: false,

  env: {
    repoUrl: 'https://e2e-service.test.sensenet.com',
    identityServer: 'https://is.demo.sensenet.com',
    users: {
      admin: {
        clientId: 'xZSq7OvBQIPEXxWo',
        clientSecret: 'TSWPEcLvDY2xyGUgIGsclSK2vX6WKK4QbKuO6foxvlToIl5Ar1K79Vp15soJTvy4',
        id: "/Root/IMS/Public('businesscat')",
      },
      developer: {
        clientId: 'devdog',
        clientSecret: '',
        id: "/Root/IMS/Public('devdog')",
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
