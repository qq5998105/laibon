function WATCH_MANAGE(){
	var apiurl="http://192.168.1.224:8080/nursecare/watch/difSplit.do",
	    totalPage,//总共页数
	    curPage,//当前页数
	    perPapernum,//每页多少条数据
	    currentPageFirst,//当前页的第一条是第几条
	    totalNUm,//总共数据多少条
	    currentPageLast,//当前页的最后一条是第几条
	    curBuild,
	    AP_id,
	    wt_ID,
	    patient_Id,
	    curFloor;
	    
    /*getWatchData（type,pram1，pram2，pram3，pram4，pram5，pram6，）
              功能描述：根据不同条件搜索显示数据
      pram1：当前页，为null时默认：1 
      pram2：每页显示数据数，为null时默认：10
      pram3：绑定人姓名，搜索条件
      pram4：IMEI编号，搜索条件
      pram5：开始时间，搜索条件
      pram6：结束时间
      
     * */
	function getWatchData(type,currentpage,perpage,patientNameKey,phoneNumberKey,IMEIKey,beginDate,endDate){
		//输入参数：cp,ps,patientNameKey,phoneNumberKey,IMEIKey,beginDate,endDate
		var currentpage_param='';
		var perpage_param='';
		var patientName='';
		var phoneNumber='';
		var imei='';
		var begin_Date='';
		var end_Date='';
		
		(currentpage==undefined) ? (currentpage_param=" ") : (currentpage_param=("cp="+currentpage));
		(perpage ==undefined) ? perpage_param=" " : (perpage_param="&ps="+perpage);
		(patientNameKey ==undefined) ? patientName=" " : (patientName="&patientNameKey="+patientNameKey);
		(phoneNumberKey ==undefined) ? phoneNumber=" " : (phoneNumber="&phoneNumberKey="+phoneNumberKey);
		(IMEIKey ==undefined) ? imei=" " : (imei="&IMEIKey="+IMEIKey);
		(beginDate ==undefined) ? begin_Date=" " : (begin_Date="&beginDate="+beginDate);
		(endDate ==undefined) ? end_Date=" " : (end_Date="&endDate="+endDate);
		
		//alert((currentpage==undefined)+"--");
		var go_searchpageurl;
		if(type==1){//简单搜索
			go_searchpageurl='http://192.168.1.224:8080/nursecare/watch/simpleSplit.do?cp=1&ps=10&key='+$('#tags').val();
		}else{//高级搜索
			go_searchpageurl=apiurl+'?'+currentpage_param+perpage_param+patientName+phoneNumber+imei+begin_Date+end_Date+'';
		}
				   
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
					parseWatchdata(data);
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
	function parseWatchdata(apdata){
		var apdataObj=JSON.parse(apdata);		
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
				if(dataobj[i].watchValue=='已开通'+''){//已开通
					tr_html="<tr><td><input name='subBox' type='checkbox' value="+dataobj[i].watchId+" />"+(i+1)+"</td><td>"
						+dataobj[i].phoneNumber+"</td><td>"+dataobj[i].imei+"</td><td>"+dataobj[i].name+"</td><td>"
						+dataobj[i].openTime+"</td><td>"+dataobj[i].value+"</td><td>"
						+dataobj[i].watchValue+"</td><td><button class='stopBtn' id="+'stat_'+dataobj[i].watchId+">停用</button><img src='../../img/delete.png' id="+'delet_'+dataobj[i].watchId+" style='max-width: 20px;'/>"
						+"<a href='#modal-container-998611' data-toggle='modal'><img src='../../img/edit.png' id="+dataobj[i].watchId+" style='max-width: 20px;margin-left: 10px;'/></a></td></tr>";
				
				}else{//已停用
					tr_html="<tr><td><img src='../../img/forbid.png'  style='max-width: 12px;'/>"+(i+1)+"</td><td>"
						+dataobj[i].phoneNumber+"</td><td>"+dataobj[i].imei+"</td><td>"+dataobj[i].name+"</td><td>"
						+dataobj[i].openTime+"</td><td>"+dataobj[i].value+"</td><td>"
						+dataobj[i].watchValue+"</td><td><button class='startBtn' id="+'stat_'+dataobj[i].watchId+">启用</button>"
						+"<a href='#modal-container-998611' data-toggle='modal'><img src='../../img/edit.png' id="+dataobj[i].watchId+" style='max-width: 20px;margin-left: 10px;'/></a></td></tr>";
				
				}
				$(".gridList").append(tr_html);
			
		}
		$(".stopBtn").click(function(){
	    	//console.log("停用按钮"+$(this).prop("id").split('_')[1]);
	    	stopOrStart(0,$(this).prop("id").split('_')[1]);
	    });
	    $(".startBtn").click(function(){
	    	//console.log("启用按钮"+$(this).prop("id").split('_')[1]);
	    	stopOrStart(1,$(this).prop("id").split('_')[1]);
	    });
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
			    			parsecurPage(num,$("#row_num").find("option:selected").text(),$("#inputName").val(),$("#inputPhonenum").val(),$("#inputImei").val(),$("#_easyui_textbox_input1").val(),$("#_easyui_textbox_input2").val());
			    		}
			    
			    	}
			    });
	   /*编辑&删除*/
        $("td img").click(function(){       	
        	$("#myModalLabel").text("手表修改页面");
        	if(($(this).prop('src').indexOf("edit.png")) > 0 ){
        		//点击编辑
        		alert($(this).prop('src'));       	    
	        	if($(this).prop('id')){	        		
	        		alert($(this).prop('id'));
	        		/*var tt='{ "list":[{"id":null,"patientId":2,"positionType":1,"longitude":null,"latitude":null,"floorId":23,"axisX":"-7.22","axisY":"-11.04","time":1498182809000},{"id":null,"patientId":3,"positionType":1,"longitude":null,"latitude":null,"floorId":23,"axisX":"-8.71","axisY":"-12.41","time":1498182809000}]}';
	        		var ts=JSON.parse(tt);
	        		alert(ts);*/
	        		for (var j=0;j<dataobj.length;j++) {
	        			console.log("dd");
	        			if($(this).prop('id')==dataobj[j].watchId){
	        				//把对应的手表信息放入编辑页面       				
	        				$("#addphoneNum").val(dataobj[j].phoneNumber);
	        				$("#addIMEI").val(dataobj[j].imei);
	        				$("#addperson").val(dataobj[j].name);
	        				wt_ID=dataobj[j].watchId;
	        				patient_Id=dataobj[j].patientId;
	        			}
	        		}
	        	}
        	}else{//点击单个删除        		 
        		if($(this).prop('id')) {
        			$.ajax({
        				url: 'http://192.168.1.224:8080/nursecare/watch/deleteSingle.do?watchId=' + $(this).prop('id').split('_')[1],
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
	function parsecurPage(pagenum,perpage,patientNameKey,phoneNumberKey,IMEIKey,beginDate,endDate){
		var currentpage_param='';
		var perpage_param='';
		var patientName='';
		var phoneNumber='';
		var imei='';
		var begin_Date='';
		var end_Date='';
		
		(pagenum==undefined) ? (currentpage_param=" ") : (currentpage_param=("cp="+pagenum));
		(perpage ==undefined) ? perpage_param=" " : (perpage_param="&ps="+perpage);
		(patientNameKey ==undefined) ? patientName=" " : (patientName="&patientNameKey="+patientNameKey);
		(phoneNumberKey ==undefined) ? phoneNumber=" " : (phoneNumber="&phoneNumberKey="+phoneNumberKey);
		(IMEIKey ==undefined) ? imei=" " : (imei="&IMEIKey="+IMEIKey);
		(beginDate ==undefined) ? begin_Date=" " : (begin_Date="&beginDate="+beginDate);
		(endDate ==undefined) ? end_Date=" " : (end_Date="&endDate="+endDate);
		
		//alert((currentpage==undefined)+"--");
		var pageurl;		
		pageurl=apiurl+'?'+currentpage_param+perpage_param+patientName+phoneNumber+imei+begin_Date+end_Date+'';
		console.log("切换页pageurl："+pageurl);
				
		$.ajax({
            url: pageurl,
            type: 'GET',
            //xml, html, script, json, jsonp, text
            dataType:'text',
            timeout: 3000,
            beforeSend: function(XMLHttpRequest) {
                
            },
            success: function(data, textStatus) {
            	console.log("切换显示页得到的远程数据："+data);
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
			    	
			    	if(dataobj[i].watchValue=='已开通'+''){//已开通
						tr_html="<tr><td><input name='subBox' type='checkbox' value="+dataobj[i].watchId+" />"+(i+1)+"</td><td>"
							+dataobj[i].phoneNumber+"</td><td>"+dataobj[i].imei+"</td><td>"+dataobj[i].name+"</td><td>"
							+dataobj[i].openTime+"</td><td>"+dataobj[i].value+"</td><td>"
							+dataobj[i].watchValue+"</td><td><button class='stopBtn' id="+'stat_'+dataobj[i].watchId+">停用</button><img src='../../img/delete.png' id="+'delet_'+dataobj[i].watchId+" style='max-width: 20px;'/>"
							+"<a href='#modal-container-998611' data-toggle='modal'><img src='../../img/edit.png' id="+dataobj[i].watchId+" style='max-width: 20px;margin-left: 10px;'/></a></td></tr>";
					
					}else{//已停用
						tr_html="<tr><td><img src='../../img/forbid.png'  style='max-width: 12px;'/>"+(i+1)+"</td><td>"
							+dataobj[i].phoneNumber+"</td><td>"+dataobj[i].imei+"</td><td>"+dataobj[i].name+"</td><td>"
							+dataobj[i].openTime+"</td><td>"+dataobj[i].value+"</td><td>"
							+dataobj[i].watchValue+"</td><td><button class='startBtn' id="+'stat_'+dataobj[i].watchId+">启用</button>"
							+"<a href='#modal-container-998611' data-toggle='modal'><img src='../../img/edit.png' id="+dataobj[i].watchId+" style='max-width: 20px;margin-left: 10px;'/></a></td></tr>";
					
					}
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
			    				if($(this).prop('id') == dataobj[j].watchId) {
			    					//把对应的手表信息放入编辑页面       				
			    					$("#addphoneNum").val(dataobj[j].phoneNumber);
			    					$("#addIMEI").val(dataobj[j].imei);
			    					$("#addperson").val(dataobj[j].name);
			    					wt_ID = dataobj[j].watchId;
			    					patient_Id = dataobj[j].patientId;
			    				}
			    			}
			    		}
			    	} else { //点击单个删除			    		
			    		if($(this).prop('id')) {
			    			$.ajax({
			    				url: 'http://192.168.1.224:8080/nursecare/watch/deleteSingle.do?watchId=' + $(this).prop('id').split('_')[1],
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
	/*启用停用设备*/
	function stopOrStart(statues,wtID){
		if(!statues){//停用			
		    var urlstring='http://192.168.1.224:8080/nursecare/watch/stop.do?watchId='+wtID;		    
		}else{//启用
		    var urlstring='http://192.168.1.224:8080/nursecare/watch/start.do?watchId='+wtID;		    		    
		}
		$.ajax({
			url: urlstring,
			type: 'GET',
			//xml, html, script, json, jsonp, text
			dataType: 'text',
			timeout: 3000,
			beforeSend: function(XMLHttpRequest) {
		
			},
			success: function(data, textStatus) {
				console.log("操作成功");
				window.location.reload();
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//timeout也会进入                        	           	
				console.log("操作..失败....");
			},
			complete: function(XMLHttpRequest, textStatus) {
				if(textStatus === 'timeout') {
		
				}
			}
		});
		
	}
	this.init=function(){		
		getWatchData();//初始化不带参数表格默认显示第一页
		$("#search-Go").click(function(){
        	getWatchData(0,$("#tag").val(),$("#row_num").find("option:selected").text(),$("#tags").val() );//带参数搜索精确页的数据
        	
        });
        /*切换选择每页显示数据number*/
        $("#row_num").change(function(){  //为Select添加事件，当选择其中一项 时触发
	                var checkText=$("#row_num").find("option:selected").text();  //获取Select选择的Text
	                //var checkValue=$(".floor").val();  //获取Select选择的Value	                  
	                console.log(checkText);
	                //getWatchData(0,'1',checkText);
	                getWatchData(0,'1',checkText,$("#inputName").val(),$("#inputPhonenum").val(),$("#inputImei").val(),$("#_easyui_textbox_input1").val(),$("#_easyui_textbox_input2").val());
				});
	    /*简单搜索*/	   
	    $("#searchIcon").click(function(){
	    	getWatchData(1,$("#row_num").find("option:selected").text(),$("#tags").val());
	    });

	    /*高级检索*/
	    $("#senior_searchIcon").click(function(){
	    	$("#beforesearch").hide();
	    	$("#searching").show();
	    	
	    	
	    });
	    /*高级搜索下 的 搜索按钮*/
	    $("#hightSearch").click(function(){
	    	console.log($("#_easyui_textbox_input1").val()+"--"+$("#_easyui_textbox_input2").val());
	    	getWatchData(0,'1',$("#row_num").find("option:selected").text(),$("#inputName").val(),$("#inputPhonenum").val(),$("#inputImei").val(),$("#_easyui_textbox_input1").val(),$("#_easyui_textbox_input2").val());
	    });
	    /*高级搜索下的返回*/
	   $("#return").click(function(){
	   	  window.location.reload();
	   });
	   /*高级搜索下的重置*/
	   $("#reset").click(function(){
	   	  $("#inputName").val(" ");
	   	  $("#inputPhonenum").val(" ");
	   	  $("#inputImei").val(" ");
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
	    	$("#myModalLabel").text("手表添加页面");
	    });
		/*添加-->保存*/
		$("#addHold").click(function(){
			//alert(personNum);
			//alert($("#myModalLabel").text());
			if($("#myModalLabel").text()=='手表添加页面'){
				//添加 -->拼接的watch信息,结构应该为：phoneNumber IMEI num； （各字段不能为空）addperson
				if($("#addphoneNum").val() && $("#addIMEI").val() && personNum) {
					var addUrl = 'http://192.168.1.224:8080/nursecare/watch/insert.do?phoneNumber=' + $("#addphoneNum").val() +
						'&IMEI=' + $("#addIMEI").val() + '&num=' + personNum + '';
					console.log("添加手表url=" + addUrl);
					$.ajax({
						url: addUrl,
						type: 'GET',
						//xml, html, script, json, jsonp, text
						dataType: 'text',
						timeout: 3000,
						beforeSend: function(XMLHttpRequest) {
				
						},
						success: function(data, textStatus) {
							console.log("保存添加："+data);
							var watchINfo=JSON.parse(data);
							if(watchINfo.statu+' '=='000'){//添加成功
								window.location.reload();
							}else{//添加失败
								alert("添加失败，"+watchINfo.msg+" ！");
							}
							
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							//timeout也会进入                        	           	
							console.log("zhang.保存..失败....");
						},
						complete: function(XMLHttpRequest, textStatus) {
							if(textStatus === 'timeout') {
				
							}
						}
					});
				} else {
					alert("各输入不能为空！")
				}
			}else{
				//修改watch信息  请求地址：http://192.168.1.224:8080/nursecare/watch/upd.do 
				//输入参数： phoneNumber IMEI patientId, watchId  
				if($("#addphoneNum").val() && $("#addIMEI").val()&& $("#addperson").val()) {
					var editUrl = 'http://192.168.1.224:8080/nursecare/watch/upd.do?phoneNumber=' + $("#addphoneNum").val() +
						'&IMEI=' + $("#addIMEI").val() + '&patientId=' + patient_Id +'&watchId='+wt_ID+ '';
					console.log("修改手表url=" + editUrl);
					$.ajax({
						url: editUrl,
						type: 'GET',
						//xml, html, script, json, jsonp, text
						dataType: 'text',
						timeout: 3000,
						beforeSend: function(XMLHttpRequest) {
				
						},
						success: function(data, textStatus) {
							console.log("保存修改成功");
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
				} else {
					alert("各输入不能为空！")
				}
			}
			
			
											
			
			
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
					url: 'http://192.168.1.224:8080/nursecare/watch/batchDeletes.do?delitems=' + ids,
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
