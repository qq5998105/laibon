//function SearchData(){
//    console.log("getSearchData.js页面的床位号bedNUm="+bedNUm);
//    $.ajax({
//        "url":"http://192.168.1.224:8080/nursecare/patient/findByBednum.do?bedNum="+bedNUm,
//        "type":"post",
//        "dataType":"json",
//        "success":function(data){
//            console.log("getSearchData.js页面的当前床位号的尊长信息：");
//            console.log(data);
//            //if(data.status==100){
//            //    alert("无此人！");
//            //    return;
//            //}
//            //var x=data.body.axisX;
//            //var y=data.body.axisY;
//            //console.log(x+","+y);
//            //markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(x,y),icon));
////            var marker=new Array(data.body.length);
////            var str=JSON.stringify(data);
////            console.log(str);
////
////            for(var i=0;i<data.body.length;i++){
////                var x=data.body[i].axisX;
////                console.log(x);
////                var y=data.body[i].axisY;
////                console.log(y);
////                var gender=data.body[i].newGender;
////                console.log(gender);
////                var flag=data.body[i].flag;
////                var name=data.body[i].patientName;
////                var icon;
////                marker[i] = new OpenLayers.Layer.Markers("Markers");
////                map.addLayer(marker[i]);
////                var size = new OpenLayers.Size(21,25);
////                var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
////                if(gender=="男"){
////                    switch(flag){
////                        case 1:
////                            icon = new OpenLayers.Icon('../img/man/man1.png',size,offset);
////                            break;
////                        case -1:
////                            icon=new OpenLayers.Icon('../img/man/offMan.png',size,offset);
////                            break;
////                    }
////                }else{
////                    switch(flag){
////                        case 1:
////                            icon = new OpenLayers.Icon('../img/women/women1.png',size,offset);
////                            break;
////                        case -1:
////                            icon=new OpenLayers.Ico n('../img/women/offWomen.png',size,offset);
////                            break;
////                    }
////                }
//////				console.log(123);
////                marker[i].addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(x,y),icon));
////
////                var html="<b>"+name+"</b>";
////                popup2=new OpenLayers.Popup("popup2",      //唯一标识id
////                    new OpenLayers.LonLat(x,y),
////                    new OpenLayers.Size(50,50),        //经纬度坐标一般与大小（size）一起用,size用于设置弹出框的大小
////                    html,
////                    false);               //值为true时，表示有关闭图案，false无关闭图案
////                popup2.setBackgroundColor("#fff");
////                popup2.setOpacity(2);
//////                    popup2.setBorder("1px solid #000000");  //#d91f12:红色
////                map.addPopup(popup2);
////
////                marker[i].name=name;
////                marker[i].gender=gender;
////                marker[i].x=x;
////                marker[i].y=y;
////
////                //鼠标悬浮到图标上的事件
////                marker[i].events.register("click", marker[i], function(evt){
////                    var html="<b>姓名："+this.name+"<br/>性别："+this.gender+"</b>";
////                    popup3=new OpenLayers.Popup("popup3",   //唯一标识id
////                        new OpenLayers.LonLat(this.x,this.y),
////                        new OpenLayers.Size(150,50),        //经纬度坐标一般与大小（size）一起用
////                        html,
////                        true);               //值为true时，表示有关闭图案，false无关闭图案
////                    popup3.setBackgroundColor("#ffffff");
////                    popup3.setOpacity(12);
////                    popup3.setBorder("1px solid #000000");  //#d91f12:红色
////                    map.addPopup(popup3);
////                });
////
////            }
//        },
//        "error":function(){
//            alert("getSearchData.js搜查老人所在位置信息出现错误！");
//        }
//    });
//
//
//}
