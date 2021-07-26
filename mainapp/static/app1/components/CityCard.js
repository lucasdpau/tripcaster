import React from 'react';

const CityCard = (props) => {
    // set up the css class for this element. adds 'selected card' class if in the select_card array
    var cardClasses = "city_weather_card";
    if (props.selectedSlots.includes(props.index)) {
        cardClasses += " selected_card";
    }
    
    // 1000ms * 60s * 60m * 24hrs = 86,400,000 ms per day
    // top component has the current date. each card's date is increased by its index
    // we also want the date formated in short form eg: "Mar 20", "Sep 4"
    const dateOfThisCard = new Date();
    dateOfThisCard.setTime(props.currentDate.getTime() + (86400000 * props.index));
    const monthDay = dateOfThisCard.toDateString().substring(4, 10);

    return (
        <div
            className={cardClasses}
            onClick={() => props.selectCard(props.index)}
        >
            <h2 className='centered'>
                {monthDay}
            </h2>
            <div className='card_city_name_wrapper'>
                <h2 className='centered'>
                    {props.cityName}
                </h2>
            </div>
        </div>
    );
};

export default CityCard;