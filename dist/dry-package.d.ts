import { DependencyResolver } from './dependency-resolver';
import { DryPackageContent } from './dry-package-content';
import { NpmPackage } from './npm-package';
export declare type WeakDryPackageContent = DryPackageContent & any;
/**
 * The dry package (i.e. package-dry.json) is the pendant of the npm package (i.e. package.json).
 * A dry package is an npm package added of a DryPackageDescriptor.
 */
export declare class DryPackage {
    private readonly dependencyResolver;
    private readonly location;
    private _content;
    private static readonly PACKAGE_DRY_JSON;
    private constructor();
    static readFromDisk(dependencyResolver: DependencyResolver): DryPackage;
    applyDiff(oldContent: WeakDryPackageContent, newContent: WeakDryPackageContent): void;
    exists(): boolean;
    /**
     * Builds a NpmPackage
     * @return {Promise<NpmPackage>} The NpmPackage
     */
    buildNpmPackage(): Promise<NpmPackage>;
    /**
     * Merge DryPackage content into the current DryPackage content
     * @param {DryPackage} dryPackage The DryPackage content to append
     */
    private merge(dryPackage);
    /**
     * Recursive method.
     * Walks the DryPackage tree to build a full NpmPackage.
     *
     * @param {DryPackage} currentPackage The DryPackage to walk
     * @param {DryPackage[]} collectedPackages The walked DryPackages
     * @return {Promise<NpmPackage>} The full NpmPackage
     */
    private doBuildNpmPackage(currentPackage?, collectedPackages?);
    private loadFromFile(path);
    private getParent();
    readonly content: WeakDryPackageContent;
}
