function CUSTOM_MANAGE(){
	var apiurl="http://192.168.1.45:8082/lb/patient/simpleSplit.do",
	    totalPage,//总共页数
	    curPage,//当前页数
	    perPapernum,//每页多少条数据
	    currentPageFirst,//当前页的第一条是第几条
	    totalNUm,//总共数据多少条
	    currentPageLast,//当前页的最后一条是第几条
	    searchFlag,
	    curBuild,
	    AP_id,
	    wt_ID,
	    patient_Id,
	    curFloor;
	    
    /*getCustomData	（type,pram1，pram2，pram3，pram4，pram5，pram6，）
              功能描述：根据不同条件搜索显示数据
      pram1：当前页，为null时默认：1 
      pram2：每页显示数据数，为null时默认：10
      pram3：绑定人姓名，搜索条件
      pram4：IMEI编号，搜索条件
      pram5：开始时间，搜索条件
      pram6：结束时间
      
     * */
	function getCustomData(searchtype,currentpage,perpage){
		//输入参数：cp,ps,patientNameKey,phoneNumberKey,IMEIKey,beginDate,endDate
		var currentpage_param='';
		var perpage_param='';
		var conditionObj={};
		var keyvalObj={};
		
		
		(currentpage==undefined) ? (currentpage_param=" ") : (currentpage_param=("cp="+currentpage));
		(perpage ==undefined) ? perpage_param=" " : (perpage_param="&ps="+perpage);
		
		
		//alert((currentpage==undefined)+"--");
		var go_searchpageurl;
		if(searchtype==1){//简单搜索
			searchFlag=1;
			go_searchpageurl='http://192.168.1.45:8082/lb/patient/simpleSplit.do?cp=1&ps=10&key='+$('#tags').val();
		}else if(searchtype==0){
			searchFlag=0;
			go_searchpageurl=apiurl+'?'+currentpage_param+perpage_param+'';
		}else{//高级搜索
			/*post封装*/
			searchFlag=2;
			go_searchpageurl='http://192.168.1.45:8082/lb/patient/difSplit.do';
			keyvalObj={
				"cp":$("#tag").val(),
				"ps":$("#row_num").find("option:selected").text(),
			    "patientNumKey":$("#input_customNum").val(),
			   "patientNameKey":$("#input_customName").val(),
			     "IDCardNumKey":$("#input_customID").val(),
			  "patientPhoneKey":$("#input_customphoneNum").val(),
			        "genderKey":$(".input_customSex").find("option:selected").val(),//传value值
			      "beginAgeKey":$("#input_age1").val(),
			        "endAgeKey":$("#input_age2").val(),
			       "levelIdKey":$("#nursing_Level").find("option:selected").val(),
			     "stationIdKey":$(".service_Station").find("option:selected").val(),
			    "buildingIdKey":$(".build_name").find("option:selected").val(),
			       "floorIdKey":$(".floor_name").find("option:selected").val(),
	    "beginAdmissionDateKey":$("#_easyui_textbox_input1").val(),
	      "endAdmissionDateKey":$("#_easyui_textbox_input2").val()
			};
			conditionObj={
				"items":JSON.stringify(keyvalObj)
			};
		}
			
			/*如果是高级搜索go_searchpageurl为高级接口；
			 keyvalObj：为高级接口封装的搜索对象；
			  切换页面也如此
			 * */
			console.log("JSON.stringify(keyvalObj)="+JSON.stringify(keyvalObj));
			$.ajax({
				url: go_searchpageurl,
				type: 'POST',
				data: conditionObj, 
				//xml, html, script, json, jsonp, text
				dataType: 'text',
				timeout: 3000,
				beforeSend: function(XMLHttpRequest) {
			
				},
				success: function(data, textStatus) {
					console.log(data);
					var dataobj=JSON.parse(data);
					if(dataobj.msg){
						alert(dataobj.msg);
					}else{						
						parseCustomdata(searchtype,data);
					}
					
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					//timeout也会进入                        	           	
					console.log("zhang...失败....");
				},
				complete: function(XMLHttpRequest, textStatus) {
					if(textStatus === 'timeout') {
			
					}
				}
			});						
	}
	function parseCustomdata(searchtype,customdata){
		var apdataObj=JSON.parse(customdata);		
		var DataObj=apdataObj.body;		
		var dataobj=DataObj.list;
		console.log(dataobj.length);
		curPage=DataObj.cp;
		perPapernum=DataObj.ps;
		totalNUm=DataObj.totalRec;
		totalPage=DataObj.totalPage;
		currentPageFirst=DataObj.firstData;
		currentPageLast=DataObj.lastData;	
		var tr_html='';
		$(".gridList").find("tr").remove();
		for (var i=0;i<dataobj.length;i++) {							
					tr_html="<tr><td><input name='subBox' type='checkbox' value="+dataobj[i].patientId+" />"+(i+1)+"</td><td>"
						+dataobj[i].patientNum+"</td><td>"+dataobj[i].patientName+"</td><td>"+dataobj[i].sex+"</td><td>"
						+dataobj[i].age+"</td><td>"+dataobj[i].buildingName+"</td><td>"
						+dataobj[i].floorName+"</td><td>"+dataobj[i].roomName+"</td><td>"
						+dataobj[i].bedName+"</td><td>"+dataobj[i].IDCardNum+"</td><td>"
						+dataobj[i].birthday+"</td><td>"+dataobj[i].admissionDate+"</td><td>"
						+dataobj[i].levelName+"</td><td>"+dataobj[i].staffNumName+"</td><td>"
						+dataobj[i].nation  +"</td><td>"+dataobj[i].maritalId+"</td><td>"
						+dataobj[i].phoneNumber+"</td><td>"+dataobj[i].stationName+"</td><td>"
						+dataobj[i].familyName+"</td><td>"+dataobj[i].familyPhone+"</td><td>"
						+dataobj[i].sosNumber+"</td><td>"+dataobj[i].type+"</td><td>"
						+dataobj[i].IMEI+"</td><td>"						
						+dataobj[i].sosType+"</td><td><button class='checkBtn' id="+'stat_'+dataobj[i].patientId+">查看</button><img src='../../../img/delete.png' id="+'delet_'+dataobj[i].patientId+" style='max-width: 20px;'/>"
						+"<a href='#modal-container-998611' data-toggle='modal'><img src='../../../img/edit.png' id="+dataobj[i].patientId+" style='max-width: 20px;margin-left: 10px;'/></a></td></tr>";
				$(".gridList").append(tr_html);
			
		}		
	    $("#totalnums").text(totalNUm);
	     console.log("当前页："+curPage+"每页显示："+perPapernum+"总共数据："+totalNUm+"总共页数："+totalPage+"当前页的第一条："+currentPageFirst+"当前页的最后一条："+currentPageLast);
	    $.jqPaginator('#pagination1', {
	    	totalPages: totalPage,
	    	visiblePages: 5,
	    	currentPage: curPage,
	    	prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
	    	next: '<li class="next"><a href="javascript:;">下一页</a></li>',
	    	page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
	    	onPageChange: function(num, type) {
	    		//curPage=num;
	    		$('#p1').text(type + '：' + num);
	    		console.log("num=" + num + "type=" + type);
	    		if(type == "change" + '') {
	    			if(searchtype=='2'){
	    				Hsearchparse(num,$("#row_num").find("option:selected").text());
	    			}else{
	    				parsecurPage(num,$("#row_num").find("option:selected").text());
	    			}
	    			
	    		}
	    
	    	}
	    });
	   /*编辑&删除*/
        $("td img").click(function(){       	
        	
        	if(($(this).prop('src').indexOf("edit.png")) > 0 ){
        		//点击编辑        		       	    
	        	if($(this).prop('id')){	        		
	        		
	        		window.location.href="customModify.html?patientid="+$(this).prop('id');
	        		
	        	}
        	}else{//点击单个删除        		 
        		if($(this).prop('id')) {
        			//alert($(this).prop('id').split('_')[1]);
        			$.ajax({
        				url: 'http://192.168.1.45:8082/lb/patient/deleteSingle.do',
        				type: 'POST',
        				//xml, html, script, json, jsonp, text
        				dataType: 'text',
        				data:{"patientId":$(this).prop('id').split('_')[1]},
        				timeout: 3000,
        				beforeSend: function(XMLHttpRequest) {
        		
        				},
        				success: function(data, textStatus) {
        					console.log("删除成功：");
        					window.location.reload();
        				},
        				error: function(XMLHttpRequest, textStatus, errorThrown) {
        					//timeout也会进入                        	           	
        					console.log("单个删除..失败....");
        				},
        				complete: function(XMLHttpRequest, textStatus) {
        					if(textStatus === 'timeout') {
        		
        					}
        				}
        			});
        		} else {
        			alert("单个删除不成功！")
        		}
        	}
        	
        	
        });
        /*点击查看*/
		$(".checkBtn").click(function(){			
			window.location.href="customCheck.html?patientId="+$(this).prop('id').split('_')[1];			
		});
	}
	/*点击分页：上一页、下一页、1、2、3、4....等切换到相应页的数据显示*/
	function parsecurPage(pagenum,perpage){
		var currentpage_param='';
		var perpage_param='';
		
		
		(pagenum==undefined) ? (currentpage_param=" ") : (currentpage_param=("cp="+pagenum));
		(perpage ==undefined) ? perpage_param=" " : (perpage_param="&ps="+perpage);
				
		
		//alert((currentpage==undefined)+"--");
		var pageurl;		
		pageurl=apiurl+'?'+currentpage_param+perpage_param+'';
		console.log("切换页pageurl："+pageurl);
				
		$.ajax({
            url: pageurl,
            type: 'POST',
            //xml, html, script, json, jsonp, text
            dataType:'text',
            timeout: 3000,
            beforeSend: function(XMLHttpRequest) {
                
            },
            success: function(data, textStatus) {
            	//console.log("切换显示页得到的远程数据："+data);
			    var apdataObj = JSON.parse(data);
			    var DataObj = apdataObj.body;
			    var dataobj = DataObj.list;
			    console.log(dataobj.length);
			    curPage = DataObj.cp;
			    perPapernum = DataObj.ps;
			    totalNUm = DataObj.totalRec;
			    totalPage = DataObj.totalPage;
			    currentPageFirst = DataObj.firstData;
			    currentPageLast = DataObj.lastData;
			    var tr_html = '';
			    $(".gridList").find("tr").remove();
			    for(var i = 0; i < dataobj.length; i++) {			    	
			    	tr_html="<tr><td><input name='subBox' type='checkbox' value="+dataobj[i].patientId+" />"+(i+1)+"</td><td>"
						+dataobj[i].patientNum+"</td><td>"+dataobj[i].patientName+"</td><td>"+dataobj[i].sex+"</td><td>"
						+dataobj[i].age+"</td><td>"+dataobj[i].buildingName+"</td><td>"
						+dataobj[i].floorName+"</td><td>"+dataobj[i].roomName+"</td><td>"
						+dataobj[i].bedName+"</td><td>"+dataobj[i].IDCardNum+"</td><td>"
						+dataobj[i].birthday+"</td><td>"+dataobj[i].admissionDate+"</td><td>"
						+dataobj[i].levelName+"</td><td>"+dataobj[i].staffNumName+"</td><td>"
						+dataobj[i].nation  +"</td><td>"+dataobj[i].maritalId+"</td><td>"
						+dataobj[i].phoneNumber+"</td><td>"+dataobj[i].stationName+"</td><td>"
						+dataobj[i].familyName+"</td><td>"+dataobj[i].familyPhone+"</td><td>"
						+dataobj[i].sosNumber+"</td><td>"+dataobj[i].type+"</td><td>"
						+dataobj[i].IMEI+"</td><td>"						
						+dataobj[i].sosTypeId+"</td><td><button class='checkBtn' id="+'stat_'+dataobj[i].patientId+">查看</button><img src='../../../img/delete.png' id="+'delet_'+dataobj[i].patientId+" style='max-width: 20px;'/>"
						+"<a href='#modal-container-998611' data-toggle='modal'><img src='../../../img/edit.png' id="+dataobj[i].patientId+" style='max-width: 20px;margin-left: 10px;'/></a></td></tr>";				
			    	$(".gridList").append(tr_html);
			    	//}
			    }
			    $("#totalnums").text(totalNUm);
			    console.log("当前页：" + curPage + "每页显示：" + perPapernum + "总共数据：" + totalNUm + "总共页数：" + totalPage + "当前页的第一条：" + currentPageFirst + "当前页的最后一条：" + currentPageLast);
			    
			    /*编辑&删除*/
			    $("td img").click(function() {
			    	$("#myModalLabel").text("手表修改页面");
			    	if(($(this).prop('src').indexOf("edit.png")) > 0) {
			    		//点击编辑
			    		alert($(this).prop('src'));
			    		if($(this).prop('id')) {
			    			alert($(this).prop('id'));
			    			/*var tt='{ "list":[{"id":null,"patientId":2,"positionType":1,"longitude":null,"latitude":null,"floorId":23,"axisX":"-7.22","axisY":"-11.04","time":1498182809000},{"id":null,"patientId":3,"positionType":1,"longitude":null,"latitude":null,"floorId":23,"axisX":"-8.71","axisY":"-12.41","time":1498182809000}]}';
			    			var ts=JSON.parse(tt);
			    			alert(ts);*/
			    			for(var j = 0; j < dataobj.length; j++) {
			    				console.log("dd");
			    				if($(this).prop('id') == dataobj[j].patientId) {
			    					//把对应的手表信息放入编辑页面       				
			    					$("#addphoneNum").val(dataobj[j].phoneNumber);
			    					$("#addIMEI").val(dataobj[j].imei);
			    					$("#addperson").val(dataobj[j].name);
			    					wt_ID = dataobj[j].patientId;
			    					patient_Id = dataobj[j].patientId;
			    				}
			    			}
			    		}
			    	} else { //点击单个删除			    		
			    		if($(this).prop('id')) {
			    			$.ajax({
			    				url: 'http://192.168.1.45:8082/lb/patient/deleteSingle.do',
			    				type: 'POST',
			    				//xml, html, script, json, jsonp, text
			    				data:{"patientId":$(this).prop('id').split('_')[1]},
			    				dataType: 'text',
			    				timeout: 3000,
			    				beforeSend: function(XMLHttpRequest) {
			    
			    				},
			    				success: function(data, textStatus) {
			    					console.log("删除成功：");
			    					window.location.reload();
			    				},
			    				error: function(XMLHttpRequest, textStatus, errorThrown) {
			    					//timeout也会进入                        	           	
			    					console.log("单个删除..失败....");
			    				},
			    				complete: function(XMLHttpRequest, textStatus) {
			    					if(textStatus === 'timeout') {
			    
			    					}
			    				}
			    			});
			    		} else {
			    			alert("单个删除不成功！")
			    		}
			    	}			    				    
			    });
			    /*点击查看*/
			    $(".checkBtn").click(function() {
			    	window.location.href = "customCheck.html?patientId=" + $(this).prop('id').split('_')[1];
			    });
			    
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                //timeout也会进入                        	           	
				console.log("zhang...失败....");				 				
            },
            complete: function(XMLHttpRequest, textStatus) {
                if(textStatus === 'timeout'){
                    
                }
            }
        });
	}
	/*高级检索-->点击分页：上一页、下一页、1、2、3、4....等切换到相应页的数据显示*/
	function Hsearchparse(pagenum,perpage){		
		var pageurl;
		var conditionPageObj={};
		/*post封装*/
		pageurl = 'http://192.168.1.45:8082/lb/patient/difSplit.do';
		keyvalObj = {
			"cp":pagenum,
			"ps":perpage,
			"patientNumKey": $("#input_customNum").val(),
			"patientNameKey": $("#input_customName").val(),
			"IDCardNumKey": $("#input_customID").val(),
			"patientPhoneKey": $("#input_customphoneNum").val(),
			"genderKey": $(".input_customSex").find("option:selected").val(), //传value值
			"beginAgeKey": $("#input_age1").val(),
			"endAgeKey": $("#input_age2").val(),
			"levelIdKey": $("#nursing_Level").find("option:selected").val(),
			"stationIdKey": $(".service_Station").find("option:selected").val(),
			"buildingIdKey": $(".build_name").find("option:selected").val(),
			"floorIdKey": $(".floor_name").find("option:selected").val(),
			"beginAdmissionDateKey": $("#_easyui_textbox_input1").val(),
			"endAdmissionDateKey": $("#_easyui_textbox_input2").val()
		};
		conditionPageObj = {
			"items": JSON.stringify(keyvalObj)
		};									
		console.log("切换页pageurl："+pageurl);
				
		$.ajax({
            url: pageurl,
            type: 'POST',
            data:conditionPageObj,
            //xml, html, script, json, jsonp, text
            dataType:'text',
            timeout: 3000,
            beforeSend: function(XMLHttpRequest) {
                
            },
            success: function(data, textStatus) {
            	//console.log("切换显示页得到的远程数据："+data);
			    var apdataObj = JSON.parse(data);
			    var DataObj = apdataObj.body;
			    var dataobj = DataObj.list;
			    console.log(dataobj.length);
			    curPage = DataObj.cp;
			    perPapernum = DataObj.ps;
			    totalNUm = DataObj.totalRec;
			    totalPage = DataObj.totalPage;
			    currentPageFirst = DataObj.firstData;
			    currentPageLast = DataObj.lastData;
			    var tr_html = '';
			    $(".gridList").find("tr").remove();
			    for(var i = 0; i < dataobj.length; i++) {			    	
			    	tr_html="<tr><td><input name='subBox' type='checkbox' value="+dataobj[i].patientId+" />"+(i+1)+"</td><td>"
						+dataobj[i].patientNum+"</td><td>"+dataobj[i].patientName+"</td><td>"+dataobj[i].sex+"</td><td>"
						+dataobj[i].age+"</td><td>"+dataobj[i].buildingName+"</td><td>"
						+dataobj[i].floorName+"</td><td>"+dataobj[i].roomName+"</td><td>"
						+dataobj[i].bedName+"</td><td>"+dataobj[i].IDCardNum+"</td><td>"
						+dataobj[i].birthday+"</td><td>"+dataobj[i].admissionDate+"</td><td>"
						+dataobj[i].levelName+"</td><td>"+dataobj[i].staffNumName+"</td><td>"
						+dataobj[i].nation  +"</td><td>"+dataobj[i].maritalId+"</td><td>"
						+dataobj[i].phoneNumber+"</td><td>"+dataobj[i].stationName+"</td><td>"
						+dataobj[i].familyName+"</td><td>"+dataobj[i].familyPhone+"</td><td>"
						+dataobj[i].sosNumber+"</td><td>"+dataobj[i].type+"</td><td>"
						+dataobj[i].IMEI+"</td><td>"						
						+dataobj[i].sosTypeId+"</td><td><button class='checkBtn' id="+'stat_'+dataobj[i].patientId+">查看</button><img src='../../img/delete.png' id="+'delet_'+dataobj[i].patientId+" style='max-width: 20px;'/>"
						+"<a href='#modal-container-998611' data-toggle='modal'><img src='../../img/edit.png' id="+dataobj[i].patientId+" style='max-width: 20px;margin-left: 10px;'/></a></td></tr>";				
			    	$(".gridList").append(tr_html);
			    	//}
			    }
			    $("#totalnums").text(totalNUm);
			    console.log("当前页：" + curPage + "每页显示：" + perPapernum + "总共数据：" + totalNUm + "总共页数：" + totalPage + "当前页的第一条：" + currentPageFirst + "当前页的最后一条：" + currentPageLast);
			    /*点击查看*/
				$(".checkBtn").click(function(){			
					window.location.href="customCheck.html?patientId="+$(this).prop('id').split('_')[1];			
				});
			    /*编辑&删除*/
			    $("td img").click(function() {
			    	$("#myModalLabel").text("手表修改页面");
			    	if(($(this).prop('src').indexOf("edit.png")) > 0) {
			    		//点击编辑
			    		alert($(this).prop('src'));
			    		if($(this).prop('id')) {
			    			alert($(this).prop('id'));
			    			/*var tt='{ "list":[{"id":null,"patientId":2,"positionType":1,"longitude":null,"latitude":null,"floorId":23,"axisX":"-7.22","axisY":"-11.04","time":1498182809000},{"id":null,"patientId":3,"positionType":1,"longitude":null,"latitude":null,"floorId":23,"axisX":"-8.71","axisY":"-12.41","time":1498182809000}]}';
			    			var ts=JSON.parse(tt);
			    			alert(ts);*/
			    			for(var j = 0; j < dataobj.length; j++) {
			    				console.log("dd");
			    				if($(this).prop('id') == dataobj[j].patientId) {
			    					//把对应的手表信息放入编辑页面       				
			    					$("#addphoneNum").val(dataobj[j].phoneNumber);
			    					$("#addIMEI").val(dataobj[j].imei);
			    					$("#addperson").val(dataobj[j].name);
			    					wt_ID = dataobj[j].patientId;
			    					patient_Id = dataobj[j].patientId;
			    				}
			    			}
			    		}
			    	} else { //点击单个删除			    		
			    		if($(this).prop('id')) {
			    			$.ajax({
	    						url: 'http://192.168.1.45:8082/lb/patient/deleteSingle.do',
	    						type: 'POST',
	    						//xml, html, script, json, jsonp, text
	    						data: {"patientId": $(this).prop('id').split('_')[1]},
			    				dataType: 'text',
			    				timeout: 3000,
			    				beforeSend: function(XMLHttpRequest) {
			    
			    				},
			    				success: function(data, textStatus) {
			    					console.log("删除成功：");
			    					window.location.reload();
			    				},
			    				error: function(XMLHttpRequest, textStatus, errorThrown) {
			    					//timeout也会进入                        	           	
			    					console.log("单个删除..失败....");
			    				},
			    				complete: function(XMLHttpRequest, textStatus) {
			    					if(textStatus === 'timeout') {
			    
			    					}
			    				}
			    			});
			    		} else {
			    			alert("单个删除不成功！")
			    		}
			    	}
			    
			    });
			    
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                //timeout也会进入                        	           	
				console.log("zhang...失败....");				 				
            },
            complete: function(XMLHttpRequest, textStatus) {
                if(textStatus === 'timeout'){
                    
                }
            }
        });
	}
	/*获取护理级别*/
	function getallLevel() {
		$.ajax({
			url: 'http://192.168.1.45:8082/lb/patient/selectLevel.do',
			type: 'POST',
			//xml, html, script, json, jsonp, text
			dataType: 'text',
			timeout: 3000,
			beforeSend: function(XMLHttpRequest) {
	
			},
			success: function(data, textStatus) {
					
				var levelData = JSON.parse(data).body;
				for(var i = 0; i < parseInt(levelData.length); i++) {
					$("#nursing_Level").append("<option value='" + levelData[i].id + "'>" + levelData[i].levelName + "</option>");
				}					
	
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//timeout也会进入                        	           	
				console.log("zhang.获取服务站..失败....");
			},
			complete: function(XMLHttpRequest, textStatus) {
				if(textStatus === 'timeout') {
	
				}
			}
		});
	}
	/*获取全部服务站*/
	function getseverStation() {
		$.ajax({
			url: 'http://192.168.1.45:8082/lb/patient/selectStation.do',
			type: 'POST',
			//xml, html, script, json, jsonp, text
			dataType: 'text',
			timeout: 3000,
			beforeSend: function(XMLHttpRequest) {
	
			},
			success: function(data, textStatus) {
	
				console.log("服务站信息：" + data);
				var stationData = JSON.parse(data).body;
				for(var i = 0; i < parseInt(stationData.length); i++) {
					$(".service_Station").append("<option value='" + stationData[i].stationId + "'>" + stationData[i].name + "</option>");
				}					
	
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//timeout也会进入                        	           	
				console.log("zhang.获取服务站..失败....");
			},
			complete: function(XMLHttpRequest, textStatus) {
				if(textStatus === 'timeout') {
	
				}
			}
		});
	}
	/*获取楼栋*/
	function getBuilds() {
		$.ajax({
			url: 'http://192.168.1.224:8080/nursecare/buildingAbout/findBuilding.do',
			type: 'GET',
			//xml, html, script, json, jsonp, text
			dataType: 'text',
			timeout: 3000,
			beforeSend: function(XMLHttpRequest) {
	
			},
			success: function(data, textStatus) {
	
				console.log("楼栋信息：" + data);
				var buildsData = JSON.parse(data).body;				
				for(var i = 0; i < parseInt(buildsData.length); i++) {
					$(".build_name").append("<option value='" + buildsData[i].buildingId + "'>" + buildsData[i].name + "</option>");
				}
			
				getFloors($(".build_name").find("option:selected").val());

				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//timeout也会进入                        	           	
				console.log("zhang.获取楼栋..失败....");
			},
			complete: function(XMLHttpRequest, textStatus) {
				if(textStatus === 'timeout') {
	
				}
			}
		});
	}
	/*根据楼栋获取楼层*/
	function getFloors(building_Id) {
		if(building_Id){
			$.ajax({
				url: 'http://192.168.1.224:8080/nursecare/buildingAbout/findFloorByBuilding.do?buildingId=' + building_Id,
				type: 'GET',
				//xml, html, script, json, jsonp, text
				dataType: 'text',
				timeout: 3000,
				beforeSend: function(XMLHttpRequest) {
			
				},
				success: function(data, textStatus) {
					console.log("根据楼栋获取楼层：" + building_Id);
					console.log("根据楼栋获取楼层：" + data);
					var floorsData = JSON.parse(data).body;
					$(".floor_name").find("option").remove();
					for(var i = 0; i < parseInt(floorsData.length); i++) {
						$(".floor_name").append("<option value='" + floorsData[i].floorId + "'>" + floorsData[i].name + "</option>");
					}
			
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					//timeout也会进入                        	           	
					console.log("zhang.获取楼层..失败....");
				},
				complete: function(XMLHttpRequest, textStatus) {
					if(textStatus === 'timeout') {
			
					}
				}
			});
		}
		
	}
	this.init=function(){		
		getCustomData(0);//初始化不带参数表格默认显示第一页
		getBuilds();
		getseverStation();
		getallLevel();
		$("#search-Go").click(function(){
        	//getCustomData(0,$("#tag").val(),$("#row_num").find("option:selected").text(),$("#tags").val() );//带参数搜索精确页的数据
        	getCustomData(searchFlag,$("#tag").val(),$("#row_num").find("option:selected").text(),$("#tags").val() );//带参数搜索精确页的数据
        });
        /*切换选择每页显示数据number*/
        $("#row_num").change(function(){  //为Select添加事件，当选择其中一项 时触发
            var checkText=$("#row_num").find("option:selected").text();  //获取Select选择的Text
            //var checkValue=$(".floor").val();  //获取Select选择的Value	                  
            console.log(checkText);	          
            getCustomData(searchFlag,'1',checkText,$("#inputName").val());
            
		});
	    /*简单搜索*/	   
	    $("#searchIcon").click(function(){
	    	getCustomData(1,$("#row_num").find("option:selected").text(),$("#tags").val());
	    });

	    /*高级检索*/
	    $("#senior_searchIcon").click(function(){
	    	$("#beforesearch").hide();
	    	$("#searching").show();	    		    	
	    });
	    /*高级搜索-->楼栋名称*/
	    
	    $(".build_name").change(function(){
	    	/“楼栋”选择下拉框*/	    		    	
			getFloors($(".build_name").find("option:selected").val());		
	    });
	    $("#nursing_Level").change(function(){
	    	
	    });
	    /*高级搜索下 的 搜索按钮*/
	    $("#hightSearch").click(function(){
	    	console.log($("#_easyui_textbox_input1").val()+"--"+$("#_easyui_textbox_input2").val());
	    	getCustomData(2);
	    });
	    /*高级搜索下的返回*/
	   $("#return").click(function(){
	   	  window.location.reload();
	   });
	   /*高级搜索下的重置*/
	   $("#reset").click(function(){	   	  
			$("#input_customNum").val(" ");
			$("#input_customName").val(" ");
			$("#input_customID").val(" ");
			$("#input_customphoneNum").val(" ");
			$(".input_customSex").find("option:selected").val(" ");//传value值
			$("#input_age1").val(" ");
			$("#input_age2").val(" ");			
			$("#nursing_Level").get(0).selectedIndex = 0;			
			$(".service_Station").get(0).selectedIndex = 0;			
			$(".build_name").get(0).selectedIndex = 0;
			$(".floor_name").find("option").remove();
	        $("#_easyui_textbox_input1").val(" ");
	        $("#_easyui_textbox_input2").val(" ");
	   });
	   
		
	    /*返回*/
	    $("#return").click(function(){
	    	$("#beforesearch").show();
	    	$("#searching").hide();
	    	
	    });
	    
	    /*添加*/
	    $("#addBtn").click(function(){
	    	window.location.href="custom-add.html?flag=1";
	    });
		
	    /*全选*/
	    $("#checkAll").click(function() {//prop 获取属性
       	     event.stopPropagation();
            $('input[name="subBox"]').prop("checked",this.checked); 
            //alert($(this).prop("checked"));
        });
        /*单选加全选*/
        var $subBox = $("input[name='subBox']");
        $subBox.click(function(){
            $("#checkAll").prop("checked",$subBox.length == $("input[name='subBox']:checked").length ? true : false);
        });
        /*删除*/
	    $("#deleteBtn").click(function(){
	    	var ids=''; 
			var i=0;					
			$("input[name='subBox']").each(function(index,el){
				console.log("select***");
				if(el.id!="checkAll" && el.checked){
					ids=ids+","+el.value; 
					i=i+1;
					//发http请求
					//$("#msg_"+el.value).remove();
				}
			});
			ids=ids.slice(1);
			console.log("总共选择了："+i+'个.....'+"ids="+ids);
			if(ids){
				$.ajax({
					url: 'http://192.168.1.45:8082/lb/patient/batchDeletes.do'  ,
					type: 'POST',
					//xml, html, script, json, jsonp, text
					data:{"delitems":ids},
					dataType: 'text',
					timeout: 3000,
					beforeSend: function(XMLHttpRequest) {
				
					},
					success: function(data, textStatus) {
						console.log("删除成功：" );	
						window.location.reload();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						//timeout也会进入                        	           	
						console.log("zhang.删除..失败....");
					},
					complete: function(XMLHttpRequest, textStatus) {
						if(textStatus === 'timeout') {
				
						}
					}
				});
			}else{
				alert("您没有选择，请选择要删除的数据！")
			}
    	
	   });
	    
	    
			   
	}
}
