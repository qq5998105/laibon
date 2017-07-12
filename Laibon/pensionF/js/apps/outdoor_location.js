var availableTags = [];
function OUTDOOR_LOCATION() {
	//var availableTags = ["张三","刘能","赵四","本山"],
	var floorNumUrl = 'http://192.168.1.224:8080/nursecare/map/selectBuildingFloor.do',      //获取楼层http接口
		eaderInfoUrl = 'http://192.168.1.224:8080/nursecare/map/selectSWAxisPatient.do',     //获取室外老人位置的http接口
		ipcInfoUrl = 'http://192.168.1.224:8080/nursecare/IPC/findOutdoorIPCs.do',
		onbedNumSearch = 'http://192.168.1.224:8080/nursecare/patient/findByBednum.do?bedNum=1001',   //根据老人床位号搜索定位老人http接口
		allInfoUrl = 'http://192.168.1.224:8080/nursecare/patient/NameAndNum.do',
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

	this.init = function (){
		allElderInfo(allInfoUrl);  //设置模糊搜索
		$("#frame_1").contents().find("#collapseOne").collapse({
			toggle: false
		});
		getOutElderInfo(eaderInfoUrl);  //将所有室外老人显示在地图上
		getOutIPCInfo(ipcInfoUrl);     //将所有室外IPC显示在地图上
		/*注册事件*/
		$( "#tags" ).autocomplete({
			source: availableTags
		});
		$( "#tags" ).click(function(){
			//alert("输入input");
		});
		$("#searchIcon").click(function(){
			//alert($("#tags").val());
			var bedNUm=$("#tags").val();
			bedNUm=bedNUm.split("：")[2];
			getOnbedNumINfo(bedNUm);
		});
		$("#openAlarmlist").click(function(){
			console.log("tan");
			$("#frame_1").contents().find("#panelDefault").show();
			//$("#frame_1").contents().find("#collapseOne").collapse('show');
			//$("#frame_1").contents().find("#collapseOne").collapse('toggle');
			//$("#frame_1").contents().find("#collapseOne").collapse('hide');
		});
	}

}

/*获取室外单个老人的位置信息*/
function getOutSingleElderInfo(lngLat) {
	console.log("根据床位号查询室外老人位置为："+lngLat);
	var lon=lngLat.split(",")[0];
	console.log("查询的室外老人的经度为："+lon);
	var lat=lngLat.split(",")[1];
	console.log("查询的室外老人的纬度为："+lat);

	//显示蓝色定位气球(Marker)
	//marker_tip.hide();
	marker_out.hide();
	marker_out = new AMap.Marker({
		position: [lon, lat],             //marker所在的位置
		map:out_map                     //创建时直接赋予map属性
	});
	marker_out.show();
}


/*获取室外老人的位置信息*/
function getOutElderInfo(apiUrl){
	console.log("获取室外老人的位置信息apiUrl="+apiUrl);
	$.ajax({
		url: apiUrl,
		type: 'post',
		//xml, html, script, json, jsonp, text
		dataType:'json',
		timeout: 3000,
		beforeSend: function(XMLHttpRequest) {

		},
		success: function(data, textStatus) {
			console.log("获取的室外老人位置信息为：");
			console.log(data);

			if(data.status==100){
				alert("室外无响应的老人");
				return;
			}

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
					map:out_map,
					position:[lon,lat],
					offset:new AMap.Pixel(-25,-5)  //点标记显示位置偏移量
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
				marker[i].patientId=data.body[i].patientId;

				//console.log("顺序是 :"+marker[i].getzIndex());

				new AMap.Marker({
					map:out_map,
					position:[lon,lat],
					content:"<b style='font-size: large;'>"+name+"<b/>",
					offset:new AMap.Pixel(-30,50)  //点标记显示位置偏移量
				});

				marker[i].on('click',function(e){
					console.log(123);
					//alert(data)
					//console.log(this.vid);
					//console.log(i);

					var info=new AMap.InfoWindow({
						content:"<b>姓名： "+this.name+"<br/>"+"性别："+this.gender+
						"<br/>老人ID："+this.patientId+"<b/>"
					});
					info.open(out_map,new AMap.LngLat(e.lnglat.getLng(),e.lnglat.getLat()));
				});
			}

			console.log("执行即将结束！！");
			var lngLat=window.localStorage["in_out"];
			console.log("跳转过来的经纬度："+lngLat);
			if(lngLat==""||lngLat==null){
				console.log("不是跳转！结束了！");
				return;
			}else{
				console.log("进到跳转查找单个老人位置了！");
				getOutSingleElderInfo(lngLat);
			}

			localStorage.clear();

			console.log("执行已经结束！！");
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//timeout也会进入
			console.log("zhang...失败....");
		},
		complete: function(XMLHttpRequest, textStatus) {
			if(textStatus === 'timeout'){
				//textStatus:timeout,success,error均会进入
				//ajaxTimeoutTest.abort();
				//$(" ").html("加载资源出错，请退出重新进入！");
			}
		}
	});
}

/*获取室外IPC的位置信息*/
function getOutIPCInfo(apiUrl){
	console.log("获取室外IPC的位置信息apiUrl="+apiUrl);
	$.ajax({
		url: apiUrl,
		type: 'post',
		//xml, html, script, json, jsonp, text
		dataType:'json',
		timeout: 3000,
		beforeSend: function(XMLHttpRequest) {

		},
		success: function(data, textStatus) {
			//parseFloorInfo(data);
			console.log("获取室外IPC的位置信息为：");
			console.log(data);

			if(data.status==100){
				alert("无IPC。。。。");
				return;
			}
			console.log(data.body.length);
			for(i=0;i<data.body.length;i++){
				var lon=data.body[i].longitude;
				//console.log(lon);
				var lat=data.body[i].latitude;
				console.log("第"+i+"个相机的位置坐标为："+lon+","+lat);
				var marker=new AMap.Marker({
					map:out_map,
					position:[lon,lat],
					offset:new AMap.Pixel(-10,-34),  //点标记显示位置偏移量
					icon:"../img/camera.jpg"
				});
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//timeout也会进入
			console.log("zhang...失败....");
		},
		complete: function(XMLHttpRequest, textStatus) {
			if(textStatus === 'timeout'){
				//textStatus:timeout,success,error均会进入
				//ajaxTimeoutTest.abort();
				//$(" ").html("加载资源出错，请退出重新进入！");
			}
		}
	});
}

/*根据床位号检索老人的位置信息*/
function getOnbedNumINfo(bedNum){
	var httpUrl='http://192.168.1.224:8080/nursecare/patient/findByBednum.do?bedNum=';
	httpUrl=httpUrl+bedNum+"";
	console.log("httpUrl="+httpUrl);
	//window.localStorage['bed']=bedNum;
	$.ajax({
		url: httpUrl,
		type: 'post',
		//xml, html, script, json, jsonp, text
		dataType:'json',
		timeout: 3000,
		beforeSend: function(XMLHttpRequest) {

		},
		success: function(data, textStatus) {
			console.log("搜索到的老人信息：");
			console.log(data);

			if (data.status == 100) {
				console.log("哈哈："+data.msg);
				return;
			}

			var floorId = data.body[0].floorId;
			console.log("该老人所在位置为：" + floorId);
			console.log("该老人姓名为：" + data.body[0].patientName);

			var lon=data.body[0].longitude;
			var lat=data.body[0].latitude;
			var lonLat=lon+","+lat;

			var x = data.body[0].axisX;
			var y = data.body[0].axisY;

			console.log("室外跳室内坐标为："+x+","+y);
			console.log("经纬度分别是："+lon+","+lat);

			if (floorId==0) {
				getOutSingleElderInfo(lonLat);
			}else{
				//从室外跳转到室内
				window.localStorage["out_in"]=x+","+y;
				window.localStorage["out_in_floorId"]=floorId;
				window.location.href="Indoor_location.html";

			}
			//parseCurrentFloor(data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//timeout也会进入
			console.log("根据床位号搜索老人信息...失败....");
		},
		complete: function(XMLHttpRequest, textStatus) {
			if(textStatus === 'timeout'){
				//textStatus:timeout,success,error均会进入
				//ajaxTimeoutTest.abort();
				//$(" ").html("加载资源出错，请退出重新进入！");
			}
		}
	});
}

function allElderInfo(allElderInfoUrl){
	console.log("获取得到的所有老人信息："+allElderInfoUrl);
	//window.localStorage['bed']=bedNum;
	$.ajax({
		url:allElderInfoUrl,
		type: 'post',
		//xml, html, script, json, jsonp, text
		dataType: 'json',
		timeout: 3000,
		beforeSend: function (XMLHttpRequest) {

		},
		success: function (data, textStatus) {
			console.log("搜索到的所有老人信息：");
			console.log(data);

			saveAllElderInfo(data);

		}
	})
}

/*处理所有老人的：姓名&床位号*/
function saveAllElderInfo(elderdata){
	var elderdataObj=elderdata.body;
	console.log(elderdataObj.length);
	console.log(elderdata.status);
	if(elderdata.status=="000"+''){
		for(var i = 0; i < parseInt(elderdataObj.length); i++) {
			availableTags.push("姓名：" + elderdataObj[i].patientName + "    床位号：" + elderdataObj[i].bedNum);
		}
	}else{
		console.log("请输入正确的搜索条件！");
	}

}

