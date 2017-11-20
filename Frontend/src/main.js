/**
 * Created by chaika on 25.01.16.
 */

$(function () {
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = [];

    var API = require('./API.js');
    API.getPizzaList(function (err, list) {
        if (err)
            alert(err);
        else {
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
        window.location = "order.html";
        $('#cart').find('.plus').hide();
    });
    $('.backToMainPage').click(function () {
        window.location = "/";
    });


    $('#nameInput').change(function () {

       var input =$('#nameInput').val();
        var Reg61 = new RegExp("^.*[^A-zА-яЁё].*$[^\\s]*");
        if(input.length>1 ){

           if(Reg61.test(input))
           {
               $('#nameInput').removeClass("isValid");
               $('#nameInput').addClass("isInvalid");
               $('.name-group').addClass("isInvalid");
               $('.name-group').removeClass("isValid");
           }
           else
           {
               $('#nameInput').removeClass("isInvalid");
               $('#nameInput').addClass('isValid');
               $('.name-group').addClass("isValid");
               $('.name-group').removeClass("isInvalid");
           }
       } else {
            $('#nameInput').removeClass("isValid");
            $('#nameInput').addClass('isInvalid');
            $('.name-group').addClass("isInvalid");
            $('.name-group').removeClass("isValid");
       }
    });

});

function initialize() {
//Тут починаємо працювати з картою

    var mapProp = {
        center: new google.maps.LatLng(50.464379, 30.519131),
        zoom: 15
    };
    var html_element = document.getElementById("map");
    var map = new google.maps.Map(html_element, mapProp);
    // ІКОНКА ПІЦИ НА КАРТІ
    var point = new google.maps.LatLng(50.464379, 30.519131);
    var directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        map: map,
        polylineOptions: {
            strokeColor: "orange"
        }
    });

    var homeMarker = new google.maps.Marker();
    var marker = new google.maps.Marker({
        position: point,
        map: map,
        icon: "assets/images/map-icon.png"
    });


    function calculateRoute(A_latlng, B_latlng, callback) {
        var directionService = new google.maps.DirectionsService();
        // directionsDisplay.setMap(map);
        directionService.route({
            origin: A_latlng,
            destination: B_latlng,
            travelMode: google.maps.TravelMode["DRIVING"]
        }, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var leg = response.routes[0].legs[0];

                directionsDisplay.setDirections(response);

                callback(null, {
                    duration: leg.duration.text
                });
            } else {
                callback(new Error("Can'	not	find	direction"));
            }
        });
    }


    function geocodeAddress(address, callback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
                var coordinates = results[0].geometry.location;
                callback(null, coordinates);
            } else {
                callback(new Error("Can	not	find	the	adress"));
            }
        });
    }


    function geocodeLatLng(latlng, callback) {
//Модуль за роботу з адресою
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'location': latlng}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK && results[1]) {
                var adress = results[1].formatted_address;
                callback(null, adress);
            } else {
                callback(new Error("Can't	find	adress"));
            }
        });
    }

    google.maps.event.addListener(map,
        'click', function (me) {
            var coordinates = me.latLng;
            geocodeLatLng(coordinates, function (err, adress) {
                if (err)
                    console.log(err);
                else {
                    homeMarker.setMap(null);
                    // console.log(adress);
                    $('#address').val(adress);
                    $('.summaryAddress').text(adress);
                    homeMarker = new google.maps.Marker({
                        position: coordinates,
                        map: map,
                        icon: "assets/images/home-icon.png"
                    });
                    calculateRoute(point, coordinates, function (err, time) {
                        if (err)
                            console.log(err);
                        else {
                            console.log(time.duration);
                            $('.timeAprox').text(time.duration);
                        }
                    });
                }
            });


        });

    $('#address').change(function () {
        var adr = (String)($('#address').val());

        geocodeAddress(adr, function (err, coord) {
            if (err)
                alert("Couldn't find the address");
            else {
                calculateRoute(point, coord, function (err, duration) {
                    if (err)
                        console.log(err);
                    else {
                        console.log(duration);
                        $('.timeAprox').text(duration.duration);
                        $('.summaryAddress').text(adr);
                        homeMarker.setMap(null);
                        homeMarker = new google.maps.Marker({
                            position: coord,
                            map: map,
                            icon: "assets/images/home-icon.png"
                        });
                    }
                });
            }
        })
    });
}

//Карта створена і показана


//Коли сторінка завантажилась
google.maps.event.addDomListener(window, 'load', initialize);