var queryBtn = document.getElementById('query-button');
var startDate = new QueryDateInput(document.getElementById('start-date'));
var endDate = new QueryDateInput(document.getElementById('end-date'));
var table = document.getElementById('statistics-table');

var recordArr;
var beComputeTagArr = [];

var resultSumObjArr = [];

function QueryDateInput(dateInputEle) {
	this.ele = dateInputEle;
	var today = new Date();
	this.ele.value = today.toISOString().match(/\d{4}-\d{2}-\d{2}/);
}

QueryDateInput.prototype.getDateString = function(){
	var dateInput = this.ele;
	var date = {};
	if(dateInput['valueAsDate']) {
		var dateObj = dateInput.valueAsDate;
		date = {
			year: dateObj.getFullYear(),
			month:dateObj.getMonth()+1,
			day:dateObj.getDate()
		};
	} else {
		var arr = dateInput.value.split(/-|\//);
		date = {
			year: Number(arr[0]),
			month:Number(arr[1]),
			day:Number(arr[2])
		};
	}
	result = date.year+'-'+date.month+'-'+date.day;
	return result;
}

document.body.onclick = function(evt) {
	var ele = evt.target;
	if(ele.name == 'tag') {
		collectTagArr();
		rend(compute());
	}
};

function compute() {
	var resultArr = [];
	for (var i = 0; i < beComputeTagArr.length; i++) {
		var curTagId = beComputeTagArr[i];
		var tmpObj = {};
		tmpObj['tagId'] = curTagId;
		tmpObj['tagName'] = tags[curTagId]; 
		tmpObj['amount'] = sumByTag(curTagId);
		resultArr.push(tmpObj);
	}
	return resultArr;
}

queryBtn.onclick = function(){
	var urlPrefix = '/accountbook/records/'
	var req = new XMLHttpRequest();
	var queryString = '?startdate='+startDate.getDateString()+'&enddate='+endDate.getDateString();
	req.open('get',urlPrefix+queryString);
	req.onreadystatechange = function(evt) {
		if(req.readyState == XMLHttpRequest.DONE) {
			recordArr = JSON.parse(req.responseText).data;
		}
	};
	req.send();
};

function collectTagArr() {
	beComputeTagArr = [];
	var tagList = document.getElementsByName('tag');
	for (var i = 0; i < tagList.length; i++) {
		var tagItem = tagList[i];
		if(tagItem.checked){
			beComputeTagArr.push(Number(tagItem.value));
		}
	}
}

function rend(dataArr) {
	var tbody = table.getElementsByTagName('tbody')[0];	
	table.removeChild(tbody);	
	tbody = document.createElement('tbody');
	for( var i = 0;i<dataArr.length;i++) {
		var tr = document.createElement('tr');
		var curData = dataArr[i];
		var td = document.createElement('td');
		td.textContent = curData['tagName'];
		tr.appendChild(td);
		td = document.createElement('td');
		td.textContent = curData['amount'];
		tr.appendChild(td);
		tbody.appendChild(tr);
	}
	table.appendChild(tbody);
}

function sumByTag(tagId) {
	var result = 0;	
	for (var i = 0; i < recordArr.length; i++) {
		var record = recordArr[i];
		if(record.tag_list.indexOf(tagId)) {
			result += record.amount;
		}
	}
	return result;
}
