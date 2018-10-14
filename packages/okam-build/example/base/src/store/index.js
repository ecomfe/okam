/**
 * @file redux store
 * @author xxx
 */

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers/index';

export default createStore(reducer, applyMiddleware(thunk));
