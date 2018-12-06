import * as DMSActions from '../Actions'

describe('UserRegistration', () => {
  it('should create an action to request user registration', () => {
    expect(DMSActions.userRegistration('alba@sensenet.com', 'alba').type).toEqual('USER_REGISTRATION_REQUEST')
  })
})

describe('VerifyCaptchaSuccess', () => {
  it('should create an action to captcha verifing success', () => {
    const expectedAction = {
      type: 'VERIFY_CAPTCHA_SUCCESS',
    }
    expect(DMSActions.verifyCaptchaSuccess()).toEqual(expectedAction)
  })
})

describe('ClearRegistration', () => {
  it('should create an action to clear registration', () => {
    const expectedAction = {
      type: 'CLEAR_USER_REGISTRATION',
    }
    expect(DMSActions.clearRegistration()).toEqual(expectedAction)
  })
})

describe('SetCurrentId', () => {
  it('should create an action to set the current id', () => {
    const expectedAction = {
      type: 'SET_CURRENT_ID',
      id: 1,
    }
    expect(DMSActions.setCurrentId(1)).toEqual(expectedAction)
  })
})

describe('SetEditedContentId', () => {
  it('should create an action to set the currently edited contents id', () => {
    const expectedAction = {
      type: 'SET_EDITED_ID',
      id: 1,
    }
    expect(DMSActions.setEditedContentId(1)).toEqual(expectedAction)
  })
})

describe('OpenActionMenu', () => {
  it('should create an action to handle actionmenu open', () => {
    const expectedAction = {
      type: 'OPEN_ACTIONMENU',
      actions: [{ Name: 'Move' }],
      content: { Id: 1, Path: '', Type: 'File', Name: 'alma' },
      title: 'sample doc',
      element: null,
      position: {
        top: 2,
        left: 2,
      },
    }
    expect(
      DMSActions.openActionMenu(
        [{ Name: 'Move' } as any],
        { Id: 1, Path: '', Type: 'File', Name: 'alma' },
        'sample doc',
        null,
        { top: 2, left: 2 },
      ),
    ).toEqual(expectedAction)
  })
})

describe('CloseActionMenu', () => {
  it('should create an action to handle actionmenu close', () => {
    const expectedAction = {
      type: 'CLOSE_ACTIONMENU',
    }
    expect(DMSActions.closeActionMenu()).toEqual(expectedAction)
  })
})

describe('SelectionModeOn', () => {
  it('should create an action to handle selection mode', () => {
    const expectedAction = {
      type: 'SELECTION_MODE_ON',
    }
    expect(DMSActions.selectionModeOn()).toEqual(expectedAction)
  })
})

describe('SelectionModeOff', () => {
  it('should create an action to handle selection mode', () => {
    const expectedAction = {
      type: 'SELECTION_MODE_OFF',
    }
    expect(DMSActions.selectionModeOff()).toEqual(expectedAction)
  })
})
