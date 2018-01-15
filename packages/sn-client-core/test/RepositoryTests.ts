import {using} from "@sensenet/client-utils";
import { expect } from "chai";
import { Repository } from "../src";

// tslint:disable:completed-docs
declare const global: any;
global.window = {};
export const repositoryTests = describe("Repository", () => {

    let repo: Repository;

    beforeEach(() => {
        repo = new Repository();
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

});
