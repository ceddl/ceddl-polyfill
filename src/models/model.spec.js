import Model from './model.js';
import ModelFactory from './model-factory.js';

describe('Model', () => {
    function createModel() {
        ModelFactory.create({
            key: 'test',
            fields: {
                field: {
                    type: ModelFactory.fields.ArrayField,
                    fieldType: ModelFactory.fields.StringField,
                    required: true,
                },
            },
        });

        return ModelFactory.create({
            key: 'model',
            fields: {
                field: {
                    type: ModelFactory.fields.StringField,
                    required: true,
                },
                modelField: {
                    type: ModelFactory.fields.ModelField,
                    required: false,
                },
                nonTypeField: {
                    required: false,
                },
                foreign: {
                    type: ModelFactory.fields.ModelField,
                    foreignModel: 'test',
                }
            },
        });
    }

    it('should give warning for unknown argument', () => {
        let model = createModel();
        let instance = new model({
            unknownField: 'kek',
        });

        let validator = instance.validate();
        expect(validator.warnings[0].msg).toEqual('Required field field not set');
    });

    it('should be able to make extended instances', () => {
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

        let instance = new extended({
            appel: 'sap',
            foreign: {
                field: ['test', 'test'],
            },
        });

        expect(typeof instance).toEqual('object');
    });

    it('should be able to return a proper value object', () => {
        let model = createModel();

        let instance = new model({
            field: 'appel',
            foreign: {
                field: ['test', 'test'],
            },
        });

        expect(JSON.stringify(instance.getValue())).toBe(JSON.stringify({
            field: 'appel',
            foreign: {
                field: ['test', 'test'],
            },
        }));
    });

    it('should not return fields that are not required and undefined or null', () => {
        let model = ModelFactory.create({
            key: 'nullcheck',
            fields: {
                checkField: {
                    type: ModelFactory.fields.StringField,
                    required: false,
                }
            }
        });

        let unmodel = new model({
            checkField: 'notnull'
        });

        let unmodels = new model({});

        expect(JSON.stringify(unmodel.getValue())).toBe(JSON.stringify({
            checkField: 'notnull'
        }));

        expect(JSON.stringify(unmodels.getValue())).toBe(JSON.stringify({}));
    });

    it('should be able to return values for an invalid model, but should send a warning', () => {
        let model = createModel();

        let instance = new model({
            huh: 'appel',
            foreign: {
                field: ['test', 'test'],
            },
        });

        const expectResult = { foreign: { field: [ 'test', 'test' ] } };

        expect(JSON.stringify(instance.getValue())).toBe(JSON.stringify(expectResult));

        expect(instance.validate().warnings[0].msg).toBe('Required field field not set');
    });
});
