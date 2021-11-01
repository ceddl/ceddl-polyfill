import {eventbus} from '../../src/utils/eventbus';
eventbus.__proto__.emit = sinon.spy();
import { ModelStore } from '../../src/stores/modelStore.js';

describe('ModelStore:', () => {
    it('should be a constructor', () => {
        // A singleton would be of type object.
        expect(typeof ModelStore).toBe('function');
    });

    describe('instance:', () => {
        const simpleModelMockKey = 'simple';
        const simpleModelMock = { a: 'b' };

        const modelMockKey = 'model';
        const modelMock = {
            a: 'b',
            b: 1,
        };

        const nestedModelMockKey = 'nestedModel';
        const nestedModelMock = {
            a: 'b',
            b: 1,
            c: {
                d: 'nested',
                e: {
                    f: 'deeper nesting',
                }
            },
        };

        const listModelMockKey = 'listModel';
        const listModelMock = {
            g: {
                h: [
                    {
                        i: 'item 1',
                    },
                    {
                        i: 'item 2',
                    },
                    {
                        i: 'item 3',
                    }
                ]
            }
        };

        let modelStore;

        beforeEach(() => {
            modelStore = new ModelStore();
        });

        afterEach(() => {
            eventbus.emit.resetHistory();
        });

        describe('getStoredModels', () => {
            it('should return an object', () => {
                const result = modelStore.getStoredModels();

                // There is no clean way to determine whether something is 'just' an object.
                expect(!Array.isArray(result) && result === Object(result)).toBeTruthy();
            });

            it('should initialise with an empty store', () => {
                expect(Object.keys(modelStore.getStoredModels()).length).toBe(0);
            });

            it('should return all stored models', () => {
                modelStore.storeModel(modelMockKey, modelMock);
                expect(Object.keys(modelStore.getStoredModels()).length).toBe(1);

                modelStore.storeModel(nestedModelMockKey, nestedModelMock);
                expect(Object.keys(modelStore.getStoredModels()).length).toBe(2);

                modelStore.storeModel(listModelMockKey, listModelMock);
                expect(Object.keys(modelStore.getStoredModels()).length).toBe(3);
            });

            it('should return an object with the stored model names as keys', () => {
                modelStore.storeModel(modelMockKey, modelMock);
                expect(Object.keys(modelStore.getStoredModels())).toEqual([modelMockKey]);

                modelStore.storeModel(nestedModelMockKey, nestedModelMock);
                expect(Object.keys(modelStore.getStoredModels())).toEqual([modelMockKey, nestedModelMockKey]);
            });

            it('should return a clone of the data by default', () => {
                modelStore.storeModel(modelMockKey, modelMock);

                const result = modelStore.getStoredModels()[modelMockKey];

                expect(result).not.toBe(modelMock);
            });

            it('should return the actual data when called with debug parameter', () => {
                modelStore.storeModel(modelMockKey, modelMock);

                const result = modelStore.getStoredModels(true)[modelMockKey];

                expect(result).toBe(modelMock);
            });
        });

        describe('storeModel:', () => {
            it('should store models if they do not exist yet', () => {
                const expected = Object.assign({}, modelMock);
                modelStore.storeModel(modelMockKey, modelMock);

                expect(modelStore.getStoredModels()[modelMockKey]).toEqual(expected);
            });

            it('should override existing models if they already exist', () => {
                const expected = Object.assign({}, modelMock);
                modelStore.storeModel(modelMockKey, {});

                modelStore.storeModel(modelMockKey, modelMock);
                expect(modelStore.getStoredModels()[modelMockKey]).toEqual(expected);
            });

            it('should store the same data under different keys', () => {
                const newKey = 'newKey';

                modelStore.storeModel(newKey, modelMock);
                modelStore.storeModel(modelMockKey, modelMock);

                const result = modelStore.getStoredModels();
                expect(Object.keys(result)).toEqual([newKey, modelMockKey]);
            });

            it('should delete a model when the value is undefined', () => {
                modelStore.storeModel(modelMockKey, modelMock);
                modelStore.storeModel(modelMockKey, undefined);

                const result = modelStore.getStoredModels();
                expect(result[modelMockKey]).toBe(undefined);
            });

            it('should emit delta events when a simple model is added', () => {
                modelStore.storeModel(simpleModelMockKey, simpleModelMock);

                sinon.assert.callCount(eventbus.emit, 3);
                sinon.assert.calledWith(eventbus.emit, 'ceddl:models', modelStore.getStoredModels());
                sinon.assert.calledWith(eventbus.emit, `${simpleModelMockKey}`, simpleModelMock);
                sinon.assert.calledWith(eventbus.emit, `${simpleModelMockKey}.a`, simpleModelMock.a);
            });

            it('should be able to emit boolean events with false', () => {
                modelStore.storeModel('booleankey', { k: false });

                sinon.assert.callCount(eventbus.emit, 3);
                sinon.assert.calledWith(eventbus.emit, 'ceddl:models', modelStore.getStoredModels());
                sinon.assert.calledWith(eventbus.emit, 'booleankey.k', false);
            });

            it('should emit delta events when a simple model is updated', () => {
                modelStore.storeModel(simpleModelMockKey, simpleModelMock);

                // Discard the events from the model creation.
                eventbus.emit.resetHistory();

                const newSimpleModelMock = { c: 'd' };
                const expected = {
                    c: newSimpleModelMock.c
                };

                modelStore.storeModel(simpleModelMockKey, newSimpleModelMock);

                sinon.assert.callCount(eventbus.emit, 4);
                sinon.assert.calledWith(eventbus.emit, 'ceddl:models', modelStore.getStoredModels());
                sinon.assert.calledWith(eventbus.emit, `${simpleModelMockKey}`, expected);
                sinon.assert.calledWith(eventbus.emit, `${simpleModelMockKey}.a`, undefined);
                sinon.assert.calledWith(eventbus.emit, `${simpleModelMockKey}.c`, expected.c);
            });

            it('should emit delta events when a nested model is added', () => {
                modelStore.storeModel(nestedModelMockKey, nestedModelMock);

                sinon.assert.callCount(eventbus.emit, 8);
                sinon.assert.calledWith(eventbus.emit, 'ceddl:models', modelStore.getStoredModels());
                sinon.assert.calledWith(eventbus.emit, `${nestedModelMockKey}`, nestedModelMock);
                sinon.assert.calledWith(eventbus.emit, `${nestedModelMockKey}.a`, nestedModelMock.a);
                sinon.assert.calledWith(eventbus.emit, `${nestedModelMockKey}.b`, nestedModelMock.b),
                sinon.assert.calledWith(eventbus.emit, `${nestedModelMockKey}.c`, nestedModelMock.c);
                sinon.assert.calledWith(eventbus.emit, `${nestedModelMockKey}.c.d`, nestedModelMock.c.d);
                sinon.assert.calledWith(eventbus.emit, `${nestedModelMockKey}.c.e`, nestedModelMock.c.e);
                sinon.assert.calledWith(eventbus.emit, `${nestedModelMockKey}.c.e.f`, nestedModelMock.c.e.f);
            });

            it('should emit delta events when a nested model is updated', () => {
                modelStore.storeModel(nestedModelMockKey, nestedModelMock);

                // Discard the events from the model creation.
                eventbus.emit.resetHistory();

                const newNestedModelMock = {
                    a: 'b',
                    b: 2,
                    c: {
                        d: {
                            g: 'newly nested'
                        }
                    }
                };

                modelStore.storeModel(nestedModelMockKey, newNestedModelMock);

                sinon.assert.callCount(eventbus.emit, 7);
                sinon.assert.calledWith(eventbus.emit, 'ceddl:models', modelStore.getStoredModels());
                sinon.assert.calledWith(eventbus.emit, `${nestedModelMockKey}`, newNestedModelMock);
                sinon.assert.calledWith(eventbus.emit, `${nestedModelMockKey}.b`, newNestedModelMock.b);
                sinon.assert.calledWith(eventbus.emit, `${nestedModelMockKey}.c`, newNestedModelMock.c);
                sinon.assert.calledWith(eventbus.emit, `${nestedModelMockKey}.c.d`, newNestedModelMock.c.d);
                sinon.assert.calledWith(eventbus.emit, `${nestedModelMockKey}.c.d.g`, newNestedModelMock.c.d.g);
                sinon.assert.calledWith(eventbus.emit, `${nestedModelMockKey}.c.e`, undefined);
            });

            it('should emit delta events when a list model is added', () => {
                modelStore.storeModel(listModelMockKey, listModelMock);

                sinon.assert.callCount(eventbus.emit, 10);
                sinon.assert.calledWith(eventbus.emit, 'ceddl:models', modelStore.getStoredModels());
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}`, listModelMock);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g`, listModelMock.g);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h`, listModelMock.g.h);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.0`, listModelMock.g.h[0]);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.0.i`, listModelMock.g.h[0].i);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.1`, listModelMock.g.h[1]);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.1.i`, listModelMock.g.h[1].i);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.2`, listModelMock.g.h[2]);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.2.i`, listModelMock.g.h[2].i);
            });

            it('should emit delta events when a list model is updated', () => {
                modelStore.storeModel(listModelMockKey, listModelMock);

                // Discard the events from the model creation.
                eventbus.emit.resetHistory();

                const newListedModuleMock = {
                    g: {
                        h: [
                            {
                                i: 'item 1',
                            },
                            {
                                i: 'item 42',
                            },
                            {
                                j: 'new property'
                            },
                            {
                                i: 'new item',
                                k: [
                                    'new',
                                    'list',
                                    'items'
                                ]
                            }
                        ]
                    }
                };


                modelStore.storeModel(listModelMockKey, newListedModuleMock);

                sinon.assert.callCount(eventbus.emit, 15);
                sinon.assert.calledWith(eventbus.emit, 'ceddl:models', modelStore.getStoredModels());
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}`, newListedModuleMock);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g`, newListedModuleMock.g);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h`, newListedModuleMock.g.h);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.1`, newListedModuleMock.g.h[1]);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.1.i`, newListedModuleMock.g.h[1].i);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.2`, newListedModuleMock.g.h[2]);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.2.i`, undefined);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.2.j`, newListedModuleMock.g.h[2].j);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.3`, newListedModuleMock.g.h[3]);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.3.i`, newListedModuleMock.g.h[3].i);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.3.k`, newListedModuleMock.g.h[3].k);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.3.k.0`, newListedModuleMock.g.h[3].k[0]);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.3.k.1`, newListedModuleMock.g.h[3].k[1]);
                sinon.assert.calledWith(eventbus.emit, `${listModelMockKey}.g.h.3.k.2`, newListedModuleMock.g.h[3].k[2]);

            });
        });

        describe('clearStore:', () => {
            it('should remove all stored models', () => {
                modelStore.storeModel(modelMockKey, modelMock);
                modelStore.storeModel(nestedModelMockKey, nestedModelMock);

                modelStore.clearStore();
                const result = modelStore.getStoredModels();

                expect(result).toEqual({});
            });

            it('should keep the reference to the store intact', () => {
                modelStore.storeModel(modelMockKey, modelMock);
                modelStore.storeModel(nestedModelMockKey, nestedModelMock);

                const firstReference = modelStore.getStoredModels(true);
                modelStore.clearStore();
                const result = modelStore.getStoredModels(true);

                expect(result).toBe(firstReference);
            });
        });
    });
});
