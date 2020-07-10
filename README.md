# TripCaster 

Get a weather forecast for all cities on your trip in one page! Instead of checking the forecast of each destination of your trip, just use TripCaster and with a few simple clicks you can get a forecast for the next 16 days at any city of your choice. 

# Setup

This app uses Django for the back end and React for the front end.
First go to the tripcaster directory and create your virtual environment with: python -m venv {your desired venv name}. 
Activate your virtual environment {env name}\Scripts\activate
Then install requirements with: pip install -r requirements.txt 

You also need to set the following environment variables:
- SECRET_KEY should be set to a unique, unpredictable value.
- WEATHERBIT_API_KEY should be set to the key you get from weatherbit

Make sure everything is ok by running: python manage.py test
Then run ther server with: python manage.py runserver

# How do I use this website?

First of all you will need to plan out your trip, and know how many days you will stay at each city.
On the main page you will see 16 cards representing the next 16 days. Enter the name of a city you will be travelling to, then click on the cards corresponding to the days you will stay in that city. Click on 'Add City' and you will see the city name added to the appropriate cards. Repeat until you have completed your trip or have filled up all the cards. 

Click on submit and the results page will load. You will see a forecast for each day and city of your trip. If you have entered an invalid city a card saying "No Report" will be rendered in place of a forecast.

