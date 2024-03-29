import { Logger } from '../utils/eventbus.js';
import { assign } from '../utils/assign.js';
import { Model } from './model.js';
import { StringField } from './fields/string.field.js';
import { BooleanField } from './fields/boolean.field.js';
import { ModelField } from './fields/model.field.js';
import { ListField } from './fields/list.field.js';
import { NumberField } from './fields/number.field.js';
import { ArrayField } from './fields/array.field.js';

/**
 * Class for creating models
 *
 * @class ModelFactoryClass
 */

function ModelFactoryClass () {
    this.models = {};
}

/**
 * getter function exposing all the field types on the modelfactory api
 */
Object.defineProperty(ModelFactoryClass.prototype, "fields", {
    get: function fields() {
        return {
            StringField: StringField,
            BooleanField: BooleanField,
            ModelField: ModelField,
            ListField: ListField,
            NumberField: NumberField,
            ArrayField: ArrayField,
        };
    }
});

/**
 * Create a new model for validating data
 *
 * @param {Object} modelArgs
 * @param {string} modelArgs.key The model identifier
 * @param {Array.<{type: Field, foreignModel?: Model, required: boolean}>} modelArgs.fields The model's fields
 * @returns {Model} The created model
 * @memberof ModelFactory
 */
ModelFactoryClass.prototype.create = function(modelArgs) {
    var mf = this;
    var model = function(values) {
        var myModel;
        if (modelArgs.extends) {
            myModel = new mf.models[modelArgs.extends](values);
        } else {
            myModel = new Model(values);
            myModel.fields = {};
        }

        for (var key in modelArgs.fields) {
            var field = modelArgs.fields[key];

            if (field.type) {
                // TODO: Refactor weird if statements
                if (field.type === ModelField || field.type === ListField) {

                    var foreignModel = mf.models[field.foreignModel];
                    if (foreignModel) {
                        myModel.fields[key] = new field.type(foreignModel, key, values[key], field.required, field.pattern, mf);
                    } else {
                        Logger.warn('foreignModel on '+modelArgs.key+' is not defined');
                    }
                } else if (field.type === ArrayField) {
                    myModel.fields[key] = new field.type(field.fieldType, key, values[key], field.required, field.pattern);
                } else {
                    myModel.fields[key] = new field.type(key, values[key], field.required, field.pattern);
                }
            } else {
                Logger.warn(field.type+' is not a valid field type.');
            }
        }

        return myModel;
    };

    model.getFields = function() {
        var fields = {};
        if (modelArgs.extends) {
            fields = new mf.models[modelArgs.extends].getFields();
        }

        assign(fields, modelArgs.fields);
        return fields;
    };

    model.isRoot = function() {
       return modelArgs.root ? modelArgs.root : false;
    };

    mf.models[modelArgs.key] = model;

    return model;
};
var ModelFactory = new ModelFactoryClass();
export { ModelFactory };
