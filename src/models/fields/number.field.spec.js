import NumberField from './number.field.js';

describe('NumberField', () => {
    it('should allow a numerical value', () => {
        let numberField = new NumberField('number', 5, true);
        expect(numberField.getErrors()).toBe(undefined);
    });

    it('should allow a numerical string value', () => {
        let stringNumField = new NumberField('number', '120', true);
        expect(stringNumField.getErrors()).toBe(undefined);
    });

    it('should allow a non-numerical value, but should give warning', () => {
        let notNumberField = new NumberField('string', 'test', true);
        expect(notNumberField.getErrors()).toBeFalsy();
        expect(notNumberField.getWarnings()).toBe('Invalid value for NumberField string: test');
    });

    it('should default isFlat and isList', () => {
        expect(NumberField.isFlat()).toBe(true);
        expect(NumberField.isList()).toBe(false);
    });
});
