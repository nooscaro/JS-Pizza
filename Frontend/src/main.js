/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    alert("YAYNAY");
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    // var Pizza_List = [];

    // var API = require('API');
    //
    // API.getPizzaList(function (eror, list) {
    //     if(error){
    //         alert(error);
    //     } else {
    //         Pizza_List = list;
    //
    //     }
    // });

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();

});