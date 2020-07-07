// create a shortcut so we don't go crazy 
const Ele = React.createElement;


ReactDOM.render(
    Ele('div', {}, 'Hi'), 
    document.getElementById('root')
);