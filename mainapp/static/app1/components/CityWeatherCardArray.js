import React from 'react';
import CityWeatherCard from './CityWeatherCard';

const CityWeatherCardArray = (props) => {
    const loadingGif = window.origin + "/static/app1/loader.gif";

    var cityWeatherCardArray;
    
    // The page displays "Loading..." before the fetch request finishes
    if (props.cityCardList.length === 0) {
        if (props.loaded === true) {
            if (props.expiredReport === true) {
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
        cityWeatherCardArray = props.cityCardList.map((card) =>
            <CityWeatherCard
                key={card.data.valid_date}
                cardinfo={card}
            />
        );
    }

    return cityWeatherCardArray
};


export default CityWeatherCardArray;