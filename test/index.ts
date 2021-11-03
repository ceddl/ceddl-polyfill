import ceddl, { ModelConfig } from '@ceddl/ceddl-polyfill'

console.log(ceddl.eventbus);
const myModel: ModelConfig = {
    key: 'product',
    fields: {
        name: {
            type: ceddl.modelFactory.fields.StringField,
            required: true,
        },
        sale: {
            type: ceddl.modelFactory.fields.BooleanField,
            required: true,
        },
        shortName: {
            type: ceddl.modelFactory.fields.StringField,
            required: true,
        },
        priceOnce: {
            type: ceddl.modelFactory.fields.NumberField,
            required: true,
        },
        priceMonth: {
            type: ceddl.modelFactory.fields.NumberField,
            required: true,
        }
    }
}
ceddl.modelFactory.create(myModel)
ceddl.eventbus.emit('jan.klaas', {}, {});
