// createa shortcut so we don't go crazy 
const Ele = React.createElement;

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
        this.setState({[event.target.name]: event.target.value,
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
                Ele(cityWeatherCards, {
                    citiesList: this.state.citiesList,
                    removeCities: this.removeCities,}),
                Ele(cityAddForm, {
                    addCities: this.addCities,
                    cityName: this.state.cityName,
                    days: this.state.days,
                    handleChange: this.handleChange
                }),
                Ele('div', null, `${this.state.citiesList}`), 
                )
        );
    }
}

function cityWeatherCards(props) {
    return(
        Ele('div', {}, 'weather cards here')
    );
}

class cityAddForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            Ele('form', {}, 
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

ReactDOM.render(
  React.createElement(UiWrapper, null),
  document.getElementById('root')
);