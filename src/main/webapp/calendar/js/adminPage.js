
(function() {

    "use strict";

    let _class = function (){

        let tbHtml = '';
        let modal = null;
        let clickDate = null;
        const todate = new Date();
        let today = todate.getFullYear() + '-' + ('0' + (todate.getMonth() + 1)).slice(-2) + '-' + ('0' + todate.getDate()).slice(-2);


        this.init = function(){
            const calendarEl = document.getElementById('calendar');

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
                                    const bemingDate = new Date(item.beming_date);
                                    const isSunday = bemingDate.getDay() === 0; // 0은 일요일을 나타냅니다.
                                    let isClosed;
                                    if(isSunday){
                                        isClosed = ( item.booking_count > 3 || item.beming_date < today)
                                    }else if (!isSunday) {
                                        isClosed = ( item.booking_count > 3 || item.beming_date < today);
                                    }
                                    const title = isClosed ? '마감' : '예약';
                                    events.push({
                                        start: item.beming_date,
                                        overlap: false,
                                        title: title + ': ' + item.booking_count + '명',
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
                    const selectDay = event.event._instance.range.start;
                    const yyyy = selectDay.getFullYear();
                    const mm = String(selectDay.getMonth() + 1).padStart(2, '0');
                    const dd = String(selectDay.getDate()).padStart(2, '0');
                    clickDate = yyyy+'-'+mm+'-'+dd;

                    getBookingMemberList().done(function () {
                        modalFunction();
                        modal.open();
                    });

                }
            });
            calendar.render();

        }

        function modalFunction(){

            modal = new tingle.modal({
                footer: true,
                stickyFooter: false,
                closeMethods: ['overlay', 'button', 'escape'],
                closeLabel: "Close",
                cssClass: ['custom-class-1', 'custom-class-2'],
                onOpen: function() {
                },
                onClose: function() {
                },
                beforeClose: function() {
                    // here's goes some logic
                    // e.g. save content before closing the modal
                    return true; // close the modal
                    return false; // nothing happens
                }
            });

            // set content
            modal.setContent(tbHtml);

            // add a button
            modal.addFooterBtn('변경등록', 'tingle-btn tingle-btn--primary', function() {
                insertPayData();
                deleteData();
                modal.close();
            });

            modal.addFooterBtn('게스트명 복사', 'tingle-btn tingle-btn--primary', function() {
                copyName();

            });

            // add another button
            modal.addFooterBtn('닫기', 'tingle-btn tingle-btn--danger', function() {
                // here goes some logic
                modal.close();
                window.location.reload();
            });

        }

        function drawBookingTable(data) {
            tbHtml +='<table class="bookingTable">';
            tbHtml +='	<thead>';
            tbHtml +='	<tr>';
            tbHtml +='		<th class="bookingTh">번호</th>';
            tbHtml +='		<th class="bookingTh">게스트명</th>';
            tbHtml +='		<th class="bookingTh">전화번호</th>';
            tbHtml +='		<th class="bookingTh">추천인</th>';
            tbHtml +='		<th class="bookingTh">입금확인</th>';
            tbHtml +='		<th class="bookingTh">삭제</th>';
            tbHtml +='	</tr>';
            tbHtml +='	</thead>';
            tbHtml +='	<tbody>';
            $.each(data, function (index, item) {
                const indexNumber = index + 1;
                const makePhone = item.guest_phone.substring(0,3) + '-' + item.guest_phone.substring(3,7) + '-' + item.guest_phone.substring(7,11);
                const payCheck = item.paydone_yn == 'Y' ? true : false;
                tbHtml +='	<tr>';
                tbHtml +='		<td class="bookingTd">'+indexNumber+'</td>';
                tbHtml +='		<td class="bookingTd guestName">'+item.guest_name+'</td>';
                tbHtml +='		<td class="bookingTd">'+makePhone+'</td>';
                tbHtml +='		<td class="bookingTd">'+item.host_name+'</td>';
                tbHtml +='		<td class="bookingTd">'
                tbHtml +=`          <input type="checkbox" id="payCheak" class="${item.guest_sequence}"  value="${payCheck}" ${payCheck ? "checked" : ""  }/>`;
                tbHtml +='      </td>'
                tbHtml +='		<td class="bookingTd">'
                tbHtml +=`          <input type="checkbox" id="deleteUser" class="${item.guest_sequence}" userName ="${item.guest_name}"/>`;
                tbHtml +='      </td>'
                tbHtml +='	</tr>';
            });
            tbHtml +='	</tbody>';
            tbHtml +='</table>';

            tbHtml +='<div class="bookingNameList" style="font-size: 2em; margin-top: 30px;"></div>';

        }

        function copyName() {
            const copyText = $(".bookingTd.guestName");
            let nameList = '';
            $.each(copyText, function (index, item) {
                const copyName = item.innerText;
                nameList += index+1 + '.' + copyName  + '||';
            });
            $(".bookingNameList").text(nameList);

            //navigator.clipboard.writeText(nameList);

        }

        // /////////////
        // API 리퀘스트 호출 영역
        // /////////////

        function getBookingMemberList() {
            const deffered = $.Deferred();
            $.ajax({
                type: "GET",
                url: "getBookingMemberList",
                data: {book_date : clickDate},
                success: function (data) {
                    const events = [];
                    if (data.SUCCESS) {
                        tbHtml = '';
                        drawBookingTable(data.RESULT);
                        deffered.resolve();
                    } else {
                        alert('예약날짜 가져오기에 실패하였습니다. ');
                    }
                },
                error: function (request, status, error) {
                    alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                }

            })
            return deffered.promise();
        }

        function insertPayData() {
            let payList = [];
            let payData = [];
            const $payEl = $("input#payCheak");
            $.each($payEl, function (index, item) {
                if(item.checked){
                    payList.push(item.className);
                    payData.push('Y');
                }else {
                    payList.push(item.className);
                    payData.push('N');
                }
            });
            console.log(JSON.stringify(payList));
            $.ajax({
                type: "POST",
                url: "updatePayData",
                data: {
                    "payData" : JSON.stringify(payList),
                    "payYn" : JSON.stringify(payData),
                },
                success: function (data) {
                    if (data.SUCCESS) {
                        alert('입금확인 체크가 완료되었습니다.');
                        modal.close();
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

        function deleteData() {
            let deleteList = [];
            const $deleteEl = $("input#deleteUser");
            $.each($deleteEl, function (index, item) {
                if(item.checked){
                    const $userName = item.getAttribute("userName");
                    deleteList.push(item.className);
                }
            });
            console.log(JSON.stringify(deleteList));
            if (deleteList.length > 0 && confirm("체크한 예약건이 삭제됩니다. 삭제하시겠습니까?")) {
                $.ajax({
                    type: "POST",
                    url: "deleteData",
                    data: {
                        "deleteData" : JSON.stringify(deleteList),
                        "clickDate" : clickDate,
                    },
                    success: function (data) {
                        if (data.SUCCESS) {
                            alert('삭제가 완료되었습니다.');
                            modal.close();
                            window.location.reload();
                        } else {
                            alert('삭제에 실패하였습니다.');
                        }
                    },
                    error: function (request, status, error) {
                        alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                    }

                })
            }

        }

    };

    window.adminPage = _class;

})();
