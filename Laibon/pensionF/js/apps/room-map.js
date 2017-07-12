function initial() {
    console.log("第二步");
    map = new OpenLayers.Map('map');
    graphic1 = new OpenLayers.Layer.Image(
        'BinJiang City',
        '../img/map-indoor/lb_test.jpg',
        new OpenLayers.Bounds(-16.26, -12.195, 16.26, 12.195),
        new OpenLayers.Size(800, 600),
        {numZoomLevels: 10}
    );
    map.addLayers([graphic1]);
    // 注册map点击事件
    map.events.register("click", map, onMapClick);
    //此属性必须存在
    map.zoomToMaxExtent();
    map.addControl(new OpenLayers.Control.PanZoomBar({   //与{numZoomLevels: 10}相对应：表示缩放工具条的数量
        position: new OpenLayers.Pixel(2, 6)     //pixel:（显示器或电视机图象的）像素之意
        //Pixel(x,y):此类用X,Y坐标描绘屏幕坐标。即4个方向箭头和一个纵向
        // 滑动杆在屏幕上的位置。
    }));

    console.log("哈哈，终于执行到这了！");

    mark=new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(mark);
    var size = new OpenLayers.Size(30,30);
    var offset = new OpenLayers.Pixel(-15, -50);
    var icon = new OpenLayers.Icon('../js/plugins/map/openlayer/img/marker-blue.png',size,offset);
    canvas_single=new OpenLayers.Marker(new OpenLayers.LonLat(-20,-50),icon);
    mark.addMarker(canvas_single);

}
function onMapClick(e) {
    ////alert('click');
    //// 显示地图屏幕坐标
    //var str = "[Screen]:" + e.xy.x + "," + e.xy.y;
    //document.getElementById("screen_xy").innerHTML = str;
    //// 屏幕坐标向地图坐标的转换
    //var lonlat = map.getLonLatFromViewPortPx(e.xy);
    //str = "[Map]:" + lonlat.lon + "," + lonlat.lat;
    //document.getElementById("location").innerHTML = str;
    ////alert("点击处的坐标为："+str);
    ////生成点图层
}

// 缩小
function zoomOut() {
    map.zoomOut();
}

// 放大
function zoomIn() {
    map.zoomIn();
}