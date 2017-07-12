function IPC_MANAGE(){
	var apiurl="http://192.168.1.224:8080/nursecare/IPC/advancedSearchAndSplit.do",
	    totalPage,//总共页数
	    curPage,//当前页数
	    perPapernum,//每页多少条数据
	    currentPageFirst,//当前页的第一条是第几条
	    totalNUm,//总共数据多少条
	    currentPageLast,//当前页的最后一条是第几条
	    curBuild,
	    curFloor;
	    
    /*getIpcData（pram1，pram2，pram3，pram4，pram5，pram6，）
              功能描述：根据不同条件搜索显示数据
      pram1：当前页，为null时默认：1 
      pram2：每页显示数据数，为null时默认：10
      pram3：ip地址，搜索条件
      pram4：楼栋的id
      pram5：楼层的id
      pram6：位置描述
     * */
	function getIpcData(currentpage,perpage,ip,building_Id,floor_Id,location_Desc){
		var currentpage_param;
		var perpage_param;
		var ip_param;
		var buildingId_param;
		var floorId_param;
		var locationDesc_param;
		(currentpage==undefined) ? (currentpage_param=" ") : (currentpage_param=("cp="+currentpage));
		(perpage ==undefined) ? perpage_param=" " : (perpage_param="&ps="+perpage);
		(ip ==undefined) ? ip_param=" " : (ip_param="&ip="+ip);
		(building_Id ==undefined) ? buildingId_param=" " : (buildingId_param="&buildingId="+building_Id);
		(floor_Id ==undefined) ? floorId_param=" " : (floorId_param="&floorId="+floor_Id);
		(location_Desc ==undefined) ? locationDesc_param=" " : (locationDesc_param="&locationDesc="+location_Desc);
		//alert((currentpage==undefined)+"--");
		var go_searchpageurl;
		go_searchpageurl=apiurl+'?'+currentpage_param+perpage_param+ip_param+buildingId_param+floorId_param+locationDesc_param+'';
		    /*if(currentpage){
		    	if(perpage){
		    		go_searchpageurl=apiurl+"?cp="+currentpage+"&ps="+perpage;
		    	}else{
		    		go_searchpageurl=apiurl+"?cp="+currentpage;
		    	}
		    	
		    }else{
		    	if(perpage) {
		    		go_searchpageurl = apiurl + "?ps=" + perpage ;
		    	} else {
		    		go_searchpageurl = apiurl;
		    	}
		    }*/
			console.log("go_searchpageurl="+go_searchpageurl);
			$.ajax({
				url: go_searchpageurl,
				type: 'GET',
				//xml, html, script, json, jsonp, text
				dataType: 'text',
				timeout: 3000,
				beforeSend: function(XMLHttpRequest) {
			
				},
				success: function(data, textStatus) {
					console.log(data);
			
					parseIPCdata(data);
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
	function parseIPCdata(ipcdata){
		var ipcdataObj=JSON.parse(ipcdata);		
		var DataObj=ipcdataObj.body;		
		var dataobj=DataObj.list;
		console.log(dataobj.length);
		curPage=DataObj.cp;
		perPapernum=DataObj.ps;
		totalNUm=DataObj.totalRec;
		totalPage=DataObj.totalPage;
		currentPageFirst=DataObj.firstData;
		currentPageLast=DataObj.lastData;	
		var tr_html='';
		$("tbody").find("tr").remove();
		for (var i=0;i<dataobj.length;i++) {
			//if(dataobj[i].locationType=="0"+''){//室内
				tr_html="<tr><td><input name='subBox' type='checkbox' value="+dataobj[i].id+" />"+(i+1)+"</td><td>"
				+dataobj[i].ip+"</td><td>"+"未知"+"</td><td>"+dataobj[i].building+"</td><td>"
				+dataobj[i].floor+"</td><td>"+dataobj[i].locationDesc+"</td><td>"
				+dataobj[i].online+"</td><td><img src='../../img/delete.png' id="+dataobj[i].id+" style='max-width: 20px;'/>"
				+"<a href='#modal-container-998612' data-toggle='modal'><img src='../../img/edit.png' id="+dataobj[i].id+" style='max-width: 20px;margin-left: 10px;'/></a></td></tr>";
				$("tbody").append(tr_html);
			//}
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
			    			parsecurPage(num,$("#row_num").find("option:selected").text());
			    		}
			    
			    	}
			    });
	   /*编辑*/
        $("td img").click(function(){
        	//alert($(this).prop('id'));        	
        	getBuilds(2);
        	//alert($(this).prop('src'));
        	if(($(this).prop('src').indexOf("edit.png")) > 0 ){
        		//点击编辑
        		//$("#editBuild option[text='稻香楼']").attr("selected", true);
        	    //$("#editBuild").val(1003);
	        	if($(this).prop('id')){
	        		for (var j=0;j<dataobj.length;j++) {
	        			console.log("dd");
	        			if($(this).prop('id')==dataobj[j].id){
	        				//把对应的ipc信息放入编辑页面       				
	        				$("#editIP").val(dataobj[j].ip);
	        				$("#editLocation").val(dataobj[j].locationDesc);
	        				console.log(dataobj[j].building);
	        				curBuild=dataobj[j].building; 
	        				curFloor=dataobj[j].floor;
	        			}
	        		}
	        	}
        	}else{//点击删除
        		if($(this).prop('id')) {
        			$.ajax({
        				url: 'http://192.168.1.224:8080/nursecare/IPC/deleteMany.do?ids='+$(this).prop('id'),
        				type: 'GET',
        				//xml, html, script, json, jsonp, text
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
        
		
	}
	/*点击分页：上一页、下一页、1、2、3、4....等切换到相应页的数据显示*/
	function parsecurPage(pagenum,perpage){
		if(perpage){
			var pageurl=apiurl+"?cp="+pagenum+"&ps="+perpage;
		}else{
			var pageurl=apiurl+"?cp="+pagenum;
		}		
		$.ajax({
            url: pageurl,
            type: 'GET',
            //xml, html, script, json, jsonp, text
            dataType:'text',
            timeout: 3000,
            beforeSend: function(XMLHttpRequest) {
                
            },
            success: function(data, textStatus) {											    
			    var ipcdataObj = JSON.parse(data);
			    var DataObj = ipcdataObj.body;
			    var dataobj = DataObj.list;
			    console.log(dataobj.length);
			    curPage = DataObj.cp;
			    perPapernum = DataObj.ps;
			    totalNUm = DataObj.totalRec;
			    totalPage = DataObj.totalPage;
			    currentPageFirst = DataObj.firstData;
			    currentPageLast = DataObj.lastData;
			    var tr_html = '';
			    $("tbody").find("tr").remove();
			    for(var i = 0; i < dataobj.length; i++) {
			    	
			    	//if(dataobj[i].locationType=="0"+''){//室内
			    	tr_html = "<tr><td><input name='subBox' type='checkbox' value="+dataobj[i].id+" />" + (i + 1) + "</td><td>" +
			    		dataobj[i].ip + "</td><td>" + "未知" + "</td><td>" + dataobj[i].building + "</td><td>" +
			    		dataobj[i].floor + "</td><td>" + dataobj[i].locationDesc + "</td><td>" +
			    		dataobj[i].online + "</td><td><img src='../../img/delete.png' id="+dataobj[i].id+" style='max-width: 20px;'/>"
				+"<a href='#modal-container-998612' data-toggle='modal'><img src='../../img/edit.png' id="+dataobj[i].id+" style='max-width: 20px;margin-left: 10px;'/></a></td></tr>";
			    	$("tbody").append(tr_html);
			    	//}
			    }
			    $("#totalnums").text(totalNUm);
			    console.log("当前页：" + curPage + "每页显示：" + perPapernum + "总共数据：" + totalNUm + "总共页数：" + totalPage + "当前页的第一条：" + currentPageFirst + "当前页的最后一条：" + currentPageLast);
			    
			    
			    
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
	/*获取楼栋*/
	function getBuilds(type){
		$.ajax({
			url: 'http://192.168.1.224:8080/nursecare/buildingAbout/findBuilding.do',
			type: 'GET',
			//xml, html, script, json, jsonp, text
			dataType: 'text',
			timeout: 3000,
			beforeSend: function(XMLHttpRequest) {
		
			},
			success: function(data, textStatus) {
				
				console.log("楼栋信息："+data);
				var buildsData = JSON.parse(data).body;	
				if(type=="0"+''){
					for(var i = 0; i < parseInt(buildsData.length); i++) {
						$(".builds").append("<option value='" + buildsData[i].buildingId + "'>" + buildsData[i].name + "</option>");
					}
				}else if(type=="1"+''){
					for(var i = 0; i < parseInt(buildsData.length); i++) {
						$(".addBuild").append("<option value='" + buildsData[i].buildingId + "'>" + buildsData[i].name + "</option>");
					}					
				}else{
					$("#editBuild option").remove();
					for(var i = 0; i < parseInt(buildsData.length); i++) {
						$("#editBuild").append("<option value='" + buildsData[i].buildingId + "'>" + buildsData[i].name + "</option>");
					    if(buildsData[i].name==curBuild+''){
					    	$("#editBuild").val(buildsData[i].buildingId);
					    }
					}
					getFloors(2,$("#editBuild").find("option:selected").val());
					
				}
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
	function getFloors(type,building_Id){
		$.ajax({
			url: 'http://192.168.1.224:8080/nursecare/buildingAbout/findFloorByBuilding.do?buildingId='+building_Id,
			type: 'GET',
			//xml, html, script, json, jsonp, text
			dataType: 'text',
			timeout: 3000,
			beforeSend: function(XMLHttpRequest) {
		
			},
			success: function(data, textStatus) {
				console.log("根据楼栋获取楼层："+building_Id);
				console.log("根据楼栋获取楼层："+data);
				var floorsData = JSON.parse(data).body;
				if(type==0){
					for(var i = 0; i < parseInt(floorsData.length); i++) {
						$(".floors").append("<option value='" + floorsData[i].floorId + "'>" + floorsData[i].name + "</option>");
					}
				}else if(type==1){
					for(var i = 0; i < parseInt(floorsData.length); i++) {
						$(".addFloor").append("<option value='" + floorsData[i].floorId + "'>" + floorsData[i].name + "</option>");
					}
				}else{
					$(".editFloor option").remove();
					for(var i = 0; i < parseInt(floorsData.length); i++) {
						$(".editFloor").append("<option value='" + floorsData[i].floorId + "'>" + floorsData[i].name + "</option>");
					    //alert(curFloor+floorsData[i].floorId);
					    if(floorsData[i].name==curFloor+''){ //如遇bug 延迟处理
					    	$(".editFloor").val(floorsData[i].floorId);
					    	
					    }
					}
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
	this.init=function(){		
		getIpcData();//初始化不带参数表格默认显示第一页
		$("#search-Go").click(function(){
        	getIpcData($("#tag").val(),$("#row_num").find("option:selected").text(),$("#tags").val() );//带参数搜索精确页的数据
        	
        });
        $("#row_num").change(function(){  //为Select添加事件，当选择其中一项 时触发
	                var checkText=$("#row_num").find("option:selected").text();  //获取Select选择的Text
	                //var checkValue=$(".floor").val();  //获取Select选择的Value	                  
	                console.log(checkText);
	                getIpcData('',checkText);
				});
	    /*简单搜索*/	   
	    $("#searchIcon").click(function(){
	    	getIpcData('',$("#row_num").find("option:selected").text(),$("#tags").val());
	    });

	    /*高级检索*/
	    $("#senior_searchIcon").click(function(){
	    	$("#beforesearch").hide();
	    	$("#searching").show();
	    	
	    	
	    });
	    /*高级搜索下 的 搜索按钮*/
	    $("#hightSearch").click(function(){
	    	console.log($("#inputip").val()+"--"+$(".builds").find("option:selected").val()+"--"+$(".floors").find("option:selected").val()+"--"+$("#ipclocation").val());
	    	getIpcData('','',$("#inputip").val(),$(".builds").find("option:selected").val(),$(".floors").find("option:selected").val(),$("#ipclocation").val());
	    });
	    /*高级搜索下的返回*/
	   $("#return").click(function(){
	   	  window.location.reload();
	   });
	   /*高级搜索下的重置*/
	   $("#reset").click(function(){
	   	  $("#inputip").val(" ");
	   	  $("#ipclocation").val(" ");
	   	  $(".builds").get(0).selectedIndex = 0;//重置下拉框
	   	  $(".floors").get(0).selectedIndex = 0;//重置下拉框
	   	  $(".mapLocation").get(0).selectedIndex = 0;//重置下拉框
	   });
	    /*高级搜索下的地图选择下拉框*/
	    $(".mapLocation").change(function(){  //为Select添加事件，当选择其中一项 时触发
            var checkText=$(".mapLocation").find("option:selected").text();  //获取Select选择的Text          
            if(checkText=="室外地图"+''){
            	$("#buildsDIV").hide();
	            $("#floorsDIV").hide();
            };
            if(checkText=="室内地图"+''){
            	$("#buildsDIV").show();
	            $("#floorsDIV").show();
	            getBuilds(0);//获取楼栋
            }
            
           
		});
		/*高级搜索下的“楼栋”选择下拉框*/
		$(".builds").change(function(){
			getFloors(0,$(".builds").find("option:selected").val());
		});
	    /*返回*/
	    $("#return").click(function(){
	    	$("#beforesearch").show();
	    	$("#searching").hide();
	    	
	    });
	    
	    /*添加*/
	    $("#addBtn").click(function(){
	    	
	    });
	    /*添加-->地图选择:室内室外切换*/
	    $("#indoor_out").change(function(){  //为Select添加事件，当选择其中一项 时触发
            var checkText=$("#indoor_out").find("option:selected").text();  //获取Select选择的Text
            //var checkValue=$("#indoor_out").val();  //获取Select选择的Value	                  
            console.log(checkText);
            if(checkText=="室外"+''){
            	$("#buildSelect").hide();
            	$("#floorSelect").hide();
            }else{
            	$("#buildSelect").show();
            	$("#floorSelect").show();
            }
            getBuilds(1);
		});
		/*添加-->“楼栋”选择下拉框*/
		$(".addBuild").change(function(){
			getFloors(1,$(".addBuild").find("option:selected").val());
		});
		/*编辑-->“楼栋”选择下拉框*/
		$("#editBuild").change(function(){
			getFloors(2,$("#editBuild").find("option:selected").val());
		});
		/*添加-->保存*/
		$("#addHold").click(function(){
			var holdINfo;
			var positionType;
			positionType=$("#indoor_out").val();
			if(positionType){
				if(positionType=='1'+''){//室外---ip,building_id,floor_id,安装位置
					holdINfo=$("#addIp").val()+","+$("#addLocation").val();
				}else{//室内---ip,安装位置 
					holdINfo=$("#addIp").val()+","+$(".addBuild").find("option:selected").val()+","+$(".addFloor").find("option:selected").val()+","+$("#addLocation").val();
				    
				}
				console.log("保存的信息："+holdINfo);
			}
			$.ajax({
				url: 'http://192.168.1.224:8080/nursecare/IPC/insertNewIPC.do?positionType=' + positionType+'&newIPC='+holdINfo,
				type: 'GET',
				//xml, html, script, json, jsonp, text
				dataType: 'text',
				timeout: 3000,
				beforeSend: function(XMLHttpRequest) {
			
				},
				success: function(data, textStatus) {
					console.log("保存添加成功");
					window.location.reload();
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
					url: 'http://192.168.1.224:8080/nursecare/IPC/deleteMany.do?ids=' + ids,
					type: 'GET',
					//xml, html, script, json, jsonp, text
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
						console.log("zhang.获取楼栋..失败....");
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
	    /*点击“编辑图片按钮”*/
	   $("td img").click(function(){
	   	 //http://192.168.1.224:8080/nursecare/IPC/getIPCById.do?IPCId=
	   	 //alert($(this).prop('id'));        	
        	getBuilds(2);
        	//alert($(this).prop('src'));
        	if(($(this).prop('src').indexOf("edit.png")) > 0 ){
        		//点击编辑        		
        	    //$("#editBuild").val(1003);
	        	if($(this).prop('id')){
	        		$.ajax({
	        			url: 'http://192.168.1.224:8080/nursecare/IPC/getIPCById.do?IPCId='+$(this).prop('id'),
	        			type: 'GET',
	        			//xml, html, script, json, jsonp, text
	        			dataType: 'text',
	        			timeout: 3000,
	        			beforeSend: function(XMLHttpRequest) {
	        		
	        			},
	        			success: function(data, textStatus) {
	        				console.log("ipc信息载入：");
	        				var IPcObj=JSON.parse(data).body;
	        				
	        				//把对应的ipc信息放入编辑页面       				
	        				$("#editIP").val(dataobj[j].ip);
	        				$("#editLocation").val(dataobj[j].locationDesc);
	        				console.log(dataobj[j].building);
	        				curBuild=dataobj[j].building; 
	        				curFloor=dataobj[j].floor;	        				
	        			},
	        			error: function(XMLHttpRequest, textStatus, errorThrown) {
	        				//timeout也会进入                        	           	
	        				console.log("zhang.修改..失败....");
	        			},
	        			complete: function(XMLHttpRequest, textStatus) {
	        				if(textStatus === 'timeout') {
	        		
	        				}
	        			}
	        		});  	        		
	        	}
        	}
	   });
	    /*修改-->”保存“按钮*/
	    $("#editSave").click(function(){
	    	var edit_holdINfo;
	    	var positionType=0;          	    		 
	    	edit_holdINfo = $("#editIP").val() + "," + $("#editBuild").find("option:selected").val() + "," + $(".editFloor").find("option:selected").val() + "," + $("#editLocation").val();	    		   		
	    	console.log("编辑保存的信息：" + edit_holdINfo);	    	
	    	$.ajax({
	    		url: 'http://192.168.1.224:8080/nursecare/IPC/insertNewIPC.do?positionType=' + positionType + '&newIPC=' + edit_holdINfo,
	    		type: 'GET',
	    		//xml, html, script, json, jsonp, text
	    		dataType: 'text',
	    		timeout: 3000,
	    		beforeSend: function(XMLHttpRequest) {
	    	
	    		},
	    		success: function(data, textStatus) {
	    			console.log("修改成功");
	    			window.location.reload();
	    		},
	    		error: function(XMLHttpRequest, textStatus, errorThrown) {
	    			//timeout也会进入                        	           	
	    			console.log("zhang.修改..失败....");
	    		},
	    		complete: function(XMLHttpRequest, textStatus) {
	    			if(textStatus === 'timeout') {
	    	
	    			}
	    		}
	    	});
	    });
	    
			   
	}
}
