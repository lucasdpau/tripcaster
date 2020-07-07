// create a shortcut so we don't go crazy 
const Ele = React.createElement;

// uiwrapper will be the very top component. it has 2 children: card wrapper and the form
// card wrapper will have the weather/city cards, forms will have the form functionality and buttons

class UiWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityName: '',
            citiesList: [],
            days: 1,
            queryString: '?',
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    // handle change for multiple forms
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
                        });
    }

    addCities = () => {
        // update the city list by adding a new city
        let newCitiesList = this.state.citiesList;
        let city = this.state.cityName;
        if (city != '') {
            for (let i=0; i<this.state.days; i++) {
                newCitiesList.push(city);
            }
            // the api only forecasts 16 days, so we trim the list
            if (newCitiesList.length > 16) {
                console.log("CityList is too long (max 16).");
                newCitiesList.splice(15);
            }
            this.setState({citiesList: newCitiesList, days: 1, cityName: ''});
            this.updateQueryString();
        } else {
            console.log("City name cannot be blank.");
        }
    }

    removeCities = (index) => {
        // splice removes elements starting from index specified by 1st argument
        // 2nd argument is how many elements to remove. it returns array of removed elements
        let newCitiesList = this.state.citiesList;
        newCitiesList.splice(index, 1);
        this.setState({citiesList: newCitiesList});
        this.updateQueryString();
    }

    //this will keep the query string updated
    updateQueryString = () => {
        let newQueryString = '?'
        for (let i=0; i<this.state.citiesList.length; i++) {
            newQueryString += "&cities=" + this.state.citiesList[i];
        }
        this.setState({queryString: newQueryString});
        console.log("querystring is: " + this.state.queryString);
    }

    render() {
        return (
            Ele('div', null, 
                "Please note that weather forecast accuracy is much lower past the 10 day mark.",
                Ele(cityWeatherCardsArray, {
                    citiesList: this.state.citiesList,
                    removeCities: this.removeCities,}),
                Ele('div', {},                 
                    Ele(cityAddForm, {
                        addCities: this.addCities,
                        cityName: this.state.cityName,
                        days: this.state.days,
                        handleChange: this.handleChange,
                        queryString: this.state.queryString,
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
    let cityCardArray = cities.map((card, index) => 
        Ele('div', {'key': index, onClick: () => props.removeCities(index)}, card,
            Ele('p', {}, index))
    );
    return(
        Ele('div', {}, cityCardArray)
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
            Ele('form', {onSubmit: this.handleSubmit}, 
                Ele('label', {'htmlFor':'cityName'}, 'City'),
                Ele('input', {'type': 'text', 
                            'name': 'cityName',
                            'id':'cityName',
                            'value': this.props.cityName,
                            'onChange': this.props.handleChange, 
                            }),
                Ele('br',null,null),
                Ele('label', {'htmlFor':'days'}, 'Days in City'),
                Ele('input', {'type': 'number', 
                            'name': 'days', 
                            'id':'days', 
                            'min': '1',
                            'max': '16', 
                            'value': this.props.days,
                            'onChange': this.props.handleChange,
                        }),
                Ele('br', null, null),
                Ele(cityAddButton, {addCities: this.props.addCities}),
                Ele('br', null, null),
                Ele('input', {'type': 'submit'}),
            )
        );
    }
}

function cityAddButton(props) {
    return(
        Ele('button', {'type': 'button', onClick: () => props.addCities()},'Add City')
    );
}

//render uiwrapper, the top element, to the root div 

ReactDOM.render(
  React.createElement(UiWrapper, null),
  document.getElementById('root')
);