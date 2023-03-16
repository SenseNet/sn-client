/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 12000,
  screenshotOnRunFailure: false,
  video: false,

  env: {
    repoUrl: 'https://e2e-service.test.sensenet.com',
    identityServer: 'https://is.test.sensenet.com',
    users: {
      admin: {
        clientId: 'emuRBycXurC1jhwD',
        clientSecret: '9xrLk56Scv12gu8WUlIx5WMYCMsv8HPblrGBKroNVCKYrMS1vKui8uTXhVGkV7O9',
        id: "/Root/IMS/Public('businesscat')",
      },
      superAdmin: {
        clientId: '7bZk2drAheS3UPgV',
        clientSecret: '4UBzLkvPyWsWXrWUjy7QVkcVaDyLfjejiJ3FfDm3fU1LlTxaGI9OT4x1NJMxRCGu',
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
