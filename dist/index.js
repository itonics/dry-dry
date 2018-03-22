#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("./cli");
const dependency_resolver_1 = require("./dependency-resolver");
const dry_package_1 = require("./dry-package");
const npm_command_proxy_1 = require("./npm-command-proxy");
const cli = cli_1.Cli.of(process);
const npmCommandProxy = new npm_command_proxy_1.NpmCommandProxy(cli, process);
const dependencyResolver = new dependency_resolver_1.DependencyResolver(cli);
dry_package_1.DryPackage.readFromDisk(dependencyResolver)
    .buildNpmPackage()
    .then((npmPackage) => {
    npmPackage.beforeNpmRun();
    return npmCommandProxy.proxy().then(() => npmPackage.afterNpmRun());
})
    .then(() => process.exit(), () => process.exit(1));
//# sourceMappingURL=index.js.map