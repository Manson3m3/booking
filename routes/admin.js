/**
 * Created by Administrator on 2018/5/24.
 */
var express = require('express');
var router = express.Router();
var db = require('../backend_js/connnectDB');
var client = db.connect();
var utils = require('../backend_js/utils');
var types_court = {'table_tennis':'乒乓球场','tennis':'网球场','badminton':'羽毛球场','climbing':'攀岩馆','room_basketball':'室内篮球场'};
var states = {1:'预定中',2:'预定成功',3:'预定失败',4:'预定取消'};

router.get('/admin',function (req,res) {
    res.render('admin');
})
router.post('/book_conclusion',function (req,res) {
    //结算预定场地日期
    var court_date = req.body.court_date
    db.query_book_winner_id(client,court_date,function (result) {
        var ids = [];
        var email_cost = new Map();
        for (var i= 0;i<result.length;i++) {
            var email = result[i].user_id;
            var cost = result[i].price;
            var time = utils.getNowFormatDate();
            var msg = '您预定的于'+result[i].court_date+'的'+result[i].court_time+result[i].court_name+'竞价成功！花费为：'+cost;
            db.insert_sys_msg(client,email,time,msg,function (result6) {
                if(result6) {
                    console.log('场地成功预定记录！');
                }
            })
            if(email_cost.has(email)) {
                var new_cost = email_cost.get(email)+cost;
                email_cost.set(email,new_cost);
            }
            else{
                email_cost.set(email,cost);
            }

            // if (i!=result.length-1) {
            //     ids = ids + result[i].id + ',';
            // }else {
            //     ids = ids + result[i].id + ')';
            // }
            ids.push(result[i].id);
        }
        if(ids.length == 0) {
            res.send(court_date+'没有预定项目')
        }
        else {
            console.log('ids:' + ids);
            console.log(email_cost);
            db.update_state2success(client, ids, function (result2) {
                console.log('result2' + result2)
                if (result2.protocol41 == true) {
                    db.update_state2failure(client, court_date, function (result3) {
                        if (result3.protocol41 == true) {
                            console.log('场地结算成功')
                        }
                    })
                }
            })

            var last_email = '';
            for (var key in email_cost) {
                last_email = key;
            }
            email_cost.forEach(function (cost, email, map) {
                db.query_user(client, email, function (result4) {
                    var new_account = result4[0].account - cost;
                    db.update_account(client, email, new_account, function (result5) {
                        if (result5){
                            console.log(email + '扣款成功！')
                            if(email == last_email) {
                                res.send('结算成功')
                            }
                        }
                    })
                })
            })
        }
    })
})

module.exports = router;