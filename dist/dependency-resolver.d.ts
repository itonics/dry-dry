import { Cli } from './cli';
import { DryDependencies } from './dry-dependencies';
/**
 * Resolves dry dependencies
 */
export declare class DependencyResolver {
    private readonly cli;
    /**
     * @param {Cli} cli The cli to use
     */
    constructor(cli: Cli);
    /**
     * Resolves provided dry dependencies by fetching them if necessary.
     * The resolution success means that all requested depencies are available in the current work directory.
     * @param {DryDependencies} dependencies The dependencies to resolve
     * @return {Promise<void>} A resolved promise on success, rejected promise on failure.
     */
    resolve(dependencies: DryDependencies): Promise<void>;
    resolveRaw(args: string[]): Promise<void>;
}
