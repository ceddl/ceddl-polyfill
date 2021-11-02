// Type definitions for @ceddl/ceddl-polyfill 1.0.0
// Project: https://www.ceddlbyexample.com/
// Definitions by: Roland Broekema <https://github.com/broekema41>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 4.4

declare module "@ceddl/ceddl-polyfill" {
    export default Ceddl;
}


declare const Ceddl: {
    /**
     * The initialize function makes it possible to allow async loading of the models
     * and initialize the html interface when ready.
     */
    initialize(): void;
    emitEvent(name: string, data: any): void;
    emitModel(name: string, data: any): void;
    /**
     * Returns all stored models.
     * @returns {Object}
     */
    getModels(): any;
    /**
     * Returns all stored events.
     * @returns {Array}
     */
    getEvents(): any[];
    modelFactory: typeof ModelFactory;
    eventbus: typeof Eventbus;
}


/**
 * Details not for implementer.
 */
export class Model {}
interface StringField {}
interface BooleanField {}
interface ModelField {}
interface ListField {}
interface NumberField {}
interface ArrayField {}

export interface ModelConfig {
    key: string;
    extends?: string;
    fields: {
        [key: string]: {
            type: StringField | BooleanField | ModelField | ListField | NumberField | ArrayField;
            foreignModel?: string;
            required: boolean;
            pattern?: string;
        }
    },
}

declare const ModelFactory: {
    fields: {
        StringField: StringField;
        BooleanField: BooleanField;
        ModelField: ModelField;
        ListField: ListField;
        NumberField: NumberField;
        ArrayField: ArrayField;
    };
    /**
     * Create a new model for validating data
     *
     * @param {Object} modelArgs
     * @param {string} modelArgs.key The model identifier
     * @param {Array.<{type: Field, foreignModel?: Model, required: boolean}>} modelArgs.fields The model's fields
     * @returns {Model} The created model
     * @memberof ModelFactory
     */
    create(modelConfig: ModelConfig): Model;
}


declare const Eventbus: {
    /**
     * Remove a specific callback from an event, or remove all callbacks from an
     * event by not passing a function and scope. When removing bound functions
     * you must also pass the correct scope.
     * @param {String} name Name of the event remove listeners from.
     * @param {Function?} callback Function to remove from callback list.
     * @param {any?} scope Scope the supplied callback was bound to.
     */
    off(name: string, callback: Function | null, scope?: any | null): void;
    /**
     * Adds a listener to be invoked when events of the specified type are
     * emitted. An optional calling context may be provided. The data arguments
     * emitted will be passed to the listener function.
     *
     * @param {String} name - Name of the event to listen to
     * @param {Function} callback - Function to invoke when the specified event is
     *   emitted
     * @param {any} scope - Optional context object to use when invoking the
     *   listener
     */
    on(name: string, callback: Function, scope?: any): void;
    /**
     * Similar to on, except that the listener is removed after it is
     * invoked once.
     *
     * @param {String} name - Name of the event to listen to
     * @param {Function} callback - Function to invoke only once when the
     *   specified event is emitted
     * @param {any} scope - Optional context object to use when invoking the
     *   listener
     */
    once(name: string, callback: Function, scope?: any): void;
    /**
     * Emits an event of the given type with the given data. All handlers of that
     * particular type will be notified. Arbitrary arguments can be passed
     * in many forms and will be forwarded to the listeners
     *
     * @param {string} name - Name of the event to emit
     * @param {...any} args Arguments to pass through to the listeners.
     * @example
     *   eventbus.on('someEvent', function(message) {
     *     console.log(message);
     *   });
     *
     *   eventbus.emit('someEvent', 'abc'); // logs 'abc'
     */
    emit(name: string, ...args: any[]): void;
}
