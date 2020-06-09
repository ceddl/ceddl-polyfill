import ListField from '../../../src/models/fields/list.field.js';
import ModelFactory from '../../../src/models/model-factory.js';

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
        ], true, undefined, ModelFactory);
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
        ], true, undefined, ModelFactory);
        expect(listField.getErrors()).toBeFalsy();
        expect(listField._items.length).not.toBe(0);
    });

    it('should NOT allow non-model values', () => {
        let notModelListField = new ListField('poop', 'testlist', 'test', true);
        expect(notModelListField.getErrors()).toBeTruthy();
    });

    it('should pass model errors', () => {
        let errorListField = new ListField(testModel, 'errortest', [
            {
                name: 'Not all fields are here!',
            }
        ], true, undefined, ModelFactory);
        expect(Array.isArray(errorListField.getErrors())).toBe(true);
    });

    it('shouldnt error when value passed is empty', () => {
        let listField = new ListField(testModel, 'field', null, false);

        expect (listField.getErrors()).toBeFalsy();
    });

    it('should validate correct models', () => {
        let listField = new ListField(testModel, 'field', [{
            name: 'test',
            kek: 'bar',
        }], true, undefined, ModelFactory);

        expect(listField.getErrors()).toBeFalsy();
    });

    it('should default isFlat and isList', () => {
        expect(ListField.isFlat()).toBe(false);
        expect(ListField.isList()).toBe(true);
    });

});

