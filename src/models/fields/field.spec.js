import Field from './field.js';

describe('Field', () => {
    it('should allow an empty value for non-required field', () => {
        let field = new Field('test', null, false);
        expect(field.getErrors()).toBeFalsy();
    });

    it('should NOT allow an empty value for a required field', () => {
        let field = new Field('test', null, true);
        expect(field.getErrors()).toBeTruthy();
    });

    it('should default isFlat and isList', () => {
        let field = new Field('test', 'foo', true);
        expect(field.getValue()).toBe('foo');
        expect(Field.isFlat()).toBe(true);
        expect(Field.isList()).toBe(false);
    });

});
