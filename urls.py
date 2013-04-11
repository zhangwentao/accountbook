from django.conf.urls.defaults import patterns, include, url
from views import add_tag_page,add_tag,add_record_page,add_record,show_record_page,record
urlpatterns = patterns('',
	(r'^add_tag$',add_tag_page),
	(r'^add_tag_do$',add_tag),
	(r'^add_record_do$',add_record),
	(r'^record/(?P<year>\d{4})-(?P<month>\d{1,2})-(?P<day>\d{1,2})/$',record),
	(r'^record/add/$',add_record_page),
	(r'^record/show/$',show_record_page)
)
