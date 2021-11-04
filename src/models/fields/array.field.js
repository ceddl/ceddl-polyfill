import { Field } from './field.js';


function ArrayField(field, key, list, required) {
    Field.call(this, key, list, required);
    this._items = [];
    var item;
    if (list) {
        for (var i in list) {
            item = list[i];
            try {
                this._items.push(new field(key+i, item, true));
            } catch(e) {
                /**
                 * The field's error message
                 *
                 * @public
                 */
                // TODO: fix warning message
                this.error = field + ' is not a valid field';
            }
        }
    }
}

ArrayField.isFlat = function() {
    return true;
};

ArrayField.isList = function() {
    return false;
};

ArrayField.prototype = Object.create(Field.prototype);
ArrayField.prototype.constructor = ArrayField;

/**
 * Fetch field errors
 *
 * @returns {Array.<{field: string, msg: string}>} List of error Objects
 * @memberof ArrayField
 */
ArrayField.prototype.getErrors = function() {
    var errors = [];
    var item, error;

    if (this.error) {
        errors.push({
            field: this.key,
            msg: this.error
        });
    }

    for (var i = 0; i < this._items.length; i++) {
        item = this._items[i];
        error = item.getErrors();
        if (error) {
            errors.push({
                field: item.key,
                msg: error,
            });
        }
    }

    return (errors.length > 0 && errors) || null;
};


export { ArrayField };

