from django.db import models

# Create your models here.
class Tag(models.Model):
	name = models.CharField(max_length=20)
	description = models.CharField(max_length=100)
	creation_time=models.DateTimeField(auto_now_add=True)
	modification_time=models.DateTimeField(auto_now=True)	

class Record(models.Model):
	amount=models.FloatField()
	detail=models.CharField(max_length=100)
	occurrence_time=models.DataTime()
	creation_time=models.DateTimeField(auto_now_add=True)
	modification_time=models.DateTimeField(auto_now=True)	

class Record_tag_maping(models.Model):
	record_id = models.IntegerField()
	tag_id = models.IntegerField()
