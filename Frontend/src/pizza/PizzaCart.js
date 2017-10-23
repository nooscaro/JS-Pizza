/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    var doubles = false;
    var newItem = ({
        pizza: pizza,
        size: size,
        quantity:1
    });
    var newItemStr = JSON.stringify(newItem.pizza)+'\n'+JSON.stringify(newItem.size);
    function checkForDouble(item) {
        var itemStr = JSON.stringify(item.pizza)+'\n'+JSON.stringify(item.size);
        
        if(newItemStr.localeCompare(itemStr)==0){
            item.quantity+=1;
            doubles=true;
        }
    }
    Cart.forEach(checkForDouble);
    //Приклад реалізації, можна робити будь-яким іншим способом
    if(!doubles) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }
    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    //TODO: треба зробити
    var sample = JSON.stringify(cart_item);
    function checkAndRemoveOneItem(item) {
        var str = JSON.stringify(item);
        if(sample.localeCompare(str)==0) {
            var index = Cart.indexOf(item);
            Cart.splice(index,1);
        }
    }
    Cart.forEach(checkAndRemoveOneItem);

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find('.minus').click(function () {
            if (cart_item.quantity > 1)
                cart_item.quantity -= 1;
            else
                removeFromCart(cart_item);
            updateCart();
        });

        $node.find('.cancel').click(function () {
            removeFromCart(cart_item);
        });

        $node.find(".plus").click(function () {
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;