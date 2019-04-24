const values = {
  addButton: {
    tooltip: 'Create or upload content',
    new: 'New...',
    dialogTitle: 'Create new {0}',
    upload: 'Upload',
    errorGettingAllowedContentTypes: 'There was an error while fetching the allowed content types.',
    contentCreatedNoty: `The content '{0}' has been created succesfully.`,
    errorPostingContentNoty: 'There was an error during content creation',
  },
  commandPalette: {
    title: 'Show Command Palette',
  },
  contentContextMenu: {
    editProperties: 'Edit properties',
    copy: 'Copy',
    move: 'Move',
    delete: 'Delete',
    open: 'Open',
  },
  contentInfoDialog: {
    dialogTitle: 'Info about {0}',
    type: 'Type',
    owner: 'Owner',
    path: 'Path',
    created: 'Created',
    unknownOwner: 'Unknown',
  },
  deleteContentDialog: {
    dialogTitle: 'Really delete content?',
    deletingContent: 'Deleting content...',
    dialogContent: 'You are going to delete the following content:',
    permanentlyLabel: 'Permanently',
    permanentlyHint: "Don't move to trash, delete immediately",
    deleteButton: 'Delete',
    cancelButton: 'Cancel',
    deleteSuccessNoty: `Content '{0}' has been deleted succesfully`,
    deleteMultipleSuccessNoty: `{0} content deleted succesfully`,
    deleteFailedNoty: `There was an error during content deletion.`,
  },
  drawer: {
    personalSettingsTitle: 'Edit personal settings',
    personalSettingsSecondaryText: 'Customize the application behavior',
    contentTitle: 'Content',
    contentSecondaryText: 'Explore the content of the repository',
    searchTitle: 'Search',
    searchSecondaryText: 'Execute custom searches, build and save queries',
    usersAndGroupsTitle: 'Users and groups',
    usersAndGroupsSecondaryText: 'Manage users and groups, roles and identities',
    setupTitle: 'Setup',
    setupSecondaryText: 'Configure the sensenet system',
    versionInfoTitle: 'Version Info',
    versionInfoSecondaryText: 'Detailed version information about the current sensenet installation',
    expand: 'Expand',
    collapse: 'Collapse',
  },
  editPropertiesDialog: {
    dialogTitle: 'Edit {0}',
    saveSuccessNoty: `Content '{0}' has been updated.`,
    saveFailedNoty: `There was an error during updating content '{0}'`,
  },
  login: {
    loginTitle: 'Login',
    loginButtonTitle: 'Login',
    userNameLabel: 'UserName',
    userNameHelperText: "Enter the user name you've registered with",
    passwordLabel: 'Password',
    passwordHelperText: 'Enter a matching password for the user',
    repositoryLabel: 'Repository URL',
    repositoryHelperText: 'URL for the repository (e.g.: https://my-sensenet.org)',
    loginFailed: 'Login failed.',
    greetings: 'Greetings, {0}!',
    loggingInTo: 'Logging in to {0}...',
    loginSuccessNoty: `Logged in with user '{0} to repository '{1}'`,
    loginFailedNoty: `Failed to log in with user '{0} to repository '{1}'`,
    loginErrorNoty: `There was an error during login with user '{0} to repository '{1}'`,
  },
  logout: {
    logoutButtonTitle: 'Log out',
    logoutDialogTitle: 'Really log out?',
    loggingOutFrom: 'Logging out from {0}...',
    logoutConfirmText: 'You are logged in to {0} as {1}. Are you sure that you want to leave?',
    logoutSuccessNoty: 'You have logged out from {0}',
    logoutCancel: 'Cancel',
  },
  personalSettings: {
    title: 'Personal settings',
    drawer: 'Options for the left drawer',
    drawerEnable: 'Enable or disable the drawer',
    drawerType: 'Drawer type',
    drawerItems: 'Items enabled on the drawer',
    repositoryTitle: 'A list of visited repositories',
    repositoryUrl: 'The path of the repository, e.g.: https://my-sensenet-repository.org',
    repositoryLoginName: "The last user you've logged in with",
    repositoryDisplayName: `An optional user friendly name to display the repository when you're connected to it`,
    commandPaletteTitle: 'Options for the command palette',
    commandPaletteEnable: 'Enable or disable the command palette',
    commandPaletteWrapQuery: 'A wrapper for all queries executed from the command palette',
    contentTitle: 'Content browsing and basic editing functions',
    contentBrowseType:
      'Choose between a simple list, a two-panel (commander) or a tree + single panel (explorer) style view',
    contentFields: 'Select fields to display',
    platformDependentTitle: 'Platform dependent setting',
    lastRepository: 'The last visited repository URL',
    languageTitle: 'The name of the active language',
    themeTitle: 'Select a dark or a light theme',
    eventLogSize: 'Number of entries to store in the Event Log',
  },
  repositorySelector: {
    loggedInAs: 'You are currently logged in as {0}',
    notLoggedIn: 'You are not logged in.',
    anotherRepo: 'Another repository',
    typeToFilter: 'Type to filter...',
  },
  textEditor: {
    unsavedChangesWarning: 'You have unsaved changes. Are you sure that you want to leave?',
    save: 'Save',
    reset: 'Reset',
    saveSuccessNoty: `The changes of '{0}' has been saved`,
    saveFailedNoty: `Failed to save changes of content '{0}'`,
  },
  navigationCommandProvider: {
    personalSettingsPrimary: 'Personal Settings',
    personalSettingsSecondary: 'Edit your personal settings',
    contentPrimary: 'Content',
    contentSecondary: 'Explore the content of the Repository',
    searchPrimary: 'Search',
    searchSecondaryText: 'Search in the repository, manage content queries',
    eventsPrimary: 'Events',
    eventsSecondary: 'Detailed event log with general info, warnings and errors',
  },
  eventList: {
    filter: {
      termTitle: 'Search term',
      termPlaceholder: 'Search term...',
      scopeTitle: 'Scope',
      scopePlaceholder: 'Scope...',
      levelTitle: 'Level',
      levelAll: 'All',
    },
    list: {
      level: 'Level',
      message: 'Message',
      scope: 'Scope',
      relatedContent: 'Related Content',
    },
  },
}

export default values
