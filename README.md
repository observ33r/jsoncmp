[![npm](https://img.shields.io/npm/v/jsoncmp.svg)](https://www.npmjs.com/package/jsoncmp)
[![JSR](https://jsr.io/badges/@observ33r/jsoncmp)](https://jsr.io/@observ33r/jsoncmp)
[![JSR Score](https://jsr.io/badges/@observ33r/jsoncmp/score)](https://jsr.io/@observ33r/jsoncmp/score)
[![Size](https://badgen.net/bundlephobia/minzip/jsoncmp)](https://bundlephobia.com/package/jsoncmp)
[![License](https://img.shields.io/npm/l/jsoncmp.svg)](https://github.com/observ33r/jsoncmp/blob/main/LICENSE)
[![Donate](https://img.shields.io/badge/Donate-PayPal-ff69b4.svg)](https://www.paypal.com/donate/?hosted_button_id=PPPN7F3VXXE8W)

# jsoncmp

Blazingly fast and type-safe deep comparison for JSON-compatible data, optimized for modern runtime environments.

## Features

- **High Performance**  
  Outperforms popular libraries like `fast-equals`, `dequal/lite`, `lodash.isEqual`, `node.isDeepStrictEqual` and even comparisons using the native `JSON.stringify` method.

- **Engine-Aware Design**  
  Tailored execution paths for V8 and JSC based runtimes to maximize performance.

- **Type-Safe**  
  Fully typed with TypeScript declarations.

## Installation

```bash
# npm / node
npm install jsoncmp

# jsr / deno
deno add @observ33r/jsoncmp

# bun
bun install jsoncmp
```

## Usage

```ts
import jsoncmp from 'jsoncmp';

export type JSONCmpValue =
  | number
  | string
  | boolean
  | null
  | JSONCmpArray
  | JSONCmpObject;

export type JSONCmpArray = JSONCmpValue[];

export interface JSONCmpObject {
  [key: string]: 
    | JSONCmpValue
    | undefined
}

/**
 *  Compares two JSON-compatible values for deep structural equality.
 * 
 *  This function supports only the following value types:
 *  number, string, boolean, null, arrays, and plain objects (no functions, symbols, etc.).
 *
 *  The comparison is optimized based on runtime heuristics for V8 and JavaScriptCore.
 *
 *  @param target - The first value to compare
 *  @param source - The second value to compare
 *  @returns `true` if both values are structural identical, otherwise `false`
 */

function jsoncmp(target: JSONCmpValue, source: JSONCmpValue): boolean
```

## Example

```ts
import jsoncmp from 'jsoncmp';

const target = JSON.parse('{ "a": 1, "b": ['2', null, false] }');
const source = JSON.parse('{ "a": 1, "b": ['2', null, false] }');

console.log(jsoncmp(target, source)); //true
```

## Benchmark

**Big JSON Object (~1.2 MiB, deeply nested)**

| Library | Time | Relative Speed |
| :--- | :--- | :--- |
| jsoncmp | 341.63 µs | 1.00x (baseline) |
| fast-equals | 1.38 ms | 4.05x slower |
| dequal/lite | 1.45 ms | 4.24x slower |
| node.isDeepStrictEqual | 2.48 ms | 7.25x slower |
| JSON.stringify | 3.84 ms | 11.24x slower |
| lodash.isEqual | 6.24 ms | 18.27x slower |


<details>
<summary>Full benchmark result with hardware counters</summary>

```console
clk: ~3.67 GHz
cpu: AMD Ryzen 5 3600 6-Core Processor
runtime: node 24.4.1 (x64-linux)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
• Big JSON Object (~1.2 MiB, deeply nested)
------------------------------------------- -------------------------------
jsoncmp                      341.63 µs/iter 339.20 µs  █                   
                    (327.78 µs … 604.35 µs) 534.00 µs  █                   
                    (382.48 kb …   1.23 mb) 967.89 kb ██▃▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
                   3.12 ipc ( 87.01% cache)   3.20k branch misses
          1.39M cycles   4.34M instructions  91.63k c-refs  11.90k c-misses

fast-equals                    1.38 ms/iter   1.44 ms  █                   
                        (1.26 ms … 1.83 ms)   1.74 ms ██▆ ▂▃               
                    (763.16 kb …   1.11 mb) 968.27 kb ███▅██▂▃▄▄▃▂▂▂▅▇▃▂▂▂▁
                   2.69 ipc ( 87.40% cache)  13.65k branch misses
          5.33M cycles  14.30M instructions 130.47k c-refs  16.44k c-misses

dequal/lite                    1.45 ms/iter   1.46 ms  █                   
                        (1.41 ms … 1.80 ms)   1.68 ms  █▂                  
                    (204.09 kb … 486.02 kb) 484.41 kb ████▇▄▂▃▂▂▂▁▁▁▁▂▁▁▁▁▁
                   2.62 ipc ( 88.67% cache)  12.31k branch misses
          5.58M cycles  14.60M instructions 108.22k c-refs  12.26k c-misses

lodash.isEqual                 6.24 ms/iter   6.38 ms  ▅      ▄█           
                        (5.90 ms … 7.82 ms)   6.95 ms  █▇▇    ██▃          
                    (  3.08 mb …   5.50 mb)   4.23 mb ▅███▇▅▄▇███▆▄▂▄▁▁▁▁▁▂
                   2.49 ipc ( 97.72% cache)  33.35k branch misses
         24.77M cycles  61.79M instructions   1.48M c-refs  33.85k c-misses

JSON.stringify                 3.84 ms/iter   3.83 ms ██                   
                        (3.56 ms … 8.55 ms)   5.48 ms ██                   
                    (  1.39 mb …   1.40 mb)   1.39 mb ██▇█▄▃▄▄▂▁▂▃▁▁▁▁▁▁▁▁▁
                   2.68 ipc ( 89.46% cache)  51.52k branch misses
         12.81M cycles  34.38M instructions 422.39k c-refs  44.54k c-misses

node.isDeepStrictEqual         2.48 ms/iter   2.47 ms  █▃                  
                        (2.42 ms … 3.47 ms)   2.96 ms  ██                  
                    (376.59 kb …   1.80 mb)   1.36 mb ███▄▁▁▁▁▁▂▂▁▁▁▁▁▂▁▁▁▁
                   2.73 ipc ( 92.25% cache)  16.40k branch misses
          9.55M cycles  26.06M instructions 187.67k c-refs  14.55k c-misses

summary
  jsoncmp
   4.05x faster than fast-equals
   4.24x faster than dequal/lite
   7.25x faster than node.isDeepStrictEqual
   11.24x faster than JSON.stringify
   18.27x faster than lodash.isEqual
```

</details>

---

Benchmark uses [mitata](https://github.com/evanwashere/mitata) to test performance with [big JSON object](https://github.com/observ33r/jsoncmp/blob/main/benchmark/data.ts) to reflect a realistic real-world scenario.

You can run bechmark with:

```bash
npm run benchmark
```

## Build

This package uses [rollup](https://rollupjs.org/) to generate clean and optimized ESM/CJS builds. 

To build package from source code, run:

```bash
npm run build
```

This will generate the output in the `dist/` folder. Builds are handled via custom rollup config and exposed under appropriate `exports` in `package.json`.

## Testing

All tests are written in [Vitest](https://vitest.dev) with native ESM support and zero transform overhead.

You can run the full suite with:

```bash
npm test
```

## Support

If you find this project useful, you can support it with a one-time donation over [PayPal](https://www.paypal.com/donate/?hosted_button_id=PPPN7F3VXXE8W). Thank you!

## Contributing

Feel free to open issues or submit pull requests on [GitHub](https://github.com/observ33r/jsoncmp).

## License

This project is licensed under the [MIT License](LICENSE).