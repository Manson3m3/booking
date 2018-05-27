/**
 * Created by Administrator on 2018/5/16.
 */
var express = require('express');
var router = express.Router();
var db = require('../backend_js/connnectDB');
var court_price = {'乒乓球场':5,'网球场':10,'羽毛球场':6,'攀岩馆':10,'室内篮球场':20}
var court_types = {'乒乓球场':'table_tennis','网球场':'tennis','羽毛球场':'badminton','攀岩馆':'climbing','室内篮球场':'room_basketball'}

var court_time = ['8:00-9:00','9:00-10:00','10:00-11:00','11:00-12:00',
                    '14:00-15:00','15:00-16:00','16:00-17:00',"17:00-18:00"];
var client = db.connect();
router.get('/court',function (req,res) {
    var user = 'LOGIN';
    if (req.session.email) {
        user = req.session.email.split('@')[0];
    }
    // get_court_avg_price('table_tennis1','8:00-9:00','2018-05-24',function (result) {
    //     console.log('result:'+result);
    // })
    // var result = get_court_data('乒乓球场','');
    // res.render('court',{title:'court',user:user,court_data:result})
    get_court_data('乒乓球场','',function (result) {
        res.render('court',{title:'court',user:user,court_data:result})
    })

})

router.post('/court',function (req,res) {
    //process register logic
})

router.post('/search_court',function (req,res) {
    client = db.connect();
    var court_type = req.body.court_type;
    var court_date = req.body.court_date;
    get_court_data(court_type,court_date,function (result) {
        console.log(result)
        res.send(result.toString());
    })
})

function get_court_data(court_type,court_date,callback) {

    if (court_date == '') {
        var date = new Date();
        date.setDate(date.getDate() + 1);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month<10?'0'+month:month;
        var day = date.getDate();
        court_date = year + "-" + month + "-" + day;
    }
    var booking = 1;
    var result = [];
    for (var i = 1; i < 3; i++) {
        var court_name_ch = court_type + i;
        var court_name_en = court_types[court_type]+i;
        for (var j = 0; j < 8; j++) {
            (function(i,j,court_name_ch,court_name_en) {
                var time = court_time[j];
                db.query_book_court_nums(client, court_date, time, court_name_en, booking,function (results) {
                    if (results) {
                        var num = results[0]['count(*)'];
                        // result.push([court_date,court_name_ch,time,court_price[court_type],num]);
                        // if (i == 3 && j == 7) {
                        //     callback(result)
                        // }
                        if(num == 0) {
                            result.push([court_date,court_name_ch,time,court_price[court_type],num]);
                            if (result.length == 16) {
                                callback(result);
                            }

                        }
                        else{
                            get_court_avg_price(court_name_en, time, court_date, function (result2) {
                                result.push([court_date, court_name_ch, time, result2, num]);
                                if (result.length == 16) {
                                    callback(result);
                                }
                            })
                        }


                        // result.push([court_date, court_name, time, court_price[court_type], num]);

                    }
                });

            })(i,j,court_name_ch,court_name_en)
            }


        }

}

function get_court_avg_price(court_name,court_time,court_date,callback) {
    var booking = 1;
    db.court_avg_price(client, court_date, court_time, court_name, booking, function (results) {
        console.log("avg:" + results[0]['avg(price)'])
        callback(results[0]['avg(price)']);
    })

}
module.exports = router;