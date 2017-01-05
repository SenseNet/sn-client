import { normalize } from 'normalizr';
import { combineReducers } from 'redux';

/**
 * Module for defining Redux reducers.
 * 
 * _Actions describe the fact that something happened, but don't specify how the application's state changes in response. This is the job of a reducer._
 * 
 * Following module contains the reducers of sn-redux, some 'reducer groups' and the root reducer which could be passed to the store creator function. Using a root reduces means
 * that you define which combination of reducers will be used and eventually defines which type of actions can be called on the store.
 */
export module Reducers {

  /**
   * Reducer to handle Actions on the byId Object in the state, which is a dictionary with normalized nested JSON response. It becomes the current state and an action as arguments,
   * creates a new state based on the previous state and the action and returns it as the next state. If the Action doesn't affect the state the returned state will
   * be the current state itself.
   * @param {Object} [state={}] Represents the current state.
   * @param {Object} action Represents an action that is called.
   * @returns {Object} state. Returns the next state based on the action.
   */
  export const byId = (state = {}, action) => {
    if (action.response) {
      return (<any>Object).assign({}, state, action.response.entities.collection);
    }
    switch (action.type) {
      case 'DELETE_CONTENT_SUCCESS':
        let res = Object.assign({}, state);
        delete res[action.id];
        return res;
      default:
        return state;
    }
  }
  /**
   * Reducers to handle Actions on the ids Array in the state, which is the list Ids of the Content in the byId Object. It becomes the current state of the ids array and an action
   * creates a new array based on the current one and the action and returns it as the next state of the ids array. If the Action doesn't affect the state the returned state will
   * be the current state itself.
   * @param {number[]} state Represents the current state.
   * @param {Object} action Represents the action that is called.
   * @returns {number[]} state. Returns the next state based on the action.
   */
  export const ids = (state = [], action) => {
    switch (action.type) {
      case 'FETCH_CONTENT_SUCCESS':
        return action.response.result;
      case 'CREATE_CONTENT_SUCCESS':
        return [...state, action.response.result];
      case 'DELETE_CONTENT_SUCCESS':
        return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
      default:
        return state;
    }
  }
  /**
   * Reducers to set in the state if the data is fetching or not. If the Action doesn't affect the state the returned state will be the current state itself.
   * @param {boolean} [state=false] Represents the current state.
   * @param {Object} action Represents the action that is called.
   * @returns {boolean} state. Returns the next state based on the action.
   */
  export const isFetching = (state = false, action) => {
    switch (action.type) {
      case 'FETCH_CONTENT_REQUEST':
        return true;
      case 'FETCH_CONTENT_SUCCESS':
      case 'FETCH_CONTENT_FAILURE':
        return false;
      default:
        return state;
    }
  }
  /**
   * Reducers to set the errormessage in the state if a process is failed. If the Action doesn't affect the state the returned state will be the current state itself.
   * @param {any} [state=null] Represents the current state.
   * @param {any} action Represents the action that is called.
   * @returns {string} state. Returns the next state based on the action.
   */
  export const errorMessage = (state: any = null, action: any) => {
    switch (action.type) {
      case 'FETCH_CONTENT_FAILURE':
      case 'CREATE_CONTENT_FAILURE':
      case 'UPDATE_CONTENT_FAILURE':
      case 'DELETE_CONTENT_FAILURE':
      case 'CHECKIN_CONTENT_FAILURE':
      case 'CHECKOUT_CONTENT_FAILURE':
      case 'PUBLISH_CONTENT_FAILURE':
      case 'APPROVE_CONTENT_FAILURE':
      case 'REJECT_CONTENT_FAILURE':
      case 'UNDOCHECKOUT_CONTENT_FAILURE':
      case 'FORCEUNDOCHECKOUT_CONTENT_FAILURE':
      case 'RESTOREVERSION_CONTENT_FAILURE':
        return action.message;
      case 'FETCH_CONTENT_REQUEST':
      case 'FETCH_CONTENT_SUCCESS':
      case 'CREATE_CONTENT_REQUEST':
      case 'CREATE_CONTENT_SUCCESS':
      case 'UPDATE_CONTENT_REQUEST':
      case 'UPDATE_CONTENT_SUCCESS':
      case 'DELETE_CONTENT_REQUEST':
      case 'DELETE_CONTENT_SUCCESS':
      case 'CHECKIN_CONTENT_REQUEST':
      case 'CHECKIN_CONTENT_SUCCESS':
      case 'CHECKOUT_CONTENT_REQUEST':
      case 'CHECKOUT_CONTENT_SUCCESS':
      case 'APPROVE_CONTENT_REQUEST':
      case 'APPROVE_CONTENT_SUCCESS':
      case 'PUBLISH_CONTENT_REQUEST':
      case 'PUBLISH_CONTENT_SUCCESS':
      case 'REJECT_CONTENT_REQUEST':
      case 'REJECT_CONTENT_SUCCESS':
      case 'UNDOCHECKOUT_CONTENT_REQUEST':
      case 'UNDOCHECKOUT_CONTENT_SUCCESS':
      case 'FORCEUNDOCHECKOUT_CONTENT_REQUEST':
      case 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS':
      case 'RESTOREVERSION_CONTENT_REQUEST':
      case 'RESTOREVERSION_CONTENT_SUCCESS':
        return null;
      default:
        return state;
    }
  }

  /**
   * Reducer combining ```byId``` object, ```ids``` array, isFetching and errorMessage into a single object which means ```collection``` will be a top object in the state.
   */
  export const collection = combineReducers({
    byId,
    ids,
    isFetching,
    errorMessage
  })
  /**
   * Reducer to hold the collection object and represent a root reducer of a SenseNet Redux application store. If you want to add your custom Reducers to the store, create your own
   * root Reducer combining ```collection``` and your top Reducer.
   */
  export const snApp = combineReducers({
    collection
  })
  /**
   * Method to get a Content item from a state object by its Id.
   * @param {Object} state Current state object.
   * @param {number} Id Id of the Content.
   * @returns {Object} content. Returns the Content from a state object with the given Id.
   */
  export const getContent = (state: Object, Id: number) => state[Id];
  /**
   * Method to get the ```ids``` array from a state object.
   * @param {Object} state Current state object.
   * @returns {number[]} content. Returns the ```ids``` array from the given state.
   */
  export const getIds = (state: any) => state.ids;
  /**
   * Method to get if the fetching of data is in progress.
   * @param {Object} state Current state object.
   * @returns {boolean} Returns true or false whether data fetching is in progress or not.
   */
  export const getFetching = (state: any) => state.isFetching;
  /**
   * Method to get the error message.
   * @param {Object} state Current state object.
   * @returns {string} Returns the error message.
   */
  export const getError = (state: any) => {

    return state.errorMessage
  };
}