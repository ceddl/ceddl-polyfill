var demo = demo? demo : {};

(function() {
    function setListeners() {
        document.querySelector('.js-clear-cart').addEventListener('click', function() {
            demo.cart.clearCart();
        }, false);
    }

    var rendering = false;
    function renderdataObject(){
        if (!rendering) {
            rendering = true;
            setTimeout(function(){
                var allData = CEDDL.getModels();
                allData.events = CEDDL.getEvents();
                document.querySelector('.js-event-object').innerHTML = 'events:' + JSON.stringify(allData, null, 4);
                rendering = false;
            }, 150);
        }
    }

    function bindDataObject() {

        CEDDL.eventbus.on('ceddl:models', function(data) {
            renderdataObject();
        });

        CEDDL.eventbus.on('ceddl:events', function(data) {
            renderdataObject();
        });

    }


    function init() {
        bindDataObject();
        demo.products.renderRandomProduct();
        demo.products.renderRandomProduct();
        demo.products.renderRandomProduct();
        demo.cart.renderCart();
        setListeners();
    }

    init();

})();





