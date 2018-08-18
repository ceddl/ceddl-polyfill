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
     * Calculating steps in the page loading pipeline.
     * @return {Object} PerformanceObj containg performance metrics
     */
    function getPerformanceTimingData() {
        var PerformanceObj = {
            'redirecting': performance.timing.fetchStart - performance.timing.navigationStart,
            'dnsconnect': performance.timing.requestStart - performance.timing.fetchStart,
            'request': performance.timing.responseStart - performance.timing.requestStart,
            'response': performance.timing.responseEnd - performance.timing.responseStart,
            'domprocessing': performance.timing.domComplete - performance.timing.responseEnd,
            'load': performance.timing.loadEventEnd - performance.timing.loadEventStart
        };

        /**
         * Obtaining the transferred kb of resources inluding estimated document size.
         */
        if (window.performance && window.performance.getEntriesByType) {
            var resource
            var resources = window.performance.getEntriesByType('resource');
            var documentSize = unescape(encodeURIComponent(document.documentElement.innerHTML)).length / 4.2;
            var byteTotal = 0;
            for (var i = 0; i < resources.length; i++) {
                resource = resources[i];
                byteTotal = byteTotal + resource.transferSize;
            }
            PerformanceObj.transferbytes = byteTotal + Math.round(documentSize);
            PerformanceObj.transferrequests = resources.length + 1;
        }

        return PerformanceObj;
    }

    function createPerformanceModel(mf) {
        mf.create({
            key: 'performanceTiming',
            fields: {
                redirecting: {
                    type: mf.fields.NumberField,
                    required: true,
                },
                dnsconnect: {
                    type: mf.fields.NumberField,
                    required: true,
                },
                request: {
                    type: mf.fields.NumberField,
                    required: true,
                },
                response: {
                    type: mf.fields.NumberField,
                    required: true,
                },
                domprocessing: {
                    type: mf.fields.NumberField,
                    required: true,
                },
                load: {
                    type: mf.fields.NumberField,
                    required: true,
                },
                transferbytes: {
                    type: mf.fields.NumberField,
                    required: false,
                },
                transferrequests: {
                    type: mf.fields.NumberField,
                    required: false,
                },
            }
        });
    }

    createPerformanceModel(CEDDL.ModelFactory);
    pageReady(function () {
       if (!performance || !performance.timing) {
            return;
        } else {
            var checkComplete = setInterval(function () {
                if(performance.timing.domComplete > 0) {
                    clearInterval(checkComplete);
                    CEDDL.pushToDataObject('performanceTiming', getPerformanceTimingData());
                }
            }, 500);
        }
    });


})();
