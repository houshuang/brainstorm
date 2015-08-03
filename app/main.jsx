import './stylesheets/main.css';
require('bootstrap/dist/css/bootstrap.css');
require("bootstrap-webpack");

import React from 'react';
import App from './components/App';

main();

function main() {
    var app = document.createElement('div');
    document.body.appendChild(app);

    React.render(<App />, app);
}
