var  React = require('react');
var  ReactDOM = require('react-dom');
// create a shortcut so we don't go crazy 
const Ele = React.createElement;

class UiWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityCardList: [],
            loaded: false,
        };
    }

    componentDidMount() {
        // AJAX request to get the weather data
        // arrow notation allows this to refer to the UiWrapper instance
        // and not the subfunction
        let queryString = window.location.search;
        fetch(window.origin + "/api/weatherdata" + queryString)
        .then(
            (response) => {
                if (response.status != 200) {
                    console.log ("error! status code:" + response.status);
                    return
                } else {
                    return response.json();
                }
            }
        ).then(
            (response) => {
                this.setState({cityCardList: response["data"], 
                                loaded: true,
                                });
            }
        );
    }
    render() {
        let loadingGif = window.origin +"/static/app1/loader.gif";
        let cityWeatherCardArray;
        // The page displays "Loading..." before the fetch request finishes
        if (this.state.cityCardList.length == 0) {
            if (this.state.loaded == true){
                cityWeatherCardArray = Ele('div', {}, 
                Ele('h2',{}, 'No Reports'));
            } else {
                cityWeatherCardArray = Ele('div', {className: "centered"}, 
                Ele('h2',{}, 'Loading...'),
                Ele('img', {'src': loadingGif , 'alt': 'Loading', className: "results_loader"},));
            }

        } else {
            cityWeatherCardArray = this.state.cityCardList.map((card) =>
                Ele(cityWeatherCard, {'key': card.data.valid_date, cardinfo:card})
            );
        }
        return (
            Ele('div', {className: "results_city_weather_card_wrapper"}, cityWeatherCardArray)
        );
    }
}

function cityWeatherCard(props) {
    // check if the object has an error message. 
    if (props.cardinfo.data.weather.description ==  "Error 204. Did you provide an invalid city?") {
        return (
            Ele('div', {className: "city_weather_card"}, 
                Ele('h2', {}, "No Report"),)
        );
    } else {
        let iconURL = window.origin +"/static/app1/icons/";
        return (
            Ele('div', {className: "city_weather_card"}, 
                Ele('h2', {className: "centered"}, props.cardinfo.weekday),
                Ele('h2', {className: "centered"}, props.cardinfo.month_day),
                Ele('h2', {className: "centered"}, props.cardinfo.city),
                Ele('div', {className: "centered results_weather_description"}, props.cardinfo.data.weather.description),
                Ele('div', {className: "centered results_weather_icon"}, 
                    Ele('img', {'src': iconURL + props.cardinfo.data.weather.icon + ".png"})
                    ),
                Ele('div',{},             
                    Ele('span', {className: "weather_card_high"}, props.cardinfo.data.high_temp + "C / "),
                    Ele('span', {className: "weather_card_low"}, props.cardinfo.data.low_temp + "C")
                ),
                Ele('div', {}, "POP: " + props.cardinfo.data.pop + "%"),
                Ele('div', {}, "Precipitation: " + props.cardinfo.data.precip + "mm"),
                Ele('div', {}, "Relative Humidity: " + props.cardinfo.data.rh + "%"),
                Ele('div', {}, "UV: " + props.cardinfo.data.uv),
                )
        );
    }
}

ReactDOM.render(
    Ele(UiWrapper, {}), 
    document.getElementById('root')
);