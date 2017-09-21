import { combineReducers } from 'redux';
import { RECEIVE_TEAM } from '../actions/navigation_actions';

export const entitiesReducer = (state = {}, action) => {
  Object.freeze(state);
  switch(action.type){
    case RECEIVE_TEAM:
      return action.teamData;
    default:
      return state;
  }
};
