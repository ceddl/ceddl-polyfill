var mf = ceddl.modelFactory;

mf.create({
    key: 'page',
    root: true,
    fields: {
        section: {
            type: mf.fields.StringField,
            required: true,
        },
        framework: {
            type: mf.fields.StringField,
            required: false,
            pattern: '^(angular 1.x|angular 2.x|vue|loDash)$'
        },
    }
});

mf.create({
    key: 'product',
    fields: {
        name: {
            type: mf.fields.StringField,
            required: true,
        },
        sale: {
            type: mf.fields.BooleanField,
            required: true,
        },
        shortName: {
            type: mf.fields.StringField,
            required: true,
        },
        priceOnce: {
            type: mf.fields.NumberField,
            required: true,
        },
        priceMonth: {
            type: mf.fields.NumberField,
            required: true,
        }
    }
});

mf.create({
    key: 'device',
    extends: 'product',
    fields: {
        brand: {
            type: mf.fields.StringField,
            required: true,
        },
    },
});

mf.create({
    key: 'sim',
    extends: 'product',
    fields: {
        subscriptionType: {
            type: mf.fields.StringField,
            required: true,
        },
    },
});

mf.create({
    key: 'package',
    extends: 'product',
    fields: {
        device: {
            type: mf.fields.ModelField,
            foreignModel: 'device',
            required: true,
        },
        sim: {
            type: mf.fields.ModelField,
            foreignModel: 'sim',
            required: true,
        },
    },
});

mf.create({
    root: true,
    key: 'products',
    fields: {
        products: {
            type: mf.fields.ListField,
            foreignModel: 'product',
            required: true,
        },
    },
});

mf.create({
    root: true,
    key: 'cart',
    fields: {
        qty: {
            type: mf.fields.StringField,
            required: true,
        },
        products: {
            type: mf.fields.ListField,
            foreignModel: 'product',
            required: false,
        },
    },
});

mf.create({
    key: 'advertiser',
    fields: {
        id: {
            type: mf.fields.StringField,
            required: true,
        },
        name: {
            type: mf.fields.StringField,
            required: false,
        },
    },
});


mf.create({
    root: true,
    key: 'advertisement',
    fields: {
        name: {
            type: mf.fields.StringField,
            required: true,
        },
        advertiser: {
            type: mf.fields.ModelField,
            foreignModel: 'advertiser',
            required: true,
        },
    },
});


ceddl.initialize();
