// create a shortcut so we don't go crazy 
const Ele = React.createElement;

class UiWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityCardList: [],
        };
    }

    componentDidMount() {
        // AJAX request to get the weather data
        // arrow notation allows this to refer to the UiWrapper instance
        // and not the subfunction
        fetch(window.origin + "/api/weatherdata" + window.location.search)
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
                console.log(response);
                this.setState({cityCardList: response});
            }
        );
    }
    render() {
        let cityWeatherCardArray = this.state.cityCardList.map((card) =>
            Ele(cityWeatherCard, {'key': card.data.valid_date, cardinfo:card})
        );
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
                Ele('div', {className: "centered"}, props.cardinfo.data.weather.description),
                Ele('div', {className: "centered"}, 
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