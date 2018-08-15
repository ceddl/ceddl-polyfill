// We will make this more pretty by creating a separated repo and npm module for supported inputs.
// yust making sure that people can make custom imputs with single page aplication support and
// minimmal complexity.
(function() {

    function pageReady(callback) {
        var isReady;
        if (document.attachEvent) {
            isReady = document.readyState === "complete";
        } else {
            isReady = document.readyState !== "loading";
        }

        if (isReady) {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    };

    /**
     * detects if the browser has Cookies enabled.
     * @return {Boolean} ret
     */
    function hasCookies() {
        if (navigator.cookieEnabled) {
            return true;
        }

        document.cookie = "cookietest=1";
        var ret = document.cookie.indexOf("cookietest=") != -1;
        document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
        return ret;
    }

    function setListeners() {
        window.addEventListener('hashchange', function(){
            CEDDL.pushToDataObject('pageMetadata', getPageMeta());
        });
        CEDDL.eventbus.on('initialize', function(){
            CEDDL.pushToDataObject('pageMetadata', getPageMeta());
        });
    }

    function createPageMetadataModel(mf) {
        mf.create({
            key: 'pageMetadata',
            fields: {
                url: {
                    type: mf.fields.StringField,
                    required: false,
                },
                path: {
                    type: mf.fields.StringField,
                    required: false,
                },
                referrer: {
                    type: mf.fields.StringField,
                    required: false,
                },
                title: {
                    type: mf.fields.StringField,
                    required: false,
                },
                url_section: {
                    type: mf.fields.ArrayField,
                    fieldType: mf.fields.StringField,
                    required: false,
                },
                cookie: {
                    type:mf.fields.BooleanField,
                    required: false,
                },
                touch: {
                    type: mf.fields.BooleanField,
                    required: false,
                },
                device_pixel_ratio: {
                    type: mf.fields.NumberField,
                    required: false,
                },
                resolution: {
                    type: mf.fields.StringField,
                    required: false,
                },
                width: {
                    type: mf.fields.NumberField,
                    required: false,
                },
                height: {
                    type: mf.fields.NumberField,
                    required: false,
                },
                query_string: {
                    type: mf.fields.StringField,
                    required: false,
                },
                hash: {
                    type: mf.fields.StringField,
                    required: false,
                }
            }
        });
    }

    /**
     * Detects some basic parameters from the browser.
     * @return {object} features
     */
    var features;
    function detectFeatures() {
        if(features) {
            return features;
        }

        var devicePixelRatio = window.devicePixelRatio || 1;
        var cookie = hasCookies();
        var touch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;
        var width = Math.round(parseInt(screen.width, 10) * devicePixelRatio);
        var height = Math.round(parseInt(screen.height, 10) * devicePixelRatio);
        var resolution = width + 'x' + height;

        features = {
            cookie,
            touch,
            device_pixel_ratio: (Math.round(devicePixelRatio * 1000) / 1000).toFixed(3),
            resolution,
            width,
            height,
        };

        return features;
    }

    /**
     * getPageState is a helper function to collect all the browser and custom element data
     * converting it into the page data object.
     */
    function getPageMeta() {
        var data = detectFeatures();

        data.title = document.title;
        data.url = window.location.href;
        data.path = document.location.pathname;
        data.referrer = document.referrer;
        data.url_section = window.location.pathname.split('/').filter(function(part){
            return part.length !== 0;
        }).map(function(part){
            return part.replace(/\.[^/.]+$/, "");
        });
        data.hash = window.location.hash;
        data.query_string = window.location.search;

        return data;
    }

    createPageMetadataModel(CEDDL.ModelFactory);
    pageReady(function () {
        CEDDL.pushToDataObject('pageMetadata', getPageMeta());
        setListeners();
    });

})();
