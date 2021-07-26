import { React, useState } from 'react';
import CityCardsArray from './components/CityCardsArray';
import AddCitiesForm from './components/AddCitiesForm';
const ReactDOM = require('react-dom');

const MainPage = () => {

    const [cityName, setCityName] = useState('');
    const [citiesList, setcitiesList] = useState(new Array(maxForecastLength).fill(''));
    const [queryString, setQueryString] = useState('?');
    const [selectedSlots, setSelectedSlots] = useState([]);

    const maxForecastLength = 14;
    const currentDate = new Date();

    //this will keep the query string updated
    const updateQueryString = () => {
        // get days since epoch. 86400 seconds per day * 1000 ms
        const currentDay = Math.floor(new Date() / (86400000));
        var newQueryString = '?reportdate=' + currentDay.toString();
        for (let i = 0; i < citiesList.length; i++) {
            let queryCityName = citiesList[i];
            if (queryCityName == '') {
                queryCityName = '_';
            }
            newQueryString += "&cities=" + queryCityName;
        }
        // trim the trailing "&cities=_" from the right end of the querystring
        var loop = true;
        while (loop) {
            const len = newQueryString.length;
            const endOfQueryString = newQueryString.substring(len - 9, len);
            if (endOfQueryString == "&cities=_") {
                newQueryString = newQueryString.substring(0, len - 9);
            } else {
                loop = false;
            }
        }
        setQueryString(newQueryString);
    };

    const selectCard = (index) => {
        // selects a card and puts it in 'selected' array
        // if card already selected, unselect it 
        const newSelectedSlots = selectedSlots.slice();
        if (newSelectedSlots.includes(index)) {
            const newSlotsIndex = newSelectedSlots.indexOf(index);
            newSelectedSlots.splice(newSlotsIndex, 1);
        } else {
            newSelectedSlots.push(index);
        }
        setSelectedSlots(newSelectedSlots);
    };

    const addCities = () => {
        // sets the cityname of selected cards to the value in the form's input field then update the query string 
        for (let i = 0; i < selectedSlots.length; i++) {
            const card_number = selectedSlots[i];
            citiesList[card_number] = cityName;
        }
        setCityName('');
        setSelectedSlots([]);
        updateQueryString();
    };


    const clearCitiesList = () => {
        // remove all city names from the current state of the app
        const clearedCitiesList = new Array(maxForecastLength).fill('');
        setcitiesList(clearedCitiesList);
        setCityName('');
        setSelectedSlots([]);
        updateQueryString();
    };

    return (
        <div>
            <CityCardsArray
                selectCard={selectCard}
                citiesList={citiesList}
                selectedSlots={selectedSlots}
                currentDate={currentDate}
            />
            <AddCitiesForm
                addCities={addCities}
                cityName={cityName}
                queryString={queryString}
                clearCitiesList={clearCitiesList}
                setCityName={setCityName}
            />
        </div>
    );
};

//render to the root div 
ReactDOM.render(
    React.createElement(MainPage, null),
    document.getElementById('root')
);