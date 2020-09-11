$(function () {
	var baseUrl = 'http://61.220.95.146:3000';
	// var baseUrl = 'http://192.168.1.3:3000';
	var roomDataList;
	var roomDataLength;
	var patientList;

	var patientAll = 0;
	var current = 0;
	var renderItems = 5;
	var timer;
	var loopTime = 5000;

	function getRoomData() {
		$.ajax({
			// --------------------
			// url: './assets/json/data_01.json',
			// type: 'get',
			// --------------------
			url: 'http://61.220.95.146:3000/Api/GeteEmployeeScheduleDataList',
			data: JSON.stringify({}),
			type: 'post',
			// --------------------
			dataType: 'json',
			contentType: 'application/json;charset=utf-8',
			success: function (returnData) {
				showRoomData(returnData);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				$('.department').html('尚無資料');
				$('.doctor').html('尚無資料');
				$('.clinic').html('尚無資料');
			},
		});
	}

	function getData() {
		$.ajax({
			// --------------------
			// url: './assets/json/data_02.json',
			// type: 'get',
			// --------------------
			url: 'http://61.220.95.146:3000/Api/GetRegisteredButNotSeenDataList',
			data: JSON.stringify({}),
			type: 'post',
			// --------------------
			dataType: 'json',
			contentType: 'application/json;charset=utf-8',
			success: function (returnData) {
				showData(returnData);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				var element = '';
				element += '<li class="noData">';
				element += '<span>尚無資料</span>';
				element += '</li>';
				$('.patientUL').html(element);
			},
		});
	}

	function showRoomData(res) {
		roomDataList = res.data;
		roomDataLength = res.data.length;
		var currentTime = dayjs().format('YYYY/MM/DD HH:mm:ss');
		var today = dayjs().format('YYYY/MM/DD');

		for (j = 0; j < roomDataLength; j++) {
			var sTime = today + ' ' + roomDataList[j].SHI_TIME_S + ':00';
			var eTime = today + ' ' + roomDataList[j].SHI_TIME_E + ':59';
			if (dayjs(currentTime).isAfter(dayjs(sTime)) && dayjs(currentTime).isBefore(dayjs(eTime))) {
				var tiemGap = dayjs(eTime).valueOf() - Date.now();
				// 緩衝65秒
				tiemGap += 65000;
				setTimeout(() => {
					getRoomData();
				}, tiemGap);

				$('.department').html(roomDataList[j].SEC_SENAME);
				$('.doctor').html(roomDataList[j].EMP_EMPNAME);
				$('.clinic').html(roomDataList[j].ROM_RONAME);
			}
		}
	}

	function showData(res) {
		patientList = res.data;
		patientAll = res.data.length;

		if (patientAll > 0) {
			loop(current);
		} else {
			noPatient();
		}
	}

	function loop(num) {
		var persons = num + renderItems;
		var element = '';
		for (i = num; i < persons; i++) {
			if (patientList[i]) {
				element += '<li class="patientItem">';
				element += '<span class="id">' + patientList[i].OCB_ROOMNO + '</span>';
				element += '<span class="name">' + patientList[i].PT_PATNAME + '</span>';
				element += '</li>';
			}
		}
		$('.patientUL').html(element);
		if (current >= patientAll) {
			current = 0;
			//  讀取列表尾端時結重新取資料
			timer = setTimeout(() => {
				getData();
				clearTimeout(timer);
			}, loopTime);
		} else {
			current += renderItems;
		}
		timer = setTimeout(() => {
			loop(current);
		}, loopTime);
	}
	function noPatient(num) {
		// 沒有患者時的顯示方式 10秒後再取資料
		var len = num + renderItems;
		var element = '';
		element += '<li class="noData">目前無人候診</li>';
		$('.patientUL').html(element);
		timer = setTimeout(() => {
			getData();
			clearTimeout(timer);
		}, 10000);
	}

	getData();
	getRoomData();
});
