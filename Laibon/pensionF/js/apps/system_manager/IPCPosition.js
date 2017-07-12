var outIPCUrl;
var availableTags=[];
var marker_out = new AMap.Marker({
    position: [0,0],             //marker所在的位置
    map:out_map                     //创建时直接赋予map属性
});


function IPC_POSITION(){
    /*室外地图所有的IPC的路径*/
     outIPCUrl='http://192.168.1.224:8080/nursecare/IPC/findOutdoorIPCs.do';



    this.init=function(){
        saveIPC_search();
        $( "#tags" ).autocomplete({
            source: availableTags
        });

        $("#searchIcon").click(function(){
            var ip=$("#tags").val();
            console.log("搜索框未截取的值为："+ip);
            ip=ip.split(":")[1];
            console.log("此时截取的ip值为："+ip);
            getSingleIPCInfo(ip);
        });

    }

}

function saveIPC_search(){
    $.ajax({
        url:outIPCUrl,
        type:'post',
        dataType:'json',
        success:function(data){
            console.log("获取的室外IPC数据为：");
            console.log(data);

            saveAllIPCInfo(data);

        },
        error:function(){
            alert("系统管理中室外地图部分搜索IPC信息失败......");
        }

    });

}

//保存所有室外IPC信息在搜索框中
function saveAllIPCInfo(IPCdata){
    if('000'==IPCdata.status){
        for(var i = 0; i < parseInt(IPCdata.body.length); i++) {
            availableTags.push("IPC的IP地址:" + IPCdata.body[i].ip);
        }
    }else{
        console.log("请输入正确的搜索条件！");
    }

}

//查找单个IPC数据
function getSingleIPCInfo(ip){
    console.log("此时传过来的ip值为："+ip);
    $.ajax({
        url:'http://192.168.1.224:8080/nursecare/IPC/lowSearchAndSplit.do',
        type:'GET',
        data:{"ip":ip},
        dataType:'json',
        success:function(data){
            console.log("获取的室外单个IPC数据为：");
            console.log(data);
            var lon=data.body.list[0].longitude;
            var lat=data.body.list[0].latitude;
            console.log("单个ipc的经纬度坐标分别为："+lon+","+lat);

            marker_out.hide();
            marker_out = new AMap.Marker({
                position: [lon, lat],             //marker所在的位置
                map:out_map,                     //创建时直接赋予map属性
                offset:new AMap.Pixel(5,-50)      //坐标偏移位置：经度：往右为正；纬度：往上为负
            });
            marker_out.show();

        },
        error:function(){
            alert("系统管理中获取的室外单个IPC信息失败......");
        }

    });


}



