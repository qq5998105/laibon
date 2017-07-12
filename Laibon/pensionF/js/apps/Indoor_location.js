//var floorId=$(".floor").val();
//console.log("Indoor_location.js中的floorId="+floorId);
//var graphic=new Array(3000);
var graphic_new;
var availableTags = [];
function INDOOR_LOCATION() {
	//var availableTags = ["张三","刘能","赵四","本山"],
	var floorNumUrl = 'http://192.168.1.224:8080/nursecare/map/selectBuildingFloor.do',      //获取楼层http接口
		eaderInfoUrl = 'http://192.168.1.224:8080/nursecare/patient/NameAndNum.do',     //获取老人姓名与床位号http接口
		onbedNumSearch = 'http://192.168.1.224:8080/nursecare/patient/findByBednum.do?bedNum=1001',   //根据老人床位号搜索定位老人http接口

		testObj = {      //测试用
			"body": [{
				"patientName": "张三",
				"bedNum": "1"
			},
				{
					"patientName": "赵四",
					"bedNum": "5"
				},
				{
					"patientName": "刘能",
					"bedNum": "5"
				},
				{
					"patientName": "旺旺",
					"bedNum": "6"
				}],
			"status": "000"
		};

	this.init = function () {
		initial();                          //  紧接着第二步
		connect();
		getHttpData(floorNumUrl);          //  紧接着第三步
		getHttpData(eaderInfoUrl);          //  紧接着第五步
		/*注册事件*/
		$("#tags").autocomplete({
			source: availableTags
		});
		$("#tags").click(function () {
			//alert("输入input");
		});
		$("#searchIcon").click(function () {
			var bedNUm = $("#tags").val();
			bedNUm = bedNUm.split("：")[2];
			getOnbedNumINfo(bedNUm);


		});
		$(".floor").change(function () {  //为Select添加事件，当选择其中一项时触发
			//console.log("刷新前的准备......");
			//window.location.reload();     //刷新页面
			//console.log("刷新后......");
			var checkText = $(".floor").find("option:selected").text();  //获取Select选择的Text
			var checkValue = $(".floor").val();  //获取Select选择的Value
			console.log("所选的floorId=" + checkValue);
			removeGraphic();
			removeMarker();
			removeAPI();
			getCurrentFloorINfo(checkValue);
			test(checkValue);
		});
		$("#openAlarmlist").click(function () {
			$("#frame_1").contents().find("#panelDefault").show();
			//$("#frame_1").contents().find("#collapseOne").collapse('show');
			//$("#frame_1").contents().find("#collapseOne").collapse('toggle');
			//$("#frame_1").contents().find("#collapseOne").collapse('hide');
		});
		/* 视频播放*/
		$("#closeVideo1").click(function () {
			$(".camera_Vedio1").hide();
		});
		$("#closeVideo2").click(function () {
			$(".camera_Vedio2").hide();
		});
		$("#closeVideo3").click(function () {
			$(".camera_Vedio3").hide();
		});
		$("#closeVideo4").click(function () {
			$(".camera_Vedio4").hide();
		});

	}
}

/*获取所有楼层图片路径信息*/
function getHttpData(apiUrl) {
	console.log("apiUrl=" + apiUrl);		 //第四步，遇$.ajax受阻，回到刚刚执行的init继续执行
	$.ajax({                             //第六步-1
		url: apiUrl,
		type: 'post',
		//xml, html, script, json, jsonp, text
		dataType: 'json',
		timeout: 3000,
		beforeSend: function (XMLHttpRequest) {

		},
		success: function (data, textStatus) {
			if (apiUrl == 'http://192.168.1.224:8080/nursecare/map/selectBuildingFloor.do') {
				parseFloorInfo(data);          //第六步-2
				console.log("获取楼层信息成功.......");
				console.log(data);

			} else if (apiUrl == 'http://192.168.1.224:8080/nursecare/patient/NameAndNum.do') {
				parseElderInfo(data);
				console.log("获取老人信息成功.......");
				console.log(data);
			}

			//parseElderInfo(data);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			//timeout也会进入
			console.log("zhang...失败....");
		},
		complete: function (XMLHttpRequest, textStatus) {
			if (textStatus === 'timeout') {
				//textStatus:timeout,success,error均会进入
				//ajaxTimeoutTest.abort();
				//$(" ").html("加载资源出错，请退出重新进入！");
			}
		}
	});
}

/*获取当前楼层单个老人信息*/
function getCurrentFloorSingleElderInfo(axisXY) {
	console.log("该老人的位置信息为: " + axisXY);
	var x = axisXY.split(",")[0];
	console.log("此单个老人的横坐标为：" + x);
	var y = axisXY.split(",")[1];
	console.log("此单个老人的纵坐标为：" + y);

	mark.removeMarker(canvas_single);
	map.removeLayer(mark);
	console.log("将之前的图标移除！");
	mark = new OpenLayers.Layer.Markers("Markers");
	map.addLayer(mark);
	var size = new OpenLayers.Size(30, 30);
	var offset = new OpenLayers.Pixel(-15, -50);
	var icon = new OpenLayers.Icon('../js/plugins/map/openlayer/img/marker-blue.png', size, offset);
	canvas_single = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);
	mark.addMarker(canvas_single);

}

function getCurrentFloorAllElderINfo(data) {
	if (data.status == 100) {
		console.log("该楼层无老人信息！！！");
		return;
	}
	marker = new Array(data.body.length);
	canvas = new Array(data.body.length);
	popup2 = new Array(data.body.length);
	len = data.body.length;
	console.log("Indoor_location.js中len的值为：" + len);

	for (var i = 0; i < data.body.length; i++) {
		var x = data.body[i].axisX;
		console.log(x);
		var y = data.body[i].axisY;
		console.log(y);
		var gender = data.body[i].newGender;
		console.log(gender);
		var flag = data.body[i].flag;
		var name = data.body[i].patientName;
		var patientId = data.body[i].patientId;
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
		canvas[i] = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);
		marker[i].addMarker(canvas[i]);

		var html = "<b>" + name + "</b>";
		popup2[i] = new OpenLayers.Popup("popup2",      //唯一标识id
			new OpenLayers.LonLat(x, y),
			new OpenLayers.Size(50, 50),        //经纬度坐标一般与大小（size）一起用,size用于设置弹出框的大小
			html,
			false);               //值为true时，表示有关闭图案，false无关闭图案
		popup2[i].setBackgroundColor("none|transparent");
		//popup2[i].setOpacity(2);
//                    popup2.setBorder("1px solid #000000");  //#d91f12:红色
		map.addPopup(popup2[i]);

		marker[i].name = name;
		marker[i].gender = gender;
		marker[i].x = x;
		marker[i].y = y;
		marker[i].patientId = patientId;

		//鼠标悬浮到图标上的事件
		marker[i].events.register("click", marker[i], function (evt) {
			var html = "<b>姓名：" + this.name + "<br/>性别：" + this.gender +
				"<br/>老人ID：" + this.patientId + "</b>";
			popup3 = new OpenLayers.Popup("popup3",   //唯一标识id
				new OpenLayers.LonLat(this.x, this.y),
				new OpenLayers.Size(150, 80),        //经纬度坐标一般与大小（size）一起用
				html,
				true);               //值为true时，表示有关闭图案，false无关闭图案
			popup3.setBackgroundColor("#ffffff");
			popup3.setOpacity(12);
			popup3.setBorder("1px solid #000000");  //#d91f12:红色
			map.addPopup(popup3);
		});

	}

	console.log("加载老人数据成功！");
}

/*显示当前楼层所有老人的信息的楼层Id*/
function getCurrentFloorAllElderINfoFloorId(floorId_present) {                 //第六步-3 遇ajax，回到49行
	var httpUrl = "http://192.168.1.224:8080/nursecare/map/selectSNAxisPatient.do?floorId=",
		httpUrl = httpUrl + floorId_present + "";
	console.log("该楼层的图片路径为httpUrl=" + httpUrl);
	$.ajax({
		url: httpUrl,
		type: 'post',
		//xml, html, script, json, jsonp, text
		dataType: 'json',
		timeout: 3000,
		beforeSend: function (XMLHttpRequest) {

		},
		success: function (data, textStatus) {
			console.log("获取相应楼层所有老人的信息为：");
			console.log(data);

			getCurrentFloorAllElderINfo(data);


		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			//timeout也会进入
			console.log("zhang...失败....");
		},
		complete: function (XMLHttpRequest, textStatus) {
			if (textStatus === 'timeout') {
				//textStatus:timeout,success,error均会进入
				//ajaxTimeoutTest.abort();
				//$(" ").html("加载资源出错，请退出重新进入！");
			}
		}
	});
}


//移除上一个楼层地图和对应的老人图标
function removeGraphic() {
	map.removeLayer(graphic_new);
}

//移除老人图标
function removeMarker() {
	console.log("此时的len值为：" + len);
	for (var j = 0; j < len; j++) {
		console.log("执行了" + j + "次！");
		marker[j].removeMarker(canvas[j]);
		map.removePopup(popup2[j]);
	}
}


/*显示当前楼层信息，根据楼层ID获取当前楼层图片*/
function getCurrentFloorINfo(floorId_num) {                 //第六步-3 遇ajax，回到49行
	var httpUrl = 'http://192.168.1.224:8080/nursecare/map/selectSNMap.do?floorId=';
	httpUrl = httpUrl + floorId_num + "";
	console.log("该楼层的图片路径为httpUrl=" + httpUrl);
	$.ajax({
		url: httpUrl,
		type: 'post',
		//xml, html, script, json, jsonp, text
		dataType: 'json',
		timeout: 3000,
		beforeSend: function (XMLHttpRequest) {

		},
		success: function (data, textStatus) {
			console.log("获取的楼层信息为：");
			console.log(data);

			if(data.status==100){
				alert("该楼层无图片！！！");
			}

			parseCurrentFloor(data.body);
			getCurrentFloorAllElderINfoFloorId(floorId_num);
			getCurrentFloorAPIInfo(floorId_num);

		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			//timeout也会进入
			console.log("zhang...失败....");
		},
		complete: function (XMLHttpRequest, textStatus) {
			if (textStatus === 'timeout') {
				//textStatus:timeout,success,error均会进入
				//ajaxTimeoutTest.abort();
				//$(" ").html("加载资源出错，请退出重新进入！");
			}
		}
	});
}


//移除API图标
function removeAPI() {
	console.log("此时的len_api值为：" + len_api);
	for (var j = 0; j < len_api; j++) {
		console.log("执行了" + j + "次！");
		marker_api[j].removeMarker(canvas_api[j]);
		map.removePopup(popup_api[j]);
	}

}


//该函数是getCurrentFloorINfo（）取到值之后传给parseCurrentFloor（），具体操作在此函数中实现
function parseCurrentFloor(customData) {
	m++;
	console.log("此时m的值为：" + m);
	/*处理当前楼层所有老人信息，根据坐标位置在地图标记显示与定位*/
	console.log("Indoor_location.js根据楼层ID获取对应的楼层图片：");
	console.log(customData);
	var str = "../";
	var path = str + customData;
	console.log("此时的楼层路径为：" + path);
	if (m == 2) {
		map.removeLayer(graphic1);   //因为在这里每次都刷新页面所以每次都重新加载，这样很好，没必要进行对graphic2的移除
	}
	//map.removeLayer(graphic2);
	console.log("为什么不走了？");
	graphic_new = new OpenLayers.Layer.Image(
		"对应的大钟楼",
		path,
		new OpenLayers.Bounds(-16.26, -12.195, 16.26, 12.195),
		new OpenLayers.Size(800, 600)
		//{numZoomLevel:10}
	);
	map.addLayer(graphic_new);

	console.log("加载新图片成功！！！");

}

/*根据床位号检索老人的位置信息*/
function getOnbedNumINfo(bedNum) {
	//根据床位号搜索老人的位置信息
	var httpUrl = 'http://192.168.1.224:8080/nursecare/patient/findByBednum.do?bedNum=';
	httpUrl = httpUrl + bedNum + "";
	console.log("httpUrl=" + httpUrl);

	$.ajax({
		url: httpUrl,
		type: 'post',
		//xml, html, script, json, jsonp, text
		dataType: 'json',
		timeout: 3000,
		beforeSend: function (XMLHttpRequest) {

		},
		success: function (data, textStatus) {
			console.log("Indoor_location.js中根据床位号搜索得到的老人信息：");
			console.log(data);
			if (data.status == 100) {
				console.log("该楼层无老人信息！！！");
				return;
			}

			var floorId = data.body[0].floorId;
			console.log("该老人所在的楼层为：" + floorId);
			console.log("该老人姓名为：" + data.body[0].patientName);

			var lon = data.body[0].longitude;
			var lat = data.body[0].latitude;

			var x = data.body[0].axisX;
			var y = data.body[0].axisY;
			var axisXY = x + "," + y;

			if (floorId == 0) {
				window.localStorage["in_out"] = lon + "," + lat;  //室内跳转到室外所传送的数据
				window.location.href = "Outdoor_location.html";
			} else {
				removeGraphic();
				removeMarker();
				removeAPI();
				getCurrentFloorINfo(floorId);
				getCurrentFloorSingleElderInfo(axisXY);
				test(floorId);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			//timeout也会进入
			console.log("根据床位号搜索老人信息...失败....");
		},
		complete: function (XMLHttpRequest, textStatus) {
			if (textStatus === 'timeout') {
				//textStatus:timeout,success,error均会进入
				//ajaxTimeoutTest.abort();
				//$(" ").html("加载资源出错，请退出重新进入！");
			}
		}
	});
}

/*处理所有楼层信息*/
function parseFloorInfo(floorData) {
	//floorData=JSON.parse(floorData);
	//var floorobj=testFloorobj.body;
	var floorobj = floorData.body;
	//alert(floorobj.length);
	for (var i = 0; i < parseInt(floorobj.length); i++) {
		$(".floor").append("<option value='" + floorobj[i].floorId + "'>" + floorobj[i].name + "</option>");
	}
	//$(".floor option[value='491214']").attr("selected", true);//默认选中某楼层
	var str = window.localStorage["out_in"];
	if (str == "" || str == null) {
		console.log("进来if()中了！！！");
		getCurrentFloorINfo($(".floor").val());
		test($(".floor").val());
	} else {
		console.log("进来else中了！！！");
		var floorId_tip = window.localStorage["out_in_floorId"];
		console.log("此时跳转的楼层ID为：" + floorId_tip);
		getCurrentFloorINfo(floorId_tip);
		getCurrentFloorSingleElderInfo(str);
		test(floorId_tip);
	}
	localStorage.clear();
}

/*处理所有老人的：姓名&床位号*/
function parseElderInfo(elderdata) {
	var elderdataObj = elderdata.body;
	console.log(elderdataObj.length);
	console.log(elderdata.status);
	if (elderdata.status == "000" + '') {
		for (var i = 0; i < parseInt(elderdataObj.length); i++) {
			availableTags.push("姓名：" + elderdataObj[i].patientName + "    床位号：" + elderdataObj[i].bedNum);
		}
	} else {
		console.log("请输入正确的搜索条件！");
	}

}

/*获取当前楼层对应API的位置*/
function getCurrentFloorAPIInfo(floorId){
	$.ajax({
		url:'http://192.168.1.224:8080/nursecare/IPC/findIndoorIPCs.do?floorId='+floorId,
		type:'post',
		dataType:'json',
		success:function(data){
			console.log("当前楼层的API数据为：");
			console.log(data);

			marker_api = new Array(data.body.length);
			canvas_api = new Array(data.body.length);
			popup_api=new Array(data.body.length);
			len_api = data.body.length;

			if (data.status == 100) {
				console.log("该楼层无API设备！！！");
				return;
			}

			for(var i=0;i<data.body.length;i++){
				var x=data.body[i].axisX;
				var y=data.body[i].axisY;


				console.log("Indoor_location.js中len_api的值为：" + len_api);

				marker_api[i] = new OpenLayers.Layer.Markers("Markers");
				map.addLayer(marker_api[i]);
				var size = new OpenLayers.Size(21, 25);
				var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
				var icon = new OpenLayers.Icon('../img/camera.jpg', size, offset);
				canvas_api[i] = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);
				marker_api[i].addMarker(canvas_api[i]);

				var name=data.body[i].name;
				var html = "<b>" + name + "</b>";
				popup_api[i] = new OpenLayers.Popup("popup_api",      //唯一标识id
					new OpenLayers.LonLat(x, y),
					new OpenLayers.Size(50, 30),        //经纬度坐标一般与大小（size）一起用,size用于设置弹出框的大小
					html,
					false);               //值为true时，表示有关闭图案，false无关闭图案
				popup_api[i].setBackgroundColor("none|transparent");
				popup_api[i].setOpacity(2);
//                    popup2.setBorder("1px solid #000000");  //#d91f12:红色
				map.addPopup(popup_api[i]);

			}

		}


	});


}

