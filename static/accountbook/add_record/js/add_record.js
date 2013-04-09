window.onload = init;

function init() {

	var dateInput = document.getElementById("record-date");
	var amountInput = document.getElementById("record-amount");
	var recordForm = document.getElementById("record-form");
	var dateRexp = /\d{4}[-,\/]\d{1,2}[-,\/]\d{1,2}/;
	var numberRexp = /^(\d+\.)?(\d+)$/;

	setDefaultDate();
	recordForm.onsubmit = validate;

	function setDefaultDate() {
		var today = new Date();
		dateInput.value = today.toISOString().match(/\d{4}-\d{2}-\d{2}/);
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
		collectData();
		return true;	
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
		} 
		else 
		{
			var arr = dateInput.value.split(/-|\//);
			data['date'] = {
				year: arr[0],
				month:arr[1],
				day:arr[2]
			};
		}
	}
}
