# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from models import Tag
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
	print var
	return HttpResponse('ok');
