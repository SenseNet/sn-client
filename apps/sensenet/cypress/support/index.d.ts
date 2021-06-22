/// <reference types="cypress" />
/// <reference types="cypress-xpath/src" />

declare namespace Cypress {
  type UserTypes = 'developer' | 'admin'

  interface Chainable {
    /**
     * Custom command to log in programmatically.
     */
    login(userType?: UserTypes): void

    /**
     * Save the current value of local storage to memory
     */
    saveLocalStorage(): void

    /**
     * Restore a previously saved local storage value from memory
     */
    restoreLocalStorage(): void

    checkReadPermissionGroup(enabled?: boolean): void

    /**
     * Check the items of the add button dropdown list by name
     */
    checkAddItemList(dropdownItems: string[]): void

    scrollToItem({
      container,
      selector,
      done,
    }: {
      container: JQuery<HTMLElement>
      selector: string
      done?: (element: HTMLElement) => void
    }): Promise<HTMLElement>

    /**
     * Check the context menu items for the selected item
     */
    checkContextMenu({
      selector,
      contextMenuItems,
      clickAction,
    }: {
      selector: string
      contextMenuItems: string[]
      clickAction: 'click' | 'rightclick'
    }): void
  }
}
