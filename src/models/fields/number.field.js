import Field from './field';

/**
 * Create a NumberField on a model to validate a number value
 * Creates an instance of NumberField.
 * @param {string} key The field's key for sending to analytics
 * @param {number} value The field's value
 * @param {boolean} required Is the field required?
 * @memberof NumberField
 */
function NumberField(key, value, required) {
    Field.call(this, key, value, required);
    if (value) {
        this.value = parseFloat(value);

        if (isNaN(this.value)) {
            this.error = 'Invalid value for NumberField '+ key +':'+value;
        }
    }
}

NumberField.isFlat = function() {
    return true;
};

NumberField.isList = function() {
    return false;
};

NumberField.prototype = Object.create(Field.prototype);
NumberField.prototype.constructor = NumberField;

export default NumberField;
