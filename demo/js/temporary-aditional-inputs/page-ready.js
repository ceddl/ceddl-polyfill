// We will make this more pretty by creating a separated repo and npm module for supported inputs.
// yust making sure that people can make custom imputs with single page aplication support and
// minimmal complexity.
(function() {

    var _store = {};
    var _listeners = [];
    var _el, pageReadyWarning;

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
     * Reducer function to check if all keys in the store are set to true.
     * @param {Boolean} acc
     * @param {String} key
     * @returns
     */
    function isStoreValid(acc, key) {
        return acc && _store[key];
    }

    /**
     * Helper function that creates event callbacks which set the event as
     * completed on execution, as well as checking whether all keys in the
     * store are true, and dispatch the pageready event should that be the
     * case.
     * @param {String} name Event name to mark as completed on execution.
     * @returns {Function}
     */
    function createCompleteCallback(name) {
        return function(data) {
            _store[name] = data;

            var allCallbacksComplete = Object.keys(_store).reduce(isStoreValid, true);
            if (allCallbacksComplete) {
                clearTimeout(pageReadyWarning);
                CEDDL.fireEvent('pageready', _store);
            }
        };
    }

    function setCompleteListener(name) {
        // Keep a reference to the callback so we can remove it from the eventbus.
        var markComplete = createCompleteCallback(name);
        CEDDL.eventbus.once(name, markComplete);

        return {
            name: name,
            markComplete: markComplete
        };
    }

    function startWarningTimeout() {
        if(typeof pageReadyWarning !== "undefined") {
            clearTimeout(pageReadyWarning);
        }
        pageReadyWarning = setTimeout(function(){
            CEDDL.fireEvent('pageready', {
                error: true,
                msg: 'Failed to complete within 4000 ms'
            });
        }, 4000);
    }


    /**
     * Method to indicate when to fire the pageready event. It takes a collection
     * of event names and waits until all of them have fired at least once before
     * dispatching the pageready event.
     */
    function pageReadySetListeners(eventNames) {
        // Reset the previous state
        _store = {};
        _listeners.forEach(function(eventCallback) {
            CEDDL.eventbus.off(eventCallback.name, eventCallback.markComplete);
        });
        this._listeners = [];

        // If there is no need to wait for anything dispatch event when the page is ready.
        if (!eventNames || eventNames.length === 0) {
            pageReady(function() {
                CEDDL.fireEvent('pageready', _store);
            });
            return;
        }

        startWarningTimeout();

        if (!Array.isArray(eventNames)) {
            // Split on whitespace and remove empty entries.
            eventNames = eventNames.split(' ').filter(function(value) {
                return !!value;
            });
        }

        if(this.el) {
            this.el.setAttribute('data-page-ready', eventNames.join(' '));
        }

        // Create the new state
        eventNames.forEach(function(name) {
            _store[name] = false;
        });
        _listeners = eventNames.map(setCompleteListener);
    }


    _el = document.querySelector('[data-page-ready]');
    pageReadySetListeners(_el ? _el.getAttribute('data-page-ready') : '');
    CEDDL.eventbus.on('initialize', function() {
        _el = document.querySelector('[data-page-ready]');
        pageReadySetListeners(_el ? _el.getAttribute('data-page-ready') : '');
    });

})();

