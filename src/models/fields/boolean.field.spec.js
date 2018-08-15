import BooleanField from './boolean.field.js';

describe('BooleanField', () => {
    it('should allow a boolean value', () => {
        let booleanField = new BooleanField('boolean', true, true);
        expect(booleanField.getErrors()).toBeFalsy();
        expect(booleanField.value).toBe(true);
        let booleanFieldFalse = new BooleanField('boolean', false, true);
        expect(booleanFieldFalse.getErrors()).toBeFalsy();
        expect(booleanFieldFalse.value).toBe(false);
    });

    it('should allow a boolean in string value', () => {
        let booleanStringField = new BooleanField('boolean', 'true', true);
        expect(booleanStringField.getErrors()).toBeFalsy();
        expect(booleanStringField.value).toBe(true);
        let booleanStringFieldFalse = new BooleanField('boolean', 'False', true);
        expect(booleanStringFieldFalse.getErrors()).toBeFalsy();
        expect(booleanStringFieldFalse.value).toBe(false);
    });

    it('should NOT allow a string value', () => {
        let stringField = new BooleanField('boolean', 'test', true);
        expect(stringField.getErrors()).toBeTruthy();
    });

    it('should default isFlat and isList', () => {
        expect(BooleanField.isFlat()).toBe(true);
        expect(BooleanField.isList()).toBe(false);
    });

});
