// createa shortcut so we don't go crazy 
const Ele = React.createElement;

class UiWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityName: '',
            citiesList: [],
            days: 1,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    // handle change for multiple forms
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value,
                        });
        console.log("cityName is " + this.state.cityName);
        console.log('days is ' + this.state.days);
    }

    addCities = () => {
        // update the city list by adding a new city
        let newCitiesList = this.state.citiesList;
        let city = this.state.cityName;
        for (let i=0; i<this.state.days; i++) {
            newCitiesList.push(city);
            console.log(i + " " + city);
        }
        this.setState({citiesList: newCitiesList, days: 1, cityName: ''});
    }

    render() {
        return (
            Ele('div', null, 
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