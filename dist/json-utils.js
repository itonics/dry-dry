"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * JSON utilities
 */
class JsonUtils {
    /**
     * Generates a JSON string using the NpmPackage JSON style.
     * @param obj
     * @return {string} Pretty stringifies JSON
     */
    static prettyStringify(obj) {
        return JSON.stringify(obj, null, 2) + '\n';
    }
}
exports.JsonUtils = JsonUtils;
//# sourceMappingURL=json-utils.js.map