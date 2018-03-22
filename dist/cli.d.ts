/// <reference types="node" />
import Process = NodeJS.Process;
/**
 * The command line interface.
 * Allows to execute command lines on the system.
 */
export declare class Cli {
    private readonly process;
    /**
     * @param {NodeJS.Process} process The main process
     */
    private constructor();
    /**
     * @param {NodeJS.Process} process The main process
     * @return {Cli} A new command line interface
     */
    static of(process: Process): Cli;
    /**
     * Executes the provided command line on the system
     * @param {string} commandLine The command line to execute
     * @return {Promise<void>} A resolved promise in case of success, rejected in case of failure
     */
    execute(commandLine: string): Promise<void>;
}
