import { all, fork } from 'redux-saga/effects'
import { watchNewGeneratedNumberRequestStart } from './numberfile'

export const rootSaga = function* root() {
  yield all([fork(watchNewGeneratedNumberRequestStart)])
}
