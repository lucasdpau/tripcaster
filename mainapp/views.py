from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
import os, requests, datetime, time 

OPENWEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY")
WEATHERBIT_API_KEY = os.environ.get("WEATHERBIT_API_KEY")

wb_api_url = "https://api.weatherbit.io/v2.0/forecast/daily?city={}&key=" + WEATHERBIT_API_KEY

def format_date(date_string):
    # the API returns the date in the object in format of "2020-07-11".
    # return some useful information based on that string
    weekday_map = {0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu", 4: "Fri", 5: "Sat", 6: "Sun"}
    new_date = datetime.datetime.strptime(date_string, "%Y-%m-%d")
    # day of the week eg. mon, wed..
    weekday = weekday_map[new_date.weekday()]
    day = str(new_date.day)
    month_day = datetime.datetime.strftime(new_date, "%b %d")
    new_date_string = "{Y}-{m}-{d}".format(Y=str(new_date.year), m=str(new_date.month), d=str(new_date.day))
    return (new_date_string, weekday, day, month_day)

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
            city_dict[city]['weather'] = "Error 204. Did you provide an invalid city?"
        else:
            city_dict[city]['weather'] = ("error " + str(weather_at_city.status_code))

    return city_dict

def ordered_list_of_weather_reports(city_dict, city_list):
    #returns a list of weather reports in the city and dates we want in order
    #eg. [{'city':'nyc', 'data':{...}}, {'city':'nyc', 'data':{...}}, {'city':'rome', 'data':{...}}....]
    report_list = []
    invalid_counter = 0
    for index in range(0, len(city_list)):
        city_name = city_list[index]
        if type(city_dict[city_name]['weather']) != str:
            weather_report = city_dict[city_name]['weather']['data'][index]
            # use the city name provided by Api for proper formatting
            proper_city_name = city_dict[city_name]['weather']['city_name']
            # add the day of the week to the object
            weekday = format_date(weather_report['valid_date'])[1]
            day = format_date(weather_report['valid_date'])[2]
            month_day = format_date(weather_report['valid_date'])[3]
            city_weather_object = {'city': proper_city_name, 'data' : weather_report, 'weekday': weekday, 'day': day, 'month_day': month_day,}
            report_list.append(city_weather_object)
        else:
            city_weather_object = {'city': city_name, 'data': {"valid_date": invalid_counter, 'weather': {"description": city_dict[city_name]['weather']}}}
            report_list.append(city_weather_object)
            invalid_counter += 1
    return report_list

def index_view(req):
    return render(req, "index.html", )

def results_view(req):
    #renders the skeleton results.html page, which is later
    # populated by an api call that calls weatherdata()
    context = {} 
    return render(req, "results.html", context)

def weatherdata(req):
    # takes in a request with multiple query parameters of cities
    # eg ?cities=rome&cities=rome&cities=paris and returns a response with the 
    # weather reports
    # if we don't safe=False so that we can send a list 

    # 60*60*24
    SECONDS_IN_DAY = 86400 
    #current UTC time since epoch in seconds = time.time()
    current_days_since_epoch = int(time.time()/SECONDS_IN_DAY)
    report_creation_date = req.GET.get("reportdate")

    # check if report_creation_date is type int
    try:
        report_creation_date = int(report_creation_date)
    except:
        report_creation_date = current_days_since_epoch

    difference_reportdate_currentdate = current_days_since_epoch - report_creation_date
    # if for some reason the query string tells us the report was made after today's date, 
    # assume that it was an error and set it to 0
    if difference_reportdate_currentdate < 0:
        difference_reportdate_currentdate = 0
    city_name_list = req.GET.getlist("cities")

    # we are going to remove 1 city from the front of the list per day offset
    # if offset is greater than length of city, then just return empty city
    # to avoid index out of range
    if  difference_reportdate_currentdate > len(city_name_list):
        city_name_list = []
    while difference_reportdate_currentdate > 0:
        city_name_list.pop(0)
        difference_reportdate_currentdate -= 1
    city_dict = city_list_to_dict(city_name_list)
    city_dict_plus_weather = get_weather_for_city_dict(city_dict)
    ordered_list = ordered_list_of_weather_reports(city_dict_plus_weather, city_name_list)
    response_obj = {"data": ordered_list}

    return JsonResponse(response_obj, safe=False)
