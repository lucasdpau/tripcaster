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
            Ele('div', {'key': card.data.valid_date}, 
                Ele(cityWeatherCard, {cardinfo:card}))
        );
        return (
            Ele('div', {className: "city_weather_card_wrapper"}, cityWeatherCardArray)
        );
    }
}

function cityWeatherCard(props) {
    let iconURL = window.origin +"/static/app1/icons/";
    return (
        Ele('div', {className: "city_weather_card"}, 
            Ele('h2', {}, props.cardinfo.city),
            Ele('div', {}, props.cardinfo.data.weather.description),
            Ele('div', {}, 
                Ele('img', {'src': iconURL + props.cardinfo.data.weather.icon + ".png"})),
            Ele('div', {}, props.cardinfo.data.valid_date),
            Ele('div', {}, "High: " + props.cardinfo.data.high_temp + "C"),
            Ele('div', {}, "Low: " + props.cardinfo.data.low_temp + "C"),
            Ele('div', {}, "P.o.P.: " + props.cardinfo.data.pop + "%"),
            Ele('div', {}, "Precipitation: " + props.cardinfo.data.precip + "mm"),
            Ele('div', {}, "Relative Humidity: " + props.cardinfo.data.rh + "%"),
            Ele('div', {}, "UV: " + props.cardinfo.data.uv),
            )
    );
}

ReactDOM.render(
    Ele(UiWrapper, {}), 
    document.getElementById('root')
);