from django.conf.urls.defaults import patterns, include, url
from views import * 
urlpatterns = patterns('',
	(r'^add_tag$',add_tag_page),
	(r'^add_tag_do$',add_tag),
	(r'^records/$',records),
	(r'^records/(?P<year>\d{4})-(?P<month>\d{1,2})-(?P<day>\d{1,2})/$',get_records_of_day),
	(r'^records/(?P<record_id>\d+)$',record),
	(r'^record/add/$',add_record_page),
	(r'^record/show/$',show_record_page),
	(r'^statistics/$',statistics_page),
	(r'^tags/$',tags)
)
