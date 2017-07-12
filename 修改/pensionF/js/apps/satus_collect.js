function STATU_COLLECT(){
	var apiurl="http://192.168.1.45:8082/lb/deviceStatus/watchOffline.do",
	    ipcurl="http://192.168.1.224:8080/nursecare/IPC/OutlineIPCSplit.do",
	    
	    totalPage,//总共页数
	    curPage,//当前页数
	    perPapernum,//每页多少条数据
	    currentPageFirst,//当前页的第一条是第几条
	    totalNUm,//总共数据多少条
	    currentPageLast;//当前页的最后一条是第几条
	    
	    
    /*getWatchData（devtype,pram1，pram2）
              功能描述：根据不同条件搜索显示数据
      devtype:设备类型
      pram1：当前页，为null时默认：1 
      pram2：每页显示数据数，为null时默认：10
      
      
     * */
	function getWatchData(devtype,currentpage,perpage){
		//输入参数：cp,ps,patientNameKey,phoneNumberKey,IMEIKey,beginDate,endDate
		var currentpage_param='';
		var perpage_param='';
		
		
		(currentpage==undefined) ? (currentpage_param=" ") : (currentpage_param=("cp="+currentpage));
		(perpage ==undefined) ? perpage_param=" " : (perpage_param="&ps="+perpage);
		
		//alert((currentpage==undefined)+"--");
		var go_searchpageurl;
		if(devtype=='watch'){
			go_searchpageurl=apiurl+'?'+currentpage_param+perpage_param+'';
		}
		if(devtype=='ipc'){
			go_searchpageurl=ipcurl+'?'+currentpage_param+perpage_param+'';
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
					parseWatchdata(devtype,data);
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
	function parseWatchdata(devtype,apdata){
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
		var thead_html=' ';
		var tr_html='';
		$(".gridList").find("tr").remove();
		$("thead").find("tr").remove();
		if(devtype=='ipc'){
			$("#headText").text("离线IPC汇总：");
			thead_html="<tr><th>序号</th><th>IP地址</th><th>位置区域</th><th>楼栋</th>"+
		        "<th>楼层</th><th>楼层名称</th><th>安装位置</th><th>在线状态</th></tr>";
			$("thead").append(thead_html);
			for (var i=0;i<dataobj.length;i++) {				
				tr_html=tr_html="<tr><td>"+(i+1)+"</td><td>"
						+dataobj[i].ip+"</td><td>"+"未知"+"</td><td>"+dataobj[i].building+"</td><td>"
						+dataobj[i].floor+"</td><td>"
						+dataobj[i].floor+"</td><td>"+dataobj[i].locationDesc+"</td><td>"
						+dataobj[i].online+"</td></tr>";
						
				$(".gridList").append(tr_html);
				
			}
		}		
		if(devtype=='watch'){
			thead_html = "<tr><th>序号</th><th>手机号码</th><th>手机IMEI编号</th><th>绑定人</th>" +
				"<th>开通时间</th><th>在线状态</th><th>设备状态</th></tr>";
			$("thead").append(thead_html);
			for(var i = 0; i < dataobj.length; i++) {
				if(dataobj[i].value == '离线' + '') { //离线筛选
					tr_html = "<tr><td>" + (i + 1) + "</td><td>" +
						dataobj[i].phoneNumber + "</td><td>" + dataobj[i].imei + "</td><td>" + dataobj[i].name + "</td><td>" +
						dataobj[i].openTime + "</td><td>" + dataobj[i].value + "</td><td>" +
						dataobj[i].watchValue + "</td></tr>";
			
				}
				$(".gridList").append(tr_html);
			
			}
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
			    			parsecurPage(GetQueryString("dev"),num,$("#row_num").find("option:selected").text());
			    		}
			    
			    	}
			    });	           		
	}
	/*点击分页：上一页、下一页、1、2、3、4....等切换到相应页的数据显示*/
	function parsecurPage(devtype,pagenum,perpage){
		var currentpage_param='';
		var perpage_param='';
		
		
		(pagenum==undefined) ? (currentpage_param=" ") : (currentpage_param=("cp="+pagenum));
		(perpage ==undefined) ? perpage_param=" " : (perpage_param="&ps="+perpage);
		
		//alert((currentpage==undefined)+"--");
		var pageurl=' ';
		if(devtype=='watch'){
			pageurl=apiurl+'?'+currentpage_param+perpage_param+'';
		}
		if(devtype=='ipc'){
			pageurl=ipcurl+'?'+currentpage_param+perpage_param+'';
		}
		
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
			    //$("thead").find("tr").remove();
			    
			    if(devtype=='ipc'){
			    	/*thead_html="<tr><th>序号</th><th>IP地址</th><th>位置区域</th><th>楼栋</th>"+
			        "<th>楼层</th><th>楼层名称</th><th>安装位置</th><th>在线状态</th></tr>";*/
					
					for (var i=0;i<dataobj.length;i++) {				
						tr_html=tr_html="<tr><td>"+(i+1)+"</td><td>"
								+dataobj[i].ip+"</td><td>"+"未知"+"</td><td>"+dataobj[i].building+"</td><td>"
								+dataobj[i].floor+"</td><td>"
								+dataobj[i].floor+"</td><td>"+dataobj[i].locationDesc+"</td><td>"
								+dataobj[i].online+"</td></tr>";
								
						$(".gridList").append(tr_html);
						
					}
			    }
			    	
			    if(devtype=='watch'){			   	
			    	for(var i = 0; i < dataobj.length; i++) {						
						tr_html=tr_html="<tr><td>"+(i+1)+"</td><td>"
								+dataobj[i].phoneNumber+"</td><td>"+dataobj[i].imei+"</td><td>"
								+dataobj[i].name+"</td><td>"
								+dataobj[i].openTime+"</td><td>"+dataobj[i].value+"</td><td>"
								+dataobj[i].watchValue+"</td></tr>";										
				    	$(".gridList").append(tr_html);
				    	
				    }
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
	function GetQueryString(name) {  
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
	    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
	    var context = "";  
	    if (r != null)  
	         context = r[2];  
	    reg = null;  
	    r = null;  
	    return context == null || context == "" || context == "undefined" ? "" : context;  
	}
	 
	this.init=function(){
		//alert(GetQueryString("dev"));
		getWatchData(GetQueryString("dev"),1,10);//初始化不带参数表格默认显示第一页
		$("#search-Go").click(function(){
        	getWatchData(GetQueryString("dev"),$("#tag").val(),$("#row_num").find("option:selected").text() );//带参数搜索精确页的数据
        	
        });
        /*切换选择每页显示数据number*/
        $("#row_num").change(function(){  //为Select添加事件，当选择其中一项 时触发
            var checkText=$("#row_num").find("option:selected").text();  //获取Select选择的Text
            //var checkValue=$(".floor").val();  //获取Select选择的Value	                  
            console.log(checkText);            
            getWatchData(GetQueryString("dev"),'1',checkText);
		});
		
	    /*返回*/
	    $("#return_devicestatu").click(function(){
	    	window.location.href="device_status.html";
	    	
	    });	    	    
			   
	}
}
