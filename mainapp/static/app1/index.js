// createa shortcut so we don't go crazy 
const Ele = React.createElement;

class UiWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityName: '',
            citiesList: ['asd', 'asdas'],
            days: 0
        };
    }

    addCities = (city) => {
        // update the city list by adding a new city
        var newCitiesList = this.state.citiesList;
        newCitiesList.push(city);
        this.setState({citiesList: newCitiesList});
    }

    render() {
        return (
            //React.createElement('div', null, 'qq')
            Ele('div', null, 
                Ele(cityAddForm, {}),
                Ele('div', null, `${this.state.citiesList}`), 
                Ele(cityAddButton, {addCities: this.addCities}),
                )
        );
    }
}

function cityAddForm(props) {
    return (
        Ele('form', {}, 
            Ele('label', {'htmlFor':'city'}, 'City'),
            Ele('input', {'type': 'text', 'name': 'city', 'id':'city'}),
            Ele('br',null,null),
            Ele('label', {'htmlFor':'days_in_city'}, 'Days in City'),
            Ele('input', {'type': 'number', 'name': 'days_in_city', 'id':'days_in_city', 'min': '1'}),
            Ele('br', null, null),
            Ele('input', {'type': 'button', 'id':'addCityButton', 'value': 'Add City'}),
            Ele('br', null, null),
            Ele('input', {'type': 'submit'}),

        )
    );
}

function cityAddButton(props) {
    return(
        Ele('button', {onClick: () => props.addCities('toronto')},'asd')
    );
}

ReactDOM.render(
  React.createElement(UiWrapper, null),
  document.getElementById('root')
);


var cityList = [];

const addCityButton = document.getElementById("addCityButton");
const cityInput = document.getElementById("city");
const daysInCityInput = document.getElementById('days_in_city');

addCityButton.addEventListener('click', addCity);
function addCity() {
    var cityName = cityInput.value;
    var daysInCity = daysInCityInput.value;
    for (let i = 0; i < daysInCity; i++) {
        cityList.push(cityName);
    }
    // reset the form
    cityInput.value = '';
    daysInCityInput.value = 1;

}