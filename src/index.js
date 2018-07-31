"use strict";

import utils from './utils/utils.js';
import ClickObserver from './observers/click.observer.js';

var _clickObserver;

function Base() {
    if (!(this instanceof Base)) {
        throw new TypeError('Must be constructed via new');
    }
}

/**
 * The initialize function makes it possible to allow async loading of the models
 * and initialize the html interface when ready.
 */
Base.prototype.initialize = function() {
    _clickObserver = new ClickObserver(this);
    // _ceddlObserver = new CEDDLObserver(this, ModelFactory);
}


Base.prototype.fireEvent = function(name, data) {
    console.log(name, data);
}

window.CEDDL = new Base();
