import { DryPackage } from './dry-package';
/**
 * npm 'package.json' component
 */
export declare class NpmPackage {
    private readonly dryPackage;
    /**
     * @type {string} The location of this NpmPackage
     */
    private readonly location;
    /**
     * The content of this NpmPackage
     */
    private readonly content;
    /**
     * @param {DryPackage} dryPackage The DryPackage from which this NpmPackage originates
     */
    constructor(dryPackage: DryPackage);
    /**
     * Called before npm command proxy
     */
    beforeNpmRun(): void;
    /**
     * Called after npm command proxy
     */
    afterNpmRun(): void;
}
