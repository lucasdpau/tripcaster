import { React, useState } from 'react';
const ReactDOM = require('react-dom');

// create a shortcut so we don't go crazy 
const maxForecastLength = 14;

// uiwrapper will be the very top component. it has 2 children: card wrapper and the form
// card wrapper will have the weather/city cards, forms will have the form functionality and buttons

const UiWrapperHook = () => {

    const [cityName, setCityName] = useState('');
    const [citiesList, setcitiesList] = useState(new Array(maxForecastLength).fill(''));
    const [queryString, setQueryString] = useState('?');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());


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
            <div className='centered entry_form_wrapper'>
                <AddCitiesFormHook
                    addCities={addCities}
                    cityName={cityName}
                    queryString={queryString}
                    clearCitiesList={clearCitiesList}
                    setCityName={setCityName}
                />
            </div>
        </div>
    );
};

const CityCardsArray = (props) => {
    // TODO using index for keys is not ideal, as we can remove and rearrange 
    //components. it's best to use unique data from the objects if possible
    const arrayOfCityCards = props.citiesList.map((card, index) =>
        <CityCard
            key={index}
            selectedSlots={props.selectedSlots}
            selectCard={props.selectCard}
            currentDate={props.currentDate}
            card={card}
            index={index}
        />
    );
    return (
        <div
            className='city_weather_card_wrapper'
        >
            {arrayOfCityCards}
        </div>
    );
};

const CityCard = (props) => {
    // set up the css class for this element. adds 'selected card' class if in the select_card array
    var city_weather_card = "city_weather_card";
    if (props.selectedSlots.includes(props.index)) {
        city_weather_card += " selected_card";
    }
    // 1000ms * 60s * 60m * 24hrs = 86,400,000 ms per day
    // top component has the current date. each card's date is increased by its index
    // we also want the date formated in short form eg: "Mar 20", "Sep 4"
    const dateOfThisCard = new Date();
    dateOfThisCard.setTime(props.currentDate.getTime() + (86400000 * props.index));
    const monthDay = dateOfThisCard.toDateString().substring(4, 10);
    return (
        <div
            className={city_weather_card}
            onClick={() => props.selectCard(props.index)}
        >
            <h2 className='centered'>
                {monthDay}
            </h2>
            <div className='card_city_name_wrapper'>
                <h2 className='centered'>
                    {props.card}
                </h2>
            </div>
        </div>
    );
};

const AddCitiesFormHook = (props) => {
    handleSubmit = (event) => {
        event.preventDefault();
        window.location = "/results" + props.queryString;
    };

    return (
        <form
            onsubmit={handleSubmit}
            id='cityEntryForm'
        >
            <input
                type='text'
                name='cityName'
                id='cityName'
                value={props.cityName}
                onChange={e => props.setCityName(e.target.value)}
                className='form_input'
                placeholder='Enter city name'
            />
            <button
                type='button'
                className='form_button'
                onClick={props.addCities}
            >
                Add City
            </button>
            <button
                type='button'
                className='form_button'
                onClick={props.clearCitiesList}
            >
                Clear
            </button>
            <input
                type='submit'
                className='form_button'
            />
        </form>
    );
}

//render uiwrapper, the top element, to the root div 

ReactDOM.render(
    React.createElement(UiWrapperHook, null),
    document.getElementById('root')
);