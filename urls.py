from django.conf.urls.defaults import patterns, include, url
from views import add_tag_page,add_tag,add_record_page,add_record
urlpatterns = patterns('',
	(r'^add_tag$',add_tag_page),
	(r'^add_tag_do$',add_tag),
	(r'^add_record$',add_record_page),
	(r'^add_record_do$',add_record)
)
