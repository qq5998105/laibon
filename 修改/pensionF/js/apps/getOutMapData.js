$(function(){
    //标记相机位置
    $.ajax({
        "url":"http://192.168.1.224:8080/nursecare/IPC/findOutdoorIPCs.do",
        "type":"post",
        "dataType":"json",
        "success":function(data){
            console.log("标记相机位置信息数据：");
            console.log(data);
            console.log(data.body.length);
            for(i=0;i<data.body.length;i++){
                var lon=data.body[i].longitude;
                //console.log(lon);
                var lat=data.body[i].latitude;
                console.log("第"+i+"个相机的位置坐标为："+lon+","+lat);
                var marker=new AMap.Marker({
                    map:map,
                    position:[lon,lat],
                    offset:new AMap.Pixel(-10,-34),  //点标记显示位置偏移量
                    icon:"../img/camera.jpg"
                });
            }
        },
        "error":function(){
//          alert("出现错误！");
        }

    });

    //室外老人定位
    $.ajax({
        "url":"http://192.168.1.224:8080/nursecare/map/selectSWAxisPatient.do",
        "type":"post",
        "dataType":"json",
        "success":function(data){
            console.log("老人定位：");
            console.log(data);
            console.log(data.body.length);
            var marker=new Array(data.body.length);
            for(var i=0;i<data.body.length;i++){
                var lon=data.body[i].longitude;
                //console.log(lon);
                var lat=data.body[i].latitude;
                console.log("第"+i+"位老人的位置坐标为："+lon+","+lat);
                var flag=data.body[i].flag;
                var gender=data.body[i].newGender;
                var name=data.body[i].patientName;
                marker[i]=new AMap.Marker({
                    map:map,
                    position:[lon,lat],
                    offset:new AMap.Pixel(-30,-80)  //点标记显示位置偏移量
                });
                if(gender=="男") {
                    switch (flag) {
                        //flag=1 表在线
                        case 1:
                            marker[i].setIcon("../img/man/man2.png");
                            break;
                        case -1:
                            marker[i].setIcon("../img/man/offMan.png");
                            break;
                    }
                }else{
                    switch(flag){
                        //flag=1 表在线
                        case 1: marker[i].setIcon("../img/women/women2.png"); break;
                        case -1: marker[i].setIcon("../img/women/offWomen.png"); break;
                    }

                }

                //marker[i].vid=data.body[i].id;
                //console.log("图标的id为："+marker[i].vid);

                marker[i].name=data.body[i].patientName;
                marker[i].gender=data.body[i].newGender;

                //console.log("顺序是 :"+marker[i].getzIndex());

                new AMap.Marker({
                    map:map,
                    position:[lon,lat],
                    content:"<b style='font-size: large;'>"+name+"<b/>",
                    offset:new AMap.Pixel(-10,-25)  //点标记显示位置偏移量
                });

                marker[i].on('click',function(e){
                    console.log(123);
                    //alert(data)
                    //console.log(this.vid);
                    //console.log(i);

                    var info=new AMap.InfoWindow({
                        content:"<b>姓名： "+this.name+"<br/>"+"性别："+this.gender+"<b/>"
                    });
                    info.open(map,new AMap.LngLat(e.lnglat.getLng(),e.lnglat.getLat()));
                });
            }
        },
        "error":function(){
//          alert("出现错误！");
        }
    });
});