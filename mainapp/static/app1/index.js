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

function drawcityWeatherCards() {

}

class uiWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityList: [],
        };
    }

    renderCityCard(index) {
        return (
            React.createElement(cityWeatherCard, 
                {cityName: this.state.cityList[index]},
                )
        );
    }

    render() {
        return (
            React.createElement('div', null, `${this.state.cityList}`)
        )
    }
}

class cityWeatherCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityName: this.props.cityName,
        };
    }
    render() {
        return (
            React.createElement('div', null, 
                React.createElement('p', null, 'blah')
            )
        );
    }
}

ReactDOM.render(
    React.createElement(uiWrapper),
    document.getElementById('root')
);
