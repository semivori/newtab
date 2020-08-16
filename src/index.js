import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import Firebase, { FirebaseContext } from './firebase';
import { DataProvider, DataProviderContext } from './services/DataProvider';

const firebase = new Firebase();
const dataProvider = new DataProvider(firebase);

ReactDOM.render(
  <FirebaseContext.Provider value={firebase}>
    <DataProviderContext.Provider value={dataProvider}>
      <App />
    </DataProviderContext.Provider>
  </FirebaseContext.Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
