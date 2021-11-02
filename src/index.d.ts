// Type definitions for sizzle 2.3
// Project: https://sizzlejs.com
// Definitions by: Leonard Thieu <https://github.com/leonard-thieu>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

export { ceddl as default };
declare var ceddl: Ceddl;
declare class Ceddl {
    /**
     * The initialize function makes it possible to allow async loading of the models
     * and initialize the html interface when ready.
     */
    initialize(): void;
    emitEvent(name: any, data: any): void;
    emitModel(name: any, data: any): void;
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
    get modelFactory(): any;
    get eventbus(): any;
}
