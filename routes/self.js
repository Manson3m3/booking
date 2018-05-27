/**
 * Created by Administrator on 2018/5/16.
 */
var express = require('express');
var router = express.Router();
var db = require('../backend_js/connnectDB');
var client = db.connect();
var types_court = {'table_tennis':'乒乓球场','tennis':'网球场','badminton':'羽毛球场','climbing':'攀岩馆','room_basketball':'室内篮球场'};
var states = {1:'预定中',2:'预定成功',3:'预定失败',4:'预定取消'};
var utils = require('../backend_js/utils');
router.get('/self',function (req,res) {
    if(req.session.email == undefined) {
        res.redirect('/login');
    }else {
        var email = req.session.email;
        get_book_record(email,function (result) {
            db.query_user(client,email,function (results) {
                var account = results[0]['account'];
                res.render('self',{title:"个人主页",data:result,account:account});
            })

        })

    }


})
router.get('/book_record',function (req,res) {
    if(req.session.email == undefined) {
        res.redirect('/login');
    }else {
        var email = req.session.email;
        get_book_record(email,function (result) {
            res.send(result)
        })

    }
})

router.get('/sys_record',function (req,res) {
    if(req.session.email == undefined) {
        res.redirect('/login');
    }else {
        var email = req.session.email;
        get_sys_record(email,function (result) {
            res.send(result)
        })

    }
})

function get_book_record(email,callback) {
    var result = [];
    db.query_book_record_by_user_id(client,email,function (results) {
        if (results) {
            if (results == '') {
                res.send('预定记录为空')
            }else {
                // console.log(results);
                for(var i = 0;i<results.length;i++) {
                    var temp = results[i];
                    // var book_time = temp['book_time'].toString();
                    // var time = book_time.substr(0,10)+' '+book_time.substr(11,8);
                    var court_name_en = temp['court_name'];
                    var court_name_ch = types_court[court_name_en.substr(0,court_name_en.length-1)]+court_name_en.substr(court_name_en.length-1,1);
                    result.push({'court_date':temp['court_date'],'court_time':temp['court_time'],
                        'court_name':court_name_ch,'book_price':temp['price'],'book_state':states[temp['book_state']],'id':temp['id']});

                }
                callback(result)
            }
        }
    })

}
function get_sys_record(email,callback) {
    var result = [];
    db.query_sys_msg(client,email,function (results) {
        if (results) {
            if (results == '') {
                res.send('预定记录为空')
            }else {
                // console.log(results);
                for(var i = 0;i<results.length;i++) {
                    var temp = results[i];
                    result.push({'msg':temp.msg,'time':temp.time});

                }
                callback(result)
            }
        }
    })
}
router.post('/cancel_book',function (req,res) {
    if(req.session.email == undefined) {
        res.redirect('/login');
    }
    var book_cancel = 4;
    var record_id = req.body.id;
    db.update_book_record_state(client,record_id,book_cancel,function (result) {
        if (result) {
            res.send('取消预定成功')
            console.log(result);

        }

    })

})
router.post('/recharge',function (req,res) {
    if(req.session.email == undefined) {
        res.redirect('/login');
    }
    var email = req.session.email;
    var recharge_amount = parseInt(req.body.recharge_amount);
    db.query_user(client,email,function (result) {
        if(result) {
            var new_account = result[0].account + recharge_amount;
            db.update_account(client,email,new_account,function (result2) {
                if(result2.protocol41 == true) {
                    var time = utils.getNowFormatDate();
                    var msg = '成功充值'+recharge_amount+'!';
                    db.insert_sys_msg(client,email,time,msg,function (result3) {
                        if(result3) {
                            console.log('充值记录成功')
                        }
                    })
                    res.send('充值成功')
                }
                else {
                    res.send(result2)
                }
            })
        }
    })
})
router.post('/self',function (req,res) {
    //process register logic
})

module.exports = router;