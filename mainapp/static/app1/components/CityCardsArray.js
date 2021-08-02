import React from 'react';
import CityCard from './CityCard';

const CityCardsArray = (props) => {
    const arrayOfCityCards = props.citiesList.map((cityName, index) =>
        <CityCard
            key={index}
            selectedSlots={props.selectedSlots}
            selectCard={props.selectCard}
            currentDate={props.currentDate}
            cityName={cityName}
            index={index}
        />
    );
    
    return (
        <div
            className='city_weather_card_wrapper'
        >
            {arrayOfCityCards}
        </div>
    );
};

export default CityCardsArray;