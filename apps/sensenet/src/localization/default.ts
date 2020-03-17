const values = {
  dashboard: {
    errorLoadingWidget: 'Error loading widget :(',
    refresh: 'Refresh',
    openInSearch: 'Open in Search',
    updates: {
      title: 'Packages to update',
      allUpToDate: 'All packages are up to date',
      view: 'View',
    },
  },
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
    title: 'Show Command Palette',
    help: {
      readMeTitle: 'ReadMe',
      readMeDescription: 'Opens the latest readme.md file from GitHub in a new window',
      communitySiteTitle: 'Visit the Community Site',
      communitySiteDescription: 'Opens http://community.sensenet.com in a new window',
      gitterTitle: 'Chat on Gitter',
      gitterDescription: 'If you have any unanswered question about the product you can ask us on Gitter',
    },
    customAction: {
      executePrimaryText: '{0} 👉 {1}',
      executeSecondaryText: "Execute custom action '{1}' on content '{0}'",
    },
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
      'Content Types': 'Content Types',
      Dashboard: 'Dashboard',
      Localization: 'Localization',
      Search: 'Search',
      Setup: 'Setup',
      Trash: 'Trash',
      Query: 'Query',
      'Users and groups': 'Users and groups',
    },
    descriptions: {
      Content: 'Explore and manage your content in the repository',
      'Content Types': 'Manage content types',
      Dashboard: 'Repository overview',
      Localization: 'Manage string resources',
      Search: 'Execute custom searches, build and save queries',
      Setup: 'Configure the sensenet system',
      Trash: 'Manage deleted items here: restore content or purge them permanently',
      Query: 'Open my custom Query',
      'Users and groups': 'Manage users and groups, roles and identities',
    },
    personalSettingsTitle: 'Edit personal settings',
    personalSettingsSecondaryText: 'Customize the application behavior',
    contentRootDescription: 'The root path. Content will be displayed below this level.',
    queryTerm: 'Content query see https://community.sensenet.com/docs/content-query/',
    columns: 'Array of columns to display',
    expand: 'Expand',
    collapse: 'Collapse',
    newSearch: 'New search',
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
    drawerDashboardName: 'A unique identifier for the dashboard',
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
    contentBrowseType:
      'Choose between a simple list, a two-panel (commander) or a tree + single panel (explorer) style view',
    contentFields: 'Select fields to display',
    platformDependentTitle: 'Platform dependent setting',
    lastRepository: 'The last visited repository URL',
    languageTitle: 'The name of the active language',
    themeTitle: 'Select a dark or a light theme',
    uploadHandlerTitle: 'Select which handlertype(s) has/have upload permission',
    eventLogSize: 'Number of entries to store in the Event Log',
    sendLogWithCrashReports: 'Send log data with crash reports by default',
    dashboard: {
      widgetName: 'Widget',
      minWidth: 'The minimum width of the widget in pixels',
      widgetType: 'Type of the widget',
      title: 'Widget title',
      queryWidget: {
        settings: 'Settings for the Query widget',
        query: 'The content query expression',
        emptyPlaceholderText: 'The text that will be displayed if the query has no hits',
        showColumnNames: 'Show or hide column names',
        top: 'Limits the number of hits',
        showOpenInSearch: 'Option for a button to open the query in the Search view',
        showRefresh: 'Option for a refresh button',
        enableSelection: 'Enable content selection',
        countOnly: 'Displays only the hits count instead of a content list',
        columns: 'Array of columns to display',
      },
      markdownWidget: {
        settings: 'Settings for the Markdown Widget',
        content: 'The Markdown content to display',
      },
    },
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
    reportError: 'Report error',
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
    queryLabel: 'Content Query',
    queryHelperText: 'Enter a content query expression',
    autoFilters: 'AutoFilters',
    openInSearchTitle: 'Open in Search',
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
    otherSettings: 'Other settings',
    descriptions: {
      '/Root/System/Settings/DocumentPreview.settings':
        'In this section you can customize the behavior of the Document Preview feature – for example the font style of the watermark displayed on documents or the number of the initially generated preview images. ',
      '/Root/System/Settings/Indexing.settings':
        'In this section you can customize the indexing behavior (for example the text extractor used in case of different file types) of the system. ',
      '/Root/System/Settings/Logging.settings':
        'Contains logging-related settings, for example which events are sent to the trace. You can control tracing by category: switch on or off writing messages in certain categories to the trace channel. ',
      '/Root/System/Settings/MailProcessor.settings':
        'The content list Inbox feature requires an Exchange or POP3 server configuration and other settings related to connecting libraries to a mailbox. ',
      '/Root/System/Settings/OAuth.settings':
        'When users log in using one of the configured OAuth providers (like Google or Facebook), these settings control the type and place of the newly created users. ',
      '/Root/System/Settings/OfficeOnline.settings':
        'To open or edit Office documents in the browser, the system needs to know the address of the Office Online Server that provides the user interface for the feature. In this section you can configure that and other OOS-related settings. ',
      '/Root/System/Settings/Portal.settings':
        'All settings related to the surface and behavior of the web application can be found here, from the cache header settings of different file types to the default content type of uploaded images and the allowed origin values. ',
      '/Root/System/Settings/Sharing.settings': 'Content sharing related options. ',
      '/Root/System/Settings/TaskManagement.settings':
        'When the Task Management module is installed, this is the place where you can configure the connection to the central task management service. ',
      '/Root/System/Settings/UserProfile.settings':
        'When a user is created, and the profile feature is enabled (in the app configuration), they automatically get a profile – a workspace dedicated to the user’s personal documents and tasks. In this setting section you can customize the content type and the place of this profile. ',
    },
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
    restoreTableHead: 'Restore to version',
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
  },
}

export default values
