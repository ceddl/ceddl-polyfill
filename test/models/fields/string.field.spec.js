import StringField from '../../../src/models/fields/string.field.js';

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

    it('should allow a regex test pattern', () => {
        let choiceField = new StringField('choicetest', 'appel', true, '^(appel|peer)$');
        expect(choiceField.getErrors()).toBe(undefined);
    });

    it('should error when not matching the regex test pattern', () => {
        let nonChoiceField = new StringField('choicetest', 'banana', true, '^(appel|peer)$');
        expect(nonChoiceField.getErrors()).toBeTruthy();
    });

    it('should error when not matching the more complex regex test pattern', () => {
        // eslint-disable-next-line no-useless-escape
        let nonChoiceField = new StringField('choicetest', '1.0.111', true, '^1\.0\.[0-9]{0,2}$');
        expect(nonChoiceField.getErrors()).toBeTruthy();
    });

    it('should not error when not matching the more complex regex test pattern', () => {
        // eslint-disable-next-line no-useless-escape
        let nonChoiceField = new StringField('choicetest', '1.0.95', true, '^1\.0\.[0-9]{0,2}$');
        expect(nonChoiceField.getErrors()).toBe(undefined);
    });

    it('should not error if not required and undefined', () => {
        let nonChoiceField = new StringField('choicetest', undefined, false, '^(appel|peer)$');
        expect(nonChoiceField.getErrors()).toBe(undefined);
    });

    it('should default isFlat and isList', () => {
        expect(StringField.isFlat()).toBe(true);
        expect(StringField.isList()).toBe(false);
    });

});
