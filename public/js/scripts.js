// Empty JS for your own code to be here
function to_login()
{
    try
    {
       $.ajax({
           type: "Get",
           url:"/login",
           error: function (data,status) {
               window.location.href='/login';
           },
           success: function (data,status) {
               window.location.href='/login'
           }
       });
    }
    catch (e){
        console.assert(e.message);
    }
}

function to_register() {
    try
    {
        $.ajax({
            type: "Get",
            url:"/register",
            error: function (data,status) {
                window.location.href='/register';
            },
            success: function (data,status) {
                window.location.href='/register'
            }
        });
    }
    catch (e){
        console.assert(e.message);
    }
}

function to_court() {
    try
    {
        $.ajax({
            type: "Get",
            url:"/court",
            error: function (data,status) {
                window.location.href='/court';
            },
            success: function (data,status) {
                window.location.href='/court'
            }
        });
    }
    catch (e){
        console.assert(e.message);
    }
}

function register_submit() {
    var email = $("#email").val();
    var password = $("#password").val();
    if (email == "") {
        alert("邮箱不能为空！");
        return;
    }
    var tj_email_reg = /^([a-zA-Z0-9_-])+@tongji.edu.cn+/;
    if (!tj_email_reg.test(email)) {
        alert("邮箱不符合格式！");
        return
    }
    if (password== "") {
        alert("密码不能为空！");
        return
    }
    var pwd_reg = /^[0-9a-zA-Z]{6,18}/;
    if(!pwd_reg.test(password)) {
        alert("密码大于6位，不允许特殊字符");
        return
    }
    var data = {"email":email,"pwd":password};
    try
    {
        $.ajax({
            type: "POST",
            url:"/register",
            data: data,
            error: function (data,status) {
                console.log("err msg:"+data);
                alert("注册失败！")
            },
            success: function (data,status) {
                console.log("success msg:"+data);
                if(data =="注册成功") {
                    // alert("注册成功");
                    window.location.href='/login';
                }
                if(data == "注册失败") {
                    alert(data);
                    window.location.reload();
                }else {
                    alert(data);
                }
            }
        });
    }
    catch (e){
        console.assert(e.message);
    }
}

function login_submit() {
    var email = $("#email").val();
    var pwd = $("#password").val();
    if (email == "") {
        alert("邮箱不能为空！");
        return;
    }
    if(pwd == "") {
        alert("密码不能为空！");
        return;
    }
    var data = {"email":email,"pwd":pwd};
    try
    {
        $.ajax({
            type: "POST",
            url:"/login",
            data: data,
            error: function (data,status) {
                console.log("err msg:"+data);
                alert("登录失败！")
            },
            success: function (data,status) {
                console.log("data："+data);
                if(data == "登录成功") {
                    window.location.href = '/court';
                }else {
                    alert(data);
                    window.location.reload();
                }
            }
        });
    }
    catch (e){
        console.assert(e.message);
    }

}

function logout() {
    var email = document.getElementsByClassName('self')[0].innerText;
    if (email == 'LOGIN') {
        window.location.href = '/login';
        return
    }
    try
    {
        $.ajax({
            type: "GET",
            url:"/logout",
            error: function (data,status) {
                console.log("err msg:"+data);
                window.location.href = '/login';
            },
            success: function (data,status) {
                window.location.href = '/login';
            }
        });
    }
    catch (e){
        console.assert(e.message);
    }
}

function self() {
    var email = document.getElementsByClassName('self')[0].innerText;
    if(email == 'LOGIN') {
        window.location.href = '/login';
        return
    }
    window.location.href = '/self';


}

function search_court() {
    var court_type = $("#court_type").val();
    var court_date = $("#court_date").val();
    if (court_date != '') {
        var date = court_date.split('-');
        var search_date = new Date(date[0],date[1]-1,date[2]);
        var flag = search_date - new Date();
        if (!(flag>0&&flag<=72*3600*1000)) {
            alert("选择时间在未来三天内！")
            return;
        }
    }
    
    var data = {'court_type':court_type,"court_date":court_date};
    try
    {
        $.ajax({
            type: "POST",
            url:"/search_court",
            data:data,
            error: function (data,status) {
                console.log("err msg:"+data);
                window.location.reload();
            },
            success: function (data,status) {
                $("#court_info").html(search_result(data));
            }
        });
    }
    catch (e){
        console.assert(e.message);
    }
}

function search_result(data) {
    var result = ' <thead><tr><th>场馆日期 </th><th>场地名</th><th>时间段</th><th>当前平均预定费用</th><th>当前预订人数</th></tr></thead><tbody>';
    data = data.split(',')
    length = data.length/5;
    for(var i = 0;i<length;i++) {
        var j = 5 * i;
        if (i%5 == 0) {
            result = result + '<tr>';
        }
        if (i%5==1) {
            result = result +'<tr class="table-active">';
        }
        if (i%5 == 2) {
            result = result +'<tr class="table-success">';
        }
        if (i%5 == 3) {
            result = result +'<tr class="table-warning">';
        }
        if (i%5 == 4) {
            result = result +'<tr class="table-danger">';
        }

        result = result + '<td>'+data[j]+'</td>';
        result = result + '<td>'+data[j+1]+'</td>';
        result = result + '<td>'+data[j+2]+'</td>';
        result = result + '<td>'+data[j+3]+'</td>';
        result = result + '<td>'+data[j+4]+'</td>';
        result = result + '</tr>';
    }
    result = result + '</tbody>';
    return result;
}

function to_book() {
    var email = document.getElementsByClassName('self')[0].innerText;
    if(email == 'LOGIN') {
        window.location.href='/login';
        return
    }
    window.open("/book","预定场馆","width = 600,height = 200");
}
function book_court() {
    var court_type = $('#court_type').val();
    var court_date = $('#court_date').val();
    var court_num = $('#court_num').val();
    var court_time = $('#court_time').val();
    var book_price = $('#book_price').val();
    if (court_date == '') {
        alert("请选择未来三天内的日期！")
        return
    }
    var date = court_date.split('-');
    var book_date = new Date(date[0],date[1]-1,date[2]);
    var flag = book_date - new Date();
    if (!(flag>0&&flag<=72*3600*1000)) {
        alert("选择日期在未来三天内！")
        return;
    }
    if (court_num == ''|| court_num <1 || court_num>2) {
        alert("场馆序号在1~2!");
        return
    }
    if (book_price == ''||book_price<5) {
        alert("预定价格高于5！");
        return
    }
    var data = {'court_type':court_type,'court_num':court_num,'court_date':court_date,'court_time':court_time,'book_price':book_price};
    try
    {
        $.ajax({
            type: "POST",
            url:"/book",
            data:data,
            error: function (data,status) {
                console.log("err msg:"+data);
                window.location.href = '/court';
            },
            success: function (data,status) {
                if (data == '预定成功') {
                    alert(data);
                    window.close();
                }
                else{
                    alert(data);
                }
            }
        });
    }
    catch (e){
        console.assert(e.message);
    }
}

function book_record() {
    $("#btn_sys").css("background","#2e3435")
    $("#btn_court_record").css("background","#5cb85c")
    try
    {
        $.ajax({
            type: "get",
            url:"/book_record",
            error: function (data,status) {
                console.log("err msg:"+data);
                window.location.href = '/self';
            },
            success: function (data,status) {
                $("#table_record").html(book_record_html(data));
            }
        });
    }
    catch (e){
        console.assert(e.message);
    }

}

function book_record_html(data) {
    var result = '<thead class="thead"><tr><th>场地日期</th> <th>场地时间</th> <th>场地名称</th> <th>预定费用</th> <th>预定状态</th> <th></th> </tr></thead>';
    result = result + '<tbody>';
    data = JSON.parse(data);
    for(var i = 0;i<data.length;i++) {
        if (i%5 == 0) {
            result = result + '<tr><td>'
        }
        if (i%5 == 1) {
            result =result + '<tr class="table-active"><td>'
        }
        if (i%5 == 2) {
            result =result + '<tr class="table-success"><td>'
        }
        if(i%5 == 3) {
            result = result + '<tr class="table-warning"><td>'
        }
        if (i%5 == 4) {
            result =result + '<tr class="table-danger"><td>'
        }
        result = result
            +data[i]['court_date']+'</td><td>'
            +data[i]['court_time']+'</td><td>'
            +data[i]['court_name']+'</td><td>'
            +data[i]['book_price']+'</td><td>'
            +data[i]['book_state']+'</td>';
        if (data[i]['book_state'] == '预定中') {
            result = result+'<td>'+' <button id=" '+data[i]['id']+'" class="btn-danger" onclick="cancel_book(this)">取消预订</button></td>'

        }
        result = result + '</tr>';
    }
    result = result + '</tbody>';
    return result;

}
function cancel_book(btn) {
    var id = btn.id;
    var data = {'id':id};
    try
    {
        $.ajax({
            type: "post",
            url:"/cancel_book",
            data:data,
            error: function (data,status) {
                console.log("err msg:"+data);
                window.location.href = '/self';
            },
            success: function (data,status) {
                if (data == '取消预定成功') {
                    alert('取消预定成功');
                    window.location.reload();
                }
                else {
                    alert(data)
                    window.location.reload();
                }
            }
        });
    }
    catch (e){
        console.assert(e.message);
    }
}
function system_record() {
    $("#btn_sys").css("background","#5cb85c")
    $("#btn_court_record").css("background","#2e3435")
    try
    {
        $.ajax({
            type: "get",
            url:"/sys_record",
            error: function (data,status) {
                console.log("err msg:"+data);
                window.location.href = '/self';
            },
            success: function (data,status) {
                $("#table_record").html(system_record_html(data));
            }
        });
    }
    catch (e){
        console.assert(e.message);
    }
}
function system_record_html(data) {
    var result = '<thead class="thead"><tr><th>通知时间</th> <th>通知内容</th> ';
    result = result + '<tbody>';
    data = JSON.parse(data);
    for(var i = 0;i<data.length;i++) {
        if (i%5 == 0) {
            result = result + '<tr><td>'
        }
        if (i%5 == 1) {
            result =result + '<tr class="table-active"><td>'
        }
        if (i%5 == 2) {
            result =result + '<tr class="table-success"><td>'
        }
        if(i%5 == 3) {
            result = result + '<tr class="table-warning"><td>'
        }
        if (i%5 == 4) {
            result =result + '<tr class="table-danger"><td>'
        }
        result = result
            +data[i]['time']+'</td><td>'
            +data[i]['msg']+'</td>';

        result = result + '</tr>';
    }
    result = result + '</tbody>';
    return result;

}
function book_conclude() {
    alert("fuck u")
    var court_date = $('#court_date').val();
    var data = {'court_date':court_date};
    try
    {
        $.ajax({
            type: "post",
            url:"/book_conclusion",
            data:data,
            error: function (data,status) {
                console.log("err msg:"+data);
                window.location.href = '/admin';
            },
            success: function (data,status) {
                if(data == '结算成功') {
                    alert(data);
                    window.close();
                }
                else {
                    alert(data);
                }
            }
        });
    }
    catch (e){
        console.assert(e.message);
    }

}
function recharge() {
    var recharge_amount = prompt('请输入充值金额');
    if(recharge_amount<=0) {
        alert("充值金额大于0！");
        return
    }
    if(recharge_amount>200) {
        alert('单次充值最多200！');
        return
    }
    var data = {'recharge_amount':recharge_amount};
    try
    {
        $.ajax({
            type: "post",
            url:"/recharge",
            data:data,
            error: function (data,status) {
                console.log("err msg:"+data);
                window.location.href = '/self';
            },
            success: function (data,status) {
                if(data == '充值成功') {
                    alert(data);
                    window.location.reload();
                }
                else {
                    alert(data);
                }
            }
        });
    }
    catch (e){
        console.assert(e.message);
    }

}