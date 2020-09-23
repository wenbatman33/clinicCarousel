$(function () {
	var ROOM_NUM = 0;
	var switchRoom = 0;
	var currentPatNumber = [];

	var rooms = 0;
	var roomList = [];
	var patLength = [];
	var maxLength = 0;
	var renderItems = 5;
	var showInfo = {};
	var timer = '';
	var loopTime = 5000;
	function reSetVar() {
		ROOM_NUM = 0;
		switchRoom = 0;
		currentPatNumber = [];
		rooms = 0;
		roomList = [];
		patLength = [];
		maxLength = 0;
		renderItems = 5;
		showInfo = {};
	}
	function noneData() {
		// 沒有患者時的顯示方式 30秒後再取資料
		var element = '';
		element += '<li class="noData">目前休診中</li>';
		$('.patientUL').html(element);
		timer = setTimeout(() => {
			getData();
			clearTimeout(timer);
		}, 30000);
	}

	// --------------------
	function getData() {
		reSetVar();
		$.ajax({
			// --------------------
			// url: './assets/json/new_data.json',
			// type: 'get',
			// --------------------
			// url: 'http://10.0.101.132:3000/Api/GeteEmployeeScheduleDataList',
			// url: 'http://192.168.1.3:3000/Api/GeteEmployeeScheduleDataList',
			url: 'http://61.220.95.146:3000/Api/GetRegisteredButNotSeenByRoomDataList',
			data: JSON.stringify({}),
			type: 'post',
			// --------------------
			dataType: 'json',
			contentType: 'application/json;charset=utf-8',
			success: function (res) {
				console.log(res);
				console.log(res.data.length);
				if (res.data.length > 0) {
					init(res);
				} else {
					noneData();
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {},
		});
	}
	function init(res) {
		roomList = res.data;
		rooms = roomList.length;
		roomList.forEach((element) => {
			patLength.push(element.pat.length);
			currentPatNumber.push(0);
		});
		maxLength = Math.max.apply(null, patLength);
		setup();
	}
	function setup() {
		loop();
	}
	function loop() {
		switchRoom = ROOM_NUM % rooms;
		showInfo.room = roomList[switchRoom];
		showInfo.pat = [];
		for (var i = 0; i < renderItems; i++) {
			var temp = roomList[switchRoom].pat[currentPatNumber[switchRoom] + i];
			if (temp) {
				showInfo.pat.push(temp);
			}
		}
		$('.department').html(showInfo.room.SEC_SENAME);
		$('.doctorName').html(showInfo.room.EMP_EMPNAME);
		$('.doctorJobTitle').html('醫師');
		$('.clinicName').html(showInfo.room.SHI_EASYNAME);
		$('.roomName').html(showInfo.room.ROM_RONAME);

		var element = '';
		for (var j = 0; j < showInfo.pat.length; j++) {
			if (showInfo.pat[j]) {
				element += '<li class="patientItem">';
				element += '<span class="id">' + showInfo.pat[j].OCB_VISITNO + '</span>';
				element += '<span class="name">' + showInfo.pat[j].PT_PATNAME + '</span>';
				element += '</li>';
			}
		}
		$('.patientUL').html(element);
		currentPatNumber[switchRoom] += 5;
		ROOM_NUM += 1;

		if (currentPatNumber[switchRoom] > patLength[switchRoom]) {
			currentPatNumber[switchRoom] = 0;
		}
		if (currentPatNumber[switchRoom] >= maxLength && ROOM_NUM >= roomList.length) {
			clearTimeout(timer);
			console.log('輪播結束點');
			getData();
		} else {
			timer = setTimeout(() => {
				loop();
			}, loopTime);
		}
	}
	// /////////////
	getData();
	// /////////////
});
