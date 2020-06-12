import './index.css';

import * as serviceWorker from './serviceWorker';

import { applyMiddleware, createStore } from 'redux';

import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import rootReducer from './modules';
import thunk from 'redux-thunk';

const store = createStore(
  rootReducer,
  window.__PRELOADED_STATE__, // 이 값을 초기상태로 사용함
  applyMiddleware(thunk)
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();