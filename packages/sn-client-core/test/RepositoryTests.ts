import { using } from "@sensenet/client-utils";
import { IActionModel, User } from "@sensenet/default-content-types";
import { expect } from "chai";
import { IActionOptions, Repository } from "../src";
import { IContent } from "../src/Models/IContent";
import { IODataCollectionResponse } from "../src/Models/IODataCollectionResponse";
import { IODataResponse } from "../src/Models/IODataResponse";
import { ConstantContent } from "../src/Repository/ConstantContent";

// tslint:disable:completed-docs
declare const global: any;
global.window = {};
export const repositoryTests = describe("Repository", () => {

    let repository: Repository;
    const mockResponse: Response = {
        ok: true,
        json: async () => ({}),
    } as Response;

    const fetchMock: Repository["fetchMethod"] = async (input: RequestInfo, init: RequestInit) => {
        return mockResponse;
    };

    beforeEach(() => {
        repository = new Repository(undefined, fetchMock);
    });

    afterEach(() => {
        repository.dispose();
    });

    it("Should be constructed", () => {
        expect(repository).to.be.instanceof(Repository);
    });

    it("Should be constructed with a built-in fetch method", (done: MochaDone) => {
        global.window.fetch = () => { done(); };
        const fetchRepo = new Repository();
        // tslint:disable-next-line:no-string-literal
        (fetchRepo as any).fetchMethod();
    });

    it("Should be disposed", () => {
        using(new Repository(), (r) => {
            expect(r).to.be.instanceof(Repository);
        });
    });

    describe("fetch", () => {
        it("Should await readyState by default", (done: MochaDone) => {
            repository.awaitReadyState = async () => { done(); };
            repository.fetch("");
        });

        it("Should be able to skip awaiting readyState", (done: MochaDone) => {
            repository.awaitReadyState = async () => { done("Shouldn't be called"); };
            // tslint:disable-next-line:no-string-literal
            repository["fetchMethod"] = (async () => { done(); }) as any;
            repository.fetch("", undefined, false);
        });
    });

    describe("Content operations", () => {
        describe("#load()", () => {

            it("should resolve with an OData response", async () => {
                (mockResponse as any).ok = true;
                mockResponse.json = async () => {
                    return {
                        d: ConstantContent.PORTAL_ROOT,
                    } as IODataResponse<IContent>;
                };
                const resp = await repository.load({
                    idOrPath: 1,
                });
                expect(resp.d).to.be.deep.eq(ConstantContent.PORTAL_ROOT);
            });

            it("should throw on unsuccessfull request", (done: MochaDone) => {
                (mockResponse as any).ok = false;
                repository.load({
                    idOrPath: 1,
                }).then(() => {
                    done("Should throw");
                }).catch(() => {
                    done();
                });
            });

        });

        describe("#loadCollection()", () => {
            it("should resolve with a proper collection response", async () => {
                (mockResponse as any).ok = true;
                mockResponse.json = async () => {
                    return {
                        d: {
                            __count: 1,
                            results: [
                                ConstantContent.PORTAL_ROOT,
                            ],
                        },

                    } as IODataCollectionResponse<IContent>;
                };
                const resp = await repository.loadCollection({
                    path: "Root/Sites/Default_Site",
                });
                expect(resp.d.results[0]).to.be.deep.eq(ConstantContent.PORTAL_ROOT);
            });

            it("should throw on unsuccessfull request", (done: MochaDone) => {
                (mockResponse as any).ok = false;
                repository.loadCollection({
                    path: "Root/Sites/Default_Site",
                }).then(() => {
                    done("Should throw");
                }).catch(() => {
                    done();
                });
            });
        });

        describe("#post()", () => {
            it("should return with a promise", async () => {
                (mockResponse as any).ok = true;
                mockResponse.json = async () => {
                    return {
                        d: ConstantContent.PORTAL_ROOT,
                    } as IODataResponse<IContent>;
                };
                const response = await repository.post({
                    parentPath: "Root/Sites/Default_Site",
                    content: ConstantContent.PORTAL_ROOT,
                    contentType: "Task",
                });

                expect(response.d).to.be.deep.eq(ConstantContent.PORTAL_ROOT);
            });

            it("should throw on unsuccessfull request", (done: MochaDone) => {
                (mockResponse as any).ok = false;
                repository.post({
                    parentPath: "Root/Sites/Default_Site",
                    content: ConstantContent.PORTAL_ROOT,
                    contentType: "Task",
                }).then(() => {
                    done("Should throw");
                }).catch(() => {
                    done();
                });
            });
        });

        describe("#patch()", () => {
            it("should return with a promise", async () => {
                (mockResponse as any).ok = true;
                mockResponse.json = async () => {
                    return {
                        d: ConstantContent.PORTAL_ROOT,
                    } as IODataResponse<IContent>;
                };
                const response = await repository.patch({
                    idOrPath: "Root/Sites/Default_Site",
                    content: ConstantContent.PORTAL_ROOT,
                });

                expect(response.d).to.be.deep.eq(ConstantContent.PORTAL_ROOT);
            });

            it("should throw on unsuccessfull request", (done: MochaDone) => {
                (mockResponse as any).ok = false;
                repository.patch({
                    idOrPath: "Root/Sites/Default_Site",
                    content: ConstantContent.PORTAL_ROOT,
                }).then(() => {
                    done("Should throw");
                }).catch(() => {
                    done();
                });
            });
        });

        describe("#put()", () => {
            it("should return with a promise", async () => {
                (mockResponse as any).ok = true;
                mockResponse.json = async () => {
                    return {
                        d: ConstantContent.PORTAL_ROOT,
                    } as IODataResponse<IContent>;
                };
                const response = await repository.put({
                    idOrPath: "Root/Sites/Default_Site",
                    content: ConstantContent.PORTAL_ROOT,
                });

                expect(response.d).to.be.deep.eq(ConstantContent.PORTAL_ROOT);
            });

            it("should throw on unsuccessfull request", (done: MochaDone) => {
                (mockResponse as any).ok = false;
                repository.put({
                    idOrPath: "Root/Sites/Default_Site",
                    content: ConstantContent.PORTAL_ROOT,
                }).then(() => {
                    done("Should throw");
                }).catch(() => {
                    done();
                });
            });
        });

        describe("#delete", () => {
            it("should resolve on success", async () => {
                (mockResponse as any).ok = true;
                mockResponse.json = async () => {
                    return {
                        d: {
                            __count: 1,
                            results: [
                                ConstantContent.PORTAL_ROOT,
                            ],
                        },
                    } as IODataCollectionResponse<IContent>;
                };
                const response = await repository.delete({
                    idOrPath: 5,
                    permanent: true,
                });

                expect(response.d.results[0]).to.be.deep.eq(ConstantContent.PORTAL_ROOT);
            });

            it("should resolve with muliple content", async () => {
                (mockResponse as any).ok = true;
                mockResponse.json = async () => {
                    return {
                        d: {
                            __count: 1,
                            results: [
                                ConstantContent.PORTAL_ROOT,
                            ],
                        },
                    } as IODataCollectionResponse<IContent>;
                };
                const response = await repository.delete({
                    idOrPath: [5, "Root/Examples/ExampleDoc1"],
                    permanent: true,
                });

                expect(response.d.results[0]).to.be.deep.eq(ConstantContent.PORTAL_ROOT);
            });

        });

        describe("#move()", () => {
            it("should resolve on success", async () => {
                (mockResponse as any).ok = true;
                mockResponse.json = async () => {
                    return {
                        d: {
                            __count: 1,
                            results: [
                                ConstantContent.PORTAL_ROOT,
                            ],
                        },
                    } as IODataCollectionResponse<IContent>;
                };
                const response = await repository.move({
                    idOrPath: 5,
                    targetPath: "Root/Example/Folder",
                });

                expect(response.d.results[0]).to.be.deep.eq(ConstantContent.PORTAL_ROOT);
            });
        });

        describe("#copy()", () => {
            it("should resolve on success", async () => {
                (mockResponse as any).ok = true;
                mockResponse.json = async () => {
                    return {
                        d: {
                            __count: 1,
                            results: [
                                ConstantContent.PORTAL_ROOT,
                            ],
                        },
                    } as IODataCollectionResponse<IContent>;
                };
                const response = await repository.copy({
                    idOrPath: 5,
                    targetPath: "Root/Example/Folder",
                });

                expect(response.d.results[0]).to.be.deep.eq(ConstantContent.PORTAL_ROOT);
            });
        });

        describe("#getActions()", () => {
            it("should resolve on success", async () => {
                (mockResponse as any).ok = true;
                mockResponse.json = async () => {
                    return {
                        d: [
                            { Name: "MockAction" },
                        ],
                    } as { d: IActionModel[] };
                };
                const response = await repository.getActions({
                    idOrPath: "Root/Sites/Default_Site",
                });
                expect(response.d).to.be.deep.eq([{ Name: "MockAction" }]);
            });

            it("should resolve on success with scenario", async () => {
                (mockResponse as any).ok = true;
                mockResponse.json = async () => {
                    return {
                        d: [
                            { Name: "MockAction" },
                        ],
                    } as { d: IActionModel[] };
                };
                const response = await repository.getActions({
                    idOrPath: "Root/Sites/Default_Site",
                    scenario: "example",
                });
                expect(response.d).to.be.deep.eq([{ Name: "MockAction" }]);
            });

            it("should throw on unsuccessfull request", (done: MochaDone) => {
                (mockResponse as any).ok = false;
                (mockResponse as any).statusText = ":(";
                repository.getActions({
                    idOrPath: "Root/Sites/Default_Site",
                }).then(() => {
                    done("Should throw");
                }).catch((err) => {
                    expect(err.message).to.be.eq(":(");
                    done();
                });
            });
        });

        describe("#executeAction()", () => {
            it("should resolve on success", async () => {
                (mockResponse as any).ok = true;
                mockResponse.json = async () => {
                    return {
                        d: ConstantContent.PORTAL_ROOT,
                    } as IODataResponse<IContent>;
                };
                const response = await repository.executeAction<{}, IODataResponse<IContent>>({
                    name: "MockAction",
                    idOrPath: "Root/Sites/Default_Site",
                    method: "GET",
                    body: {},
                });
                expect(response.d).to.be.deep.eq(ConstantContent.PORTAL_ROOT);
            });

            it("should throw on unsuccessfull request", (done: MochaDone) => {
                (mockResponse as any).ok = false;
                repository.executeAction<{}, IODataResponse<IContent>>({
                    name: "MockAction",
                    idOrPath: "Root/Sites/Default_Site",
                    method: "GET",
                    body: {},
                }).then(() => {
                    done("Should throw");
                }).catch(() => {
                    done();
                });
            });
        });
    });

    // tslint:disable
    /**
     * If there is an API change and these cases breaks, please update them in the **readme.md** as well.
     */
    describe("Readme examples", () => {

        beforeEach(() => {
            (mockResponse as any).ok = true;
        })

        it("Creating a new Repository", () => {
            repository = new Repository({
                repositoryUrl: "https://my-sensenet-site.com",
                oDataToken: "OData.svc",
                sessionLifetime: "expiration",
                defaultSelect: ["DisplayName", "Icon"],
                requiredSelect: ["Id", "Type", "Path", "Name"],
                defaultMetadata: "no",
                defaultInlineCount: "allpages",
                defaultExpand: [],
                defaultTop: 1000,
            });
        });

        it("Load", async () => {
            const user = await repository.load<User>({
                idOrPath: "/Root/IMS/BuiltIn/Portal/Visitor", // you can also load by content Id
                oDataOptions: {
                    expand: ["CreatedBy"],
                    select: "all",
                },
            });
            console.log(user);    // {d: { /*(...retrieved user data)*/ }}
        });

        it("Load collection", async () => {
            const portalUsers = await repository.loadCollection<User>({
                path: "/Root/IMS/BuiltIn/Portal",
                oDataOptions: {
                    query: "TypeIs:User",
                    orderby: ["LoginName"],
                },
            });
            console.log("Count: ", portalUsers.d.__count);
            console.log("Users: ", portalUsers.d.results);
        });

        it("POST/PATCH/PUT", async () => {
            const createdUser = await repository.post<User>({
                parentPath: "Root/Parent",
                contentType: "User",
                content: {
                    Name: "NewContent",
                    /** ...additional content data */
                },
            });
            console.log(createdUser);    // {d: { /*(...created user data)*/ }}

            // you can use PUT in the similar way
            const lockedUser = await repository.patch<User>({
                idOrPath: "Root/Path/To/User",
                content: {
                    Locked: true,
                },
            });
            console.log(lockedUser);    // {d: { /*(...locked user data)*/ }}

        });

        it("Batch operations", async () => {
            // you can use move in the similar way
            const copyResult = await repository.copy({
                idOrPath: [45, "Root/Path/To/Content"],
                targetPath: "Root/Target/Path",
            });
            console.log("Success: ", copyResult.d.results);
            console.log("Errors: ", copyResult.d.errors);

            const deleteResult = await repository.delete({
                idOrPath: "Root/Path/To/Content/To/Delete",
                permanent: true,
            });
            console.log("Success: ", deleteResult.d.results);
            console.log("Errors: ", deleteResult.d.errors);
        });

        it("Custom action", async () => {
            interface ICustomActionBodyType { Name: string; Value: string; }
            interface ICustomActionReturnType { Result: any; }

            const actionResult = await repository.executeAction<ICustomActionBodyType, ICustomActionReturnType>({
                idOrPath: "Path/to/content",
                method: "POST",
                name: "MyOdataCustomAction",
                body: {
                    Name: "foo",
                    Value: "Bar",
                },
            });
            console.log(actionResult.Result);
        });

        // tslint:enable
    });

    describe("#reloadSchema", () => {
        it("Should execute the proper custom action", (done) => {
            repository.executeAction = async (options: IActionOptions<any, any>) => {
                expect(options.name).to.be.eq("GetSchema");
                expect(options.idOrPath).to.be.eq("Root");
                expect(options.method).to.be.eq("GET");
                done();
                return {} as any;
            };
            repository.reloadSchema();
        });
    });

});
