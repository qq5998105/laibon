
window.onload = function ()
{
	getBuilds();
	getseverStation();
	getStaff();
	getSelectLevel();
    var nat = document.getElementById ("national");
    for ( var i = 0; i < national.length; i++)
    {
        var option = document.createElement ('option');
        option.value = i;
        var txt = document.createTextNode (national[i]);
        option.appendChild (txt);
        nat.appendChild (option);
    }
    
    //护理等级
    function getSelectLevel() {
		$.ajax({
			url: window.localStorage["ip:port"]+'/nursecare/patient/selectLevel.do',
			type: 'POST',
			//xml, html, script, json, jsonp, text
			dataType: 'text',
			timeout: 3000,
			beforeSend: function(XMLHttpRequest) {
	
			},
			success: function(data, textStatus) {	
//				console.log("护理等级：" + data);
				var selectLevelData = JSON.parse(data).body;
				for(var i = 0; i < parseInt(selectLevelData.length); i++) {
					$("#custom-selectLevel").append("<option value='" + selectLevelData[i].id + "'>" + selectLevelData[i].levelName + "</option>");
				}	
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//timeout也会进入                        	           	
				console.log("获取服务站..失败....");
			},
			complete: function(XMLHttpRequest, textStatus) {
				if(textStatus === 'timeout') {
	
				}
			}
		});
	}
    
    function getBuilds() {
    	$.ajax({
    		url: window.localStorage["ip:port"]+'/nursecare/buildingAbout/findBuilding.do',
    		type: 'GET',
    		//xml, html, script, json, jsonp, text
    		dataType: 'text',
    		timeout: 3000,
    		beforeSend: function(XMLHttpRequest) {
    
    		},
    		success: function(data, textStatus) {
    
//  			console.log("楼栋信息：" + data);
    			var buildsData = JSON.parse(data).body;
    			for(var i = 0; i < parseInt(buildsData.length); i++) {
    				$("#buildingId").append("<option value='" + buildsData[i].buildingId + "'>" + buildsData[i].name + "</option>");
    			}
    
    			getFloors($("#buildingId").find("option:selected").val());
    
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
    	if(building_Id) {
    		$.ajax({
    			url: window.localStorage["ip:port"]+'/nursecare/buildingAbout/findFloorByBuilding.do?buildingId=' + building_Id,
    			type: 'GET',
    			//xml, html, script, json, jsonp, text
    			dataType: 'text',
    			timeout: 3000,
    			beforeSend: function(XMLHttpRequest) {
    
    			},
    			success: function(data, textStatus) { 				    				
    				if(JSON.parse(data).msg){
    					alert(JSON.parse(data).msg);
    				}else{
    					var floorsData = JSON.parse(data).body;
    					$("#floor_name").find("option").remove();
	    				$("#floor_name").append("<option value=''>--请选择--</option>");
	    				for(var i = 0; i < parseInt(floorsData.length); i++) {	    					
	    					$("#floor_name").append("<option value='" + floorsData[i].floorId + "'>" + floorsData[i].name + "</option>");
	    				}
    				}
    				
//  			getRooms($("#floor_name").find("option:selected").val());
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
    
//  根据楼层获取房间
	
	function getRooms(floorId) {
    	if(floorId) {
    		$.ajax({
    			url: window.localStorage["ip:port"]+'/nursecare/bed/selectRoomById.do',
    			data:{"floorId":floorId},
    			type: 'POST',
    			//xml, html, script, json, jsonp, text
    			dataType: 'text',
    			timeout: 3000,
    			beforeSend: function(XMLHttpRequest) {
    
    			},
    			success: function(data, textStatus) {
    				console.log("房间信息：" + data);
    				var roomsData = JSON.parse(data);
    				if(roomsData.msg){    					
    					alert(roomsData.msg);
    				}else{
    					var roomsData = JSON.parse(data).body;
    					$("#room_name").find("option").remove();
    					$("#room_name").append("<option value=''>--请选择--</option>");
    					for(var i = 0; i < parseInt(roomsData.length); i++) {
    						$("#room_name").append("<option value='" + roomsData[i].roomId + "'>" + roomsData[i].name + "</option>");
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
    
    }
//根据房间ID号查找床铺
    function getbeds(roomId){
    	if(roomId) {
    		$.ajax({
    			url: window.localStorage["ip:port"]+'/nursecare/bed/selectNotPatientBed.do',
    			data:{"roomId":roomId},
    			type: 'POST',
    			//xml, html, script, json, jsonp, text
    			dataType: 'text',
    			timeout: 3000,
    			beforeSend: function(XMLHttpRequest) {
    
    			},
    			success: function(data, textStatus) {
    				console.log("房间信息：" + data);
    				var bedsData = JSON.parse(data);
    				console.log(bed)
    				if(bedsData.msg){    					
    					alert(bedsData.msg);
    				}else{
    					var bedsData = JSON.parse(data).body;
    					$("#bedNum").find("option").remove();
    					$("#bedNum").append("<option value=''>--请选择--</option>");
    					for(var i = 0; i < parseInt(bedsData.length); i++) {
    						$("#bedNum").append("<option value='" + bedsData[i].bedId + "'>" + bedsData[i].name + "</option>");
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
    }


/*获取全部服务站*/
	function getseverStation() {
		$.ajax({
			url: window.localStorage["ip:port"]+'/nursecare/patient/selectStation.do',
			type: 'POST',
			//xml, html, script, json, jsonp, text
			dataType: 'text',
			timeout: 3000,
			beforeSend: function(XMLHttpRequest) {
	
			},
			success: function(data, textStatus) {	
//				console.log("服务站信息：" + data);
				var stationData = JSON.parse(data).body;
				for(var i = 0; i < parseInt(stationData.length); i++) {
					$("#service_Station").append("<option value='" + stationData[i].stationId + "'>" + stationData[i].name + "</option>");
				}					
		
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//timeout也会进入                        	           	
				console.log("获取服务站..失败....");
			},
			complete: function(XMLHttpRequest, textStatus) {
				if(textStatus === 'timeout') {
	
				}
			}
		});
	}

	//获取护理人员信息

function getStaff() {
		$.ajax({
			url: window.localStorage["ip:port"] + '/nursecare/staff/getStaffLikeName.do',
			type: 'POST',
			//xml, html, script, json, jsonp, text
			//          data:{
			//          	"cp":cp,
			//          	"ps":ps,
			//          	"searchmsg":searchmsg
			//          },
			dataType: 'text',
			timeout: 3000,
			beforeSend: function(XMLHttpRequest) {

			},
			success: function(res) {
				
				//				console.log(res);
				var staffData = $.parseJSON(res);
				//				console.log(staffData);
				var staffDatelist = staffData.body.list;

				//				console.log(staffDatelist);
				for(var i = 0; i < parseInt(staffDatelist.length); i++) {
					$(".personGrid").append("<tr><td><input type='checkbox'></td><td>" + staffDatelist[i].num + "</td><td>" + staffDatelist[i].name + "</td><td>" + staffDatelist[i].birthday + "</td></tr>");
				}
				$("#pagego").val(staffData.body.cp);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {

			}
		});
	}


       //民族下拉列表

     var reqUrl=window.localStorage["ip:port"]+'/nursecare/commdict/list.do';

//       console.log({"staff":JSON.stringify(testobj)});
         $.ajax({
             url: reqUrl,
             type: 'POST',
             data:{"type":"nation"},
             //xml, html, script, json, jsonp, text
             dataType: 'text',
             timeout: 3000,
             beforeSend: function(XMLHttpRequest) {

             },
             success: function(data, textStatus) {
                 // console.log(data);
                 var dataobj=JSON.parse(data).body;
                 // alert(dataobj.length);
                 var nat = document.getElementById ("national");
                 for ( var i = 0; i < dataobj.length; i++)
                 {
                     $("#national").append("<option value="+dataobj[i].key +">"+dataobj[i].value+"</option>");
                 }
             },
             error: function(XMLHttpRequest, textStatus, errorThrown) {
                 //timeout也会进入
                 console.log("...失败....");
             },
             complete: function(XMLHttpRequest, textStatus) {
                 if(textStatus === 'timeout') {

                 }
             }
         });

        function save_Submit(){
        	var infoobj={};
        	var mentalIllnessflag;
        	var hypertensionflag;
        	var hyperlipidemiaflag;
        	var highBloodSugarflag;
        	var highUricAcidflag;
       	    ($("#disabled_PeopleY").prop("checked"))?(mentalIllnessflag=1):(mentalIllnessflag=null);
        	($("#disabled_PeopleN").prop("checked"))?(mentalIllnessflag=0):(mentalIllnessflag=null);
        	($("#check-highBloodSugar").prop("checked"))?(highBloodSugarflag=1):(highBloodSugarflag=0);
        	($("#check-highUricAcid").prop("checked"))?(highUricAcidflag=1):(highUricAcidflag=0);
        	($("#check-hyperlipidemia").prop("checked"))?(hyperlipidemiaflag=1):(hyperlipidemiaflag=0);
        	
        	
        	var patient={
        		"num":$("#customer-number").val(),   //编号
        		"name":$("#custom-name").val(),
        		"gender":$("#custom-sex").find("option:selected").val(),
        		"IDCardNum":$("#custom-ID").val(),  //身份证
        		"age":$("#custom-age").val(),
        		"birthday":$("#_easyui_textbox_input1").val(),
        		"nation":$("#national").find("option:selected").val(),   //民族
        		"marital":$("#custom-marriage").find("option:selected").val(),   //婚姻
        		"addr":$("#custom-address").val(),     //地址
        		"familyName":$("#custom-Fname").val(), //家属姓名
        		"familyPhone":$("#custom-Fphone").val(),   //家属号码
        		"admissionDate":$("#_easyui_textbox_input2").val(),//入院日期
        		"buildingId":$("#buildingId").find("option:selected").val(),
        		"floorId":$("#floor_name").find("option:selected").val(),
        		"roomId":$("#room_name").find("option:selected").val(),
        		"bedId":$("#bedNum").find("option:selected").val(),       		
        		//"nurseLevleId":$("#custom-sex").find("option:selected").val(),  //护理等级
        		"stationId":$("#service_Station").find("option:selected").val(),    //服务站ID
        		"phone":$("#custom-phone").val()    //联系电话
        	};
        	var watch={
        		//"watchId":$("#customer-number").val(),
        		"IMEI":$("#imeiNum").val(),
        		//"name":$("#customer-number").val(),
          		"phoneNumber":$("#phoneNumber").val(),
        		"type":$("#deviceType").find("option:selected").val(),
        		"sosType":$("#SOStype").find("option:selected").val()       		
        	};
        	var watchSettings={
                "sosNumber-sosName": $("#addSOS").val()
        	};
        	var patientHealth={
        		"bloodType":$("#bloodType").find("option:selected").val(),  //血型
        		"mentalIllness":mentalIllnessflag, //精神病史
        		"disabilityAbility":$("#inputDisable").find("option:selected").val(), //失能情况
        		"disabledPeople":$("#disabled_People").find("option:selected").val(),   //残疾情况
        		"hypertension":hypertensionflag,  //高血压
        		"hyperlipidemia":hyperlipidemiaflag, //高血脂
        		"highBloodSugar":highBloodSugarflag,  //高血糖
        		"highUricAcid":highUricAcidflag,   //高尿酸
        		"otherDiseases":''  //其他慢性病
        	};
        	infoobj={       		     
		     	"patient":JSON.stringify(patient),        		            		     
		     	"patientHealth":JSON.stringify(patientHealth),       		     
		     	"watchSettings":JSON.stringify(watchSettings),
		     	"watch":JSON.stringify(watch)
		    };
		    console.log(JSON.stringify(infoobj));
        	$.ajax({
             url: 'http://192.168.1.45:8082/nursecare/patient/insert.do',
             type: 'POST',
             data:infoobj,
             //xml, html, script, json, jsonp, text
             dataType: 'text',
             timeout: 3000,
             beforeSend: function(XMLHttpRequest) {

             },
             success: function(data, textStatus) {
                 console.log(data);                                 
             },
             error: function(XMLHttpRequest, textStatus, errorThrown) {
                 //timeout也会进入
                 console.log("...失败....");
             },
             complete: function(XMLHttpRequest, textStatus) {
                 if(textStatus === 'timeout') {

                 }
             }
         });
        }
	
		//根据楼栋联动楼层
		$("#buildingId").change(function(){
			getFloors($("#buildingId").find("option:selected").val());
		});
		$("#floor_name").change(function(){
			getRooms($("#floor_name").find("option:selected").val());
		});
		$("#room_name").change(function(){
			getbeds($("#room_name").find("option:selected").val());
		});
		$("#backBtn").click(function(){
			history.go(-1);
		});
		$("#submitInfo").click(function(){
			//alert($("#customer-number").val());
			save_Submit();
		});

    //SOS报警号码添加

     var addtr = function(name,number){
			var length = $("#Ttable tr").length;
			if(length<10){
				alert(length);
			}else{
				alert("超出限制")
				return false;
			}
	        }
     $("#add").click(function(){
         var result1 = $(".sosVal").val();
         addtr(result1);
     });

//        点击input弹出sos报警号列表
     $("#addSOS").click(function () {
         $("#allperson").toggle();
     })
	var listNUm = 2;
		$(".addRow").on("click",function(){		
			var length = $("#Ttable .newTr").length;
			// console.log($(".SOS-change").length);
				if(length<10){
				    var inpitArray = [];
                        $(".SOS-change").each(function (ind,item) {
                            inpitArray.push(item);
                        })
				    var isEmpty = inpitArray.every(function (ele, ind, arr) {
				        return ele.value
                    })
                    if(isEmpty){
                        $("#Ttable").append("<tr class='newTr'><td>"+listNUm+"</td><td><input type='text' class='SOS-change-name SOS-change' value=''/></td><td><input type='text' class='SOS-change-number SOS-change' value='' /></td><td id='switchBtn'><img id='closeBtn' src='../../../img/closeBtn.jpg' style='display: block'/><img id='openBtn' src='../../../img/openBtn.jpg' style='display: none'/></td><td class='deleteTd'><button class='deleteRow'>删除</button></td></tr>");
                    	listNUm=listNUm+1;
                    }else {
                        alert("不能为空");
                    }
				}else{
					alert("只能添加10个sos报警号或者有未填写的选项")
					return false;
				}
			})
		//.SOS-change-number只能为数字
//		$(".SOS-change-number").keyup(function(){$(this).val($(this).val().replace(/[^0-9.]/g, ''));}).bind("paste", function(){}).css("ime-mode", "disabled");
		$(".newTr").on("keyup",".SOS-change-number",function(){
			$(this).val($(this).val().replace(/[^0-9.]/g, ''));
		})

		// //失去焦点 input为不可选中
		//
		// $(".addCase-tab").on("blur",".SOS-change-name",function(){
		// 	$(this).attr("readonly","readonly");
		// 	$(this).css("border","none");
		// })
		// $(".addCase-tab").on("blur",".SOS-change-number",function(){
		// 	$(this).attr("readonly","readonly");
		// 	$(this).css("border","none");
		// })
		//
		//删除
		$("#Ttable").on("click",".deleteRow",function(){
			$(this).parent().parent().remove();
		})
		//修改
		// $(".addCase-tab").on("click",".changeInput",function(){
		// 	$(".SOS-change-name,.SOS-change-number").attr("readonly",false);
		// 	$(".SOS-change-name,.SOS-change-number").css("border","1px solid #595959");
		// })

    //客户编号唯一性验证
    var customer = $("#customer-number");
    $("#customer-number").blur(function(){
        if(customer.val()==""){
            alert("客户编号不能为空");
            customer.attr("required","required");
        }else{
            $.ajax({
                url: window.localStorage["ip:port"]+'/nursecare/patient/checkNum.do',
                type: 'POST',
                data:{num:"num"},
                //xml, html, script, json, jsonp, text
                dataType: 'text',
                timeout: 3000,
                beforeSend: function(XMLHttpRequest) {
                },
                success: function(res) {
                    var resObj = $.parseJSON(res);
                    console.log(resObj);
                    if(resObj.status == "000"){
                    }else{
                        alert("客户编号重复，请重新输入");
                    }
                }

            });
        }
    })
    //身份证号唯一性验证
    var custom = $("#custom-ID");
    $("#custom-ID").blur(function(){
        if(custom.val()==""){
            alert("身份证号码不能为空");
            custom.attr("required","required");
        }else{
            $.ajax({
                url: window.localStorage["ip:port"]+'/nursecare/patient/checkIDCard.do',
                type: 'POST',
                data:{num:"IDCardNum"},
                //xml, html, script, json, jsonp, text
                dataType: 'text',
                timeout: 3000,
                beforeSend: function(XMLHttpRequest) {
                },
                success: function(res) {
                    console.log(res);
                    var resObj = $.parseJSON(res);
                    console.log(resObj);
                    if(resObj.status == "000"){
                    }else{
                        alert("身份证号码重复，请重新输入");
                    }
                }
            });
        }
    })
    //客户联系电话唯一性验证
    var customP = $("#custom-phone");
    $("#custom-phone").blur(function(){
        if(customP.val()==""){
            alert("联系电话不能为空");
            customP.attr("required","required");
        }else{
            $.ajax({
                url: window.localStorage["ip:port"]+'/nursecare/patient/checkPhone.do',
                type: 'POST',
                data:{num:"phone"},
                //xml, html, script, json, jsonp, text
                dataType: 'text',
                timeout: 3000,
                beforeSend: function(XMLHttpRequest) {
                },
                success: function(res) {
                    var resObj = $.parseJSON(res);
                    if(resObj.status == "000"){
                    }else{
                        alert("联系电话重复，请重新输入");
                    }
                }
            });
        }
    })
		patAttr();
	// 查找客户的基础属性字段
	function patAttr() {
        $.ajax({
            url: window.localStorage["ip:port"]+'/nursecare/patAttrDef/list.do',
            type: 'POST',
            //xml, html, script, json, jsonp, text
//          data:{
//          	"cp":cp,
//          	"ps":ps,
//          	"searchmsg":searchmsg
//          },
            dataType: 'text',
            timeout: 3000,
            beforeSend: function(XMLHttpRequest) {

            },
            success: function(patAttr) {
//          	var patAttrData1 =$.parseJSON(patAttr).body;
//          	console.log(patAttrData1);
            	var patAttrData =$.parseJSON(patAttr);
//				console.log(patAttrData);
				$("#attrName1").text(patAttrData.body[0].attrName);
				$("#attrName2").text(patAttrData.body[1].attrName);
				$("#attrName3").text(patAttrData.body[2].attrName);
				$("#attrName4").text(patAttrData.body[3].attrName);
				$("#attrName5").text(patAttrData.body[4].attrName);
				$("#attrName6").text(patAttrData.body[5].attrName);
				$("#attrName7").text(patAttrData.body[6].attrName);
				$("#attrName8").text(patAttrData.body[7].attrName);
				$("#attrName9").text(patAttrData.body[8].attrName);
				$("#attrName10").text(patAttrData.body[9].attrName);
				$("#attrName11").text(patAttrData.body[10].attrName);
				$("#attrName12").text(patAttrData.body[11].attrName);
				$("#attrName13").text(patAttrData.body[12].attrName);
				$("#attrName14").text(patAttrData.body[13].attrName);
				$("#attrName15").text(patAttrData.body[14].attrName);
				$("#attrName16").text(patAttrData.body[15].attrName);
				$("#attrName17").text(patAttrData.body[16].attrName);
				$("#attrName18").text(patAttrData.body[17].attrName);
				$("#attrName19").text(patAttrData.body[18].attrName);
				$("#attrName20").text(patAttrData.body[19].attrName);
				$("#attrName21").text(patAttrData.body[20].attrName);
				$("#attrName22").text(patAttrData.body[21].attrName);
				$("#attrName23").text(patAttrData.body[22].attrName);
				$("#attrName24").text(patAttrData.body[23].attrName);
				$("#attrName25").text(patAttrData.body[24].attrName);
				$("#attrName26").text(patAttrData.body[25].attrName);
				$("#attrName27").text(patAttrData.body[26].attrName);
				$("#attrName28").text(patAttrData.body[27].attrName);
				$("#attrName29").text(patAttrData.body[28].attrName);
				$("#attrName30").text(patAttrData.body[29].attrName);
				$("#attrName31").text(patAttrData.body[30].attrName);
				$("#attrName32").text(patAttrData.body[31].attrName);
				$("#attrName33").text(patAttrData.body[32].attrName);
				$("#attrName34").text(patAttrData.body[33].attrName);
				$("#attrName35").text(patAttrData.body[34].attrName);
			
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    }
	//简单搜索
	geteasySearch();
	function geteasySearch(cp) {
		var searchText = $("#easySearch").val();
		$.ajax({
			url: window.localStorage["ip:port"] + '/nursecare/staff/getStaffLikeName.do',
			type: 'POST',
			//xml, html, script, json, jsonp, text
			data: {
				"cp": cp,
				"ps": "5",
				"searchmsg": searchText
			},
			dataType: 'text',
			timeout: 3000,

			beforeSend: function(XMLHttpRequest) {
		
			},
			success: function(data) {
				$("#pagego").val(cp);
				var easySearchData = $.parseJSON(data);
				$(".totalPage").text("共"+easySearchData.body.totalPage+"页");
				$(".list_num").text("共"+easySearchData.body.totalRec+"条记录");
				$("#last-page").on("click",function(){
						var cp = $("#pagego").val();
						console.log(cp)
						cp = parseInt(easySearchData.body.totalPage);
						console.log(typeof cp)
						geteasySearch(cp);
					})
				$("#first-page").on("click",function(){
						var cp = $("#pagego").val();
						console.log(cp)
						cp = parseInt(easySearchData.body.firstData);
						console.log(typeof cp)
						geteasySearch(cp);
					})
				console.log(easySearchData);
				if(easySearchData.body){
					$(".personGrid").empty();
					var items = easySearchData.body.list;
					for(var i=0;i<items.length;i++){
						$(".personGrid").append("<tr><td><input type='radio' name='personGrid' class='radioChange'></td><td>" + items[i].num + "</td><td>" + items[i].name + "</td><td>" + items[i].birthday + "</td></tr>")
					}
				}
				

		}
	})
}
	$("#next-page").on("click",function(){
		var cp = $("#pagego").val();
		console.log(cp)
		cp = parseInt(cp)+1;
		console.log(typeof cp)
		geteasySearch(cp);
	})
	$("#prev-page").on("click",function(){
		var cp = $("#pagego").val();
		console.log(cp)
		cp = parseInt(cp)-1;
		console.log(typeof cp)
		geteasySearch(cp);
	})
	
	$(".searchName").on("click",function() {
		geteasySearch("1");
	});

	
	//扩展属性
	
		$.ajax({
                url: window.localStorage["ip:port"]+'/nursecare/patient/selectPatEx.do',
                type: 'POST',
                data:{num:"num"},
                //xml, html, script, json, jsonp, text
                dataType: 'text',
                timeout: 3000,
                beforeSend: function(XMLHttpRequest) {
                },
                success: function(data) {
                    var resObj = $.parseJSON(data);
                    console.log(resObj.body);
                    $("#healthInformation").append("<tr id='extend'><td class='contact clear'>扩展信息</td></tr>");
   					$("#extend").append("<tr id='extend_tr'></tr>");
   					$("#extend_tr").append("<td class='extendTd'>"+resObj.body[0].attr_name+"</td><td class='extendInput'><input type='text'></td><td class='extendTd'>"+resObj.body[1].attr_name+"</td><td class='extendInput'><input type='text'></td><td class='extendTd'>"+resObj.body[2].attr_name+"</td><td class='extendInput'><input type='text'></td><td class='extendTd' style='width: 101px;'></td><td class='extendInput'></td>");
   				
                }

            });

	//亲情号按钮
    $("#Ttable").on("click","#switchBtn",function(){
    	if($(this).find("img").eq(0).css("display")=="block"){
    		$(this).find("img").eq(0).css("display","none");
    		$(this).find("img").eq(1).css("display","block")
    	}else{
    		$(this).find("img").eq(1).css("display","none");
    		$(this).find("img").eq(0).css("display","block")
    	}
    })

	$(".personGrid").on("change",".radioChange",function(){
	
			var attendantData = $(this).parent().next().text();
			var attendantName = $(this).parent().next().next().text();
			$(".attendant").val(attendantData+attendantName);
})

		
}