/**
 * Created by Administrator on 2018/5/16.
 */
var express = require('express');
var router = express.Router();
var db = require('../backend_js/connnectDB');
var utils = require('../backend_js/utils');
client = db.connect();
router.get('/register',function (req,res) {
    res.render('register',{title:'欢迎来到Booking!'});
})

router.post('/register',function (req,res) {

    email = req.body.email;
    pwd = req.body.pwd;
    db.query_user(client,email,function (result) {
        if(result[0] == undefined) {
            db.insert_user(client,email,pwd,function (result1) {
                if (result1) {
                    var time = utils.getNowFormatDate();
                    var msg = '您已经注册成功，欢迎使用本系统！';
                    db.insert_sys_msg(client,email,time,msg,function (result2) {
                        if(result2) {
                            console.log('注册记录成功！');
                        }
                    })
                    res.send("注册成功")
                }else {
                    res.send("注册失败")
                }
            })
        }else {
            res.send("该邮箱已经注册！")
        }
    })
})

module.exports = router;