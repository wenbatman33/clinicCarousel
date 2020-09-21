$(function() {
  var roomDataList;
  var roomDataLength;
  var patientList;

  var patientAll = 0;
  var current = 0;
  var renderItems = 5;
  var timer;
  var loopTime = 5000;
  var roomArray = [];
  var roomList_1 = [];
  var roomList_2 = [];
  var roomList_3 = [];

  function getRoomData() {
    console.log('getRoomData');
    $.ajax({
      // --------------------
      url: './assets/json/data_01.json',
      type: 'get',
      // --------------------
      // url: 'http://10.0.101.132:3000/Api/GeteEmployeeScheduleDataList',
      // url: 'http://192.168.1.3:3000/Api/GeteEmployeeScheduleDataList',
      // data: JSON.stringify({}),
      // type: 'post',
      // --------------------
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      success: function(returnData) {
        showRoomData(returnData);
      },
      error: function(xhr, ajaxOptions, thrownError) {
        $('.department').html('尚無資料');
        $('.doctor').html('尚無資料');
        $('.clinic').html('尚無資料');
      },
    });
  }

  function breakTime() {
    roomDataList = [];
    roomDataLength = 0;
    patientList = [];
    patientAll = 0;
    current = 0;
    roomArray = [];

    $('.department').html('');
    $('.doctor').html('休診中');
    $('.clinic').html('');

    var element = '';
    element += '<li class="noData">目前無人候診</li>';
    $('.patientUL').html(element);
    clearTimeout(timer);

    // 三十秒輪播
    setTimeout(() => {
      getRoomData();
    }, 30000);
  }

  function getData() {
    console.log('getData');
    $.ajax({
      // --------------------
      url: './assets/json/data_02.json',
      type: 'get',
      // --------------------
      // url: 'http://10.0.101.132:3000/Api/GetRegisteredButNotSeenDataList',
      // url: 'http://192.168.1.3:3000/Api/GetRegisteredButNotSeenDataList',
      // data: JSON.stringify({}),
      // type: 'post',
      // --------------------
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      success: function(returnData) {
        showData(returnData);
      },
      error: function(xhr, ajaxOptions, thrownError) {
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
    roomArray = [];
    var currentTime = dayjs().format('YYYY/MM/DD HH:mm:ss');
    var today = dayjs().format('YYYY/MM/DD');
    var sTime, eTime;

    for (j = 0; j < roomDataLength; j++) {
      sTime = today + ' ' + roomDataList[j].SHI_TIME_S;
      eTime = today + ' ' + roomDataList[j].SHI_TIME_E;
      if (dayjs(currentTime).isAfter(dayjs(sTime)) && dayjs(currentTime).isBefore(dayjs(eTime))) {
        roomArray.push(1);
        $('.department').html(roomDataList[j].SEC_SENAME);
        console.log(roomDataList[j].SEC_SENAME);
        $('.doctorName').html(roomDataList[j].EMP_EMPNAME);
        $('.doctorJobTitle').html('醫師');
        $('.clinicName').html(roomDataList[j].SHI_EASYNAME);
        $('.roomName').html(roomDataList[j].ROM_RONAME);
        var now = dayjs();
        var endTime = dayjs(eTime);
        var gapTime = endTime.diff(now);
        console.log(gapTime);

        // //////////////////////////
        getData()
        // //////////////////////////
        setTimeout(() => {
          console.log('rest');
          getRoomData();
        }, gapTime + 1000);

      } else {
        roomArray.push(0);
      }
    }
    if (roomArray.indexOf(1) < 0) {
      breakTime();
    }
  }

  function showData(res) {
    patientList = res.data;
    patientAll = res.data.length;
    roomList_1 = [];
    roomList_2 = [];
    roomList_3 = [];
    patientList.forEach(element => {
      if (element.SHI_SHIFTNO == 1) {
        roomList_1.push(element);
      } else if (element.SHI_SHIFTNO == 2) {
        roomList_2.push(element);
      } else if (element.SHI_SHIFTNO == 3) {
        roomList_3.push(element);
      }
    });
    console.log(roomList_1);
    console.log(roomList_2);
    console.log(roomList_3);
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
        element += '<span class="id">' + patientList[i].OCB_VISITNO + '</span>';
        element += '<span class="name">' + patientList[i].PT_PATNAME + '</span>';
        element += '</li>';
      }
    }
    $('.patientUL').html(element);
    console.log('current: ' + current);
    console.log('patientAll: ' + patientAll);
    if (current >= patientAll) {
      //  讀取列表尾端時結重新取資料
      current = 0;
      clearTimeout(timer);
      getData();
    } else {
      current += renderItems;
    }
    timer = setTimeout(() => {
      loop(current);
    }, loopTime);
  }

  function noPatient(num) {
    // 沒有患者時的顯示方式 10秒後再取資料
    var element = '';
    element += '<li class="noData">目前無人候診</li>';
    $('.patientUL').html(element);
    timer = setTimeout(() => {
      getData();
      clearTimeout(timer);
    }, 10000);
  }

  getRoomData();
});