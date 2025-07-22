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
 *  A value that is valid in a JSON structure: string, number, boolean, null,
 *  array of JSON values or a plain object with JSON values.
 */

export type JSONCmpValue =
  | number
  | string
  | boolean
  | null
  | JSONCmpArray
  | JSONCmpObject;

/**
 *  An array of JSON-compatible values.
 */

export type JSONCmpArray = JSONCmpValue[];

/**
 *  A plain object whose property values are all JSON-compatible.
 */

export interface JSONCmpObject {
  [key: string]: 
    | JSONCmpValue
    | undefined // allowed for structural compatibility in TS (e.g., Partial<T>)
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
            const targetValue = (target as JSONCmpArray)[index], sourceValue = (source as JSONCmpArray)[index];
            if (targetValue === sourceValue
                || jsoncmp(targetValue as JSONCmpValue, sourceValue as JSONCmpValue))
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
                const sourceValue = (source as JSONCmpObject)[key];
                if (sourceValue === undefined 
                    && !hasOwnProperty.call(source, key))
                        return false;
                const targetValue = (target as JSONCmpObject)[key];
                if (targetValue === sourceValue
                    || jsoncmp(targetValue as JSONCmpValue, sourceValue as JSONCmpValue))
                        continue;
                return false;
            }
        else
            for (let index = targetLength - 1; index >= 0; index--) {
                const key = targetKeys[index], sourceValue = (source as JSONCmpObject)[key];
                if (sourceValue === undefined 
                    && !hasOwnProperty.call(source, key))
                        return false;
                const targetValue = (target as JSONCmpObject)[key];
                if (targetValue === sourceValue
                    || jsoncmp(targetValue as JSONCmpValue, sourceValue as JSONCmpValue))
                        continue;
                return false;
            }
        return true;
    }
    return false;
}