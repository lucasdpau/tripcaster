var  React = require('react');
var  ReactDOM = require('react-dom');

// create a shortcut so we don't go crazy 
const Ele = React.createElement;
const maxForecastLength = 14;

// uiwrapper will be the very top component. it has 2 children: card wrapper and the form
// card wrapper will have the weather/city cards, forms will have the form functionality and buttons

function UiWrapperHook() {

    const [cityName, setCityName] = React.useState('');
    const [citiesList, setcitiesList] = React.useState(new Array(maxForecastLength).fill(''));
    const [queryString, setQueryString] = React.useState('?');
    const [selectedSlots, setSelectedSlots] = React.useState([]);
    const [currentDate, setCurrentDate] = React.useState(new Date());


    //this will keep the query string updated
    updateQueryString = () => {
        // get days since epoch. 86400 seconds per day * 1000 ms
        let currentDay = Math.floor(new Date() / (86400000));
        let newQueryString = '?reportdate=' + currentDay.toString();
        for (let i=0; i<citiesList.length; i++) {
            let queryCityName = citiesList[i];
            if (queryCityName == '') {
                queryCityName = '_'
            }
            newQueryString += "&cities=" + queryCityName;
        }
        // trim the trailing "&cities=_" from the right end of the querystring
        var loop = true;
        while (loop) {
            let len = newQueryString.length;
            let endOfQueryString = newQueryString.substring(len-9, len);
            if (endOfQueryString == "&cities=_") {
                newQueryString = newQueryString.substring(0, len-9);
            } else {
                loop = false;
            }
        }
        setQueryString(newQueryString);
    }

    selectCard = (index) => {
        // selects a card and puts it in 'selected' array
        // if card already selected, unselect it 
        let newSelectedSlots = selectedSlots.slice();
        if (newSelectedSlots.includes(index)) {
            let newSlotsIndex = newSelectedSlots.indexOf(index);
            newSelectedSlots.splice(newSlotsIndex, 1);
        } else {
            newSelectedSlots.push(index);
        }
        setSelectedSlots(newSelectedSlots);
    }

    addCities = () => {
        // sets the cityname of selected cards to the value in the form's input field then update the query string 
        for (let i=0; i<selectedSlots.length; i++) {
            let card_number = selectedSlots[i];
            citiesList[card_number] = cityName;
        }
        setCityName('');
        setSelectedSlots([]);
        updateQueryString();
    }


    clearCitiesList = () => {
        // remove all city names from the current state of the app
        let clearedCitiesList = new Array(maxForecastLength).fill('');
        setcitiesList(clearedCitiesList);
        setCityName('');
        setSelectedSlots([]);
        updateQueryString();
    }

    return (
        Ele('div', null, 
            Ele(cityCardsArray, {
                selectCard: selectCard,
                citiesList: citiesList,
                selectedSlots: selectedSlots,
                currentDate: currentDate,
                }),
            Ele('div', {className: "centered entry_form_wrapper"},                 
                Ele(addCitiesFormHook, {
                    addCities: addCities,
                    cityName: cityName,
                    queryString: queryString,
                    clearCitiesList: clearCitiesList,
                    setCityName: setCityName,
                })), 
            )
    );
}

function cityCardsArray(props) {
    // TODO using index for keys is not ideal, as we can remove and rearrange 
    //components. it's best to use unique data from the objects if possible
    // see https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
    let cityCardArray = props.citiesList.map((card, index) => 
        Ele(cityCard, {'key': index, 
                            selectedSlots: props.selectedSlots, 
                            selectCard: props.selectCard, 
                            currentDate: props.currentDate, 
                            card: card, 
                            index: index})
    );
    return(
        Ele('div', {className: "city_weather_card_wrapper"}, cityCardArray)
    );
}

function cityCard(props) {
    // set up the css class for this element. adds 'selected card' class if in the select_card array
    var city_weather_card = "city_weather_card";
    if (props.selectedSlots.includes(props.index)) {
        city_weather_card += " selected_card";
    }
    // 1000ms * 60s * 60m * 24hrs = 86,400,000 ms per day
    // top component has the current date. each card's date is increased by its index
    // we also want the date formated in short form eg: "Mar 20", "Sep 4"
    let dateOfThisCard = new Date();
    dateOfThisCard.setTime(props.currentDate.getTime() + (86400000 * props.index));
    let monthDay = dateOfThisCard.toDateString().substring(4,10);
    return (
        Ele('div',{className: city_weather_card, 
                    onClick: () => props.selectCard(props.index)},
            Ele('h2', {className: "centered"}, monthDay),
            Ele('div', {className: "card_city_name_wrapper"},
                Ele('h2', {className: "centered"}, props.card)),
            )
    );
}

function addCitiesFormHook(props) {

    handleSubmit = (event) => {
        event.preventDefault();
        window.location = "/results" + props.queryString;
    } 
    return (
        // create the form
        Ele('form', {onSubmit: handleSubmit, id: "cityEntryForm"}, 
            Ele('input', {'type': 'text', 
                        'name': 'cityName',
                        'id':'cityName',
                        'value': props.cityName,
                        // setCity name to the value in the input field
                        'onChange': e => props.setCityName(e.target.value), 
                        className: "form_input",
                        'placeholder': "Enter city name",
                        }),
            Ele('br', null),
            Ele('button', {'type': 'button',
                         className: 'form_button', 
                         onClick: () => props.addCities()}, 
                'Add City'),
            Ele('br', null),
            Ele('button', {'type': 'button', 
                        className: "form_button", 
                        onClick: () => props.clearCitiesList()}, 
                'Clear'),
            Ele('br', null),
            Ele('input', {'type': 'submit', 
                        className: "form_button"}),
        )
    );   
}

//render uiwrapper, the top element, to the root div 

ReactDOM.render(
  React.createElement(UiWrapperHook, null),
  document.getElementById('root')
);