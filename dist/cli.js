"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const childProcess = require("child_process");
/**
 * The command line interface.
 * Allows to execute command lines on the system.
 */
class Cli {
    /**
     * @param {NodeJS.Process} process The main process
     */
    constructor(process) {
        this.process = process;
    }
    /**
     * @param {NodeJS.Process} process The main process
     * @return {Cli} A new command line interface
     */
    static of(process) {
        return new Cli(process);
    }
    /**
     * Executes the provided command line on the system
     * @param {string} commandLine The command line to execute
     * @return {Promise<void>} A resolved promise in case of success, rejected in case of failure
     */
    execute(commandLine) {
        return new Promise((resolve, reject) => {
            const child = childProcess.exec(commandLine, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
            child.stderr.pipe(this.process.stderr);
            child.stdout.pipe(this.process.stdout);
            this.process.stdin.pipe(child.stdin);
        });
    }
}
exports.Cli = Cli;
//# sourceMappingURL=cli.js.map