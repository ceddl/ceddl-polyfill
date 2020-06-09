import ModelField from '../../../src/models/fields/model.field.js';
import ModelFactory from '../../../src/models/model-factory.js';

describe('ModelField', () => {
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

    it('should allow a model instance as value', () => {
        let modelField = new ModelField(testModel, 'product', {
            name: 'test',
            kek: 'lel',
        }, true);

        expect(modelField.getErrors()).toBeFalsy();
    });

    it('should NOT allow a non model instance value', () => {
        let notModelField = new ModelField('poop', 'test', 'test', true);
        expect(notModelField.getErrors()).toBeTruthy();
    });

    it('should allow an empty value on non-required fields', () => {
        let emptyModelField = new ModelField(testModel, 'test', null, false);
        expect(emptyModelField.getErrors()).toBeFalsy();
    });

    it('should invalidate incorrect models', () => {
        let modelField = new ModelField(testModel, 'field', {
            name: 5,
            kek: 'bar',
        }, true);

        expect (modelField.getErrors().length).not.toBe(0);
    });

    it('should default isFlat and isList', () => {
        expect(ModelField.isFlat()).toBe(false);
        expect(ModelField.isList()).toBe(false);
    });

});
