///<reference path="../node_modules/@types/mocha/index.d.ts"/>
import { Actions } from '../src/Actions'
import * as Chai from 'chai';
import { Content, Mocks, IContentOptions, ContentTypes, Repository } from 'sn-client-js';
const expect = Chai.expect;

describe('Actions', () => {
    const path = '/workspaces/project';
    let repo: Mocks.MockRepository = new Mocks.MockRepository();
    describe('FetchContent', () => {
        it('should create an action to a fetch content request', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_REQUEST',
                path: '/workspaces/project',
                options: {},
                contentType: Content
            }
            expect(Actions.RequestContent(path, {}, Content)).to.deep.equal(expectedAction)
        });
        it('should create an action to a fetch content request', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_REQUEST',
                path: '/workspaces/project',
                options: {},
                contentType: undefined
            }
            expect(Actions.RequestContent(path)).to.deep.equal(expectedAction)
        });
        it('should create an action to receive content', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_SUCCESS',
                response: { entities: {}, result: [] },
                params: '?$select=Id,Type&metadata=no'
            }
            expect(Actions.ReceiveContent([], '?$select=Id,Type&metadata=no')).to.deep.equal(expectedAction)
        });
        it('should create an action to content fetch request failure', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_FAILURE',
                message: 'error',
                params: '?$select=Id,Type&metadata=no'
            }
            expect(Actions.ReceiveContentFailure('?$select=Id,Type&metadata=no', { message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('LoadContent', () => {
        it('should create an action to a load content request', () => {
            const expectedAction = {
                type: 'LOAD_CONTENT_REQUEST',
                id: 123,
                options: {},
                contentType: ContentTypes.Task
            }
            expect(Actions.LoadContent(123, {}, ContentTypes.Task)).to.deep.equal(expectedAction)
        });
        it('should create an action to a load content request', () => {
            const expectedAction = {
                type: 'LOAD_CONTENT_REQUEST',
                id: 123,
                options: {},
                contentType: undefined
            }
            expect(Actions.LoadContent(123)).to.deep.equal(expectedAction)
        });
        it('should create an action to receive a loaded content', () => {
            const expectedAction = {
                type: 'LOAD_CONTENT_SUCCESS',
                params: {},
                response: {
                    entities: {
                        collection: {
                            123: repo.HandleLoadedContent({
                                DisplayName: 'My content',
                                Id: 123
                            })
                        }
                    },
                    result: 123
                }
            }
            expect(Actions.ReceiveLoadedContent(
                repo.HandleLoadedContent({ DisplayName: 'My content', Id: 123 }),
                {})).to.deep.equal(expectedAction)
        });

        it('should create an action to content reload request failure', () => {
            const expectedAction = {
                type: 'LOAD_CONTENT_FAILURE',
                message: 'error',
                params: '?$select=Id,Type&metadata=no'
            }
            expect(Actions.ReceiveLoadedContentFailure('?$select=Id,Type&metadata=no', { message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('ReloadContent', () => {
        it('should create an action to a reload content request', () => {
            const expectedAction = {
                type: 'RELOAD_CONTENT_REQUEST',
                actionName: 'edit'
            }
            expect(Actions.ReloadContent('edit')).to.deep.equal(expectedAction)
        });
        it('should create an action to receive the reloaded content', () => {
            const expectedAction = {
                type: 'RELOAD_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: repo.HandleLoadedContent({
                                DisplayName: 'My content',
                                Id: 123
                            })
                        }
                    },
                    result: 123
                }
            }
            expect(Actions.ReceiveReloadedContent(repo.HandleLoadedContent({ DisplayName: 'My content', Id: 123 }))).to.deep.equal(expectedAction)
        });
        it('should create an action to content load request failure', () => {
            const expectedAction = {
                type: 'RELOAD_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.ReceiveReloadedContentFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('ReloadContentFields', () => {
        it('should create an action to a reload fields of a content request', () => {
            const expectedAction = {
                type: 'RELOAD_CONTENTFIELDS_REQUEST',
                fields: []
            }
            expect(Actions.ReloadContentFields()).to.deep.equal(expectedAction)
        });
        it('should create an action to receive the reloaded fields of a content', () => {
            const expectedAction = {
                type: 'RELOAD_CONTENTFIELDS_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: repo.HandleLoadedContent({
                                DisplayName: 'My content',
                                Id: 123
                            })
                        }
                    },
                    result: 123
                }
            }
            expect(Actions.ReceiveReloadedContentFields(repo.HandleLoadedContent({ DisplayName: 'My content', Id: 123 }))).to.deep.equal(expectedAction)
        });
        it('should create an action to content load request failure', () => {
            const expectedAction = {
                type: 'RELOAD_CONTENTFIELDS_FAILURE',
                message: 'error'
            }
            expect(Actions.ReceiveReloadedContentFieldsFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('CreateContent', () => {
        const content = {
            Id: 123,
            Name: 'My Content',
            DueDate: null,
        };

        it('should create an action to a create content request', () => {
            const expectedAction = {
                type: 'CREATE_CONTENT_REQUEST',
                content
            };
            expect(Actions.CreateContent(content as any)).to.deep.equal(expectedAction)
        });
        it('should create an action to create content success', () => {
            const expectedAction = {
                type: 'CREATE_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: repo.HandleLoadedContent({
                                DisplayName: 'My content',
                                Id: 123
                            })
                        }
                    },
                    result: 123
                }
            }
            expect(Actions.CreateContentSuccess(repo.HandleLoadedContent({ DisplayName: 'My content', Id: 123 }))).to.deep.equal(expectedAction)
        });
        it('should create an action to content creation failure', () => {
            const expectedAction = {
                type: 'CREATE_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.CreateContentFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('UpdateContent', () => {
        it('should create an action to an update content request', () => {
            const expectedAction = {
                type: 'UPDATE_CONTENT_REQUEST',
                content: { Index: 2 }
            }
            expect(Actions.UpdateContent({
                Index: 2
            })).to.deep.equal(expectedAction)
        });
        it('should create an action to update content success', () => {
            const expectedAction = {
                type: 'UPDATE_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: repo.HandleLoadedContent({
                                DisplayName: 'My content',
                                Id: 123,
                                Index: 2
                            })
                        }
                    }, result: 123
                }
            }
            expect(Actions.UpdateContentSuccess(repo.HandleLoadedContent({ DisplayName: 'My content', Id: 123, Index: 2 }))).to.deep.equal(expectedAction)
        });
        it('should create an action to content update request failure', () => {
            const expectedAction = {
                type: 'UPDATE_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.UpdateContentFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('DeleteContent', () => {
        it('should create an action to a delete content request', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_REQUEST',
                id: 123,
                permanently: false
            }
            expect(Actions.Delete(123, false)).to.deep.equal(expectedAction)
        });
        it('should create an action to a delete content request', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_REQUEST',
                id: 123,
                permanently: false
            }
            expect(Actions.Delete(123)).to.deep.equal(expectedAction)
        });
        it('should create an action to delete content success', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_SUCCESS',
                id: 123,
                index: 0
            }
            expect(Actions.DeleteSuccess(0, 123)).to.deep.equal(expectedAction)
        });
        it('should create an action to delete content failure', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.DeleteFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('DeleteBatchContent', () => {
        it('should create an action to a delete content request', () => {
            const expectedAction = {
                type: 'DELETE_BATCH_REQUEST',
                path: path,
                ids: ['1', '2', '3'],
                permanently: false
            }
            expect(Actions.DeleteBatch(path, ['1', '2', '3'], false)).to.deep.equal(expectedAction)
        });
        it('should create an action to a delete content request', () => {
            const expectedAction = {
                type: 'DELETE_BATCH_REQUEST',
                path: path,
                ids: ['1', '2', '3'],
                permanently: false
            }
            expect(Actions.DeleteBatch(path, ['1', '2', '3'])).to.deep.equal(expectedAction)
        });
        it('should create an action to delete content success', () => {
            const expectedAction = {
                type: 'DELETE_BATCH_SUCCESS',
                indexes: [0, 1, 2]
            }
            expect(Actions.DeleteBatchSuccess([0, 1, 2])).to.deep.equal(expectedAction)
        });
        it('should create an action to delete content failure', () => {
            const expectedAction = {
                type: 'DELETE_BATCH_FAILURE',
                message: 'error'
            }
            expect(Actions.DeleteBatchFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('CheckoutContent', () => {
        it('should create an action to a checkout content request', () => {
            const expectedAction = {
                type: 'CHECKOUT_CONTENT_REQUEST',
                id: 123
            }
            expect(Actions.CheckOut(123)).to.deep.equal(expectedAction)
        });
        it('should create an action to checkout content success', () => {
            const expectedAction = {
                type: 'CHECKOUT_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: 'My content',
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            }
            expect(Actions.CheckOutSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction)
        });
        it('should create an action to checkout content failure', () => {
            const expectedAction = {
                type: 'CHECKOUT_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.CheckOutFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('CheckinContent', () => {
        it('should create an action to a checkin content request', () => {
            const expectedAction = {
                type: 'CHECKIN_CONTENT_REQUEST',
                id: 123,
                checkInComment: 'comment'
            }
            expect(Actions.CheckIn(123, 'comment')).to.deep.equal(expectedAction)
        });
        it('should create an action to a checkin content request', () => {
            const expectedAction = {
                type: 'CHECKIN_CONTENT_REQUEST',
                id: 123,
                checkInComment: ''
            }
            expect(Actions.CheckIn(123)).to.deep.equal(expectedAction)
        });
        it('should create an action to checkin content success', () => {
            const expectedAction = {
                type: 'CHECKIN_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: 'My content',
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            }
            expect(Actions.CheckInSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction)
        });
        it('should create an action to checkin content failure', () => {
            const expectedAction = {
                type: 'CHECKIN_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.CheckInFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('PublishContent', () => {
        it('should create an action to a publish content request', () => {
            const expectedAction = {
                type: 'PUBLISH_CONTENT_REQUEST',
                id: 123
            }
            expect(Actions.Publish(123)).to.deep.equal(expectedAction)
        });
        it('should create an action to publish content success', () => {
            const expectedAction = {
                type: 'PUBLISH_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: 'My content',
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            }
            expect(Actions.PublishSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction)
        });
        it('should create an action to publish content failure', () => {
            const expectedAction = {
                type: 'PUBLISH_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.PublishFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('ApproveContent', () => {
        it('should create an action to an approve content request', () => {
            const expectedAction = {
                type: 'APPROVE_CONTENT_REQUEST',
                id: 123
            }
            expect(Actions.Approve(123)).to.deep.equal(expectedAction)
        });
        it('should create an action to approve content success', () => {
            const expectedAction = {
                type: 'APPROVE_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: 'My content',
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            }
            expect(Actions.ApproveSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction)
        });
        it('should create an action to approve content failure', () => {
            const expectedAction = {
                type: 'APPROVE_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.ApproveFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('RejectContent', () => {
        it('should create an action to an reject content request', () => {
            const expectedAction = {
                type: 'REJECT_CONTENT_REQUEST',
                id: 123,
                rejectReason: 'reason'
            }
            expect(Actions.Reject(123, 'reason')).to.deep.equal(expectedAction)
        });
        it('should create an action to an reject content request', () => {
            const expectedAction = {
                type: 'REJECT_CONTENT_REQUEST',
                id: 123,
                rejectReason: ''
            }
            expect(Actions.Reject(123)).to.deep.equal(expectedAction)
        });
        it('should create an action to reject content success', () => {
            const expectedAction = {
                type: 'REJECT_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: 'My content',
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            }
            expect(Actions.RejectSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction)
        });
        it('should create an action to reject content failure', () => {
            const expectedAction = {
                type: 'REJECT_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.RejectFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('UndoCheckoutContent', () => {
        it('should create an action to an undo-checkout content request', () => {
            const expectedAction = {
                type: 'UNDOCHECKOUT_CONTENT_REQUEST',
                id: 123
            }
            expect(Actions.UndoCheckout(123)).to.deep.equal(expectedAction)
        });
        it('should create an action to undo-checkout content success', () => {
            const expectedAction = {
                type: 'UNDOCHECKOUT_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: 'My content',
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            }
            expect(Actions.UndoCheckoutSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction)
        });
        it('should create an action to undo-checkout content failure', () => {
            const expectedAction = {
                type: 'UNDOCHECKOUT_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.UndoCheckoutFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('ForceUndoCheckoutContent', () => {
        it('should create an action to a force undo-checkout content request', () => {
            const expectedAction = {
                type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST',
                id: 123
            }
            expect(Actions.ForceUndoCheckout(123)).to.deep.equal(expectedAction)
        });
        it('should create an action to force undo-checkout content success', () => {
            const expectedAction = {
                type: 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: 'My content',
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            }
            expect(Actions.ForceUndoCheckoutSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction)
        });
        it('should create an action to force undo-checkout content failure', () => {
            const expectedAction = {
                type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.ForceUndoCheckoutFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('RestoreVersion', () => {
        it('should create an action to a version restore request', () => {
            const expectedAction = {
                type: 'RESTOREVERSION_CONTENT_REQUEST',
                id: 123,
                version: 'A.1.0'
            }
            expect(Actions.RestoreVersion(123, 'A.1.0')).to.deep.equal(expectedAction)
        });
        it('should create an action to a version restore success', () => {
            const expectedAction = {
                type: 'RESTOREVERSION_CONTENT_SUCCESS',
                response: {
                    entities: {
                        collection: {
                            123: {
                                DisplayName: 'My content',
                                Id: 123,
                                Index: 2
                            }
                        }
                    }, result: 123
                }
            }
            expect(Actions.RestoreVersionSuccess({ response: { d: { DisplayName: 'My content', Id: 123, Index: 2 } } })).to.deep.equal(expectedAction)
        });
        it('should create an action to a version restore failure', () => {
            const expectedAction = {
                type: 'RESTOREVERSION_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.RestoreVersionFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('UserLogin', () => {
        it('should create an action to a user login request', () => {
            const expectedAction = {
                type: 'USER_LOGIN_REQUEST',
                userName: 'alba',
                password: 'alba'
            }
            expect(Actions.UserLogin('alba', 'alba')).to.deep.equal(expectedAction)
        });
        it('should create an action to a user login success', () => {
            const expectedAction = {
                type: 'USER_LOGIN_SUCCESS',
                response: true
            }
            expect(Actions.UserLoginSuccess(true)).to.deep.equal(expectedAction)
        });
        it('should create an action to a user login failure', () => {
            const expectedAction = {
                type: 'USER_LOGIN_FAILURE',
                message: 'error'
            }
            expect(Actions.UserLoginFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
        it('should create an action to a user login failure with the proper message when 403', () => {
            const expectedAction = {
                type: 'USER_LOGIN_FAILURE',
                message: 'The username or the password is not valid!'
            }
            expect(Actions.UserLoginFailure({ message: 'The username or the password is not valid!', status: 403 })).to.deep.equal(expectedAction)
        });
    });
    describe('UserLogout', () => {
        it('should create an action to a user logout request', () => {
            const expectedAction = {
                type: 'USER_LOGOUT_REQUEST'
            }
            expect(Actions.UserLogout()).to.deep.equal(expectedAction)
        });
        it('should create an action to a user logout success', () => {
            const expectedAction = {
                type: 'USER_LOGOUT_SUCCESS'
            }
            expect(Actions.UserLogoutSuccess({})).to.deep.equal(expectedAction)
        });
        it('should create an action to a user logout failure', () => {
            const expectedAction = {
                type: 'USER_LOGOUT_FAILURE',
                message: 'error'
            }
            expect(Actions.UserLogoutFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('CheckLoginState', () => {
        it('should return the current authentication state', () => {
            const expectedAction = {
                type: 'CHECK_LOGIN_STATE_REQUEST'
            }
            expect(Actions.CheckLoginState()).to.deep.equal(expectedAction)
        });
    });
});