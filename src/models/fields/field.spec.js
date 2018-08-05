import Field from './field.js';

describe('Field', () => {
    it('should allow an empty value for non-required field', () => {
        let field = new Field('test', null, false);
        expect(field.getErrors()).toBeFalsy();
    });

    it('should allow an empty value for a required field, but should give warning', () => {
        let field = new Field('test', null, true);
        expect(field.getErrors()).toBeFalsy();
        expect(field.getWarnings()).toBe('Required field test not set');
    });

    it('should default isFlat and isList', () => {
        let field = new Field('test', 'foo', true);
        expect(field.getValue()).toBe('foo');
        expect(Field.isFlat()).toBe(true);
        expect(Field.isList()).toBe(false);
    });

});
