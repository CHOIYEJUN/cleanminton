(function() {

    "use strict";

    let _class = function (){

        const calendarEl = document.getElementById('calendar');
        const todate = new Date();
        let today = todate.getFullYear() + '-' + ('0' + (todate.getMonth() + 1)).slice(-2) + '-' + ('0' + todate.getDate()).slice(-2);
        let clickDate = null;
        let modal = null;
        // 오늘 날짜
        let now = new Date();
        // UTC 시간 계산
        let utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
        // 한국 시간 계산
        let KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        // 한국 현재 날짜
        let koreaNow = new Date(utc + KR_TIME_DIFF);
        // 한국 현재 시간
        let nowTime = koreaNow.getTime();
        //koreaNow 기준 16시 30 분을 getTime() 으로 계산
        let WeekdaysTime = new Date(koreaNow.getFullYear(), koreaNow.getMonth(), koreaNow.getDate(), 17, 30, 0).getTime();
        //koreaNow 기준 13시 30 분을 getTime() 으로 계산
        let WeekEndTime = new Date(koreaNow.getFullYear(), koreaNow.getMonth(), koreaNow.getDate(), 14, 30, 0).getTime();

        this.init = function(){


            modal = new tingle.modal({
                footer: true,
                stickyFooter: false,
                closeMethods: ['overlay', 'button', 'escape'],
                closeLabel: "Close",
                cssClass: ['custom-class-1', 'custom-class-2'],
                onOpen: function() {
                    $(".textDiv span").on("click", function () {
                        navigator.clipboard.writeText("");
                        alert("계좌번호가 복사되었습니다.")
                    });
                },
                onClose: function() {
                    console.log('modal closed');
                },
                beforeClose: function() {
                    // here's goes some logic
                    // e.g. save content before closing the modal
                    return true; // close the modal
                    return false; // nothing happens
                }
            });

            // set content
            modal.setContent(
                '<div class="inputDiv">' +
                '<h1>클린민턴 게스트 예약</h1>'+
                '<input type="text" class="gtinput" id="name" placeholder="이름을 입력해주세요"/>'+
                '<input type="number" class="gtinputPhone" id="phone1" value="010" placeholder="휴대전화번호 입력"/>'+
                ' <p class="dash"> - </p> '+
                '<input type="number" class="gtinputPhone" id="phone2" placeholder="휴대전화번호 입력"/>'+
                ' <p class="dash"> - </p> '+
                '<input type="number" class="gtinputPhone" id="phone3" placeholder="휴대전화번호 입력"/>'+
                '<input type="text" class="gtinput" id="hostName" placeholder="추천인 기재 (없을 시 미기재)"/>'+
                '</div>' +
                //예약문구
                '<div class="textDiv">' +
                '<p>게스트는 하루 <span>4명</span> 제한입니다.<br> 참여 가능한 날짜에 맞춰서 예약하시고<br>게스트비 <span>5000원</span> 입금하시면 예약 확정됩니다.<br><br> ' +
                '<span>카카오뱅크 3333274382472 김준형</span>' +
                '</p>'+
                '<br>'+
                '<p class = "acceptTerms">' +
                '상기 본인(게스트신청자) 은 클린민턴 정관과, 게스트 이용규칙을 숙지하고 준수하겠으며,<br>' +
                '교내 흡연등 기타 이용규칙을 위반 할 경우, 이에 대한 책임이 발생할 수 있음을 동의하십니까?' +
                '</p>'+
                '<input type="checkbox" id="acceptTermsChack" class="acceptTermsChack" />'+
                '<p class = "acceptText">' +
                '동의합니다' +
                '</p>'+
                '</div>'
            );

            // add a button
            modal.addFooterBtn('등록', 'tingle-btn tingle-btn--primary', function() {
                if($('#name').val() == null || $('#name').val() == ''){
                    alert('이름을 입력해주세요');
                    return;
                }
                if($('#acceptTermsChack').is(":checked") == false){
                    alert('이용규칙에 동의해주세요');
                    return;
                }
                if ($('#phone1').val() == null || $('#phone1').val() == '' || $('#phone2').val() == null || $('#phone2').val() == '' || $('#phone3').val() == null || $('#phone3').val() == '') {
                    alert('휴대전화번호를 입력해주세요');
                    return;
                }
                insertBookingData();
                modal.close();
            });

            // add another button
            modal.addFooterBtn('취소', 'tingle-btn tingle-btn--danger', function() {
                // here goes some logic
                modal.close();
            });

            let calendar = new FullCalendar.Calendar(calendarEl, {
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                },


                initialDate: today,
                //navLinks: true, // can click day/week names to navigate views
                //businessHours: true, // display business hours
                //editable: true,
                events:function (info, successCallback, failureCallback) {
                    $.ajax({
                        type: "GET",
                        url: "getBemingData",
                        data: {},
                        success: function (data) {
                            const events = [];
                            if (data.SUCCESS) {
                                $.each(data.RESULT, function (index, item) {
                                    // 데이터에서 날짜 정보 추출
                                    const bemingDate = new Date(item.beming_date);
                                    //일요일 여부
                                    const isSunday = bemingDate.getDay() === 0;
                                    let isClosed;
                                    // 일요일일때 필터
                                    if(isSunday){
                                        // 일요일 8명초과 마감
                                        isClosed = ( item.booking_count > 3 || item.beming_date < today);
                                        // 일요일일때 14시 30분 이후 예약 마감
                                        if (item.beming_date === today && nowTime >= WeekEndTime ){
                                            isClosed = true;
                                        }
                                    }else if (!isSunday) {
                                        // 평일 4명초과 마감
                                        isClosed = ( item.booking_count > 3 || item.beming_date < today);
                                        // 평일일때 17시 30분 이후 예약 마감
                                        if (item.beming_date === today && nowTime >= WeekdaysTime ){
                                            isClosed = true;
                                        }
                                    }
                                    const title = isClosed ? '예약 마감' : '예약 가능';
                                    events.push({
                                        start: item.beming_date,
                                        overlap: false,
                                        title: title,
                                        display: 'background',
                                        color: isClosed ? '#6c6c6c' : '#7fd983'
                                    });
                                });
                            } else {
                                alert('예약날짜 가져오기에 실패하였습니다. ');
                            }
                            successCallback(events);
                        },
                        error: function (request, status, error) {
                            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                        }

                    })

                }, eventClick:function(event) {
                    if (event.event._def.title !== '예약 마감') {
                        const selectDay = event.event._instance.range.start;
                        const yyyy = selectDay.getFullYear();
                        const mm = String(selectDay.getMonth() + 1).padStart(2, '0');
                        const dd = String(selectDay.getDate()).padStart(2, '0');
                        clickDate = yyyy+'-'+mm+'-'+dd;

                        modal.open();
                    } else {
                        alert('예약이 마감되었습니다.');
                    }
                }
            });
            calendar.render();
        }

        $("#footer h4").on("click", function () {
            navigator.clipboard.writeText("");
            alert("계좌번호가 복사되었습니다.")
        });

        // /////////////
        // API 리퀘스트 호출 영역
        // /////////////

        function insertBookingData() {
            const phone = $("#phone1").val() + $("#phone2").val() + $("#phone3").val();

            $.ajax({
                type: "POST",
                url: "insertBookingData",
                data: {
                    "hostName" : $("#hostName").val(),
                    "name" : $("#name").val(),
                    "phone" : phone,
                    "date" : clickDate
                },
                success: function (data) {
                    if (data.SUCCESS) {
                        alert('예약이 완료되었습니다.');
                        modal.close();
                        sendmessage();
                        window.location.reload();

                    } else {
                        alert('예약에 실패하였습니다.');
                    }
                },
                error: function (request, status, error) {
                    alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                }

            })
        }

        function sendmessage (){
// REST API Key
            const apiKey = "bf62df502cb3f0b850269201a37a93e0";

// 보내는 사람의 카카오톡 계정
            const sender = "dpwns108";

// 메시지 템플릿
            const template = {
                "object_type": "text",
                "text": "전송할 메시지를 입력하세요",
                "link": {
                    "web_url": "http://www.example.com",
                    "mobile_web_url": "http://m.example.com",
                },
            };

// 받는 사람의 전화번호
            const receiver = "01055568270";

// HTTP 요청을 보내기 위한 URL
            const url = "https://kapi.kakao.com/v2/api/talk/memo/default/send";

// HTTP 요청 헤더
            const headers = {
                "Authorization": "Bearer " + apiKey,
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            };

// HTTP 요청 바디
            const data = {
                "template_object": JSON.stringify(template),
                "receiver_uuids": `[{"puuid": "${receiver}"}]`,
                "sender_key": sender,
            };

// HTTP 요청 보내기
            $.ajax({
                type: "POST",
                url: url,
                headers: headers,
                data: data,
                success: function(response) {
                    console.log(response);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                }
            });

        }

    };

    window.custumer = _class;

})();
