import StringField from './string.field.js';

describe('StringField', () => {
    it('should allow a string value', () => {
        let stringField = new StringField('stringtest', 'Stringeling', true);
        expect(stringField.getErrors()).toBe(undefined);
    });

    it('should allow a non-string value, but should give warning', () => {
        let nonStringField = new StringField('nonstringtest', 42, true);
        expect(nonStringField.getErrors()).toBeFalsy();
        expect(nonStringField.getWarnings()).toBe('Invalid value for StringField nonstringtest: 42');
    });

    it('should allow undefined string as a value, but should give warning', () => {
        let nonStringField = new StringField('nonstringtest', 'undefined', true);
        expect(nonStringField.getErrors()).toBeFalsy();
        expect(nonStringField.getWarnings()).toBe('Invalid value for StringField nonstringtest: undefined');
    });

    it('should allow one of the choices', () => {
        let choiceField = new StringField('choicetest', 'appel', true, 'appel|peer');
        expect(choiceField.getErrors()).toBe(undefined);
    });

    it('should allow a different value than one of the choices, but should give warning', () => {
        let nonChoiceField = new StringField('choicetest', 'banaan', true, 'appel|peer');
        expect(nonChoiceField.getErrors()).toBeFalsy();
    });

    it('should not error or give warning if not required and undefined', () => {
        let nonChoiceField = new StringField('choicetest', undefined, false, 'appel|peer');
        expect(nonChoiceField.getErrors()).toBe(undefined);
        expect(nonChoiceField.getWarnings()).toBeFalsy();
    });

});
