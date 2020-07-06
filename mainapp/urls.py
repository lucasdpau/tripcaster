from django.urls import path
from . import views

#url patterns is just a list of all urls supported by the app
#name can be used in the html rendering. eg: a href="{% url 'index' %}"

urlpatterns = [
    path("", views.index_view, name="index"),
    ] 