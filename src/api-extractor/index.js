/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("angular/packages/bazel/src/api-extractor/index", ["require", "exports", "tslib", "@bazel/concatjs", "@bazel/concatjs", "@microsoft/api-extractor", "fs", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runMain = void 0;
    const tslib_1 = require("tslib");
    /// <reference types="node"/>
    /// <reference lib="es2017"/>
    const concatjs_1 = require("@bazel/concatjs");
    const concatjs_2 = require("@bazel/concatjs");
    const api_extractor_1 = require("@microsoft/api-extractor");
    const fs = (0, tslib_1.__importStar)(require("fs"));
    const path = (0, tslib_1.__importStar)(require("path"));
    const DEBUG = false;
    function runMain(tsConfig, entryPointExecPath, dtsBundleOut, apiReviewFolder, acceptApiUpdates = false) {
        const [parsedConfig, errors] = (0, concatjs_2.parseTsconfig)(tsConfig);
        if (errors && errors.length) {
            console.error((0, concatjs_1.format)('', errors));
            return 1;
        }
        const pkgJson = path.resolve(path.dirname(entryPointExecPath), 'package.json');
        if (!fs.existsSync(pkgJson)) {
            fs.writeFileSync(pkgJson, JSON.stringify({
                'name': 'GENERATED-BY-BAZEL',
                'version': '0.0.0',
                'description': 'This is a dummy package.json as API Extractor always requires one.',
            }));
        }
        // API extractor doesn't always support the version of TypeScript used in the repo
        // example: at the moment it is not compatable with 3.2
        // to use the internal TypeScript we shall not create a program but rather pass a parsed tsConfig.
        const parsedTsConfig = parsedConfig.config;
        const compilerOptions = parsedTsConfig.compilerOptions;
        for (const [key, values] of Object.entries(compilerOptions.paths)) {
            if (key === '*') {
                continue;
            }
            // we shall not pass ts files as this will need to be parsed, and for example rxjs,
            // cannot be compiled with our tsconfig, as ours is more strict
            // hence amend the paths to point always to the '.d.ts' files.
            compilerOptions.paths[key] = values.map(path => {
                const pathSuffix = /(\*|index)$/.test(path) ? '.d.ts' : '/index.d.ts';
                return path + pathSuffix;
            });
        }
        const extractorOptions = {
            localBuild: acceptApiUpdates,
        };
        const configObject = {
            compiler: {
                overrideTsconfig: parsedTsConfig,
            },
            projectFolder: path.resolve(path.dirname(tsConfig)),
            mainEntryPointFilePath: path.resolve(entryPointExecPath),
            apiReport: {
                enabled: !!apiReviewFolder,
                // TODO(alan-agius4): remove this folder name when the below issue is solved upstream
                // See: https://github.com/microsoft/web-build-tools/issues/1470
                reportFileName: apiReviewFolder && path.resolve(apiReviewFolder) || 'invalid',
            },
            docModel: {
                enabled: false,
            },
            dtsRollup: {
                enabled: true,
                untrimmedFilePath: path.resolve(dtsBundleOut),
            },
            tsdocMetadata: {
                enabled: false,
            }
        };
        const options = {
            configObject,
            packageJson: undefined,
            packageJsonFullPath: pkgJson,
            configObjectFullPath: undefined,
        };
        const extractorConfig = api_extractor_1.ExtractorConfig.prepare(options);
        const { succeeded } = api_extractor_1.Extractor.invoke(extractorConfig, extractorOptions);
        // API extractor errors are emitted by it's logger.
        return succeeded ? 0 : 1;
    }
    exports.runMain = runMain;
    // Entry point
    if (require.main === module) {
        if (DEBUG) {
            console.error(`
api-extractor: running with
  cwd: ${process.cwd()}
  argv:
    ${process.argv.join('\n    ')}
  `);
        }
        const [tsConfig, entryPointExecPath, outputExecPath] = process.argv.slice(2);
        process.exitCode = runMain(tsConfig, entryPointExecPath, outputExecPath);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iYXplbC9zcmMvYXBpLWV4dHJhY3Rvci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBRUgsNkJBQTZCO0lBQzdCLDZCQUE2QjtJQUU3Qiw4Q0FBdUM7SUFDdkMsOENBQThDO0lBQzlDLDREQUEwSTtJQUMxSSxvREFBeUI7SUFDekIsd0RBQTZCO0lBRTdCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQztJQUVwQixTQUFnQixPQUFPLENBQ25CLFFBQWdCLEVBQUUsa0JBQTBCLEVBQUUsWUFBb0IsRUFBRSxlQUF3QixFQUM1RixnQkFBZ0IsR0FBRyxLQUFLO1FBQzFCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLEdBQUcsSUFBQSx3QkFBYSxFQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFBLGlCQUFNLEVBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFbEMsT0FBTyxDQUFDLENBQUM7U0FDVjtRQUVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQy9FLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzNCLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ3ZDLE1BQU0sRUFBRSxvQkFBb0I7Z0JBQzVCLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixhQUFhLEVBQUUsb0VBQW9FO2FBQ3BGLENBQUMsQ0FBQyxDQUFDO1NBQ0w7UUFFRCxrRkFBa0Y7UUFDbEYsdURBQXVEO1FBQ3ZELGtHQUFrRztRQUNsRyxNQUFNLGNBQWMsR0FBRyxZQUFhLENBQUMsTUFBYSxDQUFDO1FBQ25ELE1BQU0sZUFBZSxHQUFHLGNBQWMsQ0FBQyxlQUFlLENBQUM7UUFDdkQsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQVcsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzNFLElBQUksR0FBRyxLQUFLLEdBQUcsRUFBRTtnQkFDZixTQUFTO2FBQ1Y7WUFFRCxtRkFBbUY7WUFDbkYsK0RBQStEO1lBQy9ELDhEQUE4RDtZQUM5RCxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzdDLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO2dCQUV0RSxPQUFPLElBQUksR0FBRyxVQUFVLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELE1BQU0sZ0JBQWdCLEdBQTRCO1lBQ2hELFVBQVUsRUFBRSxnQkFBZ0I7U0FDN0IsQ0FBQztRQUVGLE1BQU0sWUFBWSxHQUFnQjtZQUNoQyxRQUFRLEVBQUU7Z0JBQ1IsZ0JBQWdCLEVBQUUsY0FBYzthQUNqQztZQUNELGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbkQsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztZQUN4RCxTQUFTLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLENBQUMsQ0FBQyxlQUFlO2dCQUMxQixxRkFBcUY7Z0JBQ3JGLGdFQUFnRTtnQkFDaEUsY0FBYyxFQUFFLGVBQWUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLFNBQVM7YUFDOUU7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLEtBQUs7YUFDZjtZQUNELFNBQVMsRUFBRTtnQkFDVCxPQUFPLEVBQUUsSUFBSTtnQkFDYixpQkFBaUIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQzthQUM5QztZQUNELGFBQWEsRUFBRTtnQkFDYixPQUFPLEVBQUUsS0FBSzthQUNmO1NBQ0YsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFtQztZQUM5QyxZQUFZO1lBQ1osV0FBVyxFQUFFLFNBQVM7WUFDdEIsbUJBQW1CLEVBQUUsT0FBTztZQUM1QixvQkFBb0IsRUFBRSxTQUFTO1NBQ2hDLENBQUM7UUFFRixNQUFNLGVBQWUsR0FBRywrQkFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6RCxNQUFNLEVBQUMsU0FBUyxFQUFDLEdBQUcseUJBQVMsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFFeEUsbURBQW1EO1FBQ25ELE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBL0VELDBCQStFQztJQUVELGNBQWM7SUFDZCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQzNCLElBQUksS0FBSyxFQUFFO1lBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQzs7U0FFVCxPQUFPLENBQUMsR0FBRyxFQUFFOztNQUVoQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7R0FDOUIsQ0FBQyxDQUFDO1NBQ0Y7UUFFRCxNQUFNLENBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFFLGNBQWMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdFLE9BQU8sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxjQUFjLENBQUMsQ0FBQztLQUMxRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cIm5vZGVcIi8+XG4vLy8gPHJlZmVyZW5jZSBsaWI9XCJlczIwMTdcIi8+XG5cbmltcG9ydCB7Zm9ybWF0fSBmcm9tICdAYmF6ZWwvY29uY2F0anMnO1xuaW1wb3J0IHtwYXJzZVRzY29uZmlnfSBmcm9tICdAYmF6ZWwvY29uY2F0anMnO1xuaW1wb3J0IHtFeHRyYWN0b3IsIEV4dHJhY3RvckNvbmZpZywgSUNvbmZpZ0ZpbGUsIElFeHRyYWN0b3JDb25maWdQcmVwYXJlT3B0aW9ucywgSUV4dHJhY3Rvckludm9rZU9wdGlvbnN9IGZyb20gJ0BtaWNyb3NvZnQvYXBpLWV4dHJhY3Rvcic7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBERUJVRyA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gcnVuTWFpbihcbiAgICB0c0NvbmZpZzogc3RyaW5nLCBlbnRyeVBvaW50RXhlY1BhdGg6IHN0cmluZywgZHRzQnVuZGxlT3V0OiBzdHJpbmcsIGFwaVJldmlld0ZvbGRlcj86IHN0cmluZyxcbiAgICBhY2NlcHRBcGlVcGRhdGVzID0gZmFsc2UpOiAxfDAge1xuICBjb25zdCBbcGFyc2VkQ29uZmlnLCBlcnJvcnNdID0gcGFyc2VUc2NvbmZpZyh0c0NvbmZpZyk7XG4gIGlmIChlcnJvcnMgJiYgZXJyb3JzLmxlbmd0aCkge1xuICAgIGNvbnNvbGUuZXJyb3IoZm9ybWF0KCcnLCBlcnJvcnMpKTtcblxuICAgIHJldHVybiAxO1xuICB9XG5cbiAgY29uc3QgcGtnSnNvbiA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoZW50cnlQb2ludEV4ZWNQYXRoKSwgJ3BhY2thZ2UuanNvbicpO1xuICBpZiAoIWZzLmV4aXN0c1N5bmMocGtnSnNvbikpIHtcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBrZ0pzb24sIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICduYW1lJzogJ0dFTkVSQVRFRC1CWS1CQVpFTCcsXG4gICAgICAndmVyc2lvbic6ICcwLjAuMCcsXG4gICAgICAnZGVzY3JpcHRpb24nOiAnVGhpcyBpcyBhIGR1bW15IHBhY2thZ2UuanNvbiBhcyBBUEkgRXh0cmFjdG9yIGFsd2F5cyByZXF1aXJlcyBvbmUuJyxcbiAgICB9KSk7XG4gIH1cblxuICAvLyBBUEkgZXh0cmFjdG9yIGRvZXNuJ3QgYWx3YXlzIHN1cHBvcnQgdGhlIHZlcnNpb24gb2YgVHlwZVNjcmlwdCB1c2VkIGluIHRoZSByZXBvXG4gIC8vIGV4YW1wbGU6IGF0IHRoZSBtb21lbnQgaXQgaXMgbm90IGNvbXBhdGFibGUgd2l0aCAzLjJcbiAgLy8gdG8gdXNlIHRoZSBpbnRlcm5hbCBUeXBlU2NyaXB0IHdlIHNoYWxsIG5vdCBjcmVhdGUgYSBwcm9ncmFtIGJ1dCByYXRoZXIgcGFzcyBhIHBhcnNlZCB0c0NvbmZpZy5cbiAgY29uc3QgcGFyc2VkVHNDb25maWcgPSBwYXJzZWRDb25maWchLmNvbmZpZyBhcyBhbnk7XG4gIGNvbnN0IGNvbXBpbGVyT3B0aW9ucyA9IHBhcnNlZFRzQ29uZmlnLmNvbXBpbGVyT3B0aW9ucztcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZXNdIG9mIE9iamVjdC5lbnRyaWVzPHN0cmluZ1tdPihjb21waWxlck9wdGlvbnMucGF0aHMpKSB7XG4gICAgaWYgKGtleSA9PT0gJyonKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB3ZSBzaGFsbCBub3QgcGFzcyB0cyBmaWxlcyBhcyB0aGlzIHdpbGwgbmVlZCB0byBiZSBwYXJzZWQsIGFuZCBmb3IgZXhhbXBsZSByeGpzLFxuICAgIC8vIGNhbm5vdCBiZSBjb21waWxlZCB3aXRoIG91ciB0c2NvbmZpZywgYXMgb3VycyBpcyBtb3JlIHN0cmljdFxuICAgIC8vIGhlbmNlIGFtZW5kIHRoZSBwYXRocyB0byBwb2ludCBhbHdheXMgdG8gdGhlICcuZC50cycgZmlsZXMuXG4gICAgY29tcGlsZXJPcHRpb25zLnBhdGhzW2tleV0gPSB2YWx1ZXMubWFwKHBhdGggPT4ge1xuICAgICAgY29uc3QgcGF0aFN1ZmZpeCA9IC8oXFwqfGluZGV4KSQvLnRlc3QocGF0aCkgPyAnLmQudHMnIDogJy9pbmRleC5kLnRzJztcblxuICAgICAgcmV0dXJuIHBhdGggKyBwYXRoU3VmZml4O1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgZXh0cmFjdG9yT3B0aW9uczogSUV4dHJhY3Rvckludm9rZU9wdGlvbnMgPSB7XG4gICAgbG9jYWxCdWlsZDogYWNjZXB0QXBpVXBkYXRlcyxcbiAgfTtcblxuICBjb25zdCBjb25maWdPYmplY3Q6IElDb25maWdGaWxlID0ge1xuICAgIGNvbXBpbGVyOiB7XG4gICAgICBvdmVycmlkZVRzY29uZmlnOiBwYXJzZWRUc0NvbmZpZyxcbiAgICB9LFxuICAgIHByb2plY3RGb2xkZXI6IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUodHNDb25maWcpKSxcbiAgICBtYWluRW50cnlQb2ludEZpbGVQYXRoOiBwYXRoLnJlc29sdmUoZW50cnlQb2ludEV4ZWNQYXRoKSxcbiAgICBhcGlSZXBvcnQ6IHtcbiAgICAgIGVuYWJsZWQ6ICEhYXBpUmV2aWV3Rm9sZGVyLFxuICAgICAgLy8gVE9ETyhhbGFuLWFnaXVzNCk6IHJlbW92ZSB0aGlzIGZvbGRlciBuYW1lIHdoZW4gdGhlIGJlbG93IGlzc3VlIGlzIHNvbHZlZCB1cHN0cmVhbVxuICAgICAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L3dlYi1idWlsZC10b29scy9pc3N1ZXMvMTQ3MFxuICAgICAgcmVwb3J0RmlsZU5hbWU6IGFwaVJldmlld0ZvbGRlciAmJiBwYXRoLnJlc29sdmUoYXBpUmV2aWV3Rm9sZGVyKSB8fCAnaW52YWxpZCcsXG4gICAgfSxcbiAgICBkb2NNb2RlbDoge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgfSxcbiAgICBkdHNSb2xsdXA6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICB1bnRyaW1tZWRGaWxlUGF0aDogcGF0aC5yZXNvbHZlKGR0c0J1bmRsZU91dCksXG4gICAgfSxcbiAgICB0c2RvY01ldGFkYXRhOiB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb3B0aW9uczogSUV4dHJhY3RvckNvbmZpZ1ByZXBhcmVPcHRpb25zID0ge1xuICAgIGNvbmZpZ09iamVjdCxcbiAgICBwYWNrYWdlSnNvbjogdW5kZWZpbmVkLFxuICAgIHBhY2thZ2VKc29uRnVsbFBhdGg6IHBrZ0pzb24sXG4gICAgY29uZmlnT2JqZWN0RnVsbFBhdGg6IHVuZGVmaW5lZCxcbiAgfTtcblxuICBjb25zdCBleHRyYWN0b3JDb25maWcgPSBFeHRyYWN0b3JDb25maWcucHJlcGFyZShvcHRpb25zKTtcbiAgY29uc3Qge3N1Y2NlZWRlZH0gPSBFeHRyYWN0b3IuaW52b2tlKGV4dHJhY3RvckNvbmZpZywgZXh0cmFjdG9yT3B0aW9ucyk7XG5cbiAgLy8gQVBJIGV4dHJhY3RvciBlcnJvcnMgYXJlIGVtaXR0ZWQgYnkgaXQncyBsb2dnZXIuXG4gIHJldHVybiBzdWNjZWVkZWQgPyAwIDogMTtcbn1cblxuLy8gRW50cnkgcG9pbnRcbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBpZiAoREVCVUcpIHtcbiAgICBjb25zb2xlLmVycm9yKGBcbmFwaS1leHRyYWN0b3I6IHJ1bm5pbmcgd2l0aFxuICBjd2Q6ICR7cHJvY2Vzcy5jd2QoKX1cbiAgYXJndjpcbiAgICAke3Byb2Nlc3MuYXJndi5qb2luKCdcXG4gICAgJyl9XG4gIGApO1xuICB9XG5cbiAgY29uc3QgW3RzQ29uZmlnLCBlbnRyeVBvaW50RXhlY1BhdGgsIG91dHB1dEV4ZWNQYXRoXSA9IHByb2Nlc3MuYXJndi5zbGljZSgyKTtcbiAgcHJvY2Vzcy5leGl0Q29kZSA9IHJ1bk1haW4odHNDb25maWcsIGVudHJ5UG9pbnRFeGVjUGF0aCwgb3V0cHV0RXhlY1BhdGgpO1xufVxuIl19