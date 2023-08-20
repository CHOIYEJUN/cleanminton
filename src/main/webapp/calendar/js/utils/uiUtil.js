$(function() {
	"use strict";

	var _class = {

			cachedScript : function(url) {
				var opts = {
					dataType: "script",
					cache: true,
					url: url
				};

				return $.ajax(opts);
			},

			load: function($id, url) {
				var deferred = $.Deferred();

				if ($($id).length == 0) {
					console.log("[" + $id + "] is null");
					deferred.resolve();
				} else {
					$($id).load(url, function(a, b) {
						deferred.resolve();
					});
				}

				return deferred.promise();
			},

			commonTab : function(parentTab, tabNum){
				$("." + parentTab + " ul.tabs li").removeClass("on");
				$("." + parentTab + " ul.tabs li." + tabNum).addClass("on");
				$("." + parentTab + " .tabcontents").removeClass("on");
				$("." + parentTab + " .tabcontents." + tabNum).addClass("on");

			},

			modalTab : function(parentTab, commonTabCls, tabNum){
				var $tab = $("." + parentTab);
				$tab.find("ul li").removeClass("on");
				$tab.find("ul li." + tabNum).addClass("on");

				var $content = $("." + commonTabCls + "." + tabNum);
				$("." + commonTabCls).removeClass("on");
				$content.addClass("on");
			},

			sessionLogout: function(){
				// var url = o2.config.O2Properties.CONTEXTPATH + '/user/logout.do';

				o2.utils.Http.requestData('/user/logout.do', {}, {method: 'GET'}).done(function() {
					var agent = navigator.userAgent.toLowerCase();
					if(agent.indexOf("msie") != -1 || agent.indexOf('trident') != -1){	//IE
						window.open('','_self').close();
					}else{	//chrome
						open("about:blank", '_self').close();
					}
				})
			},

			msgBox: function(msg, type, interval) {

				if (msg == null
						|| msg == "") {
					return;
				}

				var msgBox = null;
				if (type != undefined) {
					if (type == "info") {
						msgBox = toastr.info;
					} else if (type == "error") {
						msgBox = toastr.error;
					} else if (type == "alert"){
						msgBox = toastr.warning;
					} else if (type == "success"){
						msgBox = toastr.success;
					} else {
						msgBox = toastr.warning;
					}
				} else {
					msgBox = toastr.info;
				}

				msgBox(msg);
			},

			msgText: function(msg, type, interval) {

				$(".btm-area").removeClass("error-msg");
				$(".btm-area").removeClass("alert-msg");

				if (interval == undefined) {
					interval = 5000;
				}

				if (type != undefined) {
					if (type == "error") {
						$(".btm-area").addClass("error-msg");
					} else if (type == "alert"){
						$(".btm-area").addClass("alert-msg");
					}
				}

				setTimeout(function(){

					$(".btm-area").removeClass("error-msg");
					$(".btm-area").removeClass("alert-msg");
					$(".btm-area h4").text("");

				}, interval);

				$(".btm-area h4").text(msg);
			},

			/*
			 * btnOpt
			 * 	<Object> confirm
			 * 		<String> name : 확인 버튼 이름
			 *
			 * option
			 * 	<String> title
			 * 	<Integer> width
			 * */
			alert: function (msg, btnOpt, option) {

				// TODO : alert 디자인
				var $confirmPop = $("#alert_popup");
				var url = o2.config.O2Properties.CONTEXTPATH + "uis/html/common/alert.html";
				var defBtnOpt = {
						confirm: {
							name: "확인"
						}
				};
				var defOption = {
						title: "경고",
						width: 250
				};

				o2uis.utils.UIUtil.load($confirmPop, url).done(function(){

					btnOpt = Object.assign(defBtnOpt, btnOpt);
					option = Object.assign(defOption, option);

					// 초기화
					$confirmPop.find(".title").text(option.title);
					$confirmPop.find(".alert_msg").html(msg);
					$confirmPop.find(".alert_btn_ok").text(btnOpt.confirm.name);
					$confirmPop.find(".pop-box").css("width", option.width);

					$confirmPop.addClass("active");

					// 확인 이벤트
					$confirmPop.find(".alert_btn_ok").on("click", function(){
						$confirmPop.modal("hide");
					});

					$confirmPop.on('hidden.bs.modal', function () {
					    $(this).data('bs.modal', null);
						$confirmPop.removeClass("active");
					});

					$confirmPop.modal({
						backdrop: false,
						keyborard: false
					});
				});
			},

			/*
			 * btnOpt
			 * 	<Object> cancel
			 * 		<String> name : 취소 버튼 이름
			 * 		<function> callback: 완료 후 호출 함수
			 * 		<Object> callbackParam : callBackParam
			 * 	<Object> confirm
			 * 		<String> name : 확인 버튼 이름
			 * 		<function> callback: 완료 후 호출 함수
			 * 		<Object> callbackParam : callBackParam
			 *
			 * option
			 * 	<String> title
			 * 	<Integer> width
			 *
			 * */
			confirm: function (msg, btnOpt, option) {

				var $confirmPop = $("#confirm_popup");

				var url = o2.config.O2Properties.CONTEXTPATH + "uis/html/common/confirm.html";
//				if(btnOpt.confirm.callback.name == "sessionLogout"){ //로그아웃 confirm창인 경우
//				}
				if(msg.indexOf('로그아웃') != -1){ //로그아웃 confirm창인 경우
					url = o2.config.O2Properties.CONTEXTPATH + "uis/html/common/logoutConfirm.html";
				}
				var defBtnOpt = {
						cancel: {
							name: "취소"
						},
						confirm: {
							name: "확인"
						}
				};
				var defOption = {
						title: "확인",
						width: 250
				};

				o2uis.utils.UIUtil.load($confirmPop, url).done(function(){

					btnOpt = Object.assign(defBtnOpt, btnOpt);
					option = Object.assign(defOption, option);

					// 초기화
					$confirmPop.find(".title").text(option.title);
					$confirmPop.find(".confirm_msg").html(msg);
					$confirmPop.find(".confirm_btn_cancel").text(btnOpt.cancel.name);
					$confirmPop.find(".confirm_btn_ok").text(btnOpt.confirm.name);
					$confirmPop.find(".pop-box").css("width", option.width);

					$confirmPop.addClass("active");

					// 취소 이벤트
					$confirmPop.find(".confirm_btn_cancel").on("click", function(){
						if (btnOpt.cancel.callback) {
							if (btnOpt.cancel.callbackParam) {
								btnOpt.cancel.callback(btnOpt.cancel.callbackParam);
							} else {
								btnOpt.cancel.callback();
							}
						}

						$confirmPop.hide();
						$confirmPop.empty();
					});

					// 확인 이벤트
					$confirmPop.find(".confirm_btn_ok").on("click", function(){
						if (btnOpt.confirm.callback) {
							if (btnOpt.confirm.callbackParam) {
								btnOpt.confirm.callback(btnOpt.confirm.callbackParam);
							} else {
								btnOpt.confirm.callback();
							}
						}

						$confirmPop.hide();
						$confirmPop.empty();
					});

					// 닫기 이벤트
					$confirmPop.find(".close").on("click", function(){

						$confirmPop.hide();
						$confirmPop.empty();
					});

					$confirmPop.show();

//					$confirmPop.on('hidden.bs.modal', function () {
//					    $(this).data('bs.modal', null);
//						$confirmPop.removeClass("active");
//					});
//
//					$confirmPop.modal({
//						backdrop: false,
//						keyborard: false
//					});
				});
			},

			getSerializeFormObject: function(targetUI,form){
				var target = targetUI.find(form);
				var disabled = target.find(':disabled').removeAttr('disabled');
				var param = target.serializeObject();
				disabled.attr('disabled', 'disabled');

				var $datePickers = targetUI.find('input[ui="datepicker"]');
				$datePickers.each(function(index, item){
					param[this.id] = this.value.split("-").join("");
				});

				return param;
			},

			//연계 공통 함수
			setSerializeFormObject: function(targetUI,val,code){

				var deferred = $.Deferred();

				$.each(val, function(colNm, value){

	                var typeInput  = targetUI.find('#'+colNm).is("input");
	                var typeSelect = targetUI.find('#'+colNm).is("select");
	                var typeSpan  = targetUI.find('#'+colNm).is("span");

	                if(typeInput){
	                	if(colNm == "IST_YMD"){
	                       var date = value.substr(0, 4)+"-"+value.substr(4, 2)+"-"+value.substr(6, 2);
	                       targetUI.find('#'+colNm).val(date);
	                    }else if(colNm == "SYS_CHK"){
	                       if(value == '1'){
	                          targetUI.find('#'+colNm).attr('checked', 'checked');
	                       }
	                    }else{
	                    	targetUI.find('#'+colNm).val(value);
	                    }
	                 }

	                 if(typeSelect){
	                    targetUI.find('select[id='+colNm+'] option[value=' + value + ']').attr('selected', 'selected');
	                 }

	                if(typeSpan){
	                	if (code != undefined) {
	                		$.each(code, function(i, codeVal){
								if(codeVal.GRP_CD_VAL == colNm && codeVal.CD_VAL == value) {
									targetUI.find('#'+colNm).text(codeVal.CD_NM);
									return false;
								} else {
									targetUI.find('#'+colNm).text(value);
								}
							})
						} else {
							targetUI.find('#'+colNm).text(value);
						}
	                }

					deferred.resolve(true);
	        	});

				return deferred.promise();
			},

			// KRAS 공통 함수 숫자 또는 영어 코드명  >> 한글명
			switchToKrasCode : function(valNm, value, code){
				var data = '';

				$.each(code, function(i, codeVal){
					if (valNm == codeVal.GRP_CD_VAL && value == codeVal.CD_VAL) {
						data = (codeVal.CD_NM == undefined) ? '' : codeVal.CD_NM;
						return false;
					} else {
						data = (value == undefined) ? '' : value.valNm;
					}
				});

				return data;
			},


			//연계 공통 함수
			setSerializeFormObjectList: function(targetUI,val,code){
				var html = '';

				if (val == "undefind") {
					console.log(val)
				} else {
					if (val.length == undefined) {
						for(var i=0; i < 1; i++){  // val이 list로 받아와져야 하는데 값이 한개일땐 배열로 받아오지않아서 length가 안잡힘
							if (cs_id != null) {
								html += '<tr data-id='+cs_id+'>';
							} else {
								html += '<tr>';
							}

							$.each(val, function(colNm, value){
								html += '<td>'+value+'</td>';
				        	});
							html += '</tr>';
						}
					} else {
						for(var i=0; i < val.length; i++){
							if (cs_id != null) {
								html += '<tr data-id='+cs_id+'>';
							} else {
								html += '<tr>';
							}

							$.each(val[i], function(colNm, value){
								html += '<td>'+value+'</td>';
				        	});
							html += '</tr>';
						}
					}
				}
				targetUI.append(html);

				return true;
			},

			//KRAS 공통 함수
			krasExcelDownload: function(param,keyArr,title){
				try {
//					debugger
					var _url = '';
					var formData = new FormData();
					formData.append("param", JSON.stringify(param));
					formData.append("keyArr", JSON.stringify(keyArr));

					if (keyArr == "KRAS000032") {
						_url = o2.config.O2Properties.CONTEXTPATH + "cntc/kras/excel/getExcelDownload_T.do";
					} else if (keyArr == "KRAS000030"){
						_url = o2.config.O2Properties.CONTEXTPATH + "cntc/kras/excel/getExcelDownload_T.do";
					} else {
						_url = o2.config.O2Properties.CONTEXTPATH + "cntc/kras/excel/getExcelDownload.do";
					}

					var xhr = new XMLHttpRequest();
					xhr.open('POST', _url, true);
					xhr.responseType = 'blob';

					xhr.onload = function(e) {
						if (xhr.status === 200 && xhr.response.size !== 0) {
							download(xhr.response, title+".xlsx", "application/octect-stream;charset=UTF-8");
						}
					}
					xhr.send(formData);
				} catch (e) {
					toastr.error(e.toString() + "::error");
				}
				return true;
			},

			//cntc 공통 함수 (seum,saeall,upis)
			cntcExcelDownload: function(param,keyArr,title,service){
				try {
					var formData = new FormData();
					formData.append("param", JSON.stringify(param));
					formData.append("keyArr", JSON.stringify(keyArr));

					var _url = '';

					if (service == "SEUMSERVICE000001") {
						_url = o2.config.O2Properties.CONTEXTPATH + "cntc/seum/bildngPrmisnRegstr/getExcelDownload.do";
					} else if (service == "SEUMSERVICE000002"){
						_url = o2.config.O2Properties.CONTEXTPATH + "cntc/seum/bildRegstr/getExcelDownload.do";
					} else if (service == "SEUMSERVICE000003"){
						_url = o2.config.O2Properties.CONTEXTPATH + "cntc/seum/houseRegstr/getExcelDownload.do";
					} else if (service == "SEUMSERVICE000004"){
						_url = o2.config.O2Properties.CONTEXTPATH + "cntc/seum/imprmnBsns/getExcelDownload.do";
					} else if (service == "SAEALL") {
						_url = o2.config.O2Properties.CONTEXTPATH + "cntc/saeall/getExcelDownload.do";
					} else if (service == "UPISSERVICE000001") {
						_url = o2.config.O2Properties.CONTEXTPATH + "cntc/upis/devlopActionPrmisn/getExcelDownload.do";
					} else if (service == "UPISSERVICE000002") {
						_url = o2.config.O2Properties.CONTEXTPATH + "cntc/upis/ctyNtfcInfo/getExcelDownload.do";
					}

					var xhr = new XMLHttpRequest();
					xhr.open('POST', _url, true);
					xhr.responseType = 'blob';

					xhr.onload = function(e) {
						if (xhr.status === 200 && xhr.response.size !== 0) {
							download(xhr.response, title+".xlsx", "application/octect-stream;charset=UTF-8");
						}
					}
					xhr.send(formData);
				} catch (e) {
					toastr.error(e.toString() + "::error");
				}
				return true;
			},

			// 개인정보 마스킹
			cntcMaskingEvent : function(data, type){
				var value = '';

				if (type == 'NAME') {
					value = data.substring(0,1);
					for(var i=0; i < data.length-1; i++){
						value += "*";
					}

				} else if(type == "TEL") {
					//var pattern = "(\\d{2,3})(\\d{3,4})(\\d{4})$";
					// 미완성 * 전화번호 쓰이는곳이없어서 미완성

				} else if(type == "REGNO"){ //인허가정보 > 등록번호(ex. 소유자등록번호)
					if(data.indexOf("-") == -1){ // -가 없는 경우(현재 문자길이의 30%만 보여줌)
//                        var viewStrLength = Math.round(data.length * 0.3); //보여줄 문자열 길이
//                        var hideStrLength = data.length - viewStrLength; //숨길 문자열 길이
//
//                        value = data.substring(0,viewStrLength);
//                        for(var i=0; i<data.length - viewStrLength; i++){ //보여줄 문자열 뒤에 있는 문자만큼 *표시
//                        	value += "*";
//						}

						//앞에 6자리만 보여줌
						if(data.length <= 6){
                            value = data;
						} else {
							var showStrLength = 6; //보여줄 자릿 수

							value = data.substring(0,showStrLength);
							for(var i=0; i<data.length - showStrLength; i++){
								value += "*";
							}
						}

            		} else { // -가 있는 경우(첫번째 - 뒤로 문자길이만큼 *처리)
            		    var firstFindIndex = data.indexOf('-')+1; //-가 있는 위치
            		    var elseStrLength = data.length - firstFindIndex; //-뒤에 있는 문자열 길이
            		    value = data.substring(0,firstFindIndex);

            		    for(var i=0; i<elseStrLength; i++){ //-뒤에 있는 문자열 길이만큼 *표시
            		    	value += "*";
            		    }
            		}

				}
				return value;
			}
	}

	// 2020.02.07 mskim 추가
	jQuery.fn.serializeObject = function() {
	    var obj = null;
	    try {
	        if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
	            var arr = this.serializeArray();
	            if (arr) {
	                obj = {};
	                jQuery.each(arr, function() {
	                    obj[this.name] = this.value;
	                });
	            }
	        }
	    } catch (e) {
	    	o2uis.utils.UIUtil.msgBox(e.message, "alert");
	    } finally {
	    }

	    return obj;
	};

	o2.calendar.utils = $.extend(o2.calendar.utils || {}, {
		UIUtil : _class
	});

});
