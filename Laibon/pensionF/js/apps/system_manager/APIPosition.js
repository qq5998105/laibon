var marker_ipc;
var marker_ipc_name;
var lon_alter;
var lat_alter;
var ipc_id;
var checkbox_ipc;
$(function() {
    $.ajax({
        url: 'http://192.168.1.224:8080/nursecare/IPC/findOutdoorIPCs.do',
        type: 'post',
        //xml, html, script, json, jsonp, text
        dataType: 'json',
        timeout: 3000,
        success: function (data, textStatus) {
            //parseFloorInfo(data);
            console.log("获取室外IPC的位置信息为：");
            console.log(data);

            if (data.status == 100) {
                alert("无IPC。。。。");
                return;
            }
            console.log(data.body.length);
            marker_ipc = new Array(data.body.length);
            checkbox_ipc = new Array(data.body.length);
            marker_ipc_name=new Array(data.body.length);
            for (var i = 0; i < data.body.length; i++) {
                var lon = data.body[i].longitude;
                //console.log(lon);
                var lat = data.body[i].latitude;
                console.log("第" + i + "个相机的位置坐标为：" + lon + "," + lat);
                marker_ipc[i] = new AMap.Marker({
                    map: out_map,
                    draggable: true,
                    position: [lon, lat],
                    offset: new AMap.Pixel(-10, -34),  //点标记显示位置偏移量
                    icon: "../../img/camera.jpg"
                });


                checkbox_ipc[i] = new AMap.Marker({
                    map: out_map,
                    position: [lon, lat],
                    content: "<input name='checkbox' type='checkbox'/>",
                    offset: new AMap.Pixel(-10, -38)  //点标记显示位置偏移量
                });
                checkbox_ipc[i].id = data.body[i].id;

                AMap.event.addListener(checkbox_ipc[i], 'click', function (e) {
                    var b = confirm("确定删除此位置的ipc吗？");
                    var id = this.id;
                    if (b) {
                        $.ajax({
                            url: 'http://192.168.1.224:8080/nursecare/IPC/delete.do',
                            type: 'post',
                            data: {"id": id},
                            dataType: 'json',
                            timeout: 3000,
                            success: function (data, textStatus) {
                                console.log("删除后从服务端获取的数据为：");
                                console.log(data);
                                console.log("删除成功：");
                                window.location.reload();
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                //timeout也会进入
                                console.log("zhang.获取楼栋..失败....");
                            },

                        });
                    }

                });


                /*拖动修改ipc部分*/
                marker_ipc[i].ipcName = data.body[i].name;
                console.log("此时ipc的名字为：" + marker_ipc[i].ipcName);
                marker_ipc[i].ip = data.body[i].ip;
                console.log("此时ipc的ip为：" + marker_ipc[i].ip);
                marker_ipc[i].port = data.body[i].port;
                console.log("此时ipc的端口为：" + marker_ipc[i].port);
                marker_ipc[i].id = data.body[i].id;
                marker_ipc[i].j=i;


                //console.log("顺序是 :"+marker[i].getzIndex());
                marker_ipc_name[i]=new AMap.Marker({
                    map:out_map,
                    position:[lon,lat],
                    content:"<b style='font-size: large;color:blue;'>"+marker_ipc[i].ipcName+"<b/>",
                    offset:new AMap.Pixel(-10,25)  //点标记显示位置偏移量
                });


                /*为添加的ipc添加拖拽事件*/
                AMap.event.addListener(marker_ipc[i], 'dragging', function (e) {
                    var i=this.j;
                    checkbox_ipc[i].hide();
                    marker_ipc_name[i].hide();
                });

                AMap.event.addListener(marker_ipc[i], 'dragend', function (e) {
                    //alert("你拽我啦？其实我不生气！");
                    console.log(e.lnglat.getLng(), e.lnglat.getLat());
                    lon_alter = e.lnglat.getLng();
                    lat_alter = e.lnglat.getLat();
                    ipc_id = this.id;
                    var b = confirm("确定修改到此位置吗？");
                    if (b) {
                        $("#popBorder_alter").css("display", "block");
                        $("#addr_alter").val(this.ip);
                        $("#por_alter").val(this.port);
                        $("#camName_alter").val(this.ipcName);
                    }else{
                        window.location.reload();
                    }

                });
            }
        }
    });
});




function saveIPC(){
    var ip=$("#addr").val();
    console.log(ip);
    var port=$("#por").val();
    console.log(port);
    var camName=$("#camName").val();
    console.log(camName);
    var location=$("#loc").val();
    console.log(location);
    var objson={"name":camName,"ip":ip,"port":port, "locationDesc":location,
        "longitude":lon,"latitude":lat,"locationType":1};
    var obj=JSON.stringify(objson);

    $.ajax({
        url:'http://192.168.1.224:8080/nursecare/IPC/addNewIPC.do',
        type:'post',
        data:{"ipc":obj},
        dataType:'json',
        success:function(data){
            console.log("此时获取添加的IPC信息为：");
            console.log(data);
            window.location.reload();
        },
        error:function(){
            alert("哈哈哒，修改报错啦！！！");
        }

    });

}

function alterIPC(){
    var ip=$("#addr_alter").val();
    console.log(ip);
    var port=$("#por_alter").val();
    console.log(port);
    var camName=$("#camName_alter").val();
    console.log(camName);
    var location=$("#loc_alter").val();
    console.log(location);
    console.log("-126-:"+ipc_id);
    var objson={"name":camName,"ip":ip,"port":port, "longitude":lon_alter,"latitude":lat_alter,
        "id":ipc_id,"locationDesc":location,"locationType":1};
    var obj=JSON.stringify(objson);

    $.ajax({
        url:'http://192.168.1.224:8080/nursecare/IPC/updateIPCMsg.do',
        type:'post',
        data:{"ipc":obj},
        dataType:'json',
        success:function(data){
            console.log("此时获取修改的IPC信息为：");
            console.log(data);
            window.location.reload();
        },
        error:function(){
            alert("呵呵哒，报错啦！！！");
        }

    });

}

function closeIPC(){
    $("#popBorder").css("display","none");
}

function closeIPC_alter(){
    $("#popBorder_alter").css("display","none");
}

///*删除室外地图上的IPC*/
//$("#deleteBtn").click(function(){
//    var ids='';
//    var i=0;
//    $("input[name='delIpc']").each(function(index,el){
//        console.log("select***");
//        if(el.checked){
//            ids=ids+","+el.value;
//            i=i+1;
//            //发http请求
//            //$("#msg_"+el.value).remove();
//        }
//    });
//    ids=ids.slice(1);
//    console.log("总共选择了："+i+'个.....'+"ids="+ids);
//    if(ids){
//        $.ajax({
//            url: 'http://192.168.1.224:8080/nursecare/IPC/deleteMany.do?ids=' + ids,
//            type: 'GET',
//            //xml, html, script, json, jsonp, text
//            dataType: 'text',
//            timeout: 3000,
//            beforeSend: function(XMLHttpRequest) {
//
//            },
//            success: function(data, textStatus) {
//                console.log("删除成功：" );
//                window.location.reload();
//            },
//            error: function(XMLHttpRequest, textStatus, errorThrown) {
//                //timeout也会进入
//                console.log("zhang.获取楼栋..失败....");
//            },
//            complete: function(XMLHttpRequest, textStatus) {
//                if(textStatus === 'timeout') {
//
//                }
//            }
//        });
//    }else{
//        alert("您没有选择，请选择要删除的数据！")
//    }

//});

