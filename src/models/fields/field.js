
/**
 * Defines an abstract model field
 * Creates an instance of Field.
 * @param {string} key Key for mapping value to dataLayer
 * @param {any} value Field value
 * @param {boolean} required Is the field required?
 * @memberof Field
 */
function Field (key, value, required) {
    if ((value === undefined || value === null || value.length <= 0) && required) {
        /**
         * Will be set if something is wrong with the value passed to the field
         * @public
         */
        this.error = 'Required field ' + key + ' not set';
    }

    /**
     * The key for the key-value pair in the final dataObject
     * @public
     */
    this.key = key;

    /**
     * The inner value of the field
     * @public
     */
    this.value = value;
}

Field.isFlat = function() {
    return true;
}

Field.isList = function() {
    return false;
}

/**
 * Get the inner value of the field. Primarily here to be overridden by ModelField and ListField
 *
 * @returns {any} value
 * @memberof Field
 */
Field.prototype.getValue = function() {
    return this.value;
}

/**
 * Get the field's error message
 *
 * @returns {string} error message
 * @memberof Field
 */
Field.prototype.getErrors = function() {
    return this.error;
}

export default Field;
