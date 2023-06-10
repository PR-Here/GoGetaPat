import { createStore, combineReducers, applyMiddleware } from 'redux';
import activeScreenReducer from '../reducers/activeScreenReducer';
import postScreenReducer from '../reducers/postScreenReducer';
const rootReducer = combineReducers(
  {
    activeScreen: activeScreenReducer,
    postScreen: postScreenReducer,
  }
);
const configureStore = () => {
  return createStore(rootReducer);
};
export default configureStore;
