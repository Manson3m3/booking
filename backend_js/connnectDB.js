/**
 * Created by Administrator on 2018/5/16.
 */
var mysql = require('mysql');
console.log("正在连接mysql");
var http = require('http')

function connect() {
    var client = mysql.createConnection(
        {
            'host':'111.230.244.86',
            'port':'3306',
            'user':'booking',
            'password':'booking'
        }
    );
    client.connect();
    client.query('use booking');
    return client;
}


function insert_user(client,email,password,callback){
    client.query('insert into user (user_name,password) values(?,?)',[email,password],function (err,results) {
        if(err) {
            console.log('insert err:'+err.message)
        }
        callback(results);
    })
}

function query_user(client,email,callback) {
    client.query('select * from user where user_name = ?',[email],function (err,results) {
        if(err) {
            console.log("query err:"+err.message)
        }
        callback(results);
    })
}
function update_account(client,email,account,callback) {
    client.query('update user set account = ? where user_name = ?',[account,email],function (err,results) {
        if(err) {
            console.log("update err:"+err.message)
        }
        callback(results);
    })
}

function update_state(client,email,state,callback) {
    client.query('update user set state = ? where user_name = ?',[state,email],function (err,results) {
        if(err) {
            console.log("update err:"+err.message)
        }
        callback(results);
    })
}

function insert_book_record(client,user_id,court_date,court_name,court_time,price,callback) {
    client.query('insert into book_record (user_id,court_date,court_name,court_time,price) values(?,?,?,?,?)',[user_id,court_date,court_name,court_time,price],
        function (err,results) {
            if(err) {
                console.log("insert err:"+err.message)
            }
            callback(results);
        }
    )
}
function query_book_record(client,user_id,court_date,court_name,court_time,callback) {
    client.query('select * from book_record where user_id = ? and court_date = ? and court_name = ? and court_time = ?',[user_id,court_date,court_name,court_time],
        function (err,results) {
            if(err) {
                console.log("query err:"+err.message)
            }
            callback(results);
        })

}
function update_book_record_state(client,book_record_id,state,callback) {
    client.query('update book_record set book_state = ? where id = ?',[state,book_record_id],
        function (err,results) {
            if(err) {
                console.log("update err:"+err.message)
            }
            callback(results);
        })
}

function update_book_record_price(client,book_record_id,price,callback) {
    client.query('update book_record set price = ? where id = ?',[price,book_record_id],
        function (err,results) {
            if(err) {
                console.log("update err:"+err.message)
            }
            callback(results);
        })
}

function query_book_record_by_user_id(client,user_id,callback) {
    client.query('select id, book_state,book_time,court_date,court_name,court_time,price from book_record where user_id = ? order by book_time desc',[user_id],
        function (err,results) {
            if(err) {
                console.log("query err:"+err.message)
            }
            callback(results);
        })
}

function query_book_court_nums(client,court_date,court_time,court_name,book_state,callback) {
    client.query('select count(*) from book_record where court_date = ? and court_time = ? and court_name = ? and book_state = ? ',
        [court_date,court_time,court_name,book_state],
        function (err,results) {
            if(err) {
                console.log("query err:"+err.message)
            }
            callback(results);
        })
}

function query_book_court_nums1(client,court_date,court_time,court_name) {
    client.query('select count(*) from book_record where court_date = ? and court_time = ? and court_name = ? ',
        [court_date,court_time,court_name],
        function (err,results) {
            if(err) {
                console.log("query err:"+err.message)
            }
            return results
        })
}

function court_avg_price(client,court_date,court_time,court_name,book_state,callback) {
    client.query('select avg(price) from book_record where court_date = ? and court_time = ? and court_name = ? and book_state = ?',
        [court_date,court_time,court_name,book_state],
        function (err,results) {
            if (err) {
                console.log("query err:" + err.message)
            }
            // callback(results[0]['avg(price)']);
            callback(results);
        })
}
function query_max_price(client,court_date,callback) {
    client.query('select court_time,court_name,max(price) from book_record where court_date = ? and book_state = 1 group by court_time,court_name',
    [court_date],function (err,result) {
            if(err) {
                console.log('query max_price err:'+err.message)
            }
            callback(result);
        })
}
function query_book_winner_id(client,court_date,callback) {
    client.query('select t1.* from book_record as t1,(select court_time,court_name,max(price) as max from book_record where court_date = ? and book_state = 1 group by court_time,court_name) as price where t1.court_date = ? and t1.court_time = price.court_time and t1.court_name = price.court_name and t1.price = price.`max` group by t1.court_name,t1.court_time order by book_time',
        [court_date,court_date],function (err,result) {
        if (err) {
            console.log('query_book_winner_id err:'+err.message)
        }
        callback(result);
    })
}
function update_state2success(client,winner_id,callback) {
    client.query('update book_record set book_state = 2 where id in (?)',[winner_id],
        function (err,result) {
        if(err) {
            console.log('update_state2success err:'+err.message)
        }
        callback(result)
    })
}
function update_state2failure(client,court_date,callback) {
    client.query('update book_record set book_state = 3 where court_date = ? and book_state = 1',[court_date],
        function (err,result) {
            if(err) {
                console.log('update_state2failure err:'+err.message)
            }
            callback(result)
    })
}

function insert_sys_msg(client,email,time,msg,callback) {
    client.query('insert into sys_msg (email,time,msg) values (?,?,?)',
        [email,time,msg],function (err,result) {
            if (err) {
                console.log('insert_sys_msg err:'+err.message);
            }
            callback(result);
        })
}
function query_sys_msg(client,email,callback) {
    client.query('select * from sys_msg where email = ? order by id desc',
        [email],function (err,result) {
            if(err) {
                console.log('query_sys_msg err:'+err.message);
            }
            callback(result);
        })
}
exports.connect = connect;
exports.insert_book_record = insert_book_record;
exports.insert_user = insert_user;
exports.query_user = query_user;
exports.update_account = update_account;
exports.update_state = update_state;
exports.query_book_record = query_book_record;
exports.query_book_record_by_user_id = query_book_record_by_user_id;
exports.update_book_record_price = update_book_record_price;
exports.update_book_record_state = update_book_record_state;
exports.query_book_court_nums = query_book_court_nums;
exports.query_book_court_nums1 = query_book_court_nums1;
exports.court_avg_price = court_avg_price;
exports.query_book_winner_id = query_book_winner_id;
exports.update_state2success = update_state2success;
exports.update_state2failure = update_state2failure;
exports.insert_sys_msg = insert_sys_msg;
exports.query_sys_msg = query_sys_msg;