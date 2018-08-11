import StringField from './string.field.js';

describe('StringField', () => {
    it('should allow a string value', () => {
        let stringField = new StringField('stringtest', 'Stringeling', true);
        expect(stringField.getErrors()).toBe(undefined);
    });

    it('should NOT allow a non-string value', () => {
        let nonStringField = new StringField('nonstringtest', 42, true);
        expect(nonStringField.getErrors()).toBeTruthy();
    });

    it('should NOT allow undefined string as a value', () => {
        let nonStringField = new StringField('nonstringtest', 'undefined', true);
        expect(nonStringField.getErrors()).toBeTruthy();
    });

    it('should allow one of the choices', () => {
        let choiceField = new StringField('choicetest', 'appel', true, 'appel|peer');
        expect(choiceField.getErrors()).toBe(undefined);
    });

    it('should error one of the choices', () => {
        let nonChoiceField = new StringField('choicetest', 'banaan', true, 'appel|peer');
        expect(nonChoiceField.getErrors()).toBeTruthy();
    });

    it('should not error if not required and undefined', () => {
        let nonChoiceField = new StringField('choicetest', undefined, false, 'appel|peer');
        expect(nonChoiceField.getErrors()).toBe(undefined);
    });

    it('should default isFlat and isList', () => {
        expect(StringField.isFlat()).toBe(true);
        expect(StringField.isList()).toBe(false);
    });

});
