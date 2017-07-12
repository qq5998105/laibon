var graphic2;
$(function() {
    console.log("getData.js页面的floorId=" + floorId);
    $.ajax({
        //所有的楼层信息
        "url": "http://192.168.1.224:8080/nursecare/map/selectBuildingFloor.do",
        "type": "post",
        "dataType": "json",
        "success": function (data) {
            console.log("getData.js中的楼层详细信息：");
            console.log(data);
            for(var i=0;i<data.body.length;i++){
                var str="../";
                var path=str+data.body[i].mapPath;
                console.log("此时从服务端获取的图片路径为"+path);
                if(data.body[i].floorId==floorId){
                    map.removeLayer(graphic1);
                    //map.removeLayer(graphic2);
                    graphic2=new OpenLayers.Layer.Image(
                        "对应的大钟楼"+i,
                        path,
                        new OpenLayers.Bounds(-16.26, -12.195, 16.26, 12.195),
                        new OpenLayers.Size(800,600),
                        {numZoomLevel:10}
                    );
                    map.addLayer(graphic2);
                }
            }

            //对应楼层的老人位置信息
            $.ajax({
                //相应的楼层对应的老人信息
                "url": "http://192.168.1.224:8080/nursecare/map/selectSNAxisPatient.do?floorId=" + floorId,
                "type": "post",
                "dataType": "json",
                "success": function (data) {
                    console.log("getData.js中的楼层对应的老人信息：");
                    console.log(data);
                    if (data.status == 100) {
                        console.log("该楼层无老人信息！！！");
                        return;
                    }
                    var marker = new Array(data.body.length);
                    var str = JSON.stringify(data);
                    console.log(str);

                    for (var i = 0; i < data.body.length; i++) {
                        var x = data.body[i].axisX;
                        console.log(x);
                        var y = data.body[i].axisY;
                        console.log(y);
                        var gender = data.body[i].newGender;
                        console.log(gender);
                        var flag = data.body[i].flag;
                        var name = data.body[i].patientName;
                        var icon;
                        marker[i] = new OpenLayers.Layer.Markers("Markers");
                        map.addLayer(marker[i]);
                        var size = new OpenLayers.Size(21, 25);
                        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
                        if (gender == "男") {
                            switch (flag) {
                                case 1:
                                    icon = new OpenLayers.Icon('../img/man/man1.png', size, offset);
                                    break;
                                case -1:
                                    icon = new OpenLayers.Icon('../img/man/offMan.png', size, offset);
                                    break;
                            }
                        } else {
                            switch (flag) {
                                case 1:
                                    icon = new OpenLayers.Icon('../img/women/women1.png', size, offset);
                                    break;
                                case -1:
                                    icon = new OpenLayers.Icon('../img/women/offWomen.png', size, offset);
                                    break;
                            }
                        }
//				console.log(123);
                        marker[i].addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon));

                        var html = "<b>" + name + "</b>";
                        popup2 = new OpenLayers.Popup("popup2",      //唯一标识id
                            new OpenLayers.LonLat(x, y),
                            new OpenLayers.Size(50, 50),        //经纬度坐标一般与大小（size）一起用,size用于设置弹出框的大小
                            html,
                            false);               //值为true时，表示有关闭图案，false无关闭图案
                        popup2.setBackgroundColor("#fff");
                        popup2.setOpacity(2);
//                    popup2.setBorder("1px solid #000000");  //#d91f12:红色
                        map.addPopup(popup2);

                        marker[i].name = name;
                        marker[i].gender = gender;
                        marker[i].x = x;
                        marker[i].y = y;

                        //鼠标悬浮到图标上的事件
                        marker[i].events.register("click", marker[i], function (evt) {
                            var html = "<b>姓名：" + this.name + "<br/>性别：" + this.gender + "</b>";
                            popup3 = new OpenLayers.Popup("popup3",   //唯一标识id
                                new OpenLayers.LonLat(this.x, this.y),
                                new OpenLayers.Size(150, 50),        //经纬度坐标一般与大小（size）一起用
                                html,
                                true);               //值为true时，表示有关闭图案，false无关闭图案
                            popup3.setBackgroundColor("#ffffff");
                            popup3.setOpacity(12);
                            popup3.setBorder("1px solid #000000");  //#d91f12:红色
                            map.addPopup(popup3);
                        });

                    }
                },
                "error": function () {
                    alert("出现错误！");
                }
            });
        },
        "error": function () {
            alert("出现错误！");
        }

    });
});