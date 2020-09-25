$(function () {
	var timer;
	var renderItems = 5;
	var loopTime = 5000;
	//////////////////////////
	var allRoom = 0;
	var allRoomData = [];
	var roomNum = 0;
	var patNum = 0;
	//////////////////////////
	var currentRoomInfo;
	var currentPatList;
	var tempPatList = [];
	function reSetVar() {
		allRoom = 0;
		allRoomData = [];
		roomNum = 0;
		patNum = 0;
		currentRoomInfo = [];
		currentPatList = [];
	}
	function noneData() {
		// 沒有患者時的顯示方式 30秒後再取資料
		console.log('目前休診中');
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
			// url: './assets/json/new_data3.json',
			// type: 'get',
			// --------------------
			// url: 'http://192.168.1.3:3000/Api/GetRegisteredButNotSeenByRoomDataList',
			// url: 'http://61.220.95.146:3000/Api/GetRegisteredButNotSeenByRoomDataList',
			url: 'http://10.0.101.132:3000/Api/GetRegisteredButNotSeenByRoomDataList',
			data: JSON.stringify({}),
			type: 'post',
			// --------------------
			dataType: 'json',
			contentType: 'application/json;charset=utf-8',
			success: function (res) {
				if (res.Data.length > 0) {
					init(res);
				} else {
					noneData();
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				noneData();
			},
		});
	}
	function init(res) {
		allRoomData = res.Data;
		allRoom = allRoomData.length;
		roomLoop();
	}

	function roomLoop() {
		// //////////////////////////////////////////////////
		showInfoData();
		// //////////////////////////////////////////////////
		patNum += 5;
		// ////////
		if (patNum > currentPatList.length) {
			patNum = 0;
			roomNum += 1;
		}

		if (roomNum >= allRoom) {
			roomNum = 0;
			timer = setTimeout(() => {
				getData();
			}, loopTime);
		} else {
			timer = setTimeout(() => {
				roomLoop();
			}, loopTime);
		}
	}
	function showInfoData() {
		currentRoomInfo = allRoomData[roomNum];
		if (allRoomData[roomNum].PAT) {
			currentPatList = allRoomData[roomNum].PAT;
		} else {
			currentPatList = [];
		}
		// //////////////////////////////////////////////////
		$('.department').html(currentRoomInfo.SEC_SENAME);
		$('.doctorName').html(currentRoomInfo.EMP_EMPNAME);
		$('.doctorJobTitle').html('醫師');
		$('.clinicName').html(currentRoomInfo.SHI_EASYNAME);
		$('.roomName').html(currentRoomInfo.ROM_RONAME);
		// //////////////////////////////////////////////////
		var element = '';
		tempPatList = [];
		if (currentPatList.length > 0) {
			for (var i = 0; i < renderItems; i++) {
				var temp = currentPatList[patNum + i];
				if (temp) {
					tempPatList.push(temp);
				}
			}

			if (tempPatList.length) console.log(tempPatList.length);
			for (var j = 0; j < tempPatList.length; j++) {
				if (tempPatList[j]) {
					element += '<li class="patientItem">';
					element += '<span class="id">' + tempPatList[j].OCB_VISITNO + '</span>';
					element += '<span class="name">' + tempPatList[j].PT_PATNAME + '</span>';
					element += '</li>';
				}
			}
			$('.patientUL').html(element);
		} else {
			console.log('oooooo');
			element += '<li class="patientItem">';
			element += '<li class="noData">目前無人候診</li>';
			element += '</li>';
			$('.patientUL').html(element);
		}
	}
	// /////////////
	getData();
	// /////////////
});
