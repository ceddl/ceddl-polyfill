var demo = demo? demo : {};

(function() {
    function setListeners() {
        document.querySelector('.js-clear-cart').addEventListener('click', function() {
            demo.cart.clearCart();
        }, false);
    }

    function bindDataObject() {

        CEDDL.eventbus.on('dataObject', function(data) {
            document.querySelector('.js-event-object').innerHTML = 'events:' + JSON.stringify(data, null, 4);
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





