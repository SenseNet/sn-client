import { User } from '@sensenet/default-content-types'
import { UploadOptions } from '../integration/typings'

Cypress.Commands.add('login', (email, password) => {
  cy.visit('')
  Cypress.log({
    name: 'login',
    consoleProps: () => {
      return { email, password }
    },
    message: [`${email} | ${password}`],
  })
  cy.window().then(async win => {
    return await win.repository.authentication.login(email, password)
  })
})

Cypress.Commands.add('registerUser', (email, password) => {
  cy.visit('')
  cy.window().then(async win => {
    return await win.repository.executeAction<{ email: string; password: string }, User>({
      name: 'RegisterUser',
      idOrPath: `/Root/IMS('Public')`,
      body: {
        email,
        password,
      },
      method: 'POST',
    })
  })
})

Cypress.Commands.add('uploadWithApi', (options: UploadOptions) => {
  cy.visit('')
  cy.fixture(options.fileName).then(img => {
    Cypress.log({
      name: 'upload',
      consoleProps: () => {
        return { options }
      },
      message: [`Uploading ${options.fileName} to ${options.parentPath}`],
    })
    return Cypress.Blob.base64StringToBlob(img, 'image/png').then(blob => {
      cy.window().then(win => {
        win.repository.upload.file({
          file: blobToFile(blob, options.fileName),
          ...(options as any),
          overwrite: false,
          binaryPropertyName: 'Binary',
        })
      })
    })
  })
})

const blobToFile = (theBlob: Blob, fileName: string): File => {
  const b: any = theBlob
  // A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date()
  b.name = fileName

  // Cast to a File() type
  return theBlob as File
}
