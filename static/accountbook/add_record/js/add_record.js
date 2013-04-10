window.onload = init;

function init() {

	var dateInput = document.getElementById("record-date");
	var amountInput = document.getElementById("record-amount");
	var recordForm = document.getElementById("record-form");
	var tagCbxs = document.getElementsByName("tag");
	var recordTypeSel = document.getElementById("record-type");
	var commentTxtArea = document.getElementById("record-comment");
	var dateRexp = /\d{4}[-,\/]\d{1,2}[-,\/]\d{1,2}/;
	var numberRexp = /^(\d+\.)?(\d+)$/;

	setDefaultDate();
	recordForm.onsubmit = doSubmit;

	function setDefaultDate() {
		var today = new Date();
		dateInput.value = today.toISOString().match(/\d{4}-\d{2}-\d{2}/);
	}

	function doSubmit() {
		if( validate() ) {
			sendData(collectData());
		}
		return false;
	}

	function validate() {
		if (!dateRexp.test(dateInput.value)) {
			showTip("日期格式不对");			
			return false;
		}
		if (!numberRexp.test(amountInput.value)) {
			showTip("金额因为正确的数字格式");			
			return false;
		}
		if ( commentTxtArea.value.length > 100 ) {
			showTip("备注超出100个字限制");			
			return false;
		}
		collectData();
		return true;	
	}

	function sendData(data) {
		var submitBtn = document.getElementById("submit-btn");
		var key = document.getElementsByName("csrfmiddlewaretoken")[0];
		var url = "/accountbook/add_record_do";
		var req = new XMLHttpRequest();
		var dataString = JSON.stringify(data);
		var vars = '';
		req.onreadystatechange = function(evt) {
			if(req.readyState == XMLHttpRequest.DONE)
			{
				submitBtn.value = "保存完成";
			}
		};
		req.open("post",url)
		vars+="csrfmiddlewaretoken="+key.value;
		vars+="&data="+dataString;
		req.send(vars);
		submitBtn.value = "保存中...";
		submitBtn.disabled = true;
	}

	function showTip(msg) {
		alert(msg);
	}

	function collectData() {
		var data = {};

		if(dateInput['valueAsDate']) {
			var dateObj = dateInput.valueAsDate;
			var date = data.date;
			data['date'] = {
				year: dateObj.getFullYear(),
				month:dateObj.getMonth()+1,
				day:dateObj.getDate()
			};
		} else {
			var arr = dateInput.value.split(/-|\//);
			data['date'] = {
				year: Number(arr[0]),
				month:Number(arr[1]),
				day:Number(arr[2])
			};
		}

		data['amount'] = Number(amountInput.value);
		var tagArr = [];
		for ( var i = 0; i < tagCbxs.length; i++ ) {
			var tagCheckbox = tagCbxs[i];
			if ( tagCheckbox.checked ) {
				tagArr.push(Number(tagCheckbox.value));
			}
		}
		tagArr.push(Number(recordTypeSel.value));
		
		data['tags'] = tagArr;
		data['comment'] = commentTxtArea.value;
		return data;
	}

}
