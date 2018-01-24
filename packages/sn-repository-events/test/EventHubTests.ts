import { Repository } from "@sensenet/client-core";
import { ChoiceFieldSetting, FieldSetting, FieldVisibility, ShortTextFieldSetting, Task, User } from "@sensenet/default-content-types";
import { expect } from "chai";
import { EventHub } from "../src";

/**
 * Unit tests for the Repository Event Hub
 */
export const eventHubTests = describe("EventHub", () => {
    let repository: Repository;
    let eventHub: EventHub;

    beforeEach(() => {
        repository = new Repository({}, async () => ({ok: true } as any));
        eventHub = new EventHub(repository);
    });

    it("should be constructed", () => {
        expect(eventHub).to.be.instanceOf(EventHub);
    });

    it("should be disposed", () => {
        eventHub.dispose();
    });

    it("moooook", () => {
        // tslint:disable
        class Alma {
            public a = () => console.log("original a called");
        }
        const alma = new Alma();
        alma.a();   // original called
        alma.a = () => console.log("kettő");
        expect(alma.a).to.be.not.eq(new Alma().a);
    });
});
