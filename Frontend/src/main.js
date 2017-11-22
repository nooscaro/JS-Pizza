/**
 * Created by chaika on 25.01.16.
 */

$(function () {
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = [];
    var Pizza_Cart = require('./pizza/PizzaCart');
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

        var input = $('#nameInput').val();

        if (validName(input)) {
            $('#nameInput').removeClass("isInvalid");
            $('#nameInput').addClass('isValid');
            $('.name-group').addClass("isValid");
            $('.name-group').removeClass("isInvalid");
        } else {
            $('#nameInput').removeClass("isValid");
            $('#nameInput').addClass("isInvalid");
            $('.name-group').addClass("isInvalid");
            $('.name-group').removeClass("isValid");
        }
    });

    $('#phoneInput').change(function () {
        var input = $('#phoneInput').val();

        if (validPhoneNumber(input)) {
            $('#phoneInput').removeClass("isInvalid");
            $('#phoneInput').addClass("isValid");
            $('.phone-group').removeClass("isInvalid");
            $('.phone-group').addClass("isValid");
        } else {
            $('#phoneInput').removeClass("isValid");
            $('#phoneInput').addClass("isInvalid");
            $('.phone-group').removeClass("isValid");
            $('.phone-group').addClass("isInvalid");
        }
    });

    $('.orderNextButton').click(function () {
        if (!validName($('#nameInput').val()) || !validPhoneNumber($('#phoneInput').val())) {
            alert("something is wrong")
        }
        PizzaCart.formOrderInfo(function (err, data) {
            if (err) {
                return alert("Couldn't create order");
            }
            LiqPayCheckout.init({
                data: data.data,
                signature: data.signature,
                embedTo: "#liqpay",
                mode: "popup"	//	popup	||	popup
            }).on("liqpay.callback", function (data) {
                console.log(data.status);
                console.log(data);
                alert("Order status: " + data.status);
            }).on("liqpay.ready", function (data) {
                //	ready
            }).on("liqpay.close", function (data) {
                //	close
            });
        });
    });
});


function isLetterOrSpace(ch) {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'а' && ch <= 'я') || ch === ' ' || ch === 'ё' || ch === 'є' || ch === 'і';
}

function validPhoneNumber(str) {
    if (str == null || str.length < 4)
        return false;
    if (str.charAt(0) != 0) {
        if (str.charAt(0) != '+' || str.charAt(1) != '3' || str.charAt(2) != '8' || str.charAt(3) != '0')
            return false;
    }
    return true;
}

function validName(str) {
    if (str === null || str.length < 2)
        return false;
    var lowerCase = str.toLowerCase();
    for (var i = 0; i < str.length; i++) {
        if (!isLetterOrSpace(lowerCase.charAt(i)))
            return false;
    }
    return true;
}

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
            if (err) {
                $('#address').removeClass("isValid");
                $('#address').addClass("isInvalid");
                $('.address-group').removeClass("isValid");
                $('.address-group').addClass("isInvalid");
            }
            // alert("Couldn't find the address");
            else {
                calculateRoute(point, coord, function (err, duration) {
                    if (err) {
                        console.log(err);
                        $('#address').removeClass("isValid");
                        $('#address').addClass("isInvalid");
                        $('.address-group').removeClass("isValid");
                        $('.address-group').addClass("isInvalid");
                    }

                    else {
                        console.log(duration);
                        $('#address').removeClass("isInvalid");
                        $('#address').addClass("isValid");
                        $('.address-group').removeClass("isInvalid");
                        $('.address-group').addClass("isValid");
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