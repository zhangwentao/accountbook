window.onload = function() {

	var queryDateInput = document.getElementById("query-date");
	var dateRexp = /\d{4}[-,\/]\d{1,2}[-,\/]\d{1,2}/;
	var refreshBtn = document.getElementById("refresh-btn");
	var recordTable = document.getElementById("record-table");	
	var recordCaption = document.getElementById("table-caption"); 
	var win = document.getElementById("prompt-window");
	var resultDateText = "";

	var hint = {
		msgContainer: document.getElementById("hint"),
		display: function (isShow) {
			if(isShow) {
				this.msgContainer.classList.remove('hide');
			} else {
				this.msgContainer.classList.add('hide');
			}
		},
		setMsg: function (msgString) {
			this.msgContainer.textContent = msgString;
		},
		setAll: function (isShow, msgString) {
			this.display(isShow);
			this.setMsg(msgString);
		}
	};

	var dialog = {
		dialogElt: document.getElementById("prompt-window"),
		show: function() {
			this.dialogElt.style.display = "block";
			document.body.onclick = this.handleClick;
		},
		hide: function() {
			this.dialogElt.style.display = "none";
			document.body.onclick = null;
		},
		setHtml: function(htmlText) {
			this.dialogElt.innerHTML = htmlText;
		},
		handleClick: function(evt) {
			if (evt.target != win) {
				console.log(evt);
				dialog.hide();
			}
		}
	};

	setDefaultDate();
	sendData(collectData());

	refreshBtn.onclick = queryDateInput.onchange = function() {
		sendData(collectData());
	}

	function setDefaultDate() {
		var today = new Date();
		queryDateInput.value = today.toISOString().match(/\d{4}-\d{2}-\d{2}/);
	}

	function validate() {
		if (!dateRexp.test(queryDateInput.value)) {
			showTip("日期格式不对");			
			return false;
		}
		return true;
	}

	function collectData() {
		var data = {};
		if(queryDateInput['valueAsDate']) {
			var dateObj = queryDateInput.valueAsDate;
			var date = data.date;
			data['date'] = {
				year: dateObj.getFullYear(),
				month:dateObj.getMonth()+1,
				day:dateObj.getDate()
			};
		} else {
			var arr = queryDateInput.value.split(/-|\//);
			data['date'] = {
				year: Number(arr[0]),
				month:Number(arr[1]),
				day:Number(arr[2])
			};
		}
		return data;
	}

	function sendData(data) {
		recordTable.classList.add("hide");
		hint.setAll(true, "正在查询...");
		var url = "/accountbook/records/"
		var req = new XMLHttpRequest();
		var date = data['date'];
		req.onreadystatechange = function(evt) {
			if(req.readyState == XMLHttpRequest.DONE) {
				queryDateInput.disabled = false;
				renderTable(JSON.parse(req.responseText));
			}
		};
		resultDateText = date['year']+'-'+date['month']+'-'+date['day'];
		req.open("get",url+resultDateText+'/');
		req.send();
		queryDateInput.disabled = true;
	}

	function renderTable(result) {
		var data = result['data'];
		var tbody = document.createElement("tbody");	
		var total = 0;
		if ( data.length == 0 ) {
			hint.setAll(true, "没有"+resultDateText+" 的记录");
		} else {
			hint.display(false);
			recordCaption.textContent = resultDateText + "日账单";
			for( var i = 0; i < data.length; i++ ) {
				var curData = data[i];
				var tr = document.createElement("tr");
				tr.recordData = curData;
				var numTd = document.createElement("td");
				numTd.textContent = i+1; 
				var amountTd = document.createElement("td");
				amountTd.textContent = curData['amount'];
				total += curData['amount'];
				var tagTd = document.createElement("td");
				tagTd.textContent = curData['tag_list'].toString();
				tr.appendChild(numTd);
				tr.appendChild(amountTd);
				tr.appendChild(tagTd);
				tr.onclick = function(evt){
					evt.stopPropagation();	
					showRecordDetail(this);
				};
				tbody.appendChild(tr);
			}
			var tr = document.createElement("tr");
			var th = document.createElement("th");
			th.textContent = '总额';
			var td = document.createElement("td");
			td.textContent = total;
			tr.appendChild(th);
			tr.appendChild(td);
			tbody.appendChild(tr);
			recordTable.removeChild(recordTable.getElementsByTagName('tbody')[0]);
			recordTable.appendChild(tbody);
			recordTable.classList.remove("hide");
		}
	}

	function showRecordDetail(tr) {
		var dataObj = tr.recordData;
		var resultHtml =	'<h3>账单详情</h3>' +
							'<ul>' +
								'<li>金额: ' + dataObj['amount'] + '<li>' +
								'<li>标签: ' + dataObj['tag_list'] + '<li>' + 
								'<li>备注:' + dataObj['detail'] + '<li>' + 
							'</ul>' +
							'<p><a href="###" id="del-record-btn">删除这个条记录</a></p>';
		dialog.setHtml(resultHtml);
		var delRecordBtn = document.getElementById('del-record-btn');
		delRecordBtn.onclick = function() {
			delRecordById(dataObj['id'],function(){
				var tbody = recordTable.getElementsByTagName('tbody')[0];	
				tbody.removeChild(tr);
			});
		};
		dialog.show();
	}

	function delRecordById(recordId,callback) {
		var urlPrefix = '/accountbook/records/';
		var req = new XMLHttpRequest();
		req.open('DELETE',urlPrefix+recordId);
		req.onreadystatechange = function(evt) {
			if(req.readyState == XMLHttpRequest.DONE) {
				var data = JSON.parse(req.responseText);
				if(data['code'] == 0) {
					callback();
					dialog.hide();
				}	
			}
		};
		req.send();
	}
}
