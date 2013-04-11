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
	return HttpResponse('success');

def show_record_page(request):
	if request.user.is_authenticated():
		return render_to_response("accountbook/show_record.html")
	else:
		return HttpResponseRedirect('/admin')


def record(request,year,month,day):
	records = Record.objects.filter(occurrence_time = datetime(int(year),int(month),int(day)))
	resultList = []
	for record in records:
		temp = {}
		temp["amount"] = record.amount		
		maping_list = Record_tag_maping.objects.filter(record_id=record.id)
		typename_list=[]
		for maping in maping_list:
			tag = Tag.objects.get(id = maping.tag_id)	
			typename_list.append(tag.name) 
		temp["tag_list"] = typename_list
		resultList.append(temp)
	encoder = JSONEncoder()
	result = encoder.encode(resultList)			
	return HttpResponse(result);
