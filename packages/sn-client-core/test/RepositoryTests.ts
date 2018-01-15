import {using} from "@sensenet/client-utils";
import { expect } from "chai";
import { Repository } from "../src";
import { IContent } from "../src/Models/IContent";
import { IODataCollectionResponse } from "../src/Models/IODataCollectionResponse";
import { IODataResponse } from "../src/Models/IODataResponse";
import { ConstantContent } from "../src/Repository/ConstantContent";

// tslint:disable:completed-docs
declare const global: any;
global.window = {};
export const repositoryTests = describe("Repository", () => {

    let repo: Repository;
    const mockResponse: Response = {
        ok: true,
        json: async () => ({}),
    } as Response;

    const fetchMock: Repository["fetchMethod"] = async (input: RequestInfo, init: RequestInit) => {
        return mockResponse;
    };

    beforeEach(() => {
        repo = new Repository(undefined, fetchMock);
    });

    afterEach(() => {
        repo.dispose();
    });

    it("Should be constructed", () => {
        expect(repo).to.be.instanceof(Repository);
    });

    it("Should be disposed", () => {
        using(new Repository(), (r) => {
            expect(r).to.be.instanceof(Repository);
        });
    });

    describe("fetch", () => {
        it("Should await readyState by default", (done: MochaDone) => {
            repo.awaitReadyState = async () => { done(); };
            repo.fetch("");
        });

        it("Should be able to skip awaiting readyState", (done: MochaDone) => {
            repo.awaitReadyState = async () => { done("Shouldn't be called"); };
            // tslint:disable-next-line:no-string-literal
            repo["fetchMethod"] = (async () => {done(); }) as any;
            repo.fetch("", undefined, false);
        });
    });

    describe("Content operations", () => {
        describe("#load()", () => {

            it("should resolve with an OData response", async () => {
                mockResponse.json = async () => {
                    return {
                        d: ConstantContent.PORTAL_ROOT,
                    } as IODataResponse<IContent>;
                };
                const resp = await repo.load({
                    idOrPath: 1,
                });
                expect(resp.d).to.be.deep.eq(ConstantContent.PORTAL_ROOT);
            });

            it("should throw on unsuccessfull request", (done: MochaDone) => {
                (mockResponse as any).ok = false;
                repo.load({
                    idOrPath: 1,
                }).then(() => {
                    done("Should throw");
                }).catch(() => {
                    done();
                });
            });

        });

        describe("#loadCollection()", () => {
            it("should return with a promise", () => {
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
                expect(repo.loadCollection({
                    path: "Root/Sites/Default_Site",
                })).to.be.instanceof(Promise);
            });

            it("should throw on unsuccessfull request", (done: MochaDone) => {
                (mockResponse as any).ok = false;
                repo.loadCollection({
                    path: "Root/Sites/Default_Site",
                }).then(() => {
                    done("Should throw");
                }).catch(() => {
                    done();
                });
            });
        });
    });

});
