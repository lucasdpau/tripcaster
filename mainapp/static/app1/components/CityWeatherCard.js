import React from 'react';

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

export default CityWeatherCard;