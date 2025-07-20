const { keys, prototype: { hasOwnProperty } } = Object;

const isRuntime = (typeof process === 'object');

const isBrowserOrWebWorker = (typeof window === 'object' || typeof self === 'object')
    && typeof navigator === 'object' && typeof navigator.userAgent === 'string';

const isV8 = ((globalThis as any).chrome === 'object')
    || (isBrowserOrWebWorker && navigator.userAgent.search(/chrome/i) > -1)
    || (isRuntime && process.versions?.v8 !== undefined && typeof Bun !== 'object');

const isJSC = ((globalThis as any).$?.IsHTMLDDA !== undefined)
    || (isBrowserOrWebWorker && navigator.userAgent.match(/^(?!.*(chrome|crios)).*safari/i) !== null)
    || (isRuntime && process.versions?.webkit !== undefined);

/**
 *  Valid input type for `jsoncmp`.
 * 
 *  Acceptable values include:
 *  - number, string, boolean, null
 *  - arrays of valid values
 *  - plain objects with string keys and valid values
 */

export type JSONCmpValue =
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

export default function jsoncmp(target: JSONCmpValue, source: JSONCmpValue): boolean {
    if (target === null || source === null 
        || typeof target !== 'object' || typeof source !== 'object')
            return target === source;
    const isTargetArray = Array.isArray(target), isSourceArray = Array.isArray(source);
    if (isTargetArray && isSourceArray) {
        const targetLength = target.length;
        if (targetLength !== source.length)
            return false;
        for (let index = targetLength - 1; index >= 0; index--) {
            const targetValue = target[index], sourceValue = source[index];
            if (targetValue === sourceValue
                || jsoncmp(targetValue, sourceValue))
                    continue;
            return false;
        }
        return true;
    }
    if (!isTargetArray && !isSourceArray) {
        const targetKeys = keys(target), targetLength = targetKeys.length;
        if (targetLength !== keys(source).length)
            return false;
        if (isV8 && targetLength > 1 && targetLength < 20 || isJSC && targetLength < 66)
            for (const key in target) {
                if (!hasOwnProperty.call(target, key))
                    continue;
                const sourceValue = (source as any)[key];
                if (sourceValue === undefined 
                    && !hasOwnProperty.call(source, key))
                        return false;
                const targetValue = (target as any)[key];
                if (targetValue === sourceValue
                    || jsoncmp(targetValue, sourceValue))
                        continue;
                return false;
            }
        else
            for (let index = targetLength - 1; index >= 0; index--) {
                const key = targetKeys[index], sourceValue = (source as any)[key];
                if (sourceValue === undefined 
                    && !hasOwnProperty.call(source, key))
                        return false;
                const targetValue = (target as any)[key];
                if (targetValue === sourceValue
                    || jsoncmp(targetValue, sourceValue))
                        continue;
                return false;
            }
        return true;
    }
    return false;
}