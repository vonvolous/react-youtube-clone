import { combineReducers } from "redux"; //combineReducer를 이용해 rootReducer로 합쳐줌
import user from './user_reducer';

const rootReducer = combineReducers({
    user
})

export default rootReducer;