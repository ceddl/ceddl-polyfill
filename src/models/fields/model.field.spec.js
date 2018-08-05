import ModelField from './model.field.js';
import ModelFactory from '../model-factory.js';

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

    it('should allow a non model instance value, but should give warning', () => {
        let notModelField = new ModelField('poop', 'test', 'test', true);
        expect(notModelField.getErrors()).toBeFalsy();
        expect(notModelField.getWarnings()[0].msg).toBe('poop is not a valid Model');
    });

    it('should allow an empty value on non-required fields', () => {
        let emptyModelField = new ModelField(testModel, 'test', null, false);
        expect(emptyModelField.getErrors()).toBeFalsy();
        expect(emptyModelField.getWarnings()).toBeFalsy();
    });

    it('should validate incorrect models, but should give warning', () => {
        let modelField = new ModelField(testModel, 'field', {
            name: 5,
            kek: 'bar',
        }, true);
        expect(modelField.getErrors()).toBe(null);
        expect(modelField.getWarnings()[0].msg).toBe('Invalid value for StringField name: 5');
    });

    it('should default isFlat and isList', () => {
        expect(ModelField.isFlat()).toBe(false);
        expect(ModelField.isList()).toBe(false);
    });
});
