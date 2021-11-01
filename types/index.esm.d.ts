export { index as default };
declare var index: Base;
declare function Base(): void;
declare class Base {
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
    get modelFactory(): ModelFactoryClass;
    get eventbus(): () => any;
}
/**
 * Class for creating models
 *
 * @class ModelFactoryClass
 */
declare function ModelFactoryClass(): void;
declare class ModelFactoryClass {
    models: {};
    get fields(): {
        StringField: typeof StringField;
        BooleanField: typeof BooleanField;
        ModelField: typeof ModelField;
        ListField: typeof ListField;
        NumberField: typeof NumberField;
        ArrayField: typeof ArrayField;
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
    create(modelArgs: {
        key: string;
        fields: Array<{
            type: Field;
            foreignModel?: Model;
            required: boolean;
        }>;
    }): Model;
}
/**
 * Create a StringField on a model to vaidate a string value
 * Creates an instance of StringField.
 * @param {any} key
 * @param {any} value
 * @param {any} required
 * @param {string} pattern regex pattern
 * @memberof StringField
 */
declare function StringField(key: any, value: any, required: any, pattern: string): void;
declare class StringField {
    /**
     * Create a StringField on a model to vaidate a string value
     * Creates an instance of StringField.
     * @param {any} key
     * @param {any} value
     * @param {any} required
     * @param {string} pattern regex pattern
     * @memberof StringField
     */
    constructor(key: any, value: any, required: any, pattern: string);
    _patternReg: RegExp;
    error: string;
    constructor: typeof StringField;
}
declare namespace StringField {
    function isFlat(): boolean;
    function isList(): boolean;
}
/**
 * Create a BooleanField on a model to validate a boolean value
 * Creates an instance of BooleanField.
 * @param {string} key Key of the field sent to analytics
 * @param {boolean} value The value of the field
 * @param {boolean} required Is the field required?
 * @memberof BooleanField
 */
declare function BooleanField(key: string, value: boolean, required: boolean): void;
declare class BooleanField {
    /**
     * Create a BooleanField on a model to validate a boolean value
     * Creates an instance of BooleanField.
     * @param {string} key Key of the field sent to analytics
     * @param {boolean} value The value of the field
     * @param {boolean} required Is the field required?
     * @memberof BooleanField
     */
    constructor(key: string, value: boolean, required: boolean);
    value: boolean;
    error: string;
    constructor: typeof BooleanField;
}
declare namespace BooleanField {
    function isFlat(): boolean;
    function isList(): boolean;
}
/**
 * Create a ModelField on a Model to nest the instance of another model in the field
 * Creates an instance of ModelField.
 * @param {Model} model The model of the to be nested data
 * @param {string} key Key for mapping data to the dataLayer
 * @param {Object} value Key-value map for creating model instance
 * @param {boolean} required Is the field required?
 * @memberof ModelField
 */
declare function ModelField(model: Model, key: string, value: any, required: boolean): void;
declare class ModelField {
    /**
     * Create a ModelField on a Model to nest the instance of another model in the field
     * Creates an instance of ModelField.
     * @param {Model} model The model of the to be nested data
     * @param {string} key Key for mapping data to the dataLayer
     * @param {Object} value Key-value map for creating model instance
     * @param {boolean} required Is the field required?
     * @memberof ModelField
     */
    constructor(model: Model, key: string, value: any, required: boolean);
    _object: any;
    /**
     * The field's error message
     *
     * @public
     */
    public error: string;
    constructor: typeof ModelField;
    getValue(): any;
    /**
     * Get a list of errors from the model's fields, prepended by own error Object
     *
     * @returns {Array.<{field: string, msg: string}>} List of error Objects
     * @memberof ModelField
     */
    getErrors(): Array<{
        field: string;
        msg: string;
    }>;
}
declare namespace ModelField {
    function isFlat(): boolean;
    function isList(): boolean;
}
/**
 * Create a ListField on a model to create a relation between that model and many instances of another Model
 * Creates an instance of ListField.
 * @param {Model} model The Model type for the relation
 * @param {string} key Key for the value sent to dataLayer
 * @param {Array} list List of objects for converting to Model instances
 * @param {boolean} required Is the field required?
 * @memberof ListField
 */
declare function ListField(model: Model, key: string, list: any[], required: boolean, pattern: any, ModelFactory: any): void;
declare class ListField {
    /**
     * Create a ListField on a model to create a relation between that model and many instances of another Model
     * Creates an instance of ListField.
     * @param {Model} model The Model type for the relation
     * @param {string} key Key for the value sent to dataLayer
     * @param {Array} list List of objects for converting to Model instances
     * @param {boolean} required Is the field required?
     * @memberof ListField
     */
    constructor(model: Model, key: string, list: any[], required: boolean, pattern: any, ModelFactory: any);
    _items: any[];
    error: string;
    constructor: typeof ListField;
    /**
     * Get the values of all the instances in the list combined
     *
     * @returns {Object} values
     * @memberof ListField
     */
    getValue(): any;
    /**
     * Get list of errors from models in the list, prepended by own error Object
     *
     * @returns {Array.<{field: string, msg: string}>} List of error Objects
     * @memberof ListField
     */
    getErrors(): Array<{
        field: string;
        msg: string;
    }>;
}
declare namespace ListField {
    function isFlat(): boolean;
    function isList(): boolean;
}
/**
 * Create a NumberField on a model to validate a number value
 * Creates an instance of NumberField.
 * @param {string} key The field's key for sending to analytics
 * @param {number} value The field's value
 * @param {boolean} required Is the field required?
 * @memberof NumberField
 */
declare function NumberField(key: string, value: number, required: boolean): void;
declare class NumberField {
    /**
     * Create a NumberField on a model to validate a number value
     * Creates an instance of NumberField.
     * @param {string} key The field's key for sending to analytics
     * @param {number} value The field's value
     * @param {boolean} required Is the field required?
     * @memberof NumberField
     */
    constructor(key: string, value: number, required: boolean);
    value: number;
    error: string;
    constructor: typeof NumberField;
}
declare namespace NumberField {
    function isFlat(): boolean;
    function isList(): boolean;
}
declare function ArrayField(field: any, key: any, list: any, required: any): void;
declare class ArrayField {
    constructor(field: any, key: any, list: any, required: any);
    _items: any[];
    /**
     * The field's error message
     *
     * @public
     */
    public error: string;
    constructor: typeof ArrayField;
    /**
     * Fetch field errors
     *
     * @returns {Array.<{field: string, msg: string}>} List of error Objects
     * @memberof ArrayField
     */
    getErrors(): Array<{
        field: string;
        msg: string;
    }>;
}
declare namespace ArrayField {
    function isFlat(): boolean;
    function isList(): boolean;
}
/**
 * Defines an abstract model field
 * Creates an instance of Field.
 * @param {string} key Key for mapping value to dataLayer
 * @param {any} value Field value
 * @param {boolean} required Is the field required?
 * @memberof Field
 */
declare function Field(key: string, value: any, required: boolean): void;
declare class Field {
    /**
     * Defines an abstract model field
     * Creates an instance of Field.
     * @param {string} key Key for mapping value to dataLayer
     * @param {any} value Field value
     * @param {boolean} required Is the field required?
     * @memberof Field
     */
    constructor(key: string, value: any, required: boolean);
    /**
     * Will be set if something is wrong with the value passed to the field
     * @public
     */
    public error: string;
    /**
     * The key for the key-value pair in the final dataObject
     * @public
     */
    public key: string;
    /**
     * The inner value of the field
     * @public
     */
    public value: any;
    /**
     * Get the inner value of the field. Primarily here to be overridden by ModelField and ListField
     *
     * @returns {any} value
     * @memberof Field
     */
    getValue(): any;
    /**
     * Get the field's error message
     *
     * @returns {string} error message
     * @memberof Field
     */
    getErrors(): string;
}
declare namespace Field {
    function isFlat(): boolean;
    function isList(): boolean;
}
/**
 * Defines an abstract data model
 * Creates an instance of Model.
 * @param {Array} args model fields
 * @memberof Model
 */
declare function Model(args: any[]): void;
declare class Model {
    /**
     * Defines an abstract data model
     * Creates an instance of Model.
     * @param {Array} args model fields
     * @memberof Model
     */
    constructor(args: any[]);
    _args: any[];
    fields: {};
    setField(key: any, fieldObj: any): void;
    getValue(): {};
    /**
     * Validate the model
     *
     * @returns {{valid: boolean, errors: Array, warnings: Array}}
     * @memberof Model
     */
    validate(): {
        valid: boolean;
        errors: any[];
        warnings: any[];
    };
}
