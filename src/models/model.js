/**
 * Defines an abstract data model
 * Creates an instance of Model.
 * @param {Array} args model fields
 * @memberof Model
 */
function Model(args) {
    this._args = args;
    this.fields = {};
};

Model.prototype.setField = function(key, fieldObj) {
    this.fields[key] = fieldObj;
}

Model.prototype.getValue = function() {
    const validation = this.validate();
    if (validation.valid) {
        var data = {};

        for (var key in this.fields) {
            var field = this.fields[key];
            var value = field.getValue();
            if (value !== null && value !== undefined) {
                data[key] = value;
            }
        }

        return data;
    } else {
        return {error: 'Cant get values from an invalid Model'};
    }
}

/**
 * Validate the model
 *
 * @returns {{valid: boolean, errors: Array, warnings: Array}}
 * @memberof Model
 */
Model.prototype.validate = function() {
    var errors = [],
        warnings = [];

    for (var key in this.fields) {
        var field = this.fields[key];
        var fieldErrors = field.getErrors();
        var fieldWarnings = field.getWarnings();
        if (fieldErrors) {
            errors.push({
                field: key,
                msg: fieldErrors
            });
        }
        if (fieldWarnings) {
            warnings.push({
                field: key,
                msg: fieldWarnings
            });
        }
    }

    return {
        valid: errors.length <= 0,
        errors: errors,
        warnings: warnings
    }
}


export default Model;
