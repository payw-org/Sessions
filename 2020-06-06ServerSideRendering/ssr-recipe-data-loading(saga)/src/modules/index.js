import users, { usersSaga } from './users';

import { all } from 'redux-saga/effects';
import { combineReducers } from 'redux';

export function* rootSaga() {
  yield all([usersSaga()]);
}

const rootReducer = combineReducers({ users });
export default rootReducer;