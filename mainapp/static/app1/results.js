import { React, useEffect, useState } from 'react';
import CityWeatherCard from './components/CityWeatherCard';
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
};

ReactDOM.render(
    React.createElement(UiWrapperHook, {}),
    document.getElementById('root')
);