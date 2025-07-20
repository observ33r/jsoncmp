import { run, bench, group, summary } from 'mitata';
import * as fastEquals from 'fast-equals';
import { isEqual } from 'lodash-es';
import { isDeepStrictEqual } from 'node:util';
import { dequal } from 'dequal/lite';

import { getJSONObject } from './data.ts';
import jsoncmp from '../src/index.ts';

const isNode = typeof process === 'object'
    && typeof process.versions?.node === 'string'
    && typeof Deno === 'undefined'
    && typeof Bun === 'undefined';

group('Big JSON Object (~1.2 MiB, deeply nested)', () => {
    summary(() => {
        bench('jsoncmp', function* () {
            const target = getJSONObject();
            const source = getJSONObject();
            yield () => jsoncmp(target, source)
        });
        bench('fast-equals', function* () {
            const target = getJSONObject();
            const source = getJSONObject();
            yield () => fastEquals.deepEqual(target, source)
        });
        bench('dequal/lite', function* () {
            const target = getJSONObject();
            const source = getJSONObject();
            yield () => dequal(target, source)
        });
        bench('lodash.isEqual', function* () {
            const target = getJSONObject();
            const source = getJSONObject();
            yield () => isEqual(target, source)
        });
        bench('JSON.stringify', function* () {
            const target = getJSONObject();
            const source = getJSONObject();
            yield () => JSON.stringify(target) === JSON.stringify(source)
        });
        if (isNode) {
            bench('node.isDeepStrictEqual', function* () {
                const target = getJSONObject();
                const source = getJSONObject();
                yield () => isDeepStrictEqual(target, source)
            });
        }
    });
});

await run();
