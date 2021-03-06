var map, measureControls;
var markers;
function init(){
    //OpenLayers.Map(id):创建地图实例
    //OpenLayers:格式地图数据的发布
    map = new OpenLayers.Map('map');

    /**********************加载图层开始*******************************/
    var graphic1 = new OpenLayers.Layer.Image(
        'BinJiang City',
        '../img/lb_test.jpg',
        /**
         *  图层坐标范围
         * 表示边界类实例。使用bounds之前需要设置left,bottom, right, top四个属性，这些属性的初始值为null。
         */
        new OpenLayers.Bounds(-16.26, -12.195, 16.26, 12.195),
        /**
         *   图片大小
         * OpenLayers.Size(w,h):此类描绘一对高宽值的实例
         */
        new OpenLayers.Size(800, 600),
        // 缩放水平的数量
        {numZoomLevels: 10}
    );
    map.addLayers([graphic1]);

//				setCenter(position:LngLat):设置地图显示的中心点

//				  map.setCenter(new OpenLayers.LonLat(-60, 0), 0);


    // 注册map点击事件
    map.events.register("click", map, onMapClick);
    // 注册map点击事件
//				map.events.register("zoomend", map, onMapZoom);

    /*
     *  放大到全屏
     *  zoomToMaxExtent():是用于将地图放大到最大范围的按钮. 它和OpenLayers.Control.Panel一起使用.
     *
     * */
    map.zoomToMaxExtent();

    // map.addControl(new OpenLayers.Control.LayerSwitcher());
    // map.addControl(new OpenLayers.Control.MousePosition());


    /**
     * 加载基础控件
     */
        // 添加平移缩放工具条.
        // PanZoomBar 是一个可视化的控件。
        // 是由 OpenLayers.Control.PanPanel 和 OpenLayers.Control.ZoomBar组合而成.?
        // 认显示在地图左上角，包含4个方向箭头和一个纵向滑动杆。
    map.addControl(new OpenLayers.Control.PanZoomBar({   //与{numZoomLevels: 10}相对应：表示缩放工具条的数量
        position: new OpenLayers.Pixel(2, 6)     //pixel:（显示器或电视机图象的）像素之意
        //Pixel(x,y):此类用X,Y坐标描绘屏幕坐标。即4个方向箭头和一个纵向
        // 滑动杆在屏幕上的位置。
    }));
//					map.addControl(new OpenLayers.Control.Navigation());  //双击放大,平移
    //map.addControl(new OpenLayers.Control.Scale($('scale')));  //获取地图比例尺
    // map.addControl(new OpenLayers.Control.MousePosition({element: $('location')}));  //获取鼠标的经纬度
    //map.setCenter(new OpenLayers.LonLat(100.254, 35.25), 1);  //添加平移缩放工具条
    //map.addControl(new OpenLayers.Control.OverviewMap());  //添加鹰眼图
    //map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));  //图层切换工具
    // map.addControl(new OpenLayers.Control.Permalink('xxxx'));  //添加永久链接
    //map.addControl(new OpenLayers.Control.MouseToolbar());

    //map.zoomToMaxExtent();
    //var zb=new OpenLayers.Control.ZoomBox({out:true});
    //var panel = new OpenLayers.Control.Panel({defaultControl: zb});
    //map.addControl(panel);

    /*****************************测距、面积Start***************************/


    // style the sketch（画素描） fancy
    var sketchSymbolizers = {
        "Point": {
            pointRadius: 4,               //radius:半径
            graphicName: "square",       //graphic:绘画的
            fillColor: "white",
            fillOpacity: 1,
            strokeWidth: 1,          //stroke:"画"的意思
            strokeOpacity: 1,
            strokeColor: "#333333"
        },
        "Line": {
            strokeWidth: 3,                //{Number} 边框像素宽度.
            strokeOpacity: 1,             // {Number}线边框透明度 (0-1).
            strokeColor: "#ffffff",      // {String}线边框颜色值.
            strokeDashstyle: "dash"      //dashstyle:样式
        },
        "Polygon": {                      //多边形
            strokeWidth: 2,
            strokeOpacity: 1,
            strokeColor: "#ffffff",
            fillColor: "white",
            fillOpacity: 0.3
        }
    };

    var style = new OpenLayers.Style();
    style.addRules([
        new OpenLayers.Rule({symbolizer: sketchSymbolizers})
    ]);

    var styleMap = new OpenLayers.StyleMap({"default": style});

    // allow testing of specific renderers via "?renderer=Canvas", etc
    var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

    measureControls = {
        line: new OpenLayers.Control.Measure(
            OpenLayers.Handler.Path, {
                persist: true,
                handlerOptions: {
                    layerOptions: {
                        renderers: renderer,
                        styleMap: styleMap
                    }
                }
            }
        ),
        polygon: new OpenLayers.Control.Measure(
            OpenLayers.Handler.Polygon, {
                persist: true,
                handlerOptions: {
                    layerOptions: {
                        renderers: renderer,
                        styleMap: styleMap
                    }
                }
            }
        )
    };

    var control;
    for(var key in measureControls) {
        control = measureControls[key];
        control.events.on({
            "measure": handleMeasurements,
            "measurepartial": handleMeasurements
        });
        map.addControl(control);
    }

    //map.setCenter(new OpenLayers.LonLat(0, 0), 3);

    /**************************测距、面积End***************************/


    /**
     * 添加图片标注
     */
    markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);

    var size = new OpenLayers.Size(21,25);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    var icon = new OpenLayers.Icon('../js/plugins/map/openlayer/img/marker.png',size,offset);
    markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(-5.020275,-4.8068625),icon));

    var halfIcon = icon.clone();
    markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(1.66665,-4.776375),halfIcon));
    halfIcon.setOpacity(0.5);    //设置透明度

    marker = new OpenLayers.Marker(new OpenLayers.LonLat(8.00805,-4.532475),icon.clone());
    marker.setOpacity(0.2);
    //鼠标点击事件
    marker.events.register('mousedown', marker, function(evt) {
        alert("鼠标点击事件："+this.icon.url);
        OpenLayers.Event.stop(evt);
    });
    markers.addMarker(marker);

    //map.addControl(new OpenLayers.Control.LayerSwitcher());
    //map.zoomToMaxExtent();

    //鼠标悬浮到图标上的事件
    var companyname="来邦科技股份公司",renshu=302;
    marker.events.register("mouseover", marker, function(evt){
        var html="<b>??"+companyname+"<br>??当前人数："+renshu+"人</b>";
        popup1=new OpenLayers.Popup("popup1",   //唯一标识id
            new OpenLayers.LonLat(8.00805,-4.532475),
            new OpenLayers.Size(150,50),        //经纬度坐标一般与大小（size）一起用
            html,
            true);               //值为true时，表示有关闭图案，false无关闭图案
        popup1.setBackgroundColor("#ffffff");
        popup1.setOpacity(12);
        popup1.setBorder("1px solid #000000");  //#d91f12:红色
        map.addPopup(popup1);
    });
    //鼠标移开事件
    marker.events.register("mouseout", marker, function(evt){
        popup1.hide();
    });


    function onMapZoom(e){
        console.log("123");
        graphic1.setVisibility(true);
    }

}

//测距、面积
function handleMeasurements(event) {
    var geometry = event.geometry;   //geometry: 几何学
    var units = event.units;         //units: 单位
    var order = event.order;
    var measure = event.measure;
    var element = document.getElementById('output');
    var out = "";
    if(order == 1) {
        out += "measure: " + measure.toFixed(3) + " " + units;
    } else {
        out += "measure: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
    }
    element.innerHTML = out;
}

function toggleControl(_value) {
    for(key in measureControls) {
        var control = measureControls[key];
        if(_value == key ) {
            control.activate();
        } else {
            control.deactivate();
        }
    }
}


function onMapClick(e){
    //alert('click');
    // 显示地图屏幕坐标
    var str = "[Screen]:" + e.xy.x + "," + e.xy.y;
    document.getElementById("screen_xy").innerHTML = str;
    // 屏幕坐标向地图坐标的转换
    var lonlat = map.getLonLatFromViewPortPx(e.xy);
    str = "[Map]:" + lonlat.lon + "," + lonlat.lat;
    document.getElementById("location").innerHTML = str;
    alert("点击处的坐标为："+str);
    //生成点图层


}


function createPoint(){
    /******************************生成点图层Start***********************************/
    // Create 50 random features, and give them a "type" attribute that
    // will be used for the label text.
    var features = new Array(50);
    for (var i=0; i<features.length; i++) {
        features[i] = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(
                (360 * Math.random()) - 180, (180 * Math.random()) - 90
            ), {
                type: 5 + parseInt(5 * Math.random())
            }
        );
    }
    /**
     * Create a style instance that is a collection of rules with symbolizers.
     * Use a default symbolizer to extend symoblizers for all rules.
     */
    var style = new OpenLayers.Style({
        fillColor: "#ffcc66",
        strokeColor: "#ff9933",
        strokeWidth: 2,
        label: "${type}",
        fontColor: "#333333",
        fontFamily: "sans-serif",
        fontWeight: "bold"
    }, {
        rules: [
            new OpenLayers.Rule({
                minScaleDenominator: 200000000,
                symbolizer: {
                    pointRadius: 7,
                    fontSize: "9px"
                }
            }),
            new OpenLayers.Rule({
                maxScaleDenominator: 200000000,
                minScaleDenominator: 100000000,
                symbolizer: {
                    pointRadius: 10,
                    fontSize: "12px"
                }
            }),
            new OpenLayers.Rule({
                maxScaleDenominator: 100000000,
                symbolizer: {
                    pointRadius: 13,
                    fontSize: "15px"
                }
            })
        ]
    });
    // Create a vector layer and give it your style map.
    var points = new OpenLayers.Layer.Vector("Points", {
        styleMap: new OpenLayers.StyleMap(style)
    });
    points.addFeatures(features);
    map.addLayer(points);
    /******************************生成点图层End***********************************/

}

// 缩小
function zoomOut(){
    map.zoomOut();
}

// 放大
function zoomIn(){
    map.zoomIn();
}

/**
 * 获取地图大小
 */
function getSize(){
    alert(map.getSize()+",高度为="+map.getSize().h);
}

/**
 * 显示标注
 */
var marker1;
function addMarker(){
    var url = '../plugins/map/openlayer/img/marker-blue.png';
    // 尺寸大小
    var sz = new OpenLayers.Size(20, 20);
    var calculateOffset = function(size) {
        return new OpenLayers.Pixel(-(size.w/2), -size.h);
    };
    var icon = new OpenLayers.Icon(url, sz, null, calculateOffset);

    marker1 = new OpenLayers.Marker(new OpenLayers.LonLat(48,31), icon);
    markers.addMarker(marker1);
}

/**
 * 移除标注
 */
function removeMarker() {
    markers.removeMarker(marker1);
}

/**
 * 多边形获取经纬度坐标系
 */
function test(){
    var getpolygonxy = new OpenLayers.Control();
    OpenLayers.Util.extend(getpolygonxy, {
        draw: function() {
            this.polygon= new OpenLayers.Handler.Polygon(getpolygonxy ,
                { "done": this.notice },{ "persist": true},
                { keyMask: OpenLayers.Handler.MOD_SHIFT });
            this.polygon.activate();
        },
        notice: function(bounds) {
            // 坐标信息
            alert(bounds);
        }
    });
    map.addControl(getpolygonxy);
}

//		markers = new OpenLayers.Layer.Markers( "Markers" );
//		map.addLayer(markers);
//
//		var size = new OpenLayers.Size(21,25);
//		var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
//		var icon = new OpenLayers.Icon('../img/volder.jpg',size,offset);
//		markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(-10.3251,-2.439),icon));

