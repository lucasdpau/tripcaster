from django.test import SimpleTestCase, Client
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
import requests, os, json
from mainapp.views import format_date, city_list_to_dict, get_weather_for_city_dict, ordered_list_of_weather_reports, results_view

OPENWEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY")
WEATHERBIT_API_KEY = os.environ.get("WEATHERBIT_API_KEY")
# Create your tests here.

toronto_coords = (43.65, -79.38)
# If we don't use a db, use SimpleTestCase as per django docs.
    
class WEATHERBIT_TestCase(SimpleTestCase):
    # docs at https://www.weatherbit.io/api/weather-forecast-16-day
    # base url https://api.weatherbit.io/v2.0/forecast/daily
    # example request: 
    #https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=API_KEY   
    def test_request_correct_city(self):
        api_url = "https://api.weatherbit.io/v2.0/forecast/daily?city=Toronto&key=" + WEATHERBIT_API_KEY
        response = requests.get(api_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["city_name"], 'Toronto')
    
class View_Functions(SimpleTestCase):

    def test_date_format(self):
        test_date = format_date("2020-07-11")
        #returned tuple[0] should have the leading 0 of the month removed
        self.assertEqual(test_date[0], "2020-7-11")
        self.assertEqual(test_date[1], "Sat")
        self.assertEqual(test_date[2], "11")
        self.assertEqual(test_date[3], "Jul 11")

    def test_convert_citylist_to_dict(self):
        #get a list of cities ['nyc','nyc','rome','rome','berlin','rome'] and turn into dict like so
        # {'nyc': {'dates': [0,1]}, 'rome': {'dates': [2,3,5]}, 'berlin':{'dates':[4]}}
        city_list = ['nyc','nyc','rome','rome','berlin','rome']
        city_dict = {'nyc': {'dates': [0,1]}, 'rome': {'dates': [2,3,5]}, 'berlin':{'dates':[4]}}
        self.assertEqual(city_list_to_dict(city_list), city_dict)

    def test_add_weather_to_city_dict(self):
        # add JSON object with the weather report from the api response.
        #eg. [{'city':'nyc', 'weather':{...}}]
        city_dict = {'nyc': {'dates': [0,1]}, 'rome': {'dates': [2,3,5]}, 'berlin':{'dates':[4]}}
        self.assertIn('weather', get_weather_for_city_dict(city_dict)['nyc'])

    def test_return_ordered_list_of_weather_reports(self):
        #returns a list of weather reports in the city and dates we want in order
        #eg. [{'city':'nyc', 'data':{...}}, {'city':'nyc', 'data':{...}}, {'city':'rome', 'data':{...}}....]
        city_list = ['nyc','nyc','rome','rome','berlin','rome']
        city_dict = get_weather_for_city_dict({'nyc': {'dates': [0,1]}, 'rome': {'dates': [2,3,5]}, 'berlin':{'dates':[4]}})
        self.assertEqual('nyc', ordered_list_of_weather_reports(city_dict, city_list)[0]['city'].lower())
        self.assertEqual('rome', ordered_list_of_weather_reports(city_dict, city_list)[2]['city'].lower())
        self.assertEqual('berlin', ordered_list_of_weather_reports(city_dict, city_list)[4]['city'].lower())
        self.assertIn('high_temp', ordered_list_of_weather_reports(city_dict, city_list)[4]['data'])
        result = ordered_list_of_weather_reports(city_dict, city_list)
        #print(json.dumps(result, indent=4, sort_keys=True))

    def test_remove_leading_0_from_api_date(self):
        # July 9, 2020
        start_date = "2020-07-09"
        formatted_date = format_date(start_date)
        self.assertEqual(formatted_date[0], "2020-7-9")
        self.assertEqual(formatted_date[1], "Thu")

    def test_client_request(self):
        test_client = Client()
        response = test_client.get('/api/weatherdata', {
                'cities': ['toronto', 'toronto', 
                'toronto', 'tokyo', 'tokyo', 'tokyo',] 
                })
        json_response = response.json()
        self.assertEqual(json_response["city_reports"][0]['city'].lower(), 'toronto')
        self.assertEqual(json_response["city_reports"][4]['city'].lower(), 'tokyo')
        self.assertIn('high_temp', json_response["city_reports"][1]['data'])
    
    def test_invalid_city_name(self):
        #if a bad cityname is sent to the api, no data is sent back and the 
        # app puts an error message in its place
        c = Client()
        response = c.get('/api/weatherdata', {
                'cities': ['xxxxxx', 'toronto',] 
                })
        #print(response.content)
        json_response = response.json()
        self.assertEqual("xxxxxx", json_response["city_reports"][0]["city"])
        self.assertIn('Error', json_response["city_reports"][0]['data']['weather']['description'])
        self.assertIsInstance(json_response["city_reports"][0]['data']['weather']['description'], str)    

    def test_city_dict_includes_weekday(self):
        weekdays = ("Mon",  "Tue",  "Wed",  "Thu", "Fri", "Sat", "Sun")
        recorded_day = ''
        c = Client()
        response = c.get('/api/weatherdata', {
                'cities': ['toronto',] 
                })
        json_response = response.json()
        for day in weekdays:
            if day == json_response["city_reports"][0]['weekday']:
                recorded_day = day
        self.assertEqual(json_response["city_reports"][0]['weekday'], recorded_day)

    def test_detects_expired_report(self):
        c = Client()
        response = c.get('/api/weatherdata', {
                'reportdate':'1',
                'cities': ['toronto',] 
                })
        json_response = response.json()
        self.assertEqual(json_response["expired_report"], True)