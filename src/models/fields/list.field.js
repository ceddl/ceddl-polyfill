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
function ListField (model, key, list, required, pattern, ModelFactory) {
    Field.call(this, key, list, required);
    this._items = [];
    var item;
    if (list) {
        for (var i = 0; i < list.length; i++) {
            item = list[i];
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
    var item;

    for (var i = 0; i < this._items.length; i++) {
        item = this._items[i];
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
    var item, validator;

    if (this.error) {
        errors.push({
            field: this.key,
            msg: this.error
        });
    }

    for (var i = 0; i < this._items.length; i++) {
        item = this._items[i];
        validator = item.validate();
        for (var j = 0; j < validator.errors.length; j++) {
            errors.push(validator.errors[j]);
        }
    }

    return (errors.length > 0 && errors) || null;
};


export default ListField;
