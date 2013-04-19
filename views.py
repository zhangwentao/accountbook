# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response,HttpResponseRedirect
from django.template import RequestContext
from models import Tag,Record,Record_tag_maping
from datetime import datetime
import simplejson
from simplejson.encoder import JSONEncoder

def add_tag_page(request):
	return render_to_response('add_tag.html',{},context_instance=RequestContext(request))

def add_record_page(request):
	if request.user.is_authenticated():
		title_tags = Tag.objects.filter(is_title=True)
		normal_tags = Tag.objects.filter(is_title = False)
		return render_to_response('accountbook/add_record.html',{'title_tags':title_tags,'normal_tags':normal_tags},context_instance=RequestContext(request))
	else:
		return HttpResponseRedirect('/admin')

def add_tag(request):
	var = request.POST
	is_title = bool(int(var['is_title']))
	new_tag=Tag()
	new_tag.name = var['tag_name']
	new_tag.description = var['tag_description']
	new_tag.is_title = is_title
	new_tag.save()
	return HttpResponse("ok");

def add_record(request):
	var = request.POST
	data = simplejson.loads(var['data'])
	date = data['date']
	tags = data['tags']
	new_record = Record()
	new_record.amount = float(data['amount']) 	
	new_record.occurrence_time = datetime(int(date['year']),int(date['month']),int(date['day']))
	new_record.detail = data['comment']	
	new_record.save()	
	for tag_id in tags:
		maping = Record_tag_maping()
		maping.record_id = new_record.id
		maping.tag_id = int(tag_id)
		maping.save()
	result = ReturnedData().to_json_string()
	return HttpResponse(result);

def show_record_page(request):
	if request.user.is_authenticated():
		return render_to_response("accountbook/show_record.html")
	else:
		return HttpResponseRedirect('/admin')

def record(request, record_id):
	record_id = int(record_id)
	cur_record = Record.objects.get(id=record_id)

	if request.method == 'DELETE':
		cur_record.delete()
		tmp_data = {'recordId':record_id}
	elif request.method == 'GET':
		temp = {}
		temp["amount"] = cur_record.amount		
		temp["id"] = cur_record.id
		temp["detail"] = record.detail
		maping_list = Record_tag_maping.objects.filter(record_id=cur_record.id)
		typename_list=[]
		for maping in maping_list:
			tag = Tag.objects.get(id = maping.tag_id)	
			typename_list.append(tag.name) 
		temp["tag_list"] = typename_list
		tmp_data = temp
	
	result = ReturnedData(data=tmp_data).to_json_string()
	return HttpResponse(result);

def records(request):
	if request.method == 'POST':
		return add_record(request)
	elif request.method == 'GET':
		params = request.GET
		start_date_list = params['startdate'].split('-')
		end_date_list = params['enddate'].split('-')
		start_date = datetime(int(start_date_list[0]),int(start_date_list[1]),int(start_date_list[2]))
		end_date = datetime(int(end_date_list[0]),int(end_date_list[1]),int(end_date_list[2]))
		record_list = Record.objects.filter(occurrence_time__range=(start_date,end_date))
		resultList = []
		for record in record_list:
			temp = {}
			temp["amount"] = record.amount		
			temp["id"] = record.id
			temp["detail"] = record.detail
			maping_list = Record_tag_maping.objects.filter(record_id=record.id)
			typename_list=[]
			for maping in maping_list:
				tag = Tag.objects.get(id = maping.tag_id)	
				typename_list.append(tag.name) 
			temp["tag_list"] = typename_list
			resultList.append(temp)
		result = ReturnedData(data=resultList).to_json_string()			
		return HttpResponse(result);
	return HttpResponse();

def get_records_of_day(request,year,month,day):
	records = Record.objects.filter(occurrence_time = datetime(int(year),int(month),int(day)))
	resultList = []
	for record in records:
		temp = {}
		temp["amount"] = record.amount		
		temp["id"] = record.id
		temp["detail"] = record.detail
		maping_list = Record_tag_maping.objects.filter(record_id=record.id)
		typename_list=[]
		for maping in maping_list:
			tag = Tag.objects.get(id = maping.tag_id)	
			typename_list.append(tag.name) 
		temp["tag_list"] = typename_list
		resultList.append(temp)
	result = ReturnedData(data=resultList).to_json_string()			
	return HttpResponse(result);

class ReturnedData:
	def __init__(self,code=0,data={},msg=''):
		self.data_dict = {}
		tmp = self.data_dict
		tmp['code'] = code
		tmp['data'] = data
		tmp['msg'] = msg
	def to_json_string(self):
		return JSONEncoder().encode(self.data_dict)
