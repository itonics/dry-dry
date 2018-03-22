"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Resolves dry dependencies
 */
class DependencyResolver {
    /**
     * @param {Cli} cli The cli to use
     */
    constructor(cli) {
        this.cli = cli;
    }
    /**
     * Resolves provided dry dependencies by fetching them if necessary.
     * The resolution success means that all requested depencies are available in the current work directory.
     * @param {DryDependencies} dependencies The dependencies to resolve
     * @return {Promise<void>} A resolved promise on success, rejected promise on failure.
     */
    resolve(dependencies) {
        const args = [];
        Object.keys(dependencies).forEach((dependencyName) => {
            const dependencyVersion = dependencies[dependencyName];
            console.info('dependencyVersion', dependencyVersion);
            if (dependencyVersion && dependencyVersion.indexOf(':') !== 1) {
                args.push(dependencyVersion);
            }
            else {
                let arg = dependencyName;
                if (dependencyVersion) {
                    arg += '@' + dependencyVersion;
                }
                args.push(arg);
            }
        });
        if (args.length === 0) {
            return Promise.resolve();
        }
        if (args.length > 0) {
            return this.cli.execute('npm install --no-save ' + args.join(' '));
        }
        else {
            return Promise.resolve(null);
        }
    }
    resolveRaw(args) {
        console.info('resolving', args);
        if (args.length > 0) {
            let commandLine = 'npm install --no-save ' + args.join(' ');
            return this.cli.execute(commandLine)
                .catch((error) => {
                throw error;
            });
        }
        else {
            return Promise.resolve(null);
        }
    }
}
exports.DependencyResolver = DependencyResolver;
//# sourceMappingURL=dependency-resolver.js.map