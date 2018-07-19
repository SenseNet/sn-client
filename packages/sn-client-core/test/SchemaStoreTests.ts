import { Schema, SchemaStore as DefaultSchemaStore, User } from "@sensenet/default-content-types";
import { expect } from "chai";
import { SchemaStore } from "../src/Schemas/SchemaStore";

/**
 * Unit tests for SchemaStore
 */
export const schemaStoreTests: Mocha.Suite = describe("SchemaStore", () => {
    it("Should be constructed", () => {
        expect(new SchemaStore()).to.be.instanceof(SchemaStore);
    });

    it("Schemas can be set", () => {
        const store = new SchemaStore();
        const newSchemaArray: Schema[] = [];
        store.setSchemas(newSchemaArray);
        // tslint:disable-next-line:no-string-literal
        expect(store["schemas"]).to.be.eq(newSchemaArray);
    });

    it("Schemas can be retrieved by Content Type", () => {
        const store = new SchemaStore();
        store.setSchemas(DefaultSchemaStore);
        const schema = store.getSchema(User);
        // tslint:disable-next-line:no-string-literal
        expect(schema.ContentTypeName).to.be.eq("User");
    });

    it("Schemas can be retrieved by name", () => {
        const store = new SchemaStore();
        store.setSchemas(DefaultSchemaStore);
        const schema = store.getSchemaByName("User");
        // tslint:disable-next-line:no-string-literal
        expect(schema.ContentTypeName).to.be.eq("User");
    });

    it("Schemas can be retrieved by name from cache", () => {
        const store = new SchemaStore();
        store.setSchemas(DefaultSchemaStore);
        const schema = store.getSchemaByName("User");
        const schema2 = store.getSchemaByName("GenericContent");
        expect(schema.ContentTypeName).to.be.eq("User");
        expect(schema2.ContentTypeName).to.be.eq("GenericContent");
    });

    it("Should fall back to GenericContent Schema if not found", () => {
        const store = new SchemaStore();
        store.setSchemas(DefaultSchemaStore);
        const schema = store.getSchemaByName("NotFound");
        expect(schema.ContentTypeName).to.be.eq("GenericContent");
    });

    it("Should be able to merge field settings", () => {
        // tslint:disable-next-line:no-string-literal
        const mergeAction = new SchemaStore()["mergeFieldSettings"];

        const result = mergeAction([
            { Name: "Field", Type: "Example", FieldClassName: "ExampleOverriddenValue" },
            { Name: "Field2", Type: "Example", FieldClassName: "Example" },
        ],
            [
                { Name: "Field", Type: "Example", FieldClassName: "Example" },
                { Name: "ParentField", Type: "Example", FieldClassName: "Example" },
            ]);
        expect(result).to.be.deep.eq([
            { Name: "Field", Type: "Example", FieldClassName: "ExampleOverriddenValue" },
            { Name: "Field2", Type: "Example", FieldClassName: "Example" },
            { Name: "ParentField", Type: "Example", FieldClassName: "Example" }]);
    });
});
