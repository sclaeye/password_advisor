from django import forms
from models import Task1, Task2, Task3, Task4

CHOICES = (('1', 'Very Strong',), ('2', 'Strong',), ('3', 'Weak',), ('4', 'Very Weak',))
class task1Form(forms.ModelForm):
	choice = forms.ChoiceField(widget=forms.RadioSelect, choices=CHOICES, help_text='Please indicate what password strength you would aim for for this kind of website.', required= True)
	username = forms.CharField(help_text="Username", widget=forms.TextInput(attrs={'class': 'form-control', 'readonly':'readonly'}))
	password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), help_text='Password')
	
	class Meta:
		model = Task1
		fields = ('choice' , 'username', 'password')
		
class task2Form(forms.ModelForm):
	choice = forms.ChoiceField(widget=forms.RadioSelect, choices=CHOICES, help_text='Please indicate what password strength you would aim for for this kind of website.', required= True)
	username = forms.CharField(help_text="Username", widget=forms.TextInput(attrs={'class': 'form-control', 'readonly':'readonly'}))
	password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), help_text='Password')

	class Meta:
		model = Task2
		fields = ('choice' , 'username', 'password')
		
class task3Form(forms.ModelForm):
	choice = forms.ChoiceField(widget=forms.RadioSelect, choices=CHOICES, help_text='Please indicate what password strength you would aim for for this kind of website.', required= True)
	username = forms.CharField(help_text="Username", widget=forms.TextInput(attrs={'class': 'form-control', 'readonly':'readonly'}))
	password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), help_text='Password')

	class Meta:
		model = Task3
		fields = ('choice' , 'username', 'password')

class task4Form(forms.ModelForm):
	choice = forms.ChoiceField(widget=forms.RadioSelect, choices=CHOICES, help_text='Please indicate what password strength you would aim for for this kind of website.', required= True)
	username = forms.CharField(help_text="Username", widget=forms.TextInput(attrs={'class': 'form-control', 'readonly':'readonly'}))
	password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), help_text='Password')

	class Meta:
		model = Task4
		fields = ('choice' , 'username', 'password')