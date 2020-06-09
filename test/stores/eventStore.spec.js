import {eventbus} from '../../src/utils/eventbus';
eventbus.__proto__.emit = sinon.spy();
import EventStore from '../../src/stores/eventStore.js';

describe('EventStore:', () => {
    it('should be a constructor', () => {
        // A singleton would be of type object.
        expect(typeof EventStore).toBe('function');
    });

    describe('instance:', () => {
        const testEvent = 'testEvent';
        const testData = { a: 1, b: false, c: 'true' };
        const testData2 = ['test', true, null];

        let eventStore;

        beforeEach(() => {
            eventStore = new EventStore();
        });

        afterEach(() => {
            eventbus.emit.resetHistory();
        });

        describe('getStoredEvents:', () => {
            it('should return an array', () => {
                expect(Array.isArray(eventStore.getStoredEvents())).toBeTruthy();
            });

            it('should initialise with an empty store', () => {
                expect(eventStore.getStoredEvents().length).toBe(0);
            });

            it('should return all stored events', () => {
                eventStore.storeEvent(testEvent, testData);
                eventStore.storeEvent(testEvent, testData);
                eventStore.storeEvent(testEvent, testData);
                eventStore.storeEvent(testEvent, testData);
                eventStore.storeEvent(testEvent, testData);

                expect(eventStore.getStoredEvents().length).toBe(5);
            });

            it('should return stored events with "name" and "data"', () => {
                eventStore.storeEvent(testEvent, testData);
                expect(Object.keys(eventStore.getStoredEvents()[0])).toEqual(['name', 'data']);
            });

            it('should return a clone of stored events by default', () => {
                eventStore.storeEvent(testEvent, testData);

                const clone = eventStore.getStoredEvents()[0];
                const actual = eventStore.getStoredEvents(true)[0];

                expect(clone).not.toBe(actual);
            });

            it('should not clone user supplied rest parameters when called with debug', () => {
                eventStore.storeEvent(testEvent, testData);

                const result = eventStore.getStoredEvents(true)[0];

                expect(result.data).toBe(testData);
            });
        });

        describe('storeEvent:', () => {
            it('should store events with "name" and "data"', () => {
                eventStore.storeEvent(testEvent, testData);

                expect(eventStore.getStoredEvents()[0]).toEqual({
                    name: testEvent,
                    data: testData,
                });
            });

            it('should store parameters as an object', () => {
                eventStore.storeEvent(testEvent, testData);

                expect(eventStore.getStoredEvents()[0].data).not.toBeUndefined();

                eventStore.storeEvent(testEvent, testData, testData2);

                expect(eventStore.getStoredEvents()[1].data).not.toBeUndefined();
            });

            it('should dispatch the event on the event bus', () => {
                eventStore.storeEvent(testEvent, testData);
                sinon.assert.callCount(eventbus.emit, 2);
                sinon.assert.calledWith(eventbus.emit, 'ceddl:events', eventStore.getStoredEvents());
                sinon.assert.calledWith(eventbus.emit, testEvent, testData);
            });
        });

        describe('clearStore:', () => {
            it('should remove all stored events', () => {
                eventStore.storeEvent(testEvent, testData);
                eventStore.storeEvent(testEvent, testData);
                eventStore.storeEvent(testEvent, testData);

                eventStore.clearStore();
                const result = eventStore.getStoredEvents();

                expect(result.length).toBe(0);
            });

            it('should keep the reference to the store intact', () => {
                eventStore.storeEvent(testEvent, testData);

                const firstReference = eventStore.getStoredEvents(true);
                eventStore.clearStore();
                const cleanedReference = eventStore.getStoredEvents(true);

                expect(cleanedReference).toBe(firstReference);
            });
        });
    });
});
