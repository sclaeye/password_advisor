from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django import forms

class Task1(models.Model):
	username = models.CharField(max_length=128, unique=True)
	password = models.CharField(max_length=128)
	choice = models.IntegerField()

	def __unicode__(self):
		return self.name
		
class Task2(models.Model):
	username = models.CharField(max_length=128, unique=True)
	password = models.CharField(max_length=128)
	choice = models.IntegerField()

	def __unicode__(self):
		return self.name
		
class Task3(models.Model):
	username = models.CharField(max_length=128, unique=True)
	password = models.CharField(max_length=128)
	choice = models.IntegerField()

	def __unicode__(self):
		return self.name
		
class Task4(models.Model):
	username = models.CharField(max_length=128, unique=True)
	password = models.CharField(max_length=128)
	choice = models.IntegerField()
	
	def __unicode__(self):
		return self.name