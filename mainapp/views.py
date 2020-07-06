from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
import os, requests

OPENWEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY")
WEATHERBIT_API_KEY = os.environ.get("WEATHERBIT_API_KEY")

wb_api_url = "https://api.weatherbit.io/v2.0/forecast/daily?city={}&key=" + WEATHERBIT_API_KEY

def city_list_to_dict(city_list):
    #get a list of cities ['nyc','nyc','rome','rome','berlin','rome'] and turn into dict like so
    # {'nyc': {'dates': [0,1]}, 'rome': {'dates': [2,3,5]}, 'berlin':{'dates':[4]}}
    city_dict = {}
    for index in range(0, len(city_list)):
        if city_list[index] in city_dict:
            city_dict[city_list[index]]['dates'].append(index)
        else:
            city_dict[city_list[index]] = {'dates': [index]}
    return city_dict


def get_weather_for_city_dict(city_dict):
    #pings the api and populates the city_dict with the response
    for city in city_dict:
        weather_at_city = requests.get(wb_api_url.format(city))
        #if city name is invalid, api returns blank response
        if weather_at_city.status_code == 200:
            weather_json = weather_at_city.json()
            city_dict[city]['weather']  = weather_json
        elif weather_at_city.status_code == 204:
            city_dict[city]['weather'] = "error 204, perhaps you provided an invalid city?"
        else:
            city_dict[city]['weather'] = ("error " + str(weather_at_city.status_code))

    return city_dict

def ordered_list_of_weather_reports(city_dict, city_list):
    #returns a list of weather reports in the city and dates we want in order
    #eg. [{'city':'nyc', 'data':{...}}, {'city':'nyc', 'data':{...}}, {'city':'rome', 'data':{...}}....]
    report_list = []
    for index in range(0, len(city_list)):
        city_name = city_list[index]
        if type(city_dict[city_name]['weather']) != str:
            weather_report = city_dict[city_name]['weather']['data'][index]
            city_weather_object = {'city': city_name, 'data' : weather_report}
            report_list.append(city_weather_object)
        else:
            city_weather_object = {'city': city_name, 'data' : city_dict[city_name]['weather']}
            report_list.append(city_weather_object)
    return report_list

def index_view(req):
    city_names = req.GET.get("cities")
    if city_names:
        print(city_names)
        weather_at_city = requests.get(wb_api_url.format(city_names))
        if weather_at_city.status_code == 200:
            for items in weather_at_city.json()['data']:
                print("Date: " + items['valid_date'] + " High: " + str(items['high_temp']))
            return HttpResponse(weather_at_city)
        # if a non-existent city is sent to the API, an empty response 204 is set
        elif weather_at_city.status_code == 204:
            return HttpResponse("error 204, perhaps you provided an invalid city?")
        else:
            return HttpResponse("error " + str(weather_at_city.status_code))
    return render(req, "index.html", )

def results_view(req):
    city_name_list = req.GET.getlist("cities")
    city_dict = city_list_to_dict(city_name_list)
    city_dict_plus_weather = get_weather_for_city_dict(city_dict)
    ordered_list = ordered_list_of_weather_reports(city_dict_plus_weather, city_name_list)
    return HttpResponse(ordered_list)