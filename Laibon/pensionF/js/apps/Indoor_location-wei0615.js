function INDOOR_LOCATION() {
    //var availableTags = ["张三","刘能","赵四","本山"],
    var availableTags = [ ],
    floorNumUrl='http://192.168.1.224:8080/nursecare/map/selectBuildingFloor.do',      //获取楼层http接口
    eaderInfoUrl='http://192.168.1.224:8080/nursecare/patient/NameAndNum.do',     //获取老人姓名与床位号http接口
    onbedNumSearch='http://192.168.1.224:8080/nursecare/patient/findByBednum.do?bedNum=1001',   //根据老人床位号搜索定位老人http接口
    
	testObj={      //测试用
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
		/*获取楼层或老人信息*/
	function getHttpData(apiUrl){		
		console.log("apiUrl="+apiUrl);		
        $.ajax({
            url: apiUrl,
            type: 'GET',
            //xml, html, script, json, jsonp, text
            dataType:'text',
            timeout: 3000,
            beforeSend: function(XMLHttpRequest) {
                
            },
            success: function(data, textStatus) {								
				//parseFloorInfo(data);
				if(apiUrl=='http://192.168.1.224:8080/nursecare/map/selectBuildingFloor.do'){
					parseFloorInfo(data);
					console.log("zhang...获取楼层信息成功...."+data);
				}else if(apiUrl=='http://192.168.1.224:8080/nursecare/patient/NameAndNum.do'){
					parseElderInfo(data);
					console.log("zhang...获取老人信息成功...."+data);
				}
					
				
				//parseElderInfo(data);
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
	/*根据楼层获取当前楼层的老人信息*/
	function getCurrentFloorINfo(floorId_num){
		//var httpUrl='http://192.168.1.224:8080/nursecare/map/selectAxisPatient.do?floorId=';
		var httpUrl='http://192.168.1.224:8080/nursecare/map/selectSNAxisPatient.do?floorId=';
		httpUrl=httpUrl+floorId_num+"";
		console.log("httpUrl="+httpUrl);		
        $.ajax({
            url: httpUrl,
            type: 'GET',
            //xml, html, script, json, jsonp, text
            dataType:'text',
            timeout: 3000,
            beforeSend: function(XMLHttpRequest) {
                
            },
            success: function(data, textStatus) { 
            	console.log("获取的老人信息："+data);
            	
            	//window.localStorage["elderLocationINfo"]=JSON.stringify(data); 
            	localStorage.setItem('elderLocationINfo', data); // 存储字符串数据到本地
				parseCurrentFloor(data);
				
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
	function parseCurrentFloor (customData) {
		/*处理当前楼层所有老人信息，根据坐标位置在地图标记显示与定位*/	
		/*var testobj=JSON.parse(customData);
		console.log(testobj.body.length);*/
		
	}
	/*根据床位号检索老人的位置信息*/
	function getOnbedNumINfo(bedNum){
		var httpUrl='http://192.168.1.224:8080/nursecare/patient/findByBednum.do?bedNum=';
		httpUrl=httpUrl+bedNum+"";
		console.log("httpUrl="+httpUrl);		
        $.ajax({
            url: httpUrl,
            type: 'GET',
            //xml, html, script, json, jsonp, text
            dataType:'text',
            timeout: 3000,
            beforeSend: function(XMLHttpRequest) {
                
            },
            success: function(data, textStatus) { 
            	console.log("搜索到的老人信息："+data);
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
	/*处理楼层信息，显示当前楼层*/
	function parseFloorInfo(floorData){
		floorData=JSON.parse(floorData);
		//var floorobj=testFloorobj.body;
		var floorobj=floorData.body;
		//alert(floorobj.length);
		for(var i = 0; i < parseInt(floorobj.length); i++) {				
			$(".floor").append("<option value='"+floorobj[i].floorId+"'>"+floorobj[i].name+"</option>");
		}
		//$(".floor option[value='491214']").attr("selected", true);//默认选中某楼层 
		getCurrentFloorINfo($(".floor").val());
	}
	
	/*处理所有老人的：姓名&床位号*/
	function parseElderInfo(elderdata){
		elderdata=JSON.parse(elderdata);
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
				
		//availableTags[0]=availableTags[0].replace(/姓名/g, " 姓名 ");
		
		/*for(var i = 0, len = availableTags.length; i < len; i++) {
			//console.log(availableTags[i]);
		}*/
	}
	
	this.init = function (){		        
		        getHttpData(floorNumUrl);
		        getHttpData(eaderInfoUrl);
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
			    $(".floor").change(function(){  //为Select添加事件，当选择其中一项 时触发
	                var checkText=$(".floor").find("option:selected").text();  //获取Select选择的Text
	                var checkValue=$(".floor").val();  //获取Select选择的Value	                  
	                console.log(checkValue);
	                //getCurrentFloorINfo(checkValue);
				});
				 $("#openAlarmlist").click(function(){			    		
			    	$("#frame_1").contents().find("#panelDefault").show();
			    	//$("#frame_1").contents().find("#collapseOne").collapse('show');
			    	//$("#frame_1").contents().find("#collapseOne").collapse('toggle');
			    	//$("#frame_1").contents().find("#collapseOne").collapse('hide');
			    });
			    
	}
}