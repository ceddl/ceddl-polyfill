import { Eventbus } from '../../src/utils/eventbus';
describe('Eventbus', () => {

    it('should allow binding and unbind with a scope and emitting with arguments', () => {
        let count = 0;
        let scope = {scope: 'scope'};
        let cb = function(b, c) {
            expect(b).toBe('b');
            expect(c).toBe('c');
            expect(this).toBe(scope);
            count++;
        };
        Eventbus.on('a', cb, scope);
        Eventbus.emit('a', 'b', 'c');
        Eventbus.off('a', cb);
        Eventbus.emit('a', 'b', 'c');
        Eventbus.off('a', cb, scope);
        Eventbus.emit('a', 'b', 'c');
        expect(count).toBe(2);
    });

    it('should allow binding and unbind by callback without scope', () => {
        let count = 0;
        let cb1 = function() {
            expect(this.constructor.name).toBe('EventbusClass');
            count++;
        };
        let cb2 = function() {
            expect(this.constructor.name).toBe('EventbusClass');
            count++;
        };
        Eventbus.on('b', cb1);
        Eventbus.on('b', cb2);
        Eventbus.emit('b', 'b');
        Eventbus.off('b', cb1);
        Eventbus.emit('b', 'b');
        expect(count).toBe(3);
    });

    it('should allow removal of all listeners by name', () => {
        let count = 0;
        let cb1 = function() {
            count++;
        };
        let cb2 = function() {
            count++;
        };
        Eventbus.on('c', cb1);
        Eventbus.on('c', cb2);
        Eventbus.emit('c', 'b', 'c');
        Eventbus.off('c');
        Eventbus.emit('c', 'b', 'c');
        expect(count).toBe(2);
    });

    it('should allow a listener to remove itselfe when called via once with scope', () => {
        let count = 0;
        let scope = {scope: 'scope'};
        let cb1 = function() {
            count++;
        };
        let cb2 = function() {
            count++;
        };
        Eventbus.once('d', cb1, scope);
        Eventbus.on('d', cb2, scope);
        Eventbus.emit('d', 'b', 'c');
        Eventbus.emit('d', 'b', 'c');
        expect(count).toBe(3);
    });

    it('should allow a listener to remove itselfe when called via once without scope', () => {
        let count = 0;
        let scope = {scope: 'scope'};
        let cb1 = function() {
            count++;
        };
        let cb2 = function() {
            count++;
        };
        Eventbus.once('e', cb1);
        Eventbus.on('e', cb1, scope);
        Eventbus.on('e', cb2);
        Eventbus.emit('e', 'b', 'c');
        Eventbus.emit('e', 'b', 'c');
        expect(count).toBe(5);
    });

    it('should callback immediately with the current value if exists', () => {
        let count = 0;
        let scope = {scope: 'scope'};
        let cb = function(b) {
            count++;
            expect(this.constructor.name).toBe('EventbusClass');
            expect(b).toBe('b');
        };
        let cbOnce = function(b) {
            count++;
            expect(this).toBe(scope);
            expect(b).toBe('b');
        };
        Eventbus.emit('f', 'b');
        Eventbus.on('f', cb);
        Eventbus.once('f', cbOnce, scope);
        Eventbus.emit('f', 'b');
        expect(count).toBe(3);
    });

    /**
     * Verry important that when js throws an error
     * in the listener or tag container. The js process should
     * never stop but be logged to the console.
     */
    it('should fire all events even if one throws an exception', () => {
        let count = 0;
        let cb1 = function() {
            expect(this.constructor.name).toBe('EventbusClass');
            count++;
        };
        let excFunc = function() {
            throw new Error('testing: external error on eventbus should not stop analytics process');
            count++; // eslint-disable-line
        };

        Eventbus.on('g', excFunc);
        Eventbus.on('g', cb1);
        Eventbus.emit('g');
        expect(count).toBe(1);
    });

});
