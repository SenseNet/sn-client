import { Trace } from "@sensenet/client-utils";
import { expect } from "chai";
import { Repository } from "../src/Repository/Repository";
import { Upload } from "../src/Repository/Upload";

// tslint:disable:no-string-literal
// tslint:disable:completed-docs
// tslint:disable:max-classes-per-file

declare const global: any;

global.File = class {
    public size: number = 1024;
    public namme: string = "file.txt";
    public slice(...args: any[]) { return ""; }
};
global.FormData = class {
    public append(...args: any[]) { /** */ }
};

export const uploadTests = describe("Upload", () => {
    let repo: Repository;

    let mockAnswer: any;

    let mockText: string;

    let fetchOk: boolean = true;

    beforeEach(() => {
        mockAnswer = {
            Id: 4037,
            Length: 18431,
            Name: "LICENSE",
            Thumbnail_url: "/Root/Sites/Default_Site/Workspace/Document_Library/LICENSE",
            Type: "File",
            Url: "/Root/Sites/Default_Site/Workspace/Document_Library/LICENSE",
        };
        mockText = "";
        fetchOk = true;
        repo = new Repository({}, async (...args: any[]) => ({ ok: fetchOk, json: async () => (mockAnswer), text: async () => mockText } as any));
    });

    afterEach(() => {
        repo.dispose();
    });

    describe("#isChunkedUploadNeeded()", () => {
        it("should return true is the file is larger than the chunk size", () => {
            expect(Upload.isChunkedUploadNeeded({size: 1024} as any, {configuration: {chunkSize: 640}} as any)).to.be.eq(true);
        });

        it("should return false is the file is smaller than the chunk size", () => {
            expect(Upload.isChunkedUploadNeeded({size: 1024} as any, {configuration: {chunkSize: 2048}} as any)).to.be.eq(false);
        });
    });

    describe("#text()", () => {
        it("should resolve on upload", async () => {
            const answer = await Upload.textAsFile({
                binaryPropertyName: "Binary",
                overwrite: true,
                fileName: "alma.txt",
                parentPath: "Root/Example",
                text: "ExampleText",
                repository: repo,
                contentTypeName: "File",
            });
            expect(answer).to.be.deep.eq(mockAnswer);
        });

        it("should throw on upload failure", (done) => {
            fetchOk = false;
            Upload.textAsFile({
                binaryPropertyName: "Binary",
                overwrite: true,
                fileName: "alma.txt",
                parentPath: "Root/Example",
                text: "ExampleText",
                repository: repo,
                contentTypeName: "File",
            }).then(() => {
                done(Error("Should throw"));
            }).catch((err) => {
                done();
            });

        });
    });

    describe("#file()", () => {

        it("should resolve on upload chunked", async () => {
            fetchOk = true;
            const answer = await Upload.file({
                binaryPropertyName: "Binary",
                overwrite: true,
                parentPath: "Root/Example",
                file: {size: 65535000, slice: (...args: any[]) => ""} as any as File,
                repository: repo,
                contentTypeName: "File",
            });
            expect(answer).to.be.deep.eq(mockAnswer);
        });

        it("Should throw on error chunked", (done) => {
            fetchOk = false;
            Upload.file({
                binaryPropertyName: "Binary",
                overwrite: true,
                file: {size: 65535000, slice: (...args: any[]) => ""} as any as File,
                parentPath: "Root/Example",
                repository: repo,
                contentTypeName: "File",
            }).then(() => {
                done(Error("Should throw"));
            }).catch((err) => {done(); });
        });

        it("Should throw if a chunk has been failed", (done) => {
            let ok: boolean = true;
            repo["fetchMethod"] = async (...args: any[]) => {
                return {
                        ok,
                        text: async () => "",
                        json: async () => {ok = false; return {}; },
                    } as any;
            };
            Upload.file({
                binaryPropertyName: "Binary",
                overwrite: true,
                file: {size: 65535000, slice: (...args: any[]) => ""} as any as File,
                parentPath: "Root/Example",
                repository: repo,
                contentTypeName: "File",
            }).then(() => {
                done(Error("Should throw"));
            }).catch((err) => {
                done();
            });
        });

    });

    describe("#fromDropEvent()", () => {

        it("should trigger an Upload request without webkitRequestFileSystem", (done: MochaDone) => {
            (global as any).window.webkitRequestFileSystem = undefined;
            const file = new File(["alma.txt"], "alma");
            Object.assign(file, { type: "file" });
            const uploadTrace = Trace.method({
                object: Upload,
                method: Upload.file,
                onCalled: (c) => {
                    uploadTrace.dispose();
                    done();
                },
            });
            Upload.fromDropEvent({
                event: {
                    dataTransfer: {
                        files: [ file, {} ],
                    },
                } as any,
                parentPath: "Root/Example",
                createFolders: true,
                repository: repo,
                binaryPropertyName: "Binary",
                contentTypeName: "File",
                overwrite: true,
            });
        });

        it("should trigger an Upload request with webkitRequestFileSystem", (done: MochaDone) => {
            (global as any).window = { webkitRequestFileSystem: () => { /**/ } };
            const uploadTrace = Trace.method({
                object: Upload,
                method: Upload.file,
                onCalled: (c) => {
                    uploadTrace.dispose();
                    done();
                },
            });
            const file = {
                isFile: true,
                file: (cb: (f: File) => void) => { cb(new File(["alma.txt"], "alma")); },
            };
            Upload.fromDropEvent({
                event: {
                    dataTransfer: {
                        items: [
                            { webkitGetAsEntry: () => file },
                        ],
                    },
                } as any,
                parentPath: "Root/Example",
                createFolders: true,
                repository: repo,
                binaryPropertyName: "Binary",
                contentTypeName: "File",
                overwrite: true,
            });
        });

        it("should fail with webkitRequestFileSystem if failed to read a file", (done: MochaDone) => {
            (global as any).window = { webkitRequestFileSystem: () => { /**/ } };
            const file = {
                isFile: true,
                file: (cb: (f: File) => void, err: (err: any) => void) => { err("File read fails here..."); },
            };
            Upload.fromDropEvent({
                event: {
                    dataTransfer: {
                        items: [
                            { webkitGetAsEntry: () => file },
                        ],
                    },
                } as any,
                parentPath: "Root/Example",
                createFolders: true,
                repository: repo,
                binaryPropertyName: "Binary",
                contentTypeName: "File",
                overwrite: true,
            }).catch((err) => {done(); });
        });

        it("should trigger a post when the dataTransfer contains folders", (done: MochaDone) => {
            (global as any).window = { webkitRequestFileSystem: () => { /**/ } };

            repo["fetchMethod"] = async () => ({
                ok: true,
                json: async () => ({d: {Path: "Root/Example" }}),
            }as any);

            let postHasCalled = false;
            const uploadTrace = Trace.method({
                object: repo,
                method: repo.post,
                onCalled: (c) => {
                    uploadTrace.dispose();
                    postHasCalled = true;
                },
            });
            const directory = {
                isFile: false,
                isDirectory: true,
                createReader: () => {
                    return {
                        readEntries: (cb: (entries: any) => void, err: (err: any) => void) => {
                            cb([
                                {
                                    isFile: true,
                                    isDirectory: false,
                                    name: "ExampleDirectory",
                                    file: (callback: (f: File) => void) => { callback(new File(["alma.txt"], "alma")); },
                                },
                            ]);
                        },
                    };
                },
            };
            Upload.fromDropEvent({
                event: {
                    dataTransfer: {
                        items: [
                            { webkitGetAsEntry: () => directory },
                        ],
                    },
                } as any,
                parentPath: "Root/Example",
                createFolders: true,
                repository: repo,
                binaryPropertyName: "Binary",
                contentTypeName: "File",
                overwrite: true,
            }).then(() => {
                expect(postHasCalled).to.be.eq(true);
                done();
            }).catch((err) => {
                done(err);
            });
        });

        it("should fail if there is an error reading folders", (done: MochaDone) => {
            (global as any).window = { webkitRequestFileSystem: () => { /**/ } };

            const directory = {
                isFile: false,
                isDirectory: true,
                createReader: () => {
                    return {
                        readEntries: (cb: (entries: any) => void, err: (err: any) => void) => {
                            err("Reading directories fails here...");
                        },
                    };
                },
            };
            Upload.fromDropEvent({
                event: {
                    dataTransfer: {
                        items: [
                            { webkitGetAsEntry: () => directory },
                        ],
                    },
                } as any,
                parentPath: "Root/Example",
                createFolders: true,
                repository: repo,
                binaryPropertyName: "Binary",
                contentTypeName: "File",
                overwrite: true,
            }).then(() => {
                done(Error("Should have failed"));
            }).catch((err) => {
                done();
            });
        });
    });

});
