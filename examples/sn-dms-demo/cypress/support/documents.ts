import Chance = require('chance')
import { resources } from '../../src/assets/resources'

export const openContextMenu = (name: string | number | RegExp) => {
  cy.contains('[data-cy=appbar]', 'Document library', { timeout: 10000 })
    .should('exist')
    .get('[data-cy=gridPlaceholder]')
    .should('be.hidden')
  cy.contains('tr', name)
    .click()
    .trigger('contextmenu')
}

export const contextMenuItems = {
  preview: 'Preview',
  download: 'Download',
  rename: 'Rename',
  copyTo: 'Copy to',
  moveTo: 'Move to',
  shareContent: 'Share content',
  editProperties: 'Edit properties',
  setPermissions: 'Set permissions',
  checkOut: 'Check out',
  checkIn: 'Check in',
  undoChanges: 'Undo changes',
  publish: 'Publish',
  versions: 'Versions',
  delete: 'Delete',
}

export const newMenuItems = [
  { name: 'document', ext: '.docx' },
  { name: 'sheet', ext: '.xlsx' },
  { name: 'slide', ext: '.pptx' },
  { name: 'text', ext: '.txt' },
  { name: 'folder', ext: '' },
]

export const createNewFileName = () => Chance().word() + '.png'

export const openNew = (action: string) => {
  cy.contains('Documents').click()
  cy.contains(resources.ADD_NEW).click()
  cy.get(`[title="${resources.ADD_NEW} ${action}"]`).click()
}

export const registerNewUser = () => {
  const chance = new Chance()
  const currentUser = { email: chance.email({ domain: 'sensenet.com' }), password: chance.string() }
  cy.registerUser(currentUser.email, currentUser.password)
  return currentUser
}

export const moveToFolderAndCheckIfFileExists = (copyToPath: string, fileName: string) => {
  cy.contains(copyToPath)
    .should('be.visible')
    .dblclick()
  cy.contains('[data-cy=appbar]', copyToPath, { timeout: 10000 }).should('exist')
  cy.contains(fileName).should('exist')
}

export const openContextMenuItem = (fileName: string, menuItem: string) => {
  openContextMenu(fileName)
  cy.get(`[title="${menuItem}"]`).click()
}

export const uploadNewFileAndOpenContextMenuItem = (currentUserEmail: string, fileName: string, menuItem: string) => {
  cy.uploadWithApi({
    parentPath: `Root/Profiles/Public/${currentUserEmail}/Document_Library`,
    fileName,
  })
  cy.contains('div', fileName, { timeout: 10000 }).should('exist')
  openContextMenuItem(fileName, menuItem)
}

export const selectPathInListPicker = ({ path, action }: { path: string; action: string }) => {
  cy.contains('h6', `${action} content`).should('be.visible')
  cy.get('div[role="dialog"]')
    .contains('span', path)
    .click()
  cy.contains('button', `${action} content here`).click()
}
