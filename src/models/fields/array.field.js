import Field from './field';


function ArrayField(field, key, list, required) {
    Field.call(this, key, list, required);
    this._items = [];
    if (list) {
        for (let i in list) {
            let item = list[i];
            try {
                this._items.push(new field(key+i, item, true));
            } catch(e) {
                /**
                 * The field's error message
                 *
                 * @public
                 */
                // TODO: fix warning message
                this.warning = `${field} is not a valid field`;
            }
        }
    }
}

ArrayField.isFlat = function() {
    return true;
}

ArrayField.isList = function() {
    return false;
}

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

    if (this.error) {
        errors.push({
            field: this.key,
            msg: this.error
        });
    }

    for (var item of this._items) {
        var error = item.getErrors();
        if (error) {
            errors.push({
                field: item.key,
                msg: error,
            });
        }
    }

    return (errors.length > 0 && errors) || null;
}

/**
 * Get list of warnings from models in the list, prepended by own warning Object
 *
 * @returns {Array.<{field: string, msg: string}>} List of warning Objects
 * @memberof ArrayField
 */
ArrayField.prototype.getWarnings = function() {
    var warnings = [];

    if (this.warning) {
        warnings.push({
            field: this.key,
            msg: this.warning
        });
    }

    for (var item of this._items) {
        var warning = item.getWarnings();
        if (warning) {
            warnings.push({
                field: item.key,
                msg: warning,
            });
        }
    }

    return (warnings.length > 0 && warnings) || null;
}


export default ArrayField;

