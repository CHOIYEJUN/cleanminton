<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="CONTEXTPATH" value="${pageContext.request.contextPath}" />

<!-- menu -->
<!DOCTYPE html>
<html>
<head>

	<meta charset='utf-8' />
	<%
		long VERSION = System.currentTimeMillis();

		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Pragma", "no-cache");
		response.setDateHeader("Expires", 0);
	%>

	<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.10/clipboard.min.js"></script>
	<link rel="shortcut icon" href="${CONTEXTPATH}/calendar/img/logo2.jpg" type="image/x-icon">
	<script src="${CONTEXTPATH}/calendar/uis-css-loader.js?v=<%=VERSION%>"></script>
	<script src="${CONTEXTPATH}/calendar/uis-js-loader.js?v=<%=VERSION%>"></script>
	<script src="https://developers.kakao.com/sdk/js/kakao.js"></script>


	<script>
		document.addEventListener('DOMContentLoaded', function() {
			const _self = this;
			const adminPage = new window.adminPage();
			adminPage.init();
		});




	</script>
	<style>

		body {
			margin: 40px 10px;
			padding: 0;
			font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
			font-size: 14px;
		}
		#header {
			text-align: center;
			margin: 0 auto;

		}
		.fc-theme-standard td {
			height:  10%;
			font-size: 1.3em;
		}
		.fc .fc-view-harness {
			padding-bottom: 100.0741% !important;
		}
		.fc .fc-scrollgrid > tbody table {
			height: 1000px; !important;
		}

		#calendar {
			max-width: 1100px;
			margin: 0 auto;
		}
		.fc .fc-button .fc-icon {
			font-size: 3em;
		}

		.fc-direction-ltr .fc-toolbar > * > :not(:first-child){
			font-size: 1.5em;
			padding : 14px;
		}

		.tingle-modal-box {
			width: 80%;
		}

		.gtinput {
			width: 100%;
			height: 50px;
			margin-bottom: 10px;
			border: 1px solid #ccc;
			padding: 0 15px;
			font-size: 16px;
			color: #333;
			-webkit-transition: 0.5s;
			transition: 0.5s;
			outline: none;
		}

		.bookingTable  {
			border-collapse:collapse;
			border-spacing:0;
		}
		.bookingTable td{
			border-color:black;
			border-style:solid;
			border-width:1px;
			font-family:Arial, sans-serif;
			font-size:30px;
			overflow:hidden;
			padding:10px 5px;
			word-break:normal;
			text-align: center;
		}
		.bookingTable th{
			border-color:black;
			border-style:solid;
			border-width:1px;
			font-family:Arial, sans-serif;
			font-size:30px;
			font-weight:normal;
			overflow:hidden;
			padding:10px 5px;
			word-break:normal;
			text-align: center;
		}
		.bookingTable .bookingTh{
			border-color:inherit;
			text-align:center;
			vertical-align:top
		}
		.bookingTable .tg-bookingTd{
			text-align:left;
			vertical-align:top
		}

		#payCheak {
			width: 50px;
			height: 50px;
		}

		#deleteUser {
			width: 50px;
			height: 50px;
		}



	</style>
</head>


<body>
<div id='header'>
	<img src="${CONTEXTPATH}/calendar/img/logo1.jpg"></img>
	<h1>클린민턴 게스트 예약 어드민 페이지</h1>

</div>

<div id='calendar'></div>



</body>
</html>
<!--// footer -->
