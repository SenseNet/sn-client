"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SN = require("sn-client-js");
const Actions_1 = require("../src/Actions");
const Chai = require("chai");
const expect = Chai.expect;
describe('Actions', () => {
    const path = '/workspaces/project';
    describe('FetchContent', () => {
        it('should create an action to a fetch content request', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_REQUEST',
                path: '/workspaces/project',
                filter: "?$select=Id,Type&metadata=no"
            };
            expect(Actions_1.Actions.RequestContent(path, {})).to.deep.equal(expectedAction);
        });
        it('should create an action to receive content', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_SUCCESS',
                response: { entities: {}, result: [] },
                filter: "?$select=Id,Type&metadata=no"
            };
            expect(Actions_1.Actions.ReceiveContent({ d: { results: [] } }, '?$select=Id,Type&metadata=no')).to.deep.equal(expectedAction);
        });
        it('should create an action to content fetch request failure', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_FAILURE',
                message: 'error',
                filter: "?$select=Id,Type&metadata=no"
            };
            expect(Actions_1.Actions.ReceiveContentFailure('?$select=Id,Type&metadata=no', { message: 'error' })).to.deep.equal(expectedAction);
        });
    });
    describe('CreateContent', () => {
        const content = SN.Content.Create('Article', { DisplayName: 'My content', Id: 123 });
        it('should create an action to a create content request', () => {
            const expectedAction = {
                type: 'CREATE_CONTENT_REQUEST',
                path: '/workspaces/project',
                content: content
            };
            expect(Actions_1.Actions.CreateContent(path, content)).to.deep.equal(expectedAction);
        });
        it('should create an action to create content success', () => {
            const expectedAction = {
                type: 'CREATE_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: 'My content',
                                Id: 123
                            }
                        }
                    },
                    result: 123
                }
            };
            expect(Actions_1.Actions.CreateContentSuccess({ response: { d: { DisplayName: 'My content', Id: 123 } } })).to.deep.equal(expectedAction);
        });
        it('should create an action to content creation failure', () => {
            const expectedAction = {
                type: 'CREATE_CONTENT_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.CreateContentFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
    });
    describe('UpdateContent', () => {
        it('should create an action to an update content request', () => {
            const expectedAction = {
                type: 'UPDATE_CONTENT_REQUEST',
                id: 123,
                fields: { Index: 2 }
            };
            expect(Actions_1.Actions.UpdateContent(123, { Index: 2 })).to.deep.equal(expectedAction);
        });
        it('should create an action to update content success', () => {
            const expectedAction = {
                type: 'UPDATE_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: "My content",
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            };
            expect(Actions_1.Actions.UpdateContentSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction);
        });
        it('should create an action to content update request failure', () => {
            const expectedAction = {
                type: 'UPDATE_CONTENT_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.UpdateContentFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
    });
    describe('DeleteContent', () => {
        it('should create an action to a delete content request', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_REQUEST',
                id: 123,
                permanently: false
            };
            expect(Actions_1.Actions.Delete(123, false)).to.deep.equal(expectedAction);
        });
        it('should create an action to delete content success', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_SUCCESS',
                id: 123,
                index: 0
            };
            expect(Actions_1.Actions.DeleteSuccess(0, 123)).to.deep.equal(expectedAction);
        });
        it('should create an action to delete content failure', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.DeleteFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
    });
    describe('DeleteBatchContent', () => {
        it('should create an action to a delete content request', () => {
            const expectedAction = {
                type: 'DELETE_BATCH_REQUEST',
                path: path,
                ids: ['1', '2', '3'],
                permanently: false
            };
            expect(Actions_1.Actions.DeleteBatch(path, ['1', '2', '3'], false)).to.deep.equal(expectedAction);
        });
        it('should create an action to delete content success', () => {
            const expectedAction = {
                type: 'DELETE_BATCH_SUCCESS',
                indexes: [0, 1, 2]
            };
            expect(Actions_1.Actions.DeleteBatchSuccess([0, 1, 2])).to.deep.equal(expectedAction);
        });
        it('should create an action to delete content failure', () => {
            const expectedAction = {
                type: 'DELETE_BATCH_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.DeleteBatchFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
    });
    describe('CheckoutContent', () => {
        it('should create an action to a checkout content request', () => {
            const expectedAction = {
                type: 'CHECKOUT_CONTENT_REQUEST',
                id: 123
            };
            expect(Actions_1.Actions.CheckOut(123)).to.deep.equal(expectedAction);
        });
        it('should create an action to checkout content success', () => {
            const expectedAction = {
                type: 'CHECKOUT_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: "My content",
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            };
            expect(Actions_1.Actions.CheckOutSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction);
        });
        it('should create an action to checkout content failure', () => {
            const expectedAction = {
                type: 'CHECKOUT_CONTENT_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.CheckOutFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
    });
    describe('CheckinContent', () => {
        it('should create an action to a checkin content request', () => {
            const expectedAction = {
                type: 'CHECKIN_CONTENT_REQUEST',
                id: 123,
                checkInComment: 'comment'
            };
            expect(Actions_1.Actions.CheckIn(123, 'comment')).to.deep.equal(expectedAction);
        });
        it('should create an action to checkin content success', () => {
            const expectedAction = {
                type: 'CHECKIN_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: "My content",
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            };
            expect(Actions_1.Actions.CheckInSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction);
        });
        it('should create an action to checkin content failure', () => {
            const expectedAction = {
                type: 'CHECKIN_CONTENT_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.CheckInFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
    });
    describe('PublishContent', () => {
        it('should create an action to a publish content request', () => {
            const expectedAction = {
                type: 'PUBLISH_CONTENT_REQUEST',
                id: 123
            };
            expect(Actions_1.Actions.Publish(123)).to.deep.equal(expectedAction);
        });
        it('should create an action to publish content success', () => {
            const expectedAction = {
                type: 'PUBLISH_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: "My content",
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            };
            expect(Actions_1.Actions.PublishSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction);
        });
        it('should create an action to publish content failure', () => {
            const expectedAction = {
                type: 'PUBLISH_CONTENT_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.PublishFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
    });
    describe('ApproveContent', () => {
        it('should create an action to an approve content request', () => {
            const expectedAction = {
                type: 'APPROVE_CONTENT_REQUEST',
                id: 123
            };
            expect(Actions_1.Actions.Approve(123)).to.deep.equal(expectedAction);
        });
        it('should create an action to approve content success', () => {
            const expectedAction = {
                type: 'APPROVE_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: "My content",
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            };
            expect(Actions_1.Actions.ApproveSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction);
        });
        it('should create an action to approve content failure', () => {
            const expectedAction = {
                type: 'APPROVE_CONTENT_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.ApproveFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
    });
    describe('RejectContent', () => {
        it('should create an action to an reject content request', () => {
            const expectedAction = {
                type: 'REJECT_CONTENT_REQUEST',
                id: 123,
                rejectReason: 'reason'
            };
            expect(Actions_1.Actions.Reject(123, 'reason')).to.deep.equal(expectedAction);
        });
        it('should create an action to reject content success', () => {
            const expectedAction = {
                type: 'REJECT_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: "My content",
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            };
            expect(Actions_1.Actions.RejectSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction);
        });
        it('should create an action to reject content failure', () => {
            const expectedAction = {
                type: 'REJECT_CONTENT_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.RejectFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
    });
    describe('UndoCheckoutContent', () => {
        it('should create an action to an undo-checkout content request', () => {
            const expectedAction = {
                type: 'UNDOCHECKOUT_CONTENT_REQUEST',
                id: 123
            };
            expect(Actions_1.Actions.UndoCheckout(123)).to.deep.equal(expectedAction);
        });
        it('should create an action to undo-checkout content success', () => {
            const expectedAction = {
                type: 'UNDOCHECKOUT_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: "My content",
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            };
            expect(Actions_1.Actions.UndoCheckoutSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction);
        });
        it('should create an action to undo-checkout content failure', () => {
            const expectedAction = {
                type: 'UNDOCHECKOUT_CONTENT_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.UndoCheckoutFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
    });
    describe('ForceUndoCheckoutContent', () => {
        it('should create an action to a force undo-checkout content request', () => {
            const expectedAction = {
                type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST',
                id: 123
            };
            expect(Actions_1.Actions.ForceUndoCheckout(123)).to.deep.equal(expectedAction);
        });
        it('should create an action to force undo-checkout content success', () => {
            const expectedAction = {
                type: 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: "My content",
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            };
            expect(Actions_1.Actions.ForceUndoCheckoutSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction);
        });
        it('should create an action to force undo-checkout content failure', () => {
            const expectedAction = {
                type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.ForceUndoCheckoutFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
    });
    describe('RestoreVersion', () => {
        it('should create an action to a version restore request', () => {
            const expectedAction = {
                type: 'RESTOREVERSION_CONTENT_REQUEST',
                id: 123,
                version: 'A.1.0'
            };
            expect(Actions_1.Actions.RestoreVersion(123, 'A.1.0')).to.deep.equal(expectedAction);
        });
        it('should create an action to a version restore success', () => {
            const expectedAction = {
                type: 'RESTOREVERSION_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: "My content",
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            };
            expect(Actions_1.Actions.RestoreVersionSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction);
        });
        it('should create an action to a version restore failure', () => {
            const expectedAction = {
                type: 'RESTOREVERSION_CONTENT_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.RestoreVersionFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
    });
    describe('UserLogin', () => {
        it('should create an action to a user login request', () => {
            const expectedAction = {
                type: 'USER_LOGIN_REQUEST',
                userName: 'alba',
                password: 'alba'
            };
            expect(Actions_1.Actions.UserLogin('alba', 'alba')).to.deep.equal(expectedAction);
        });
        it('should create an action to a user login success', () => {
            const expectedAction = {
                type: 'USER_LOGIN_SUCCESS',
                response: {
                    Name: 'alba',
                    DisplayName: 'Alba Monday'
                }
            };
            expect(Actions_1.Actions.UserLoginSuccess({ response: { d: { Name: 'alba', DisplayName: 'Alba Monday' } } })).to.deep.equal(expectedAction);
        });
        it('should create an action to a user login failure', () => {
            const expectedAction = {
                type: 'USER_LOGIN_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.UserLoginFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
        it('should create an action to a user login failure with the proper message when 403', () => {
            const expectedAction = {
                type: 'USER_LOGIN_FAILURE',
                message: 'The username or the password is not valid!'
            };
            expect(Actions_1.Actions.UserLoginFailure({ message: 'The username or the password is not valid!', status: 403 })).to.deep.equal(expectedAction);
        });
    });
    describe('UserLogout', () => {
        it('should create an action to a user logout request', () => {
            const expectedAction = {
                type: 'USER_LOGOUT_REQUEST'
            };
            expect(Actions_1.Actions.UserLogout()).to.deep.equal(expectedAction);
        });
        it('should create an action to a user logout success', () => {
            const expectedAction = {
                type: 'USER_LOGOUT_SUCCESS'
            };
            expect(Actions_1.Actions.UserLogoutSuccess({})).to.deep.equal(expectedAction);
        });
        it('should create an action to a user logout failure', () => {
            const expectedAction = {
                type: 'USER_LOGOUT_FAILURE',
                message: 'error'
            };
            expect(Actions_1.Actions.UserLogoutFailure({ message: 'error' })).to.deep.equal(expectedAction);
        });
    });
});

//# sourceMappingURL=ActionsTests.js.map
