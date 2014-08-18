from django.shortcuts import render_to_response
from django.template import RequestContext
from website.models import Task1
from website.forms import task1Form, task2Form, task3Form, task4Form

from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required

def index(request):
    return render_to_response('index.html', {}, RequestContext(request))

def task1(request):
	context = RequestContext(request)
	registered = False

	if request.method == 'POST':
		user_form = task1Form(data=request.POST)

		if user_form.is_valid():
			user = user_form.save()
			registered = True
			return HttpResponseRedirect("../"+user.username+"/task2/")
		# Invalid form
		else:
			print(user_form.errors)
	else:
		user_form = task1Form(initial={'username': generateNewUser()})

	return render_to_response('tasks/task1.html', {'form': user_form, 'registered': registered}, context)
	
def task2(request, username):
	context = RequestContext(request)
	registered = False

	if request.method == 'POST':
		user_form = task2Form(data=request.POST)

		if user_form.is_valid():
			user = user_form.save()
			registered = True
			return HttpResponseRedirect("../"+user.username+"/task3/")
		# Invalid form
		else:
			print(user_form.errors)
	else:
		user_form = task2Form(initial={'username': username})

	return render_to_response('tasks/task2.html', {'form': user_form, 'registered': registered}, context)

def task3(request, username):
	context = RequestContext(request)
	registered = False

	if request.method == 'POST':
		user_form = task3Form(data=request.POST)

		if user_form.is_valid():
			user = user_form.save()
			registered = True
			return HttpResponseRedirect("../"+user.username+"/task4/")
		# Invalid form
		else:
			print(user_form.errors)
	else:
		user_form = task3Form(initial={'username': username})

	return render_to_response('tasks/task2.html', {'form': user_form, 'registered': registered}, context)
	
def task4(request, username):
	context = RequestContext(request)
	registered = False

	if request.method == 'POST':
		user_form = task4Form(data=request.POST)

		if user_form.is_valid():
			user = user_form.save()
			registered = True
			return HttpResponseRedirect("../completed")
		# Invalid form
		else:
			print(user_form.errors)
	else:
		user_form = task4Form(initial={'username': username})

	return render_to_response('tasks/task2.html', {'form': user_form, 'registered': registered}, context)
	
def generateNewUser():
	username=""
	if Task1.objects.count() >= 1:
		username="user"+str(Task1.objects.count()+1)
	else:
		username="user1"
	return username