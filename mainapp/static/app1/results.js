// create a shortcut so we don't go crazy 
const Ele = React.createElement;

class UiWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityCardList: [],
        };
    }

    getCityWeatherData = () => {
        // AJAX request to get the weather data
        var queryString = window.location.search;
        var listOfCityData;
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
               listOfCityData = xhttp.responseText;
               console.log(xhttp.responseText);
            }
        };
        xhttp.open("GET", "/api/weatherdata" + queryString, true);
        xhttp.send();
        
        this.setState({cityCardList: listOfCityData});
    }

    render() {
        return (
            Ele('div', {}, 'hi',
                Ele(cityWeatherCard, null),
                Ele('button', {'type':'button', onClick: () => this.getCityWeatherData()}, 'AJAX here'))
        );
    }
}

function cityWeatherCard(props) {
    return (
        Ele('div', {}, 
            Ele('h1', {}, 'City Name here'),
            Ele('h2', {}, "Weather description here"),
            Ele('div', {}, "icon here"),
            Ele('div', {}, 'date here'),
            Ele('div', {}, "high temp here"),
            Ele('div', {}, "low temp here"),
            Ele('div', {}, "percent of precip"),
            Ele('div', {},'precip here'),
            Ele('div', {}, 'humidity here'),
            Ele('div', {}, 'UV here'),
            )
    );
}

ReactDOM.render(
    Ele(UiWrapper, {}), 
    document.getElementById('root')
);