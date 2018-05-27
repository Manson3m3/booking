/**
 * Created by Administrator on 2018/5/23.
 */
var express = require('express');
var router = express.Router();
var db = require('../backend_js/connnectDB');
var client = db.connect();
var court_types = {'乒乓球场':'table_tennis','网球场':'tennis','羽毛球场':'badminton','攀岩馆':'climbing','室内篮球场':'room_basketball'}
router.get('/book',function (req,res) {
    if(req.session.email == undefined) {
        res.redirect('/login');
    }else {
        res.render('book');
    }


})

router.post('/book',function (req,res) {
    var email = req.session.email;
    var court_date = req.body.court_date;
    var court_type = req.body.court_type;
    var court_num = req.body.court_num;
    var court_name_en = court_types[court_type]+court_num;
    var court_time = req.body.court_time;
    var book_price = req.body.book_price;
    db.query_book_record(client,email,court_date,court_name_en,court_time,function (result) {
        // if (result && result[0]['book_state'] == 1) {
        if (result){
            if (result == ''){
                db.insert_book_record(client,email,court_date,court_name_en,court_time,book_price,function (results) {
                    if (results) {
                        res.send('预定成功')
                    }
                    else {
                        res.send('预定失败！')
                    }
                })
            }
            else {
                if (result[0]['book_state'] == 1) {
                    res.send("你已经预定过该场次！")
                }
            }
        }
    })
})

module.exports = router;