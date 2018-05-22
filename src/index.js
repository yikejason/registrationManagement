import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import App from './views/home/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Router basename="/Info"><App /></Router>, document.getElementById('root'));
registerServiceWorker();
