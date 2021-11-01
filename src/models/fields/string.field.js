import { Field } from './field.js';

/**
 * Create a StringField on a model to vaidate a string value
 * Creates an instance of StringField.
 * @param {any} key
 * @param {any} value
 * @param {any} required
 * @param {string} pattern regex pattern
 * @memberof StringField
 */
function StringField(key, value, required, pattern) {
    Field.call(this, key, value, required);
    this._patternReg = new RegExp(pattern);

    if (value !== null && value !== undefined && typeof value !== 'string') {
        this.error = 'Invalid value for StringField '+key+': '+value;
    }

    if (value === "undefined") {
        this.error = 'Invalid value for StringField '+key+': '+value;
    }

    if (value && pattern && !this._patternReg.test(value)) {
        this.error = 'Invalid value for StringField ' +key+', should be '+pattern;
    }
}

StringField.isFlat = function() {
    return true;
};

StringField.isList = function() {
    return false;
};

StringField.prototype = Object.create(Field.prototype);
StringField.prototype.constructor = StringField;

export{ StringField };
