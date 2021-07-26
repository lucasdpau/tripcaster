import { React, useEffect, useState } from 'react';
const ReactDOM = require('react-dom');

const UiWrapperHook = () => {
    const [cityCardList, setCityCardList] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [expiredReport, setExpiredReport] = useState(false);

    // we need the empty array in the use effect or else it will keep spamming fetch requests
    useEffect(() => {
        const queryString = window.location.search;
        fetch(window.origin + "/api/weatherdata" + queryString)
            .then(
                (response) => {
                    if (response.status != 200) {
                        console.log("error! status code:" + response.status);
                        return
                    } else {
                        return response.json();
                    }
                }
            ).then(
                (response) => {
                    setCityCardList(response["city_reports"]);
                    setLoaded(true);
                    setExpiredReport(response["expired_report"]);
                }
            ).catch(err => {
                console.error(err);
            });
    }, []);

    const loadingGif = window.origin + "/static/app1/loader.gif";
    let cityWeatherCardArray;
    // The page displays "Loading..." before the fetch request finishes
    if (cityCardList.length === 0) {
        if (loaded === true) {
            if (expiredReport === true) {
                cityWeatherCardArray =
                    <div>
                        <h2>
                            Your report has expired. We hope you enjoyed your trip!
                        </h2>
                    </div>
            } else {
                cityWeatherCardArray =
                    <div>
                        <h2>
                            No Reports
                        </h2>
                    </div>
            }
        } else {
            cityWeatherCardArray =
                <div className='centered'>
                    <h2>
                        Loading...
                    </h2>
                    <img
                        src={loadingGif}
                        alt='Loading'
                        className='results_loader'
                    />
                </div>
        }
    } else {
        cityWeatherCardArray = cityCardList.map((card) =>
            <CityWeatherCard
                key={card.data.valid_date}
                cardinfo={card}
            />
        );
    }
    return (
        <div className='results_city_weather_card_wrapper'>
            {cityWeatherCardArray}
        </div>
    );
}

const CityWeatherCard = (props) => {
    // check if the object has an error message. 
    if (props.cardinfo.data.weather.description == "Error 204. Did you provide an invalid city?") {
        return (
            <div className='city_weather_card'>
                <h2>
                    No Report
                </h2>
            </div>
        );
    } else {
        const iconURL = window.origin + "/static/app1/icons/";
        return (
            <div className='city_weather_card'>
                <h2 className='centered'>
                    {props.cardinfo.weekday}
                </h2>
                <h2 className='centered'>
                    {props.cardinfo.month_day}
                </h2>
                <h2 className='centered'>
                    {props.cardinfo.city}
                </h2>
                <div className='centered results_weather_description'>
                    {props.cardinfo.data.weather.description}
                </div>
                <div className='centered results_weather_icon'>
                    <img
                        src={iconURL + props.cardinfo.data.weather.icon + '.png'}
                    />
                </div>
                <div>
                    <span className='weather_card_high'>
                        {`${props.cardinfo.data.high_temp}C / `}
                    </span>
                    <span className='weather_card_low'>
                        {`${props.cardinfo.data.low_temp}C`}
                    </span>
                </div>
                <div>
                    {`POP: ${props.cardinfo.data.pop}%`}
                </div>
                <div>
                    {`Precipitation: ${props.cardinfo.data.precip}mm`}
                </div>
                <div>
                    {`Relative Humidty: ${props.cardinfo.data.rh}%`}
                </div>
                <div>
                    {`UV: ${props.cardinfo.data.uv}`}
                </div>
            </div>
        );
    }
};

ReactDOM.render(
    React.createElement(UiWrapperHook, {}),
    document.getElementById('root')
);