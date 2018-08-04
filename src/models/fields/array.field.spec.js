import ArrayField from './array.field.js';
import StringField from './string.field.js';

describe('ArrayField', () => {
    it('should allow a list of valid data types', () => {
        let arrayField = new ArrayField(StringField, 'products', ['appel', 'banaan'], true);
        expect(arrayField.getErrors()).toBeFalsy();
        expect(arrayField._items.length).not.toBe(0);
    });

    it('should allow incorrect data types, but should give warning', () => {
        let arrayField = new ArrayField(StringField, 'products', [false, 'banaan'], true);
        expect(arrayField.getErrors()).toBeFalsy();
        expect(arrayField.getWarnings()[0].msg).toBe('Invalid value for StringField products0: false');
    });

    it('should pass field errors', () => {
        let arrayField = new ArrayField(StringField, 'products', ['banaan', 5], true);
        expect(arrayField.getErrors()).toBeFalsy();
        expect(arrayField.getWarnings()[0].msg).toBe('Invalid value for StringField products1: 5');
    });

    it('should allow something that is not a field, but should give warning', () => {
        let arrayField = new ArrayField('Not a field', 'products', ['banaan', 5], true);
        expect(arrayField.getErrors()).toBeFalsy();
        expect(arrayField.getWarnings()[0].msg).toBe('Not a field is not a valid field');
    });

    it('should NOT error or give warnings when value passed is empty', () => {
        let arrayField = new ArrayField('field', 'field', null, false);
        expect (arrayField.getErrors()).toBeFalsy();
        expect (arrayField.getWarnings()).toBeFalsy();
    });
});
