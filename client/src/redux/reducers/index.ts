import { combineReducers } from 'redux'
import { numberCollectionReducer, NumberCollectionState } from './numberReducer'

export interface State {
  numberCollection: NumberCollectionState
}

export const rootReducers = combineReducers<State>({
  numberCollection: numberCollectionReducer,
})
