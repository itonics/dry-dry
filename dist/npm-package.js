"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const json_utils_1 = require("./json-utils");
/**
 * npm 'package.json' component
 */
class NpmPackage {
    /**
     * @param {DryPackage} dryPackage The DryPackage from which this NpmPackage originates
     */
    constructor(dryPackage) {
        this.dryPackage = dryPackage;
        /**
         * @type {string} The location of this NpmPackage
         */
        this.location = './package.json';
        this.content = this.dryPackage.content;
        // tslint:disable-next-line:no-string-literal
        delete this.content['dry'];
    }
    /**
     * Called before npm command proxy
     */
    beforeNpmRun() {
        if (!this.dryPackage.exists()) {
            return;
        }
        try {
            fs.unlinkSync(this.location);
        }
        catch (e) {
            // TODO
            console.error(e);
        }
        let json = json_utils_1.JsonUtils.prettyStringify(this.content);
        console.info('json', json);
        fs.writeFileSync(this.location, json);
    }
    /**
     * Called after npm command proxy
     */
    afterNpmRun() {
        let fileContent = '{}';
        try {
            fileContent = fs.readFileSync(this.location, 'utf8');
        }
        catch (e) {
            // TODO
            console.error(e);
        }
        this.dryPackage.applyDiff(this.content, JSON.parse(fileContent));
        // try {
        //     fs.unlinkSync(this.location);
        // } catch (e) {
        //     // TODO
        //     console.error(e);
        // }
    }
}
exports.NpmPackage = NpmPackage;
//# sourceMappingURL=npm-package.js.map