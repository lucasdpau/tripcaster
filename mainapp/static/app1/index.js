// create a shortcut so we don't go crazy 
const Ele = React.createElement;

// uiwrapper will be the very top component. it has 2 children: card wrapper and the form
// card wrapper will have the weather/city cards, forms will have the form functionality and buttons

class UiWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityName: '',
            citiesList: new Array(16).fill(''),
            queryString: '?',
            selectedSlots: [],
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    // handle change for multiple forms
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
                        });
    }

    clearCitiesList = () => {
        let clearedCitiesList = new Array(16).fill('');
        this.setState({citiesList: clearedCitiesList, cityName: ''});
        this.updateQueryString();
    }

    selectCard = (index) => {
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
        console.log('you clicked on card #' + index);
        console.log(this.state.selectedSlots);
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
        console.log('hi');
    }

    removeCities = (index) => {
        // replaces city at index with a placeholder city the api won't recognize
        // if we removed the city from the list the whole array would shift.
        let newCitiesList = this.state.citiesList;
        newCitiesList[index] = 'xxxxx';
        this.setState({citiesList: newCitiesList});
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
        console.log("querystring is: " + this.state.queryString);
    }

    render() {
        return (
            Ele('div', null, 
                Ele(cityWeatherCardsArray, {
                    selectCard: this.selectCard,
                    citiesList: this.state.citiesList,
                    removeCities: this.removeCities,
                    selectedSlots: this.state.selectedSlots,
                    }),
                Ele('div', {},                 
                    Ele(cityAddForm, {
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

function cityWeatherCardsArray(props) {
    let cities = props.citiesList;
    // TODO using index for keys is not ideal, as we can remove and rearrange 
    //components. it's best to use unique data from the objects, such as the 
    // date or temp. go back to change this when data is iplemented.
    // see https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
    let cityCardArray = cities.map((card, index) => 
        Ele(cityWeatherCard, {'key': index, 
                            selectedSlots: props.selectedSlots, 
                            selectCard: props.selectCard, 
                            card: card, 
                            removeCities: props.removeCities, 
                            index: index})
    );
    return(
        Ele('div', {className: "city_weather_card_wrapper"}, cityCardArray)
    );
}

function cityWeatherCard(props) {
    var city_weather_card = "city_weather_card";
    if (props.selectedSlots.includes(props.index)) {
        city_weather_card += " selected_card";
    }
    return (
        Ele('div',{className: city_weather_card, onClick: () => props.selectCard(props.index)},
            Ele('h2', {className: "centered"}, "Day " + (parseInt(props.index)+1)),
            Ele('h2', {}, props.card),
            Ele('br',null),
            Ele('button', {'type':'button', className: "form_button", onClick: () => props.removeCities(props.index)}, 'Remove'))
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
        console.log("submit button pressed");
        event.preventDefault();
        window.location = "/results" + this.props.queryString;
    }

    render() {
        return (
            // create the form
            Ele('form', {onSubmit: this.handleSubmit, id: "cityEntryForm"}, 
                Ele('label', {'htmlFor':'cityName', className: 'form_label'}, 'City'),
                Ele('br', null),
                Ele('input', {'type': 'text', 
                            'name': 'cityName',
                            'id':'cityName',
                            'value': this.props.cityName,
                            'onChange': this.props.handleChange, 
                            className: "form_input"
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