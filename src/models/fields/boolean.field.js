import Field from './field';

/**
 * Create a BooleanField on a model to validate a boolean value
 * Creates an instance of BooleanField.
 * @param {string} key Key of the field sent to analytics
 * @param {boolean} value The value of the field
 * @param {boolean} required Is the field required?
 * @memberof BooleanField
 */
function BooleanField(key, value, required) {
    Field.call(this, key, value, required);
    var _trueStrings = ['true', 'TRUE', 'True'];
    var _falseStrings = ['false', 'FALSE', 'False'];
    var _allowedStrings = [].concat(_trueStrings, _falseStrings);

    if (value !== undefined && value !== null && (typeof value === 'boolean' || _allowedStrings.indexOf(value) > -1)) {
        if (typeof value === 'string') {
            if (_trueStrings.indexOf(value) > -1) {
                this.value = true
            } else {
                this.value = false;
            }
        } else {
            this.value = value;
        }
    } else {
        if (value !== undefined && value !== null && typeof value !== 'boolean') {
            this.error = 'Invalid value for BooleanField ' + key + ': ' + value;
        }
    }
}

BooleanField.isFlat = function() {
    return true;
}

BooleanField.isList = function() {
    return false;
}

BooleanField.prototype = Object.create(Field.prototype);
BooleanField.prototype.constructor = BooleanField;

export default BooleanField;
