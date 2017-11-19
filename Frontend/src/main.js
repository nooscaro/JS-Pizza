/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = [];

    var API = require('./API.js');
    API.getPizzaList(function (err, list) {
        if(err)
            alert(err);
        else{
            Pizza_List = list;
            PizzaCart.initialiseCart();
            PizzaMenu.initialiseMenu();

        }
    });

    $('#meatFilter').click(function () {
        $pizza_cat_name.text("М'ясні піци");
        filterPizza("Meat");
        // this.addClass('.active');
        // alert("I WORK TOO");
    });
    $('#pineappleFilter').click(function () {
        $pizza_cat_name.text("Піци з ананасами");
        filterPizza("Pineapple");
        // this.addClass('.active');


    });
    $('#mushroomFilter').click(function () {
        $pizza_cat_name.text("Піци з грибами");
        filterPizza("Mushroom");
        // this.addClass('.active');

    });
    $('#seafoodFilter').click(function () {
        $pizza_cat_name.text("Морські піци");
        filterPizza("Seafood");
        // this.addClass('.active');

    });
    $('#veganFilter').click(function () {
        $pizza_cat_name.text("Вега-піци");
        filterPizza("Vegetarian");
        // this.addClass('.active');

    });
    $('.orderButton').click(function () {
        window.location= "order.html";
       $('#cart').find('.plus').hide();
    });
    $('.backToMainPage').click(function () {
        window.location = "/";
    });

});

function	initialize() {
//Тут починаємо працювати з картою

    var mapProp = {
        center: new google.maps.LatLng(50.464379, 30.519131),
        zoom: 15
    };
    var html_element = document.getElementById("map");
    var map = new google.maps.Map(html_element, mapProp);
    // ІКОНКА ПІЦИ НА КАРТІ
    var point	=	new	google.maps.LatLng(50.464379,30.519131);

    // var point	=	new	google.maps.LatLng(50.464379,30.519131);
    var marker	=	new	google.maps.Marker({
        position:	point,
        map:	map,
        icon:	"assets/images/map-icon.png"
    });
}
//Карта створена і показана


//Коли сторінка завантажилась
    google.maps.event.addDomListener(window,	 'load',	initialize);