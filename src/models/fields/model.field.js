import Field from './field';

/**
 * Create a ModelField on a Model to nest the instance of another model in the field
 * Creates an instance of ModelField.
 * @param {Model} model The model of the to be nested data
 * @param {string} key Key for mapping data to the dataLayer
 * @param {Object} value Key-value map for creating model instance
 * @param {boolean} required Is the field required?
 * @memberof ModelField
 */
function ModelField(model, key, value, required) {
    Field.call(this, key, value, required);
    if (value) {
        try {
            this._object = new model(value);
        } catch(e) {
            /**
             * The field's error message
             *
             * @public
             */
            this.warning = `${model} is not a valid Model`;
        }
    } else {
        this._object = null;
    }
}

ModelField.prototype = Object.create(Field.prototype);
ModelField.prototype.constructor = ModelField;

ModelField.prototype.isFlat = function() {
    return false;
}

ModelField.prototype.isList = function() {
    return false;
}

ModelField.prototype.getValue = function() {
    return this._object ? this._object.getValue() : {};
}

/**
 * Get a list of errors from the model's fields, prepended by own error Object
 *
 * @returns {Array.<{field: string, msg: string}>} List of error Objects
 * @memberof ModelField
 */
ModelField.prototype.getErrors = function() {
    let errors = [];
    if (this.error) {
        errors.push({
            field: this.key,
            msg: this.error
        });
    }

    if (this._object) {
        let validator = this._object.validate();
        if (validator.errors.length > 0) {
            errors.push(...validator.errors);
        }
    }

    return (errors.length > 0 && errors) || null;
}

/**
 * Get a list of warnings from the model's fields, prepended by own warning Object
 *
 * @returns {Array.<{field: string, msg: string}>} List of warning Objects
 * @memberof ModelField
 */
ModelField.prototype.getWarnings = function() {
    let warnings = [];
    if (this.warning) {
        warnings.push({
            field: this.key,
            msg: this.warning
        });
    }

    if (this._object) {
        let validator = this._object.validate();
        if (validator.warnings.length > 0) {
            warnings.push(...validator.warnings);
        }
    }

    return (warnings.length > 0 && warnings) || null;
}


export default ModelField;
