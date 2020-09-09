$(function () {
	var baseUrl = 'http://61.220.95.146:3000';
	var patientList;
	var patientAll = 0;
	var current = 0;
	var renderItems = 5;
	var timer;
	var loopTime = 5000;

	function getData() {
		$.ajax({
			url: './assets/data_02.json',
			method: 'get',
		})
			.done(function (res) {
				step2(res);
			})
			.fail(function (err) {
				console.log(err);
			});
	}

	function step2(res) {
		patientList = res.data;
		patientAll = res.data.length;
		loop(current);
	}

	function loop(num) {
		var len = num + renderItems;
		var element = '';
		for (i = num; i < len; i++) {
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
			clearTimeout(timer);
			//  讀取列表尾端時結重新取資料
			getData();
		} else {
			current += renderItems;
		}
		timer = setTimeout(() => {
			loop(current);
		}, loopTime);
	}

	getData();
});
