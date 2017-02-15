"use strict";
const normalizr_1 = require("normalizr");
var Schemas;
(function (Schemas) {
    Schemas.content = new normalizr_1.schema.Entity('collection', {}, { idAttribute: 'Id' });
    Schemas.arrayOfContent = new normalizr_1.schema.Array(Schemas.content);
})(Schemas = exports.Schemas || (exports.Schemas = {}));

//# sourceMappingURL=Schema.js.map
