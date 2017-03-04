// @flow
import { combineReducers } from "redux";
import { routerReducer as routing } from "react-router-redux";
import photos from "./photos";

const rootReducer = combineReducers({
  photos,
  routing
});

export default rootReducer;
