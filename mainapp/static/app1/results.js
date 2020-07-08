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
        let listOfCityData = [];
        // AJAX request to get the weather data

        this.setState({cityCardList: listOfCityData});
    }

    render() {
        return (
            Ele('div', {}, 'hi',
                Ele(cityWeatherCard, null))
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