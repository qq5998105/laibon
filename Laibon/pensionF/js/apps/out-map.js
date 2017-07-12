console.log("进入out-map.js中了！！！");
var num=123;
var lon;
var lat;
var out_map = new AMap.Map('container',{
    resizeEnable: true,         //是否监控地图容器尺寸变化，默认值为false
    zoom: 15,                   //Number 地图显示的缩放级别，若center与level未赋值，地图初始化默认显示用户所在城市范围
    center: [117.303389,31.814245]
});

//显示蓝色定位气球(Marker)
var marker = new AMap.Marker({
    position: [117.303389,31.814245],             //marker所在的位置
    map:out_map                                      //创建时直接赋予map属性

});

//随意设置的一个便于后面操作的蓝色定位气球(Marker)
marker_out = new AMap.Marker({
    position: [-10,-10],
    map:out_map
});


//放大
document.getElementById("zoomIn").onclick=function(){
    out_map.zoomIn();
};
//缩小
document.getElementById("zoomOut").onclick=function(){
    out_map.zoomOut();
};

//增加事件拖拽监听事件
//AMap.event.addListener(map,"dragend",function(){
//    alert("你拽我啦？其实我不生气！");
//});

/* 为地图注册click事件获取鼠标点击出的经纬度坐标
*
* 同时添加单击事件增加IPC设备
*
* */
var clickEventListener = out_map.on('click', function(e) {
    lon= e.lnglat.getLng();
    lat= e.lnglat.getLat();
    console.log( lon+ ',' +lat);
    var b=confirm("确定在此处添加一个IPC吗？");
    console.log(b);
    if(b){
        //alert($("#addBtn").attr("href"));
        $("#popBorder").css("display","block");
    }

});

//  添加比例尺插件(或叫控件)
out_map.plugin(['AMap.Scale'],function(){
    var scale= new AMap.Scale();   //实例化比例尺控件
    out_map.addControl(scale);
});

// 添加工具条控件
out_map.plugin(['AMap.ToolBar'],function(){
    var tool=new AMap.ToolBar();
    out_map.addControl(tool);
});

// 添加鹰眼控件
out_map.plugin(['AMap.OverView'],function(){
    var view=new AMap.OverView();
    view.open();
    out_map.addControl(view);
});

// 添加地图类型
out_map.plugin(['AMap.MapType'],function(){
    var type=new AMap.MapType();
    out_map.addControl(type);
});

console.log("out-map.js结束。。。");

