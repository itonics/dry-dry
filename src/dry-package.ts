import * as deepDiff from 'deep-diff';
import * as merge from 'deepmerge';
import * as fs from 'fs';

import {DependencyResolver} from './dependency-resolver';
import {DryPackageContent} from './dry-package-content';
import {JsonUtils} from './json-utils';
import {NpmPackage} from './npm-package';
import {error} from 'util';

// TODO: consider adding a type to 'any'
// tslint:disable-next-line:no-any
export type WeakDryPackageContent = DryPackageContent & any;

/**
 * The dry package (i.e. package-dry.json) is the pendant of the npm package (i.e. package.json).
 * A dry package is an npm package added of a DryPackageDescriptor.
 */
export class DryPackage {
    private static readonly PACKAGE_DRY_JSON = 'package-dry.json';

    private constructor(private readonly dependencyResolver: DependencyResolver,
                        private readonly location: string,
                        // tslint:disable-next-line:variable-name
                        private _content: WeakDryPackageContent,) {
    }

    public static readFromDisk(dependencyResolver: DependencyResolver): DryPackage {
        const location = './' + DryPackage.PACKAGE_DRY_JSON;
        let fileContent = '{}';
        try {
            fileContent = fs.readFileSync(location, 'utf8');
        } catch (e) {
            // TODO: Bad practice to silence exception
        }
        const baseDryPackage = JSON.parse(fileContent);
        return new DryPackage(dependencyResolver, location, baseDryPackage);
    }

    public applyDiff(oldContent: WeakDryPackageContent, newContent: WeakDryPackageContent): void {
        const diffs = deepDiff.diff(oldContent, newContent);
        if (!diffs) {
            return;
        }
        diffs.forEach((diff) => deepDiff.applyChange(this._content, this._content, diff));
        fs.writeFileSync(this.location, JsonUtils.prettyStringify(this._content));
    }

    public exists(): boolean {
        return fs.existsSync(this.location);
    }

    /**
     * Builds a NpmPackage
     * @return {Promise<NpmPackage>} The NpmPackage
     */
    public buildNpmPackage(): Promise<NpmPackage> {
        return this.doBuildNpmPackage();
    }

    /**
     * Merge DryPackage content into the current DryPackage content
     * @param {DryPackage} dryPackage The DryPackage content to append
     */
    private merge(dryPackage: DryPackage): void {
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
    private doBuildNpmPackage(currentPackage?: DryPackage, collectedPackages?: DryPackage[]): Promise<NpmPackage> {
        currentPackage = currentPackage || this;
        collectedPackages = collectedPackages || [];

        collectedPackages.push(currentPackage);

        return currentPackage.getParent().then<NpmPackage>((parent) => {
            if (parent) {
                return this.doBuildNpmPackage(parent, collectedPackages);
            } else {
                const mergedPackage = collectedPackages.pop();
                while (collectedPackages.length > 0) {
                    mergedPackage.merge(collectedPackages.pop());
                }
                return new NpmPackage(mergedPackage);
            }
        });
    }

    private loadFromFile(path: string): Promise<DryPackage> {
        console.info('loading dry from path', path);
        try {
            let content = fs.readFileSync(path, 'utf8');

            return Promise.resolve(new DryPackage(this.dependencyResolver, path, JSON.parse(content)));
        } catch (e) {
            console.error('error', e);

            throw e;
        }
    }

    private getParent(): Promise<DryPackage> {
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
        } else {
            console.info('resolving the dry.extends', dry.extends);

            let packageName = '';
            if (dry.extends.startsWith('ssh://')) {
                // assume that the reponame is the packageName
                const matched = dry.extends.match('([\\w|\\-|_]+)\\.git');
                if (matched[1]) {
                    packageName = matched[1];
                } else {
                    throw new Error('couldn\'t extract packageName from:' + dry.extends);
                }
            } else {
                packageName = dry.extends.split('@')[0];
            }

            const packagePath = './node_modules/' + packageName;

            if (fs.existsSync(packagePath)) {
                console.info('using existing package', packagePath);

                return this.loadFromFile(packagePath + '/' + DryPackage.PACKAGE_DRY_JSON);
            } else {
                // TODO allow the extends syntax to have a file declared at the end
                return this.dependencyResolver.resolveRaw([dry.extends])
                    .then(() => {
                        return this.loadFromFile(packagePath + '/' + DryPackage.PACKAGE_DRY_JSON);
                    });
            }
        }
    }

    public get content(): WeakDryPackageContent {
        return JSON.parse(JSON.stringify(this._content));
    }
}
