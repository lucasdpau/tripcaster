var  React = require('react');
var  ReactDOM = require('react-dom');

// create a shortcut so we don't go crazy 
const Ele = React.createElement;
const maxForecastLength = 14;

// uiwrapper will be the very top component. it has 2 children: card wrapper and the form
// card wrapper will have the weather/city cards, forms will have the form functionality and buttons

class UiWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityName: '',
            citiesList: new Array(maxForecastLength).fill(''),
            queryString: '?',
            selectedSlots: [],
            currentDate: new Date()
        };
        this.handleChange = this.handleChange.bind(this);
        this.cityEntryRef = React.createRef();
    }
    
    // handle change for multiple forms
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
                        });
    }

    clearCitiesList = () => {
        let clearedCitiesList = new Array(maxForecastLength).fill('');
        this.setState({citiesList: clearedCitiesList, 
                    cityName: '',
                    selectedSlots: [],});
        this.updateQueryString();
    }

    selectCard = (index, cityEntryRef) => {
        // selects a card and puts it in 'selected' arary
        // if card already selected, unselect it 
        let newSelectedSlots = this.state.selectedSlots.slice();
        if (newSelectedSlots.includes(index)) {
            let newSlotsIndex = newSelectedSlots.indexOf(index);
            newSelectedSlots.splice(newSlotsIndex, 1);
        } else {
            newSelectedSlots.push(index);
        }
        this.setState({selectedSlots: newSelectedSlots});
        cityEntryRef.focus({preventScroll: true});
    }

    addCities = () => {
        // sets the city name of selectd cards to the value in the form's city field then  update the query string 
        for (let i=0; i<this.state.selectedSlots.length; i++) {
            let card_number = this.state.selectedSlots[i];
            this.state.citiesList[card_number] = this.state.cityName;
        }
        this.state.cityName = '';
        let clearedSelectedCitiesArray = [];
        this.setState({selectedSlots: clearedSelectedCitiesArray})
        this.updateQueryString();
    }

    //this will keep the query string updated
    updateQueryString = () => {
        let newQueryString = '?'
        for (let i=0; i<this.state.citiesList.length; i++) {
            let queryCityName = this.state.citiesList[i];
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
        this.setState({queryString: newQueryString});
    }

    render() {
        return (
            Ele('div', null, 
                Ele(cityCardsArray, {
                    cityEntryRef: this.cityEntryRef,
                    selectCard: this.selectCard,
                    citiesList: this.state.citiesList,
                    selectedSlots: this.state.selectedSlots,
                    currentDate: this.state.currentDate,
                    }),
                Ele('div', {className: "centered entry_form_wrapper"},                 
                    Ele(cityAddForm, {
                        cityEntryRef: this.cityEntryRef,
                        addCities: this.addCities,
                        cityName: this.state.cityName,
                        handleChange: this.handleChange,
                        queryString: this.state.queryString,
                        clearCitiesList: this.clearCitiesList,
                    })), 
                )
        );
    }
}

function cityCardsArray(props) {
    // TODO using index for keys is not ideal, as we can remove and rearrange 
    //components. it's best to use unique data from the objects if possible
    // see https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
    let cityCardArray = props.citiesList.map((card, index) => 
        Ele(cityCard, {'key': index, 
                            cityEntryRef: props.cityEntryRef,
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
                    onClick: () => props.selectCard(props.index, props.cityEntryRef.current)},
            Ele('h2', {className: "centered"}, monthDay),
            Ele('div', {className: "card_city_name_wrapper"},
                Ele('h2', {className: "centered"}, props.card)),
            )
    );
}

class cityAddForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    // when pressing submit, stop default behavior, and go to results page
    // with the querystring inherited from the form above
    handleSubmit = (event) => {
        event.preventDefault();
        window.location = "/results" + this.props.queryString;
    }

    render() {
        return (
            // create the form
            Ele('form', {onSubmit: this.handleSubmit, id: "cityEntryForm"}, 
                Ele('input', {'type': 'text', 
                            'name': 'cityName',
                            'id':'cityName',
                            'value': this.props.cityName,
                            'onChange': this.props.handleChange, 
                            className: "form_input",
                            'ref': this.props.cityEntryRef,
                            'placeholder': "Enter city name",
                            }),
                Ele('br', null),
                Ele('button', {'type': 'button',
                             className: 'form_button', 
                             onClick: () => this.props.addCities()}, 
                    'Add City'),
                Ele('br', null),
                Ele('button', {'type': 'button', 
                            className: "form_button", 
                            onClick: () => this.props.clearCitiesList()}, 
                    'Clear'),
                Ele('br', null),
                Ele('input', {'type': 'submit', 
                            className: "form_button"}),
            )
        );
    }
}

//render uiwrapper, the top element, to the root div 

ReactDOM.render(
  React.createElement(UiWrapper, null),
  document.getElementById('root')
);