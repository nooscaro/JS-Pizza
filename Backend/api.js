/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');

var LIQPAY_PRIVATE_KEY = "NK5ddcmkg8cO06YpWGBMxgEvNiGYSQXXcaggZq8A";
var LIQPAY_PUBLIC_KEY = "i34666374942";
var crypto = require('crypto');

function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}

function base64(str) {
    return new Buffer(str).toString('base64');
}

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function (req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);

    var order = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: order_info.total,
        currency: "UAH",
        description: "Замовлення для "+order_info.name+"\nТелефон: "+order_info.phone+"\nДоставка за адресою: "+order_info.address+"\n"+order_info.order+"\nРазом: "+order_info.total+"UAH",
        order_id: Math.random(),
        //!!!Важливо щоб було 1,	бо інакше візьме гроші!!!
        sandbox: 1
    };
    var data = base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);

    res.send({
        success: true,
        name: order_info.name,
        phone: order_info.phone,
        address: order_info.address,
        order: order_info.cart,
        total: order_info.total,
        data: data,
        signature: signature
    });
};