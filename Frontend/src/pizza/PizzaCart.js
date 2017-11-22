/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = require('../Storage');
var API = require('../API');
//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];
var total = 0;
//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");
var $grandTotal = $('#grandTotal');
//Очищення кошика
var $clearCart = $('#clearYourOrder');
$clearCart.click(function () {
    Cart = [];
    total=0;
    updateCart();

});
//Кількість піц у кошику
var $numPizzas = $('#numItemsInTheCart');


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
        Cart.push(newItem);
    }
    //Оновити вміст кошика на сторінці
    total+=newItem.pizza[size].price;
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика

    var sample = JSON.stringify(cart_item);
    function checkAndRemoveOneItem(item) {
        var str = JSON.stringify(item);
        if(sample.localeCompare(str)==0) {
            var index = Cart.indexOf(item);
            total-=item.quantity*item.pizza[item.size].price;
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
    var savedCart = Storage.read("cart");

    var sum = Storage.read("total");
    if(savedCart) {
        Cart = savedCart;
        total = sum;
    }

    updateCart();
}

function sumUp() {
    var total = 0;
    Cart.forEach(function (t) {
      total+=  t.pizza[t.size].price*t.quantity;
    });
    return total;
}

exports.formOrderInfo = function (callback) {
    API.createOrder({
        name: $("#nameInput").val(),
        phone: $("#phoneInput").val(),
        address: $("#address").val(),
        order: cartSummary(),
        total: sumUp(),
    }, function (err, result) {
        if(err) return callback(err);
        callback(null,  result);
    })
};

function cartSummary() {
    var res = "";
    var size = "";
    Cart.forEach(function (t) {
        size = (t.size==="small_size")?"мала":"велика";
       res+=t.pizza.title+"["+size+"]: "+t.quantity;
    });
    return res;
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
        // total+=cart_item.quantity*cart_item.pizza[size].price;
        $node.find('.minus').click(function () {
            if (cart_item.quantity > 1) {
                total-=cart_item.pizza[cart_item.size].price;
                cart_item.quantity -= 1;
            }
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
            total+=cart_item.pizza[cart_item.size].price;
            //Оновлюємо відображення
            updateCart();
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
     $grandTotal.text(total+" грн.");
     $numPizzas.text(Cart.length);

     Storage.write("cart", Cart);
     Storage.write("total", total);


}

exports.cartForOrder = function () {
  $cart.html("");
  Cart.forEach(function (pizza) {
      var html = Templates.PizzaCart_OneItem_Order(pizza);
      $cart.append(html);
  })
};

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;
exports.cartSummary = cartSummary;
exports.PizzaSize = PizzaSize;