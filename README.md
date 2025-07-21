[![npm](https://img.shields.io/npm/v/jsoncmp.svg)](https://www.npmjs.com/package/jsoncmp)
[![JSR](https://jsr.io/badges/@observ33r/jsoncmp)](https://jsr.io/@observ33r/jsoncmp)
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

type JSONCmpValue =
  | number
  | string
  | boolean
  | null
  | JSONCmpValue[]
  | { 
    [key: string]: 
      | JSONCmpValue 
      | undefined //allowed only for TS structural compatibility in unions
    };

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

const target = JSON.parse('{ "a": 1, "b": [2, 3] }');
const source = JSON.parse('{ "a": 1, "b": [2, 3] }');

console.log(jsoncmp(target, source)); //true
```

## Benchmark

**Big JSON Object (~1.2 MiB, deeply nested)**

| Library | Time | Relative Speed |
| :--- | :--- | :--- |
| jsoncmp | 348.80 µs | 1.00x (baseline) |
| fast-equals | 1.39 ms | 3.99x slower |
| dequal/lite | 1.54 ms | 4.42x slower |
| node.isDeepStrictEqual | 2.52 ms | 7.23x slower |
| JSON.stringify | 4.08 ms | 11.71x slower |
| lodash.isEqual | 6.47 ms | 18.54x slower |

<details>
<summary>Full benchmark result with hardware counters</summary>

```console
clk: ~3.69 GHz
cpu: AMD Ryzen 5 3600 6-Core Processor
runtime: node 24.4.1 (x64-linux)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
• Big JSON Object (~1.2 MiB, deeply nested)
------------------------------------------- -------------------------------
jsoncmp                      348.80 µs/iter 344.88 µs  █                   
                    (332.46 µs … 558.35 µs) 534.88 µs  █                   
                    (403.01 kb …   1.20 mb) 967.86 kb ▄█▃▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
                   3.11 ipc ( 87.45% cache)   3.20k branch misses
          1.42M cycles   4.43M instructions  93.73k c-refs  11.76k c-misses

fast-equals                    1.39 ms/iter   1.38 ms    █                 
                        (1.32 ms … 1.88 ms)   1.66 ms  ▂ █                 
                    (851.30 kb …   1.13 mb) 968.70 kb ▂█▆█▇▃▂▂▂▂▁▂▂▁▁▂▁▁▁▁▁
                   2.70 ipc ( 87.48% cache)  13.06k branch misses
          5.32M cycles  14.35M instructions 130.36k c-refs  16.31k c-misses

dequal/lite                    1.54 ms/iter   1.52 ms █                    
                        (1.51 ms … 2.18 ms)   2.02 ms ██                   
                    (484.92 kb … 690.30 kb) 485.44 kb ██▂▁▁▁▁▁▁▂▁▁▁▁▁▁▁▁▁▁▁
                   2.48 ipc ( 91.62% cache)  11.82k branch misses
          5.91M cycles  14.64M instructions 134.45k c-refs  11.27k c-misses

lodash.isEqual                 6.47 ms/iter   6.46 ms  █                   
                        (6.30 ms … 8.03 ms)   7.42 ms  █                   
                    (  2.98 mb …   5.56 mb)   4.24 mb ▅██▂▁▆▄▁▂▁▁▁▁▁▁▁▁▁▁▁▁
                   2.48 ipc ( 97.75% cache)  34.76k branch misses
         24.94M cycles  61.94M instructions   1.50M c-refs  33.67k c-misses

JSON.stringify                 4.08 ms/iter   4.05 ms   █                  
                        (3.90 ms … 9.64 ms)   4.99 ms   █                  
                    (  1.39 mb …   1.40 mb)   1.39 mb ▂▇██▄▂▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁
                   2.62 ipc ( 90.97% cache)  50.92k branch misses
         13.17M cycles  34.50M instructions 428.33k c-refs  38.70k c-misses

node.isDeepStrictEqual         2.52 ms/iter   2.51 ms  █                   
                        (2.45 ms … 3.40 ms)   3.08 ms  █▂                  
                    (941.22 kb …   1.96 mb)   1.36 mb ███▄▄▂▂▂▂▁▁▁▁▁▁▁▁▁▁▁▁
                   2.69 ipc ( 92.85% cache)  16.52k branch misses
          9.69M cycles  26.04M instructions 189.83k c-refs  13.58k c-misses

summary
  jsoncmp
   3.99x faster than fast-equals
   4.42x faster than dequal/lite
   7.23x faster than node.isDeepStrictEqual
   11.71x faster than JSON.stringify
   18.54x faster than lodash.isEqual
```

</details>

## Running Benchmark

Benchmark uses [mitata](https://github.com/evanwashere/mitata) for performance testing with big JSON Object to reflect realistic real-world scenario.

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