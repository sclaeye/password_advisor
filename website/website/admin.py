from website.models import *
from django.contrib import admin

class Task1Admin(admin.ModelAdmin):
    list_display = ('username', 'password', 'choice' )

class Task2Admin(admin.ModelAdmin):
    list_display = ('username', 'password', 'choice' )

class Task3Admin(admin.ModelAdmin):
    list_display = ('username', 'password', 'choice' )

class Task4Admin(admin.ModelAdmin):
    list_display = ('username', 'password', 'choice' )


admin.site.register(Task1, Task1Admin)
admin.site.register(Task2, Task2Admin)
admin.site.register(Task3, Task3Admin)
admin.site.register(Task4, Task4Admin)