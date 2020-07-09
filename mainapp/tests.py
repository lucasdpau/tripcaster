from django.test import SimpleTestCase, Client
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
import requests, os, json
from mainapp.views import city_list_to_dict, get_weather_for_city_dict, ordered_list_of_weather_reports, results_view

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


    def test_client_request(self):
        test_client = Client()
        response = test_client.get('/api/weatherdata', {
                'cities': ['toronto', 'toronto', 
                'toronto', 'tokyo', 'tokyo', 'tokyo',] 
                })
        json_response = response.json()
        self.assertEqual(json_response[0]['city'].lower(), 'toronto')
        self.assertEqual(json_response[4]['city'].lower(), 'tokyo')
        self.assertIn('high_temp', json_response[1]['data'])
    
    def test_invalid_city_name(self):
        #if a bad cityname is sent to the api, no data is sent back and the 
        # app puts an error message in its place
        c = Client()
        response = c.get('/api/weatherdata', {
                'cities': ['xxxxxx', 'toronto',] 
                })
        #print(response.content)
        json_response = response.json()
        self.assertEqual("xxxxxx", json_response[0]["city"])
        self.assertIn('error', json_response[0]['data']['weather']['description'])
        self.assertIsInstance(json_response[0]['data']['weather']['description'], str)    