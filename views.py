# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from models import Tag,Record,Record_tag_maping
from datetime import datetime
import json
def add_tag_page(request):
	return render_to_response('add_tag.html',{},context_instance=RequestContext(request))

def add_record_page(request):
	title_tags = Tag.objects.filter(is_title=True)
       	normal_tags = Tag.objects.filter(is_title = False) 			
	return render_to_response('add_record.html',{'title_tags':title_tags,'normal_tags':normal_tags},context_instance=RequestContext(request))

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
	data = json.loads(var['vars'])
	print data 
	date = data['occurrence_date'].split('/')
	tags = data['tag']
	new_record = Record()
	new_record.amount = float(data['amount']) 	
	new_record.occurrence_time = datetime(int(date[0]),int(date[1]),int(date[2]))
	new_record.save()	
	for tag_id in tags:
		maping = Record_tag_maping()
		maping.record_id = new_record.id
		maping.tag_id = int(tag_id)
		maping.save()
	return HttpResponse('ok');
