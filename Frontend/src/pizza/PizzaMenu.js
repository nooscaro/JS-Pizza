/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = [];
// var Pizza_Manager = require('Pizza');
//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
var $pizza_cat_quant = $('#pizzaCatQuant');
var $pizza_cat_name = $('#catName');
//ФІЛЬТРИ
// var $all = $('#allFilter');
// var $meat = $('#meatFilter');
// var $pineapple = $('#pineappleFilter');
// var $mushroom = $('#mushroomFilter');
// var $sea = $('#seafoodFilter');
// var $vegan = $('#veganFilter');
//
// $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
//     var target = $(e.target).attr("href");
//     switch(target) {
//         case "#all":
//             alert("");
//             showPizzaList($pizza_list);
//             break;
//         case "#meat":
//             alert("");
//
//             filterPizza("Meat");
//             break;
//         case "#pineapple":
//             filterPizza("Pineapple");
//             alert("");
//
//             break;
//         case "#mushroom":
//             filterPizza("Mushroom");
//             alert("");
//
//             break;
//         case"#seafood":
//             filterPizza("Seafood");
//             alert("");
//
//             break;
//         case "#vegan":
//             filterPizza("Vegetarian");
//             alert("");
//
//             break;
//         default:
//             showPizzaList($pizza_list);
//             alert("DEFAULT");
//     }
// });
$('#allFilter').click(function () {
    // alert("!!!!");
    $pizza_cat_name.text("Усі піци");
   showPizzaList(Pizza_List);
   $pizza_cat_quant.text(8);
   this.addClass('.active');

});
$('#meatFilter').click(function () {
    $pizza_cat_name.text("М'ясні піци");
   filterPizza("Meat");
    this.addClass('.active');
    // alert("I WORK TOO");
});
$('#pineappleFilter').click(function () {
    $pizza_cat_name.text("Піци з ананасами");
   filterPizza("Pineapple");
    this.addClass('.active');


});
$('#mushroomFilter').click(function () {
    $pizza_cat_name.text("Піци з грибами");
   filterPizza("Mushroom");
    this.addClass('.active');

});
$('#seafoodFilter').click(function () {
    $pizza_cat_name.text("Морські піци");
   filterPizza("Seafood");
    this.addClass('.active');

});
$('#veganFilter').click(function () {
    $pizza_cat_name.text("Вега-піци");
    filterPizza("Vegetarian");
    this.addClass('.active');

});

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
        // alert(pizza.PizzaFilter.filter);
        if (pizza.PizzaFilter[filter] === 1)
            pizza_shown.push(pizza);


    });
    $pizza_cat_quant.text(pizza_shown.length);
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    var API = require('../API');
    API.getPizzaList(function (error, list) {
        if(error){
            alert(error);
        } else {
            Pizza_List = list;
            showPizzaList(Pizza_List);

        }
    });
    // showPizzaList(Pizza_List);
    // filterPizza("Meat");
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;