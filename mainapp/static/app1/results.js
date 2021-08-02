import { React, useEffect, useState } from 'react';
import CityWeatherCardArray from './components/CityWeatherCardArray';

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
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error("error! code: " + response.status)
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

    return (
        <div className='results_city_weather_card_wrapper'>
            <CityWeatherCardArray
                cityCardList={cityCardList}
                loaded={loaded}
                expiredReport={expiredReport}
            />
        </div>
    );
};

ReactDOM.render(
    React.createElement(UiWrapperHook, {}),
    document.getElementById('root')
);