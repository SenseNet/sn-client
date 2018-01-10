import * as Chai from "chai";

import { PathHelper } from "../src";
const expect = Chai.expect;

/**
 * Path Helper tests
 */
export const pathHelperTests = describe("PathHelper", () => {
    describe("#isItemPath()", () => {
        it("should return true for item paths", () => {
            const isAnItem = PathHelper.isItemPath("/workspace('project')");
            expect(isAnItem).to.be.eq(true);
        });

        it("should return false for collection paths", () => {
            const isNotAnItem = PathHelper.isItemPath("/workspace/project");
            expect(isNotAnItem).to.be.eq(false);
        });
    });

    describe("#getContentUrlbyId()", () => {
        it("should create the path with the correct format", () => {
            const contentUrl = PathHelper.getContentUrlbyId(1);
            expect(contentUrl).to.be.eq("/content(1)");
        });
    });

    describe("#getContentUrlByPath()", () => {
        it("should return a proper item path by the given path", () => {
            const contentUrl = PathHelper.getContentUrlByPath("/workspace/project");
            expect(contentUrl).to.be.eq("/workspace('project')");
        });

        it("should return the path itself if it is an item path already", () => {
            const contentUrl = PathHelper.getContentUrlByPath("/workspace('project')");
            expect(contentUrl).to.be.eq("/workspace('project')");
        });

        it("should return an error message if the given argument is an empty string", () => {
            expect(() => {PathHelper.getContentUrlByPath(""); })
            .to.throws();
        });

        it("should return a proper item path for Root only", () => {
            const path = PathHelper.getContentUrlByPath("/Root");
            expect(path).to.be.eq("/('Root')");
        });
    });

    describe("#joinPaths()", () => {
        it("should join with slashes", () => {
            const joined = PathHelper.joinPaths("path1", "path2", "path3");
            expect(joined).to.be.eq("path1/path2/path3");
        });

        it("should remove slashes from the beginning of the segments", () => {
            const joined = PathHelper.joinPaths("path1", "path2/", "path3/");
            expect(joined).to.be.eq("path1/path2/path3");
        });

        it("should remove slashes from the end of the segments", () => {
            const joined = PathHelper.joinPaths("/path1", "/path2", "path3/");
            expect(joined).to.be.eq("path1/path2/path3");
        });
    });

    describe("#isAncestorOf()", () => {
        it("should return true if content is ancestor", () => {
            expect(PathHelper.isAncestorOf("Root/Example", "Root/Example/Content1")).to.be.eq(true);
        });

        it("should return true if content is ancestor and ends with a slash", () => {
            expect(PathHelper.isAncestorOf("Root/Example/", "Root/Example/Content1")).to.be.eq(true);
        });

        it("should return false if content is not an ancestor", () => {
            expect(PathHelper.isAncestorOf("Root/Example/", "Root/Example2/Content1")).to.be.eq(false);
        });
    });

});
