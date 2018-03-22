"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Responsible for the requested npm command propagation
 */
class NpmCommandProxy {
    /**
     * @param {Cli} cli The CLI to use
     * @param {NodeJS.Process} process The main process
     */
    constructor(cli, process) {
        this.cli = cli;
        this.rawArgs = process.argv.slice(2);
    }
    /**
     * Propagate the command received by dry to npm
     * @return {Promise<void>} Resolved promise on success, rejected promise on failure.
     */
    proxy() {
        return this.cli.execute(`npm ${this.rawArgs.join(' ')}`);
    }
}
exports.NpmCommandProxy = NpmCommandProxy;
//# sourceMappingURL=npm-command-proxy.js.map