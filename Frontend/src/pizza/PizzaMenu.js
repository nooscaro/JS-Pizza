/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');
// var Pizza_Manager = require('Pizza');
//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
// //ФІЛЬТРИ
// var $all = $('#allFilter');
// var $meat = $('#meatFilter');
// var $pineapple = $('#pineappleFilter');
// var $mushroom = $('#mushroomFilter');
// var $sea = $('#seafoodFilter');
// var $vegan = $('#veganFilter');
//
// $all.click(function () {
//     showPizzaList($pizza_list);
// });
// $meat.click(function () {
//     filterPizza(Pizza_Manager.PizzaFilter.Meat);
//
// });
// $pineapple.click(function () {
//     filterPizza(Pizza_Manager.PizzaFilter.Pineapple);
// });
// $mushroom.click(function () {
//     filterPizza(Pizza_Manager.PizzaFilter.Mushroom);
// });
// $sea.click(function () {
//     filterPizza(Pizza_Manager.PizzaFilter.Seafood);
// });
// $vegan.click(function () {
//     filterPizza(Pizza_Manager.PizzaFilter.Vegetarian);
// });


function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function (pizza) {
        //Якщо піка відповідає фільтру
        alert(pizza.filter[filter])
        if (pizza.filter[filter])
            pizza_shown.push(pizza);

        //TODO: зробити фільтри
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List)
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;