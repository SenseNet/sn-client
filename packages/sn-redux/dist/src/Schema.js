"use strict";
const normalizr_1 = require('normalizr');
var Schemas;
(function (Schemas) {
    Schemas.content = new normalizr_1.Schema('collection', { idAttribute: 'Id' });
    Schemas.arrayOfContent = normalizr_1.arrayOf(Schemas.content);
})(Schemas = exports.Schemas || (exports.Schemas = {}));

//# sourceMappingURL=Schema.js.map
