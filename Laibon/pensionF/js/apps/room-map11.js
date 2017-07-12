var map, measureControls;
var markers;
function init(){
    //OpenLayers.Map(id):������ͼʵ��
    //OpenLayers:��ʽ��ͼ���ݵķ���
    map = new OpenLayers.Map('map');

    /**********************����ͼ�㿪ʼ*******************************/
    var graphic1 = new OpenLayers.Layer.Image(
        'BinJiang City',
        '../img/lb_test.jpg',
        /**
         *  ͼ�����귶Χ
         * ��ʾ�߽���ʵ����ʹ��bounds֮ǰ��Ҫ����left,bottom, right, top�ĸ����ԣ���Щ���Եĳ�ʼֵΪnull��
         */
        new OpenLayers.Bounds(-16.26, -12.195, 16.26, 12.195),
        /**
         *   ͼƬ��С
         * OpenLayers.Size(w,h):�������һ�Ը߿�ֵ��ʵ��
         */
        new OpenLayers.Size(800, 600),
        // ����ˮƽ������
        {numZoomLevels: 10}
    );
    map.addLayers([graphic1]);

//				setCenter(position:LngLat):���õ�ͼ��ʾ�����ĵ�

//				  map.setCenter(new OpenLayers.LonLat(-60, 0), 0);


    // ע��map����¼�
    map.events.register("click", map, onMapClick);
    // ע��map����¼�
//				map.events.register("zoomend", map, onMapZoom);

    /*
     *  �Ŵ�ȫ��
     *  zoomToMaxExtent():�����ڽ���ͼ�Ŵ����Χ�İ�ť. ����OpenLayers.Control.Panelһ��ʹ��.
     *
     * */
    map.zoomToMaxExtent();

    // map.addControl(new OpenLayers.Control.LayerSwitcher());
    // map.addControl(new OpenLayers.Control.MousePosition());


    /**
     * ���ػ����ؼ�
     */
        // ���ƽ�����Ź�����.
        // PanZoomBar ��һ�����ӻ��Ŀؼ���
        // ���� OpenLayers.Control.PanPanel �� OpenLayers.Control.ZoomBar��϶���.?
        // ����ʾ�ڵ�ͼ���Ͻǣ�����4�������ͷ��һ�����򻬶��ˡ�
    map.addControl(new OpenLayers.Control.PanZoomBar({   //��{numZoomLevels: 10}���Ӧ����ʾ���Ź�����������
        position: new OpenLayers.Pixel(2, 6)     //pixel:����ʾ������ӻ�ͼ��ģ�����֮��
        //Pixel(x,y):������X,Y���������Ļ���ꡣ��4�������ͷ��һ������
        // ����������Ļ�ϵ�λ�á�
    }));
//					map.addControl(new OpenLayers.Control.Navigation());  //˫���Ŵ�,ƽ��
    //map.addControl(new OpenLayers.Control.Scale($('scale')));  //��ȡ��ͼ������
    // map.addControl(new OpenLayers.Control.MousePosition({element: $('location')}));  //��ȡ���ľ�γ��
    //map.setCenter(new OpenLayers.LonLat(100.254, 35.25), 1);  //���ƽ�����Ź�����
    //map.addControl(new OpenLayers.Control.OverviewMap());  //���ӥ��ͼ
    //map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));  //ͼ���л�����
    // map.addControl(new OpenLayers.Control.Permalink('xxxx'));  //�����������
    //map.addControl(new OpenLayers.Control.MouseToolbar());

    //map.zoomToMaxExtent();
    //var zb=new OpenLayers.Control.ZoomBox({out:true});
    //var panel = new OpenLayers.Control.Panel({defaultControl: zb});
    //map.addControl(panel);

    /*****************************��ࡢ���Start***************************/


    // style the sketch�������裩 fancy
    var sketchSymbolizers = {
        "Point": {
            pointRadius: 4,               //radius:�뾶
            graphicName: "square",       //graphic:�滭��
            fillColor: "white",
            fillOpacity: 1,
            strokeWidth: 1,          //stroke:"��"����˼
            strokeOpacity: 1,
            strokeColor: "#333333"
        },
        "Line": {
            strokeWidth: 3,                //{Number} �߿����ؿ��.
            strokeOpacity: 1,             // {Number}�߱߿�͸���� (0-1).
            strokeColor: "#ffffff",      // {String}�߱߿���ɫֵ.
            strokeDashstyle: "dash"      //dashstyle:��ʽ
        },
        "Polygon": {                      //�����
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

    /**************************��ࡢ���End***************************/


    /**
     * ���ͼƬ��ע
     */
    markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);

    var size = new OpenLayers.Size(21,25);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    var icon = new OpenLayers.Icon('../js/plugins/map/openlayer/img/marker.png',size,offset);
    markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(-5.020275,-4.8068625),icon));

    var halfIcon = icon.clone();
    markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(1.66665,-4.776375),halfIcon));
    halfIcon.setOpacity(0.5);    //����͸����

    marker = new OpenLayers.Marker(new OpenLayers.LonLat(8.00805,-4.532475),icon.clone());
    marker.setOpacity(0.2);
    //������¼�
    marker.events.register('mousedown', marker, function(evt) {
        alert("������¼���"+this.icon.url);
        OpenLayers.Event.stop(evt);
    });
    markers.addMarker(marker);

    //map.addControl(new OpenLayers.Control.LayerSwitcher());
    //map.zoomToMaxExtent();

    //���������ͼ���ϵ��¼�
    var companyname="����Ƽ��ɷݹ�˾",renshu=302;
    marker.events.register("mouseover", marker, function(evt){
        var html="<b>??"+companyname+"<br>??��ǰ������"+renshu+"��</b>";
        popup1=new OpenLayers.Popup("popup1",   //Ψһ��ʶid
            new OpenLayers.LonLat(8.00805,-4.532475),
            new OpenLayers.Size(150,50),        //��γ������һ�����С��size��һ����
            html,
            true);               //ֵΪtrueʱ����ʾ�йر�ͼ����false�޹ر�ͼ��
        popup1.setBackgroundColor("#ffffff");
        popup1.setOpacity(12);
        popup1.setBorder("1px solid #000000");  //#d91f12:��ɫ
        map.addPopup(popup1);
    });
    //����ƿ��¼�
    marker.events.register("mouseout", marker, function(evt){
        popup1.hide();
    });


    function onMapZoom(e){
        console.log("123");
        graphic1.setVisibility(true);
    }

}

//��ࡢ���
function handleMeasurements(event) {
    var geometry = event.geometry;   //geometry: ����ѧ
    var units = event.units;         //units: ��λ
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
    // ��ʾ��ͼ��Ļ����
    var str = "[Screen]:" + e.xy.x + "," + e.xy.y;
    document.getElementById("screen_xy").innerHTML = str;
    // ��Ļ�������ͼ�����ת��
    var lonlat = map.getLonLatFromViewPortPx(e.xy);
    str = "[Map]:" + lonlat.lon + "," + lonlat.lat;
    document.getElementById("location").innerHTML = str;
    alert("�����������Ϊ��"+str);
    //���ɵ�ͼ��


}


function createPoint(){
    /******************************���ɵ�ͼ��Start***********************************/
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
    /******************************���ɵ�ͼ��End***********************************/

}

// ��С
function zoomOut(){
    map.zoomOut();
}

// �Ŵ�
function zoomIn(){
    map.zoomIn();
}

/**
 * ��ȡ��ͼ��С
 */
function getSize(){
    alert(map.getSize()+",�߶�Ϊ="+map.getSize().h);
}

/**
 * ��ʾ��ע
 */
var marker1;
function addMarker(){
    var url = '../plugins/map/openlayer/img/marker-blue.png';
    // �ߴ��С
    var sz = new OpenLayers.Size(20, 20);
    var calculateOffset = function(size) {
        return new OpenLayers.Pixel(-(size.w/2), -size.h);
    };
    var icon = new OpenLayers.Icon(url, sz, null, calculateOffset);

    marker1 = new OpenLayers.Marker(new OpenLayers.LonLat(48,31), icon);
    markers.addMarker(marker1);
}

/**
 * �Ƴ���ע
 */
function removeMarker() {
    markers.removeMarker(marker1);
}

/**
 * ����λ�ȡ��γ������ϵ
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
            // ������Ϣ
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

