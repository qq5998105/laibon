function connect(){
    console.log("进入websocketPush.js的连接方法！！！");
    alert(url);
    if (!url) {
        print('Select whether to use W3C WebSocket or SockJS');
        return;
    }
    var relativeURL = window.location.host;
    //ws = (url.indexOf('sockjs') != -1) ?new SockJS(url, undefined, {protocols_whitelist: transports}) : new WebSocket(url);
    if ('WebSocket'in window) {
        ws= new WebSocket("ws://"+ relativeURL+ "/nursecare/websck.ws");
    }else {
        ws = new SockJS("http://"+ relativeURL+ "/nursecare/sockjs/websck/info.ws");
    }
    alert(ws.url);
    ws.onopen = function () {
        setConnected(true);
        alert("onopen");
    };
    ws.onmessage = function (event) {
        console.log("--22行：一直保持接收从服务端推送过来得数据--");
        print('Received: ' + event.data);
    };
    ws.onclose = function (event) {
        setConnected(false);
        print('Info: connection closed.');
        print(event);
    };

    console.log("websocketPush.js的连接方法结束！！！");
}

function  test(floorId) {
    if (ws != null) {
        console.log("此时调用的楼层Id是："+floorId);
        var message = '{"type":"1","stationId":"1"}';
        console.log('Sent:'+message);
        print('Sent: ' + message);
        ws.send(message);
        ws.onmessage = function (event) {
            console.log("--41行：哈哈一直保持接收从服务端推送过来得数据--");
            print(event.data);
        };
    } else {
        alert('connection not established, please connect.');
    }
}

function setConnected(connected) {
    document.getElementById('connect').disabled = connected;
    document.getElementById('disconnect').disabled = !connected;
}

function disconnect() {
    if (ws != null) {
        ws.close();
        ws = null;
    }
    setConnected(false);
}


