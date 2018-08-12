import Field from './field';

/**
 * Create a StringField on a model to vaidate a string value
 * Creates an instance of StringField.
 * @param {any} key
 * @param {any} value
 * @param {any} required
 * @param {string} choices Choices for the field separated by a pipe (|)
 * @memberof StringField
 */
function StringField(key, value, required, choices) {
    Field.call(this, key, value, required);
    this._choices = choices && choices.split('|') || null;

    if (value !== null && value !== undefined && typeof value !== 'string') {
        this.error = 'Invalid value for StringField '+key+': '+value;
    }

    if (value === "undefined") {
        this.error = 'Invalid value for StringField '+key+': '+value;
    }

    if (value && choices && this._choices.indexOf(value) <= -1) {
        this.error = 'Invalid value for StringField ' +key+', should be '+choices;
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

export default StringField;
