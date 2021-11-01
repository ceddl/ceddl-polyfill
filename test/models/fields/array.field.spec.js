import { ArrayField } from '../../../src/models/fields/array.field.js';
import { StringField } from '../../../src/models/fields/string.field.js';

describe('ArrayField', () => {
    it('should allow a list of valid data types', () => {
        let arrayField = new ArrayField(StringField, 'products', ['appel', 'banaan'], true);
        expect(arrayField.getErrors()).toBeFalsy();
        expect(arrayField._items.length).not.toBe(0);
    });

    it('should NOT allow incorrect data types', () => {
        let arrayField = new ArrayField(StringField, 'products', [false, 'banaan'], true);
        expect(arrayField.getErrors()).toBeTruthy();
    });

    it('should pass field errors', () => {
        let arrayField = new ArrayField(StringField, 'products', ['banaan', 5], true);
        expect(arrayField.getErrors()).toBeTruthy();
        expect(Array.isArray(arrayField.getErrors())).toBe(true);
    });

    it('should not allow something that is not a field', () => {
        let arrayField = new ArrayField('Not a field', 'products', ['banaan', 5], true);
        expect(arrayField.getErrors()).toBeTruthy();
        expect(Array.isArray(arrayField.getErrors())).toBe(true);
    });

    it('shouldnt error when value passed is empty', () => {
        let arrayField = new ArrayField('field', 'field', null, false);
        expect (arrayField.getErrors()).toBeFalsy();
    });

    it('should default isFlat and isList', () => {
        expect(ArrayField.isFlat()).toBe(true);
        expect(ArrayField.isList()).toBe(false);
    });

});
