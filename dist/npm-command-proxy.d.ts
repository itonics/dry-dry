/// <reference types="node" />
import { Cli } from './cli';
import Process = NodeJS.Process;
/**
 * Responsible for the requested npm command propagation
 */
export declare class NpmCommandProxy {
    private readonly cli;
    private readonly rawArgs;
    /**
     * @param {Cli} cli The CLI to use
     * @param {NodeJS.Process} process The main process
     */
    constructor(cli: Cli, process: Process);
    /**
     * Propagate the command received by dry to npm
     * @return {Promise<void>} Resolved promise on success, rejected promise on failure.
     */
    proxy(): Promise<void>;
}
