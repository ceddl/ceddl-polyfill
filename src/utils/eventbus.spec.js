import eventbus from './eventbus';
describe('Eventbus', () => {

    it('should allow binding and unbind with a scope and emitting with arguments', () => {
        let count = 0;
        let scope = {scope: 'scope'};
        let cb = function(b, c) {
            expect(b).toBe('b');
            expect(c).toBe('c');
            expect(this).toBe(scope);
            count++;
        }
        eventbus.on('a', cb, scope);
        eventbus.emit('a', 'b', 'c');
        eventbus.off('a', cb);
        eventbus.emit('a', 'b', 'c');
        eventbus.off('a', cb, scope);
        eventbus.emit('a', 'b', 'c');
        expect(count).toBe(2);
    });

    it('should allow binding and unbind by callback without scope', () => {
        let count = 0;
        let cb1 = function(b, c) {
            expect(this.constructor.name).toBe('Eventbus');
            count++;
        }
        let cb2 = function(b, c) {
            expect(this.constructor.name).toBe('Eventbus');
            count++;
        }
        eventbus.on('b', cb1);
        eventbus.on('b', cb2);
        eventbus.emit('b', 'b');
        eventbus.off('b', cb1);
        eventbus.emit('b', 'b');
        expect(count).toBe(3);
    });

    it('should allow removal of all listeners by name', () => {
        let count = 0;
        let cb1 = function(b, c) {
            count++;
        }
        let cb2 = function(b, c) {
            count++;
        }
        eventbus.on('c', cb1);
        eventbus.on('c', cb2);
        eventbus.emit('c', 'b', 'c');
        eventbus.off('c');
        eventbus.emit('c', 'b', 'c');
        expect(count).toBe(2);
    });

    it('should allow a listener to remove itselfe when called via once with scope', () => {
        let count = 0;
        let scope = {scope: 'scope'};
        let cb1 = function(b, c) {
            count++;
        }
        let cb2 = function(b, c) {
            count++;
        }
        eventbus.once('d', cb1, scope);
        eventbus.on('d', cb2, scope);
        eventbus.emit('d', 'b', 'c');
        eventbus.emit('d', 'b', 'c');
        expect(count).toBe(3);
    });

    it('should allow a listener to remove itselfe when called via once without scope', () => {
        let count = 0;
        let scope = {scope: 'scope'};
        let cb1 = function(b, c) {
            count++;
        }
        let cb2 = function(b, c) {
            count++;
        }
        eventbus.once('e', cb1);
        eventbus.on('e', cb1, scope);
        eventbus.on('e', cb2);
        eventbus.emit('e', 'b', 'c');
        eventbus.emit('e', 'b', 'c');
        expect(count).toBe(5);
    });

    it('should callback immediately with the current value if exists', () => {
        let count = 0;
        let scope = {scope: 'scope'};
        let cb = function(b) {
            count++;
            expect(this.constructor.name).toBe('Eventbus');
            expect(b).toBe('b');
        }
        let cbOnce = function(b) {
            count++;
            expect(this).toBe(scope);
            expect(b).toBe('b');
        }
        eventbus.emit('f', 'b');
        eventbus.on('f', cb);
        eventbus.once('f', cbOnce, scope);
        eventbus.emit('f', 'b');
        expect(count).toBe(3);
    });

    /**
     * Verry important that when js throws an error
     * in the listener or tag container. The js process should
     * never stop but be logged to the console.
     */
    it('should fire all events even if one throws an exception', () => {
        let count = 0;
        let cb1 = function(b, c) {
            expect(this.constructor.name).toBe('Eventbus');
            count++;
        }
        let excFunc = function(b, c) {
            throw new Error('testing: external error on eventbus should not stop analytics process');
            count++;
        };

        eventbus.on('g', excFunc);
        eventbus.on('g', cb1);
        eventbus.emit('g');
        expect(count).toBe(1);
    });

});
