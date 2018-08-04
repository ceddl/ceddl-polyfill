import ModelFactory from './model-factory.js';

describe('ModelFactory', () => {
    function createModel() {
        return ModelFactory.create({
            key: 'model',
            fields: {
                field: {
                    type: ModelFactory.fields.StringField,
                    required: true,
                },
                modelField: {
                    type: ModelFactory.fields.ModelField,
                    required: true,
                },
                nonTypeField: {
                    required: true,
                }
            },
        });
    }

    it('should support making a model', () => {
        let model = createModel();
        expect(typeof model).toEqual('function');
    });

    it('should expose a function to get the fields from the model', () => {
        let model = createModel();
        let fieldNames = []
        for (let key in model.getFields()) {
            fieldNames.push(key);
        }
        expect(fieldNames).toEqual([ 'field', 'modelField', 'nonTypeField' ]);
    });

    it('should expose a function to get if model is a root model and default to false', () => {
        let model = createModel();
        expect(model.isRoot()).toBe(false);
    });

    it('should support extending a model', () => {
        let model = createModel();
        let extended = ModelFactory.create({
            key: 'extended',
            extends: 'model',
            fields: {
                extendedField: {
                    type: ModelFactory.fields.StringField,
                    required: true,
                },
            },
        });

        expect(typeof extended).toEqual('function');
    });
});
