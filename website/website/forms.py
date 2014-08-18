from django import forms
from models import Task1, Task2, Task3, Task4

class task1Form(forms.ModelForm):

    username = forms.CharField(help_text="Username", widget=forms.TextInput(attrs={'class': 'form-control', 'readonly':'readonly'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), help_text='Password')

    class Meta:
        model = Task1
        fields = ('username', 'password')
		
class task2Form(forms.ModelForm):

    username = forms.CharField(help_text="Username", widget=forms.TextInput(attrs={'class': 'form-control', 'readonly':'readonly'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), help_text='Password')

    class Meta:
        model = Task2
        fields = ('username', 'password')
		
class task3Form(forms.ModelForm):

    username = forms.CharField(help_text="Username", widget=forms.TextInput(attrs={'class': 'form-control', 'readonly':'readonly'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), help_text='Password')

    class Meta:
        model = Task3
        fields = ('username', 'password')

class task4Form(forms.ModelForm):

    username = forms.CharField(help_text="Username", widget=forms.TextInput(attrs={'class': 'form-control', 'readonly':'readonly'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), help_text='Password')

    class Meta:
        model = Task4
        fields = ('username', 'password')