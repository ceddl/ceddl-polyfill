var demo = demo? demo : {};
demo.products = (function () {
    var productList = [];

    var productTemplate = _.template(document.querySelector("#product-template").innerHTML);
    var shortThings = ['Rock', 'Paper', 'Scissor'];
    var LongThings = ['Pencil words - Silver', 'Pencil words - Orange', 'Pencil words - Purple'];
    var subscriptionThings = ['postpaid', 'simonly', 'prepaid'];
    var containerElm = document.querySelector('.js-product-container');

    function getRandomShortText() {
        return shortThings[Math.floor(Math.random()*shortThings.length)];
    }

    function getRandomLongText() {
        return LongThings[Math.floor(Math.random()*LongThings.length)];
    }

    function getRandomSubscriptionText() {
        return subscriptionThings[Math.floor(Math.random()*subscriptionThings.length)];
    }

    function createDomElements(html) {
        var elm = document.createElement("DIV");
        elm.innerHTML = html;
        return elm.firstElementChild;
    }

    function renderRandomProduct() {
        var product = {
            sale: !!Math.round(Math.random()),
            image: Math.floor(Math.random() * 40) + 1,
            short_name: getRandomShortText(),
            name: getRandomLongText(),
            price_once: Math.floor(Math.random() * 40) + 1,
            price_month: Math.floor(Math.random() * 40) + 1,
            subscription_type: getRandomSubscriptionText()
        }
        var elm = createDomElements(productTemplate(product));
        containerElm.insertBefore(elm, containerElm.lastChild);
        productList.push(product);

        elm.addEventListener('click', function(e) {
            demo.cart.addToCart(product);
        });
    }

    function removeRandomProduct() {
        var myElms = containerElm.querySelectorAll('.container-item');
        var itemNumber = Math.floor(Math.random()*myElms.length);
        if(myElms.length > 0) {
            productList.splice(itemNumber, 1);
            myElms[itemNumber].remove();
        }
    }

    return {
        renderRandomProduct: renderRandomProduct,
        removeRandomProduct: removeRandomProduct,
    }

})();


