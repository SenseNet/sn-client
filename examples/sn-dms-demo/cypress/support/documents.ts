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
