import React from 'react';

const AddCitiesForm = (props) => {
    handleSubmit = (event) => {
        event.preventDefault();
        window.location = "/results" + props.queryString;
    };

    return (
        <div className='centered entry_form_wrapper'>
            <form
                onsubmit={handleSubmit}
                id='cityEntryForm'
            >
                <input
                    type='text'
                    name='cityName'
                    id='cityName'
                    value={props.cityName}
                    onChange={e => props.setCityName(e.target.value)}
                    className='form_input'
                    placeholder='Enter city name'
                />
                <button
                    type='button'
                    className='form_button'
                    onClick={props.addCities}
                >
                    Add City
                </button>
                <button
                    type='button'
                    className='form_button'
                    onClick={props.clearCitiesList}
                >
                    Clear
                </button>
                <input
                    type='submit'
                    className='form_button'
                />
            </form>
        </div>
    );
};

export default AddCitiesForm;