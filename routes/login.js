/**
 * Created by Administrator on 2018/5/16.
 */
var express = require('express');
var router = express.Router();
var db = require('../backend_js/connnectDB');
var client =db.connect();

router.get('/login',function (req,res) {
    // var book_state = 1;
    // var court_time = '8:00-9:00';
    // var court_name = 'table_tennis1';
    // var court_date = '2018-05-25';
    // db.court_avg_price(client,court_date,court_time,court_name,book_state,function (result) {
    //     console.log('result:'+result);
    // })
    // db.query_book_court_nums(client,court_date,court_time,court_name,book_state,function (result) {
    //     console.log(result);
    // })
    res.render('login',{title:'欢迎来到Booking!'});
});


router.post('/login',function (req,res) {
    client = db.connect();
    email = req.body.email;
    pwd = req.body.pwd;
    db.query_user(client,email,function (result) {
        if (result[0] != undefined) {
            var flag = result[0]["password"] == pwd;
            console.log(flag);
            if (result[0]["password"] == pwd) {
                req.session.email = email;
                req.session.is_login = true;
                res.send("登录成功");
            } else {
                res.send("密码不正确");
            }
        }
        else {
            res.send("该账号不存在！")
        }
    })

})
router.get('/logout',function (req,res) {
    delete req.session.email;
    req.session.is_login = false;
    res.render('/login');
})
module.exports = router;