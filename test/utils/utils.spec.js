"use strict";

import utils from '../../src/utils/utils.js';

describe('util', () => {
    describe('simpleDeepClone:', () => {
        it('should deeply clone simple objects', () => {
            const target = { a: 1, b: 'test', c: false };
            const result = utils.simpleDeepClone(target);

            expect(result).toEqual(target);
            expect(result).not.toBe(target);
        });

        it('should deeply clone simple arrays', () => {
            const target = [1, 'test', false];
            const result = utils.simpleDeepClone(target);

            expect(result).toEqual(target);
            expect(result).not.toBe(target);
        });

        it('should deeply clone nested objects', () => {
            const target = { a: 1, b: { c: 'nested', d: { e: 'deeper nesting' } } };
            const result = utils.simpleDeepClone(target);

            expect(result).toEqual(target);
            expect(result).not.toBe(target);
            expect(result.b).not.toBe(target.b);
            expect(result.b.d).not.toBe(target.b.d);
        });

        it('should deeply clone nested arrays', () => {
            const target = [1, ['a', 'b', [true, false, true]]];
            const result = utils.simpleDeepClone(target);

            expect(result).not.toBe(target);
            expect(result).not.toBe(target);
            expect(result[1]).not.toBe(target[1]);
            expect(result[1][2]).not.toBe(target[1][2]);
        });

        it('should deeply clone complex objects', () => {
            const target = {
                a: [
                    {
                        b: 'item 1'
                    },
                    {
                        b: 'item 2'
                    },
                    {
                        b: 'item 3',
                        c: {
                            d: 'nested',
                            e: [1, 2, 3]
                        }
                    }
                ],
                f: {
                    g: {
                        h: true
                    }
                }
            };
            const result = utils.simpleDeepClone(target);

            expect(result).toEqual(target);
            expect(result).not.toBe(target);
            expect(result.a).not.toBe(target.a);
            expect(result.a[0]).not.toBe(target.a[0]);
            expect(result.a[1]).not.toBe(target.a[1]);
            expect(result.a[2]).not.toBe(target.a[2]);
            expect(result.a[2].c).not.toBe(target.a[2].c);
            expect(result.a[2].c.e).not.toBe(target.a[2].c.e);
            expect(result.f).not.toBe(target.f);
            expect(result.f.g).not.toBe(target.f.g);
        });
    });

    describe('isArrayOfStrings', () => {
        it('should return the true for array of strings', () => {
            expect(utils.isArrayOfStrings([])).toEqual(true);
            expect(utils.isArrayOfStrings(['a', 'b'])).toEqual(true);
        });
        it('should return false for any other object', () => {
            expect(utils.isArrayOfStrings(new Date())).toEqual(false);
            expect(utils.isArrayOfStrings({})).toEqual(false);
            expect(utils.isArrayOfStrings([{}])).toEqual(false);
            expect(utils.isArrayOfStrings([1235, 12])).toEqual(false);
        });
    });


    describe('diff', () => {

        it('should return the result if a single value in object changed', () => {
            let lhs = {
                foo: 'bar',
                baz: 'daz'
            };
            let rhs = {
                foo: 'bak',
                baz: 'daz'
            };
            expect(utils.diff(lhs, lhs)).toEqual({});
            expect(utils.diff(lhs, rhs)).toEqual({ foo: 'bak' });
        });

        it('should return a result  if a single values are added or removed', () => {
            let lhs = {
                foo: 'bar'
            };
            let rhs = {
                foo: 'bar',
                baz: 'daz'
            };
            expect(utils.diff(lhs, rhs)).toEqual({ baz: 'daz' });
            expect(utils.diff(lhs, {})).toEqual({ foo: undefined });
        });

        it('should return a result when using javascript date objects', () => {
            let date = new Date();
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            let lhs = {
                foo: date,
                baz: date
            };
            let rhs = {
                foo: date,
                baz: tomorrow
            };
            expect(utils.diff(lhs, lhs)).toEqual({});
            expect(utils.diff(lhs, rhs)).toEqual({ baz: tomorrow });
            expect(utils.diff(date, date)).toEqual({});
        });

        it('should be able to return a result when using deep objects', () => {
            let lhs = {
                foo: {
                    kla: 'kli',
                    kdi: {
                        jkw: 'jkw',
                        klm: 'klo'
                    }
                },
                baz: 'daz'
            };
            let rhs = {
                foo: {
                    kla: 'kli',
                    kdi: {
                        jkw: 'jkw',
                        klm: 'klm',
                        hyt: 'htr'
                    }
                },
                baz: 'daz'
            };
            expect(utils.diff(lhs, lhs)).toEqual({});
            expect(utils.diff(lhs, rhs)).toEqual({
                foo: {
                    kdi: {
                        klm: 'klm',
                        hyt: 'htr'
                    }
                }
            });
        });
    });

    describe('debounce', () => {

        it('should call callback only once after periode has past', (done) => {
            let count = 0;
            let debouncedfunc = utils.debounce(function() {
                count++;
            }, 20);
            expect(typeof debouncedfunc).toBe('function');
            debouncedfunc();
            debouncedfunc();
            debouncedfunc();
            setTimeout(function() {
                  expect(count).toBe(1);
                  debouncedfunc();
                  debouncedfunc();
            }, 45);
            setTimeout(function() {
                  expect(count).toBe(2);
                  done();
            }, 70);
        });

        it('should call callback once immidiatly and wait after periode has past', (done) => {
            let count = 0;
            let debouncedfunc = utils.debounce(function() {
                count++;
            }, 20, true);
            expect(typeof debouncedfunc).toBe('function');
            debouncedfunc();
            expect(count).toBe(1);
            debouncedfunc();
            debouncedfunc();
            expect(count).toBe(1);
            done();
        });

        it('should set a timeout of 100ms if no timeout is provided', (done) => {
            let count = 0;
            let debouncedfunc = utils.debounce(function() {
                count++;
            });
            expect(typeof debouncedfunc).toBe('function');
            debouncedfunc();
            setTimeout(function() {
                  expect(count).toBe(0);
            }, 0);
            setTimeout(function() {
                  expect(count).toBe(1);
                  debouncedfunc();
                  done();
            }, 120);
        });

    });

    describe('getAllElementsAttributes', () => {

    });
});

export default function() {}
