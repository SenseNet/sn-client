const values = {
  addButton: {
    tooltip: 'Create or upload content',
    new: 'New...',
    addNew: 'Add new',
    dialogTitle: 'Create new {0}',
    upload: 'Upload',
    errorGettingAllowedContentTypes: 'There was an error while fetching the allowed content types.',
    contentCreatedNotification: `The content '{0}' has been created succesfully.`,
    errorPostingContentNotification: 'There was an error during content creation',
    errorGettingActions: 'There was an error while fetching the actions.',
  },
  commandPalette: {
    title: 'Search',
    clear: 'Clear',
    help: {
      readMeTitle: 'ReadMe',
      readMeDescription: 'Opens the latest readme.md file from GitHub in a new window',
      communitySiteTitle: 'Visit the Community Site',
      communitySiteDescription: 'Opens https://community.sensenet.com in a new window',
      docsSiteTitle: 'Visit the Documentation Site',
      docsSiteDescription: 'Opens https://docs.sensenet.com in a new window',
      gitterTitle: 'Chat on Gitter',
      gitterDescription: 'If you have any unanswered question about the product you can ask us on Gitter',
    },
    customAction: {
      executePrimaryText: '{0} 👉 {1}',
      executeSecondaryText: "Execute custom action '{1}' on content '{0}'",
    },
    searchSuggestionList: 'Search suggestion list',
  },
  lockedCell: {
    checkedOutTo: (name: string) => `Checked out to ${name}`,
    actionNeeded: 'Content should be approved',
  },
  contentInfoDialog: {
    dialogTitle: 'Info about {0}',
    type: 'Type',
    owner: 'Owner',
    path: 'Path',
    created: 'Created',
    unknownOwner: 'Unknown',
  },
  checkInDialog: {
    inputLabel: 'Check in comment (optional)',
    successMessage: 'Check in succeded',
    errorMessage: 'Check in failed',
    send: 'Send',
    checkinComment: 'Add a check in comment',
  },
  areYouSureDialog: {
    body: 'Are you absolutely sure?',
    submitButton: 'Yes',
    cancelButton: 'Cancel',
    title: 'Are you sure?',
  },
  approveDialog: {
    approveSuccess: (name: string) => `${name} approved successfully.`,
    approveError: 'Approve action failed.',
    rejectSuccess: (name: string) => `${name} rejected successfully.`,
    rejectError: 'Reject action failed.',
    body: (name: string) => `You are about to approve or reject ${name}`,
    title: 'Approve or reject',
    inputLabel: 'Please provide a reason for rejecting the content',
    approveButton: 'Approve',
    rejectButton: 'Reject',
    cancelButton: 'Cancel',
  },
  deleteContentDialog: {
    dialogTitle: 'Really delete content?',
    deletingContent: 'Deleting content...',
    dialogContent: 'You are going to delete the following content:',
    permanentlyLabel: 'Permanently',
    deletePermanently: 'Delete permanently',
    permanentlyHint: "Don't move to trash, delete immediately",
    deleteButton: 'Delete',
    cancelButton: 'Cancel',
    deleteSuccessNotification: `Content '{0}' has been deleted succesfully`,
    deleteMultipleSuccessNotification: `{0} content deleted succesfully`,
    deleteSingleContentFailedNotification: `There was an error deleting content '{0}': {1}`,
    deleteMultipleContentFailedNotification: `There was an error deleting {0} content.`,
    deleteFailedNotification: `There was an error during content deletion.`,
  },
  copyMoveContentDialog: {
    copy: {
      title: `Copy '{0}' to '{1}'`,
      inProgress: 'Copy in progress...',
      titleMultiple: `Copy {0} items to '{1}'`,
      copyButton: 'Copy',
      cancelButton: 'Cancel',
      details: 'Copy {0} content to {1}',
      copySucceededNotification: '{0} has been copied to {1}',
      copyMultipleSucceededNotification: '{0} items has been copied to {1}',
      copyFailedNotification: 'Failed to copy content {0} to {1}',
      copyMultipleFailedNotification: 'Failed to copy {0} items to {1}',
    },
    move: {
      title: `Move '{0}' to '{1}'`,
      inProgress: 'Move in progress...',
      titleMultiple: `Move {0} items to '{1}'`,
      copyButton: 'Move',
      cancelButton: 'Cancel',
      details: 'Move {0} content to {1}',
      copySucceededNotification: '{0} has been moved to {1}',
      copyMultipleSucceededNotification: '{0} items has been moved to {1}',
      copyFailedNotification: 'Failed to move content {0} to {1}',
      copyMultipleFailedNotification: 'Failed to move {0} items to {1}',
    },
  },
  drawer: {
    titles: {
      Content: 'Content',
      ContentTypes: 'Content Types',
      Localization: 'Localization',
      Search: 'Search',
      Setup: 'Setup',
      Trash: 'Trash',
      UsersAndGroups: 'Users and groups',
      CustomContent: 'Custom content',
    },
    descriptions: {
      Content: 'Explore and manage your content in the repository',
      ContentTypes: 'Manage content types',
      Localization: 'Manage string resources',
      Search: 'Execute custom searches, build and save queries',
      Setup: 'Configure the sensenet system',
      Trash: 'Manage deleted items here: restore content or purge them permanently',
      UsersAndGroups: 'Manage users and groups, roles and identities',
      CustomContent: 'Explore and manage your content from the configured path',
    },
    personalSettingsTitle: 'Edit personal settings',
    personalSettingsSecondaryText: 'Customize the application behavior',
    contentRootDescription: 'The root path. Content will be displayed below this level.',
    columns: 'Array of columns to display',
    expand: 'Expand',
    collapse: 'Collapse',
    newSearch: 'New search',
    add: 'Add',
  },
  dashboard: {
    title: (projectName: string) => `Welcome to your ${projectName} project`,
    descriptionFirstLine: 'Here you can Explore the Admin UI with sample content',
    descriptionSecondLine: 'Feel free to look around!',
    subscriptionPlan: 'Your subscription plan',
    free: 'Free',
    features: 'Features',
    users: 'users',
    content: 'content',
    storageSpace: 'GB storage space',
    version: 'Version number',
    releaseNotes: 'View release notes',
    getMore: 'Want to get more?',
    upgrade: 'Upgrade',
    usage: 'Current usage',
    Users: 'Users',
    Content: 'Content',
    StorageSpace: 'Storage space',
    used: (current: string | number, limit: string | number) => `${current} of ${limit} used`,
    yourProject: 'Your project',
    getStarted: 'Get started with your new project.',
    learnMore: 'Learn more about Sensenet',
    learnBasics: 'Learn the basics',
    learnBasicsDescription: 'Get step-by-step guides and learn what you can achieve only working on the admin-ui.',
    beExpert: 'Be a content management expert',
    beExpertDescription: 'Master the concept of sensenet with its special terms and abstractions.',
    buildApp: 'Build your first app',
    buildAppDescription: 'Let us help you to begin your sensenet journey!',
    viewUserGuides: 'View User Guides',
    viewConceptDocs: 'View Concept Docs',
    viewDevManual: 'View the Developer manual',
  },
  trash: {
    title: 'Trash',
    retentionTime: 'Minimum retention time',
    retentionTimeUnit: 'day(s)',
    sizeQuota: 'Size quota',
    sizeQuotaUnit: 'MB',
    capacity: 'Trashbag capacity',
    capacityUnit: 'content',
  },
  editPropertiesDialog: {
    dialogTitle: 'Edit {0}',
    saveSuccessNotification: `Content '{0}' has been updated.`,
    saveFailedNotification: `There was an error during updating content '{0}'`,
  },
  login: {
    loginTitle: 'Welcome!',
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
    youCanLogInWith: 'You can also log in with',
    logInWithSso: 'Log in via SSO',
    resetPassword: 'Reset password',
    resendConfirmation: 'Resend confirmation',
    unlockAccount: 'Unlock account',
    newToSensenet: 'New to sensenet?',
    help: 'Help',
    contactUs: 'Contact us',
    signUp: 'Sign up',
    loginSuccessNotification: `Logged in with user '{0} to repository '{1}'`,
    loginFailedNotification: `Failed to log in with user '{0}' to repository '{1}'`,
    loginErrorNotification: `There was an error during login with user '{0}' to repository '{1}'`,
    loginToDemoButtonTitle: `Login to a demo repository`,
    welcome: 'Welcome to admin.sensenet.com',
    demoTitle: `If you don't have your own repository yet`,
    repositoryUrl: 'Otherwise please type in your repository URL to continue',
  },
  logout: {
    logoutButtonTitle: 'Log out',
    logoutDialogTitle: 'Really log out?',
    loggingOutFrom: (repoUrl: string) => `Logging out from ${repoUrl}...`,
    logoutConfirmText: (repoUrl: string, userName: string) =>
      `You are logged in to ${repoUrl} as ${userName}. Are you sure that you want to leave?`,
    logoutSuccessNotification: (repoUrl: string) => `You have logged out from ${repoUrl}`,
    logoutCancel: 'Cancel',
  },
  personalSettings: {
    defaults: 'Defaults',
    showDefaults: 'Show defaults',
    restoreDefaults: 'Restore defaults',
    restoreDialogTitle: 'Really restore defaults?',
    restoreDialogText:
      'Are you sure you want to restore the default settings? Your log will also be cleared and you will be signed out from all repositories.',
    cancel: 'Cancel',
    restore: 'Restore',
    restoringDefaultsProgress: 'Restoring the default settings...',
    title: 'Personal settings',
    drawer: 'Options for the left drawer',
    drawerEnable: 'Enable or disable the drawer',
    drawerType: 'Drawer type',
    drawerItems: 'Items enabled on the drawer',
    drawerCustomContentAppPath: 'Unique url param for the new menu item',
    drawerCustomContentRoot: 'SenseNet path of the root item of the custom content view',
    drawerItemTitle: 'Title of the item',
    drawerItemDescription: 'Description of the item',
    drawerItemIcon: 'The icon of the drawer item',
    drawerItemPermissions: 'A list of required persmissions for a specific drawer items',
    drawerItemPermissionPath: 'A full path to a specific content',
    drawerItemPermissionName: 'The name of the action',
    repositoryTitle: 'A list of visited repositories',
    repositoryUrl: 'The path of the repository, e.g.: https://my-sensenet-repository.org',
    repositoryLoginName: "The last user you've logged in with",
    repositoryDisplayName: `An optional user friendly name to display the repository when you're connected to it`,
    commandPaletteTitle: 'Options for the command palette',
    commandPaletteEnable: 'Enable or disable the command palette',
    commandPaletteWrapQuery: 'A wrapper for all queries executed from the command palette',
    contentTitle: 'Content browsing and basic editing functions',
    contentBrowseType: 'Browse type selection: currently only the single panel (explorer) style view available',
    contentFields: 'Select fields to display',
    platformDependentTitle: 'Platform dependent setting',
    lastRepository: 'The last visited repository URL',
    languageTitle: 'The name of the active language',
    themeTitle: 'Select a dark or a light theme',
    uploadHandlerTitle: 'Select which handlertype(s) has/have upload permission',
    eventLogSize: 'Number of entries to store in the Event Log',
    sendLogWithCrashReports: 'Send log data with crash reports by default',
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
    saveSuccessNotification: `The changes of '{0}' has been saved`,
    saveFailedNotification: `Failed to save changes of content '{0}'`,
  },
  topMenu: {
    personalSettings: 'Personal settings',
    logout: 'Log out',
    openMenu: 'Open menu',
  },
  navigationCommandProvider: {
    personalSettingsPrimary: 'Personal Settings',
    personalSettingsSecondary: 'Edit your personal settings',
    contentPrimary: 'Content',
    contentSecondary: 'Explore the content of the Repository',
    searchPrimary: 'Search',
    searchSecondaryText: 'Search in the current repository',
    savedQueriesPrimary: 'Saved queries',
    savedQueriesSecondaryText: 'List of your saved queries and searches in the current repository',
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
      clear: 'Clear',
      confirmClear: 'Are you sure to clear the log?',
    },
    list: {
      level: 'Level',
      message: 'Message',
      scope: 'Scope',
      relatedContent: 'Related Content',
      date: 'Date',
    },
    details: {
      back: 'Back to list',
    },
  },
  errorBoundary: {
    title: 'Something went wrong :(',
    text: `An error occured and your request couldn't be completed. `,
    reload: 'Reload page',
  },
  errorReport: {
    title: 'Send error report',
    descriptionTitle: 'Description',
    descriptionHelperText: 'Explain what did you do when the error occured',
    send: 'Send',
    cancel: 'Cancel',
    allowLogSending: 'I agree to send events from my log',
    sendingInProgress: 'Sending error report...',
  },
  uploadProgress: {
    title: 'Upload files',
    selectFilesToUpload: 'Select files to upload',
    orDragAndDrop: 'or drag and drop',
    uploadButton: 'Upload',
    blockNavigation: 'Upload is in progress. Do you want to navigate away anyway?',
    uploadCompleted: 'Upload completed',
    uploadFailed: 'Upload failed',
    contentUploaded: `Content '{0}' has been uploaded succesfully`,
    contentUploadedMultiple: `Finished uploading {count} content.`,
  },
  search: {
    title: 'Search',
    onlyPublic: 'Show public queries only',
    saveInputPlaceholder: (term: string) => `Search results for '${term}'`,
    savedQueries: 'Saved queries',
    queryHelperText: 'Enter a keyword or a content query expression',
    autoFilters: 'AutoFilters',
    openInSearchTitle: (term: string) => `See all results for '${term}'`,
    openInSearchDescription: 'Opens the query expression in the Search view',
    saveQuery: 'Save Query',
    noSavedQuery: 'There is no query saved yet.',
    save: 'Save',
    cancel: 'Cancel',
    public: 'Public',
    confirmDeleteQuery: `Are you sure that you want to delete the query '{0}'?`,
  },
  settings: {
    edit: 'Edit',
    learnMore: 'Learn more',
  },
  customActions: {
    executeCustomActionDialog: {
      title: `Execute custom action '{0}' on content '{1}'`,
      noParameters: 'The action does not have any parameters',
      cancelButton: 'Cancel',
      executeButton: 'Execute',
      executingAction: `Executing custom action...`,
    },
    resultsDialog: {
      title: `Custom action results`,
      closeButton: 'Close',
    },
  },
  wopi: {
    errorOpeningFileTitle: `Error opening file for online editing`,
    errorOpeningFileText: 'There was an error during opening the file for online editing.',
    tryOpenRead: 'View',
    goBack: 'Go back',
  },
  versionsDialog: {
    getVersionsError: (name: string) => `Couldn't get versions for content: ${name}`,
    title: 'Versions',
    versionTableHead: 'Version',
    modifiedByTableHead: 'Modified by',
    commentTableHead: 'Comment',
    rejectReasonTableHead: 'Reject reason',
    restoreTableHead: 'Restore',
    restoreBodyText: (name: string, version?: string) =>
      `Are you sure you want to restore version <strong>${version}</strong> of <strong>${name}</strong>`,
    restoreSubmitText: 'Restore',
    restoreVersionSuccess: (name: string, version?: string) => `${name} restored to version ${version}`,
    restoreVersionError: (name: string, version?: string) =>
      `Couldn't restore version to  ${version} for content: ${name}`,
    restoreButtonTitle: 'Restore version',
  },
  forms: {
    referencePicker: 'Reference picker',
    avatarPicker: 'Avatar picker',
    removeAvatar: 'Remove avatar',
    changeReference: 'Change reference',
    addReference: 'Add reference',
    ok: 'Ok',
    cancel: 'Cancel',
    upload: 'Upload',
    submit: 'Submit',
    inputPlaceHolder: 'Start typing to add another type',
    emptyField: '<This field is empty>',
  },
  common: {
    loadingContent: 'Loading content...',
  },
  batchActions: {
    delete: 'Delete selected items',
    move: 'Move selected items',
    copy: 'Copy selected items',
  },
  referenceContentListDialog: {
    errorAlreadyInList: 'The selected item is already in the list',
  },
  contentList: {
    errorContentModification: 'There was an error during content modification',
  },
  restore: {
    description: (contentName: string) =>
      `You are about to restore <strong>${contentName}</strong> from the Trash to the following destination:`,
    selectTarget: 'Select target',
    title: 'Restore',
    cancel: 'Cancel',
  },
  contentPickerDialog: {
    title: 'Select a target',
    cancelButton: 'Cancel',
    selectButton: 'Select',
  },
}

export default values
