import { describe, test, expect } from 'vitest';
import jsoncmp from '../src/index.ts';

describe('jsoncmp', () => {

    test('compares primitives correctly', () => {
        expect(jsoncmp(42, 42)).toBe(true);
        expect(jsoncmp('a', 'a')).toBe(true);
        expect(jsoncmp(true, true)).toBe(true);
        expect(jsoncmp(null, null)).toBe(true);
        expect(jsoncmp(42, '42')).toBe(false);
        expect(jsoncmp(true, false)).toBe(false);
    });

    test('compares arrays deeply', () => {
        expect(jsoncmp([1, 2, 3], [1, 2, 3])).toBe(true);
        expect(jsoncmp([1, 2], [1, 2, 3])).toBe(false);
        expect(jsoncmp([1, [2, 3]], [1, [2, 3]])).toBe(true);
        expect(jsoncmp([1, [2, 3]], [1, [3, 2]])).toBe(false);
    });

    test('compares plain objects deeply', () => {
        expect(jsoncmp({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
        expect(jsoncmp({ a: 1, b: 2 }, { a: 1 })).toBe(false);
        expect(jsoncmp({ a: { b: 2 } }, { a: { b: 2 } })).toBe(true);
        expect(jsoncmp({ a: { b: 2 } }, { a: { b: 3 } })).toBe(false);
    });

    test('differentiates arrays from objects', () => {
        expect(jsoncmp([], {})).toBe(false);
        expect(jsoncmp({}, [])).toBe(false);
    });

    test('strict equality for non-object mismatched types', () => {
        expect(jsoncmp(null, {})).toBe(false);
        expect(jsoncmp({}, null)).toBe(false);
        expect(jsoncmp(0, false)).toBe(false);
    });

});