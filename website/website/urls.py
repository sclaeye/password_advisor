from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin

from website import views

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
	url(r'^task1/$', views.task1),
	url(r'^(?P<username>\w+)/task2/$', views.task2),
	url(r'^(?P<username>\w+)/task3/$', views.task3),
	url(r'^(?P<username>\w+)/task4/$', views.task4),
	url(r'^completed/$', views.index),
	url(r'^(?P<username>\w+)/$', views.index),

    # Admin
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
)