import ListField from './list.field.js';
import ModelFactory from '../model-factory.js';

describe('ListField', () => {
    let testModel;

    beforeEach(() => {
        testModel = ModelFactory.create({
            key: 'test',
            fields: {
                name: {
                    type: ModelFactory.fields.StringField,
                    required: true,
                },
                kek: {
                    type: ModelFactory.fields.StringField,
                    required: true,
                },
            },
        });
    });

    it('should allow a list of valid model instances', () => {
        let listField = new ListField(testModel, 'products', [
            {
                name: 'test1',
                kek: 'lel',
            },
        ], true, ModelFactory);
        expect(listField.getErrors()).toBeFalsy();
        expect(listField._items.length).not.toBe(0);
    });

    it('should allow a overriding the model', () => {
        testModel = ModelFactory.create({
            key: 'override',
            fields: {
                foo: {
                    type: ModelFactory.fields.StringField,
                    required: true,
                },
            },
        });

        let listField = new ListField(testModel, 'products', [
            {
                _model: 'override',
                foo: 'bar',
            },
        ], true, ModelFactory);
        expect(listField.getErrors()).toBeFalsy();
        expect(listField._items.length).not.toBe(0);
    });

    it('should allow non-model values, but should give warning', () => {
        let notModelListField = new ListField('poop', 'testlist', 'test', true, ModelFactory);
        expect(notModelListField.getErrors()).toBeFalsy();
        expect(notModelListField.getWarnings()[0].msg).toBe('poop is not a valid Model');
    });

    it('should NOT error or give warning when value passed is empty', () => {
        let listField = new ListField(testModel, 'field', null, false, ModelFactory);

        expect (listField.getErrors()).toBeFalsy();
        expect (listField.getWarnings()).toBeFalsy();
    });

    it('should validate correct models', () => {
        let listField = new ListField(testModel, 'field', [{
            name: 'test',
            kek: 'bar',
        }], true, ModelFactory);

        expect (listField.getErrors()).toBeFalsy();
    });

    it('should default isFlat and isList', () => {
        expect(ListField.isFlat()).toBe(false);
        expect(ListField.isList()).toBe(true);
    });

});
