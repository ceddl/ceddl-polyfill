var demo = demo? demo : {};

(function() {
    function setListeners() {
        document.querySelector('.js-clear-cart').addEventListener('click', function() {
            demo.cart.clearCart();
        }, false);
    }

    function bindDataObject() {

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





