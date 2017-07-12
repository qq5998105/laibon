function ALL_PERSON(){
	var apiurl="http://192.168.1.224:8080/nursecare/watch/selectNoWatch.do",
	    totalPage,//总共页数
	    curPage,//当前页数
	    perPapernum,//每页多少条数据
	    currentPageFirst,//当前页的第一条是第几条
	    totalNUm,//总共数据多少条
	    currentPageLast,//当前页的最后一条是第几条
	    curBuild,
	    AP_id,
	    curFloor;
	    
    /*getAllpersonData（type,pram1，pram2,pram3）
              功能描述：根据不同条件搜索显示数据
      pram1：当前页，为null时默认：1 
      pram2：每页显示数据数，为null时默认：10
      pram3：绑定人姓名，搜索条件
      
      
     * */
	function getAllpersonData(type,currentpage,perpage,personName){
		//输入参数：cp,ps,patientNameKey,phoneNumberKey,IMEIKey,beginDate,endDate
		var currentpage_param='';
		var perpage_param='';
		var person_param='';
		
		
		(currentpage==undefined) ? (currentpage_param=" ") : (currentpage_param=("cp="+currentpage));
		(perpage ==undefined) ? perpage_param=" " : (perpage_param="&ps="+perpage);	
		(personName ==undefined) ? person_param=" " : (person_param="&key="+personName);
		//alert((currentpage==undefined)+"--");
		var go_searchpageurl;
			//go_searchpageurl='http://192.168.1.224:8080/nursecare/watch/selectNoWatch.do?cp=1&ps=10';

		if(type==1){//
			go_searchpageurl='http://192.168.1.224:8080/nursecare/watch/selectNoWatch.do?cp=1&ps=10';
		}else{//
			go_searchpageurl=apiurl+'?'+currentpage_param+perpage_param+person_param+'';
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
					parsePersondata(data);
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
	function parsePersondata(apdata){
		var persondataObj=JSON.parse(apdata);		
		var DataObj=persondataObj.body;		
		var dataobj=DataObj.list;
		console.log(dataobj.length);
		curPage=DataObj.cp;
		perPapernum=DataObj.ps;
		totalNUm=DataObj.totalRec;
		totalPage=DataObj.totalPage;
		currentPageFirst=DataObj.firstData;
		currentPageLast=DataObj.lastData;	
		var tr_html='';
		$(".personGrid").find("tr").remove();
		for (var i=0;i<dataobj.length;i++) {			
				tr_html="<tr><td><input name='subBox1' type='radio' value="+dataobj[i].patientId+" />"+(i+1)+"</td><td>"
				+dataobj[i].num+"</td><td>"+dataobj[i].name+"</td><td>"+dataobj[i].birthday+"</td></tr>";
				
				$(".personGrid").append(tr_html);
			
		}			
	    $(".list_num").text("共"+totalNUm+"条记录");
	     console.log("当前页："+curPage+"每页显示："+perPapernum+"总共数据："+totalNUm+"总共页数："+totalPage+"当前页的第一条："+currentPageFirst+"当前页的最后一条："+currentPageLast);
			    $.jqPaginator('#pagination2', {
			    	totalPages: totalPage,
			    	visiblePages: 2,
			    	currentPage: curPage,
			    	prev: '<li class="prev2"><a href="javascript:;">上一页</a></li>',
			    	next: '<li class="next2"><a href="javascript:;">下一页</a></li>',
			    	page: '<li class="page2"><a href="javascript:;">{{page}}</a></li>',
			    	onPageChange: function(num, type) {
			    		//curPage=num;
			    		//$('#p1').text(type + '：' + num);
			    		console.log("num=" + num + "type=" + type);
			    		if(type == "change" + '') {
			    			parsecurPage(num,10);
			    		}
			    
			    	}
			    });	
	    /*单选*/
	    var subBox1 = $("input[name='subBox1']");
	    subBox1.click(function() {
	    	console.log($(this).attr("value"));	    	
	    	for(var j = 0; j < dataobj.length; j++) {	    		
	    	   if($(this).attr("value")==dataobj[j].patientId+''){
	    	   	 //alert(dataobj[j].name);
	    	   	 $("#addperson").val(dataobj[j].name);
	    	   	 window.localStorage["personNum"]=dataobj[j].num+'';
	    	   	 personNum=dataobj[j].num+'';
	    	   }
	    	}
	    });
	}
	/*点击分页：上一页、下一页、1、2、3、4....等切换到相应页的数据显示*/
	function parsecurPage(pagenum,perpage){
		var currentpage_param='';
		var perpage_param='';
		var patientName='';
		var phoneNumber='';
		var imei='';
		var begin_Date='';
		var end_Date='';
		
		(pagenum==undefined) ? (currentpage_param=" ") : (currentpage_param=("cp="+pagenum));
		(perpage ==undefined) ? perpage_param=" " : (perpage_param="&ps="+perpage);
		
		
		//alert((currentpage==undefined)+"--");
		var pageurl;		
		pageurl=apiurl+'?'+currentpage_param+perpage_param+'';
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
			    $(".personGrid").find("tr").remove();
			    for(var i = 0; i < dataobj.length; i++) {
			    	tr_html="<tr><td><input name='subBox1' type='radio' value="+dataobj[i].patientId+" />"+(i+1)+"</td><td>"
				            +dataobj[i].num+"</td><td>"+dataobj[i].name+"</td><td>"+dataobj[i].birthday+"</td></tr>";
				
				    $(".personGrid").append(tr_html);
			    	
			    	
			    	
			    }
			    $(".list_num").text("共"+totalNUm+"条记录")
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
	
	
	this.init=function(){		
		getAllpersonData();//初始化不带参数表格默认显示第一页
		$(".pagesearch").click(function(){
        	getAllpersonData(0,$("#pagego").val(),10);//带参数搜索精确页的数据
        	
        });        
	    /*简单搜索*/	   
	    $(".searchName").click(function(){
	    	getAllpersonData(0,1,10,$(".inputName").val());
	    });	    		
		
	    /*确定*/
	    $(".allperson_sure").click(function() {
       	     event.stopPropagation();
       	     if($('#addperson').val()){
       	     	$("#allperson").hide();
       	     }else{      	     	
       	     	alert("您还未选择，请选择绑定人！");
       	     }
            
        });
       
       /*取消*/
	    $(".allperson_cancel").click(function() {
       	     event.stopPropagation();
       	     $('#addperson').val('');
            
        });
       	   			   
	}
}
