import Field from './field';

/**
 * Create a ListField on a model to create a relation between that model and many instances of another Model
 * Creates an instance of ListField.
 * @param {Model} model The Model type for the relation
 * @param {string} key Key for the value sent to dataLayer
 * @param {Array} list List of objects for converting to Model instances
 * @param {boolean} required Is the field required?
 * @memberof ListField
 */
function ListField (model, key, list, required, choices, ModelFactory) {
    Field.call(this, key, list, required);
    this._items = [];
    if (list) {
        for (var item of list) {
            try {
                if (item._model) {
                    this._items.push(new ModelFactory.models[item._model](item));
                } else {
                    this._items.push(new model(item));
                }
            } catch(e) {
                /**
                 * The field's error message
                 *
                 * @public
                 */
                if (item._model) {
                    this.error = item._model + ' is not a valid Model';
                } else {
                    this.error = model + ' is not a valid Model';
                }

            }
        }
    }
}

ListField.isFlat = function() {
    return false;
};

ListField.isList = function() {
    return true;
};

ListField.prototype = Object.create(Field.prototype);
ListField.prototype.constructor = ListField;

/**
 * Get the values of all the instances in the list combined
 *
 * @returns {Object} values
 * @memberof ListField
 */
ListField.prototype.getValue = function() {
    var data = [];

    for (var item of this._items) {
        data.push(item.getValue());
    }

    return data;
};

/**
 * Get list of errors from models in the list, prepended by own error Object
 *
 * @returns {Array.<{field: string, msg: string}>} List of error Objects
 * @memberof ListField
 */
ListField.prototype.getErrors = function() {
    var errors = [];

    if (this.error) {
        errors.push({
            field: this.key,
            msg: this.error
        });
    }

    for (var item of this._items) {
        var validator = item.validate();
        if (validator.errors.length > 0) {
            errors.push(...validator.errors);
        }
    }

    return (errors.length > 0 && errors) || null;
};


export default ListField;
