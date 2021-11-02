// Type definitions for @ceddl/ceddl-polyfill 1.0.0
// Project: https://www.ceddlbyexample.com/
// Definitions by: Roland Broekema <https://github.com/broekema41>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 4.4

declare module "@ceddl/ceddl-polyfill" {
    export default Ceddl;
}

declare class Ceddl {
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
    get modelFactory(): any;
    get eventbus(): any;
}
