function VIDEO_SURVEILANCE() {
    //var availableTags = ["张三","刘能","赵四","本山"],
    var availableTags = [ ],
    floorNumUrl='http://192.168.1.224:8080/nursecare/map/selectBuildingFloor.do',      //获取楼层http接口
    IPCInfoUrl='';     //获取根据楼层获取ipc列表http接口    
    
	
		/*获取楼层信息*/
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
					parseFloorInfo(data);
					console.log("zhang...获取楼层信息成功...."+data);								
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
	/*根据楼层获取当前楼层的IPC信息*/
	function getCurrentFloorINfo(floorId_num){
		var httpUrl='http://192.168.1.224:8080/nursecare/IPC/findIndoorIPCs.do?floorId=';
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
            	console.log("获取的该楼层的ipc信息："+data);
				parseCurrentFloorIpc(data);
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
	function parseCurrentFloorIpc(data){
		/*分室内楼层地图和室外地图处理*/		
		var ipcdata=JSON.parse(data);
		var ipcData=ipcdata.body;
		console.log(ipcData.length);		
		console.log(ipcdata.status);
		if(ipcdata.status=='000'){
			$(".indoorLocation option").remove();
			for(var i = 0; i < parseInt(ipcData.length); i++) {				
				$(".indoorLocation").append("<option value='"+ipcData[i].ipcid+"'>"+ipcData[i].name+"</option>");
			}
		}
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
		/*如果是室外地图切换到室外*/
		//$(".floor option[value='491214']").attr("selected", true);//默认选中某楼层 
		getCurrentFloorINfo($(".floor").val());
	}
	
	
	this.text = function(){
		return "123456";
	}
	this.init = function (){		        
		        getHttpData(floorNumUrl);		       
		        /*注册事件*/
			    $( "#tags" ).autocomplete({
			      source: availableTags
			    });
			    $( "#tags" ).click(function(){
			     	//alert("输入input");			     				    			     	
			    });			    
			    $(".floor").change(function(){  //为Select添加事件，当选择其中一项 时触发
	                var checkText=$(".floor").find("option:selected").text();  //获取Select选择的Text
	                var checkValue=$(".floor").val();  //获取Select选择的Value	                  
	                console.log(checkValue);
	                getCurrentFloorINfo(checkValue);
				});				 
			    $("#startCameraBtn").click(function(){
			    	console.log($(".indoorLocation").val());//点击“开启”，发送ipcid到服务端
			    	$("#frame_1").contents().find(".camera_Vedio1").show();
			    	$("#frame_1").contents().find(".camera_Vedio2").show();
			    	$("#frame_1").contents().find(".camera_Vedio3").show();
			    	$("#frame_1").contents().find(".camera_Vedio4").show();
			    });	
			    /*var child = document.getElementByIdx_x("frame_1").contentWindow;
			    $("#closeVideo1",window.document).click(function(){
			    	console.log("父页面关闭");
			    	//$("#frame_1").contents().find(".camera_Vedio1").hide();
			    });*/
	}
}