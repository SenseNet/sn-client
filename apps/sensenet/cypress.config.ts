/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 12000,
  screenshotOnRunFailure: false,
  video: false,

  env: {
    repoUrl: 'https://e2e.test.sensenet.cloud',
    identityServer: 'https://e2e-is.test.sensenet.cloud',
    users: {
      admin: {
        clientId: 'DLb8MEWjqSMTAPQC',
        clientSecret: 'nGp3dSOuhCnpw4lXKuwWfguLjrqAV8UEflVRNwnLdc3rGMpK7A7MBuwjI4wKZpUT',
        id: "/Root/IMS/Public('businesscat')",
      },
      superAdmin: {
        clientId: 'OrgJhzuEs4s4SlPn',
        clientSecret: 'H3EsuyCAJ6uXUQhiEZ7HRsaxGhllISsS8TIen1aeAH6K2HzOIg1GkVA4RIVVSGff',
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
