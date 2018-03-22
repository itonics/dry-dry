"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepDiff = require("deep-diff");
const merge = require("deepmerge");
const fs = require("fs");
const json_utils_1 = require("./json-utils");
const npm_package_1 = require("./npm-package");
/**
 * The dry package (i.e. package-dry.json) is the pendant of the npm package (i.e. package.json).
 * A dry package is an npm package added of a DryPackageDescriptor.
 */
class DryPackage {
    constructor(dependencyResolver, location, 
    // tslint:disable-next-line:variable-name
    _content) {
        this.dependencyResolver = dependencyResolver;
        this.location = location;
        this._content = _content;
    }
    static readFromDisk(dependencyResolver) {
        const location = './' + DryPackage.PACKAGE_DRY_JSON;
        let fileContent = '{}';
        try {
            fileContent = fs.readFileSync(location, 'utf8');
        }
        catch (e) {
            // TODO: Bad practice to silence exception
        }
        const baseDryPackage = JSON.parse(fileContent);
        return new DryPackage(dependencyResolver, location, baseDryPackage);
    }
    applyDiff(oldContent, newContent) {
        const diffs = deepDiff.diff(oldContent, newContent);
        if (!diffs) {
            return;
        }
        diffs.forEach((diff) => deepDiff.applyChange(this._content, this._content, diff));
        fs.writeFileSync(this.location, json_utils_1.JsonUtils.prettyStringify(this._content));
    }
    exists() {
        return fs.existsSync(this.location);
    }
    /**
     * Builds a NpmPackage
     * @return {Promise<NpmPackage>} The NpmPackage
     */
    buildNpmPackage() {
        return this.doBuildNpmPackage();
    }
    /**
     * Merge DryPackage content into the current DryPackage content
     * @param {DryPackage} dryPackage The DryPackage content to append
     */
    merge(dryPackage) {
        this._content = merge(this._content, dryPackage._content);
    }
    /**
     * Recursive method.
     * Walks the DryPackage tree to build a full NpmPackage.
     *
     * @param {DryPackage} currentPackage The DryPackage to walk
     * @param {DryPackage[]} collectedPackages The walked DryPackages
     * @return {Promise<NpmPackage>} The full NpmPackage
     */
    doBuildNpmPackage(currentPackage, collectedPackages) {
        currentPackage = currentPackage || this;
        collectedPackages = collectedPackages || [];
        collectedPackages.push(currentPackage);
        return currentPackage.getParent().then((parent) => {
            if (parent) {
                return this.doBuildNpmPackage(parent, collectedPackages);
            }
            else {
                const mergedPackage = collectedPackages.pop();
                while (collectedPackages.length > 0) {
                    mergedPackage.merge(collectedPackages.pop());
                }
                return new npm_package_1.NpmPackage(mergedPackage);
            }
        });
    }
    loadFromFile(path) {
        console.info('loading dry from path', path);
        try {
            let content = fs.readFileSync(path, 'utf8');
            return Promise.resolve(new DryPackage(this.dependencyResolver, path, JSON.parse(content)));
        }
        catch (e) {
            console.error('error', e);
            throw e;
        }
    }
    getParent() {
        const dry = this._content.dry;
        if (!dry) {
            return Promise.resolve(null);
        }
        if (!dry.extends) {
            return Promise.resolve(null);
        }
        // simply load a package-dry.json (most likely in the same repository)
        if (dry.extends.startsWith('file://')) {
            return this.loadFromFile(dry.extends.replace('file://', ''));
        }
        else {
            console.info('resolving the dry.extends', dry.extends);
            let packageName = '';
            if (dry.extends.startsWith('ssh://')) {
                // assume that the reponame is the packageName
                const matched = dry.extends.match('([\\w|\\-|_]+)\\.git');
                if (matched[1]) {
                    packageName = matched[1];
                }
                else {
                    throw new Error('couldn\'t extract packageName from:' + dry.extends);
                }
            }
            else {
                packageName = dry.extends.split('@')[0];
            }
            const packagePath = './node_modules/' + packageName;
            if (fs.existsSync(packagePath)) {
                console.info('using existing package', packagePath);
                return this.loadFromFile(packagePath + '/' + DryPackage.PACKAGE_DRY_JSON);
            }
            else {
                // TODO allow the extends syntax to have a file declared at the end
                return this.dependencyResolver.resolveRaw([dry.extends])
                    .then(() => {
                    return this.loadFromFile(packagePath + '/' + DryPackage.PACKAGE_DRY_JSON);
                });
            }
        }
    }
    get content() {
        return JSON.parse(JSON.stringify(this._content));
    }
}
DryPackage.PACKAGE_DRY_JSON = 'package-dry.json';
exports.DryPackage = DryPackage;
//# sourceMappingURL=dry-package.js.map