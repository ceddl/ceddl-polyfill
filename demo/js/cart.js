var demo = demo ? demo : {};
demo.cartProductTemplate = _.template(document.querySelector("#cart-product-template").innerHTML);

demo.cart = (function () {
    var cartTemplate = _.template(document.querySelector("#cart-template").innerHTML);
    var containerElm = document.querySelector('.js-cart-container');
    var cart = {
        products: []
    }

    function renderCart() {
        containerElm.innerHTML = cartTemplate({
            products: cart.products,
        });

        var items = document.querySelectorAll('.js-cart-product');

        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            item.removeEventListener('click', removeFromCart);
            item.addEventListener('click', removeFromCart);
        }
    }

    function removeFromCart() {
        var items = Array.from(document.querySelectorAll('.js-cart-product'));
        cart.products.splice(items.indexOf(this), 1);

        renderCart();
    }

    function addToCart(product) {
        cart.products.push(product);
        renderCart();
    }

    function clearCart() {
        cart.products = [];
        renderCart();
    }

    return {
        addToCart: addToCart,
        clearCart: clearCart,
        renderCart: renderCart
    }

})();



