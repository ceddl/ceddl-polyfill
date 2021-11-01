// Type definitions for sizzle 2.3
// Project: https://sizzlejs.com
// Definitions by: Leonard Thieu <https://github.com/leonard-thieu>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

export as namespace ceddl;

declare const ceddl: ceddlStatic;
export = ceddl;


interface ceddlStatic {
    initialize(): Function;
    emitEvent(name: string, data: any): Function;
    emitModel(name: string, data: any): Function;
    getModels(): any;
    getEvents(): any[];
    // get modelFactory(): typeof ModelFactory;
    // get eventbus(): typeof Eventbus;
    get modelFactory(): any;
    get eventbus(): any;

}

declare namespace ceddl {

}
