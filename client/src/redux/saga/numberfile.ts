import { call, put, takeEvery } from 'redux-saga/effects'
import { numberRequestCompletedAction } from '../actions/numberAction'
import { actionIds } from '../actions/types'

export function* watchNewGeneratedNumberRequestStart() {
  yield takeEvery(actionIds.GET_NUMBER_REQUEST_START, requestNewGeneratedNumber)
}
// should we create another file for promise ??
let initialNumber = 0
export const generateNewNumber = (): Promise<number> => {
  const promise = new Promise<number>((resolve) => {
    setTimeout(() => {
      initialNumber += 1
      resolve(initialNumber)
    }, 500)
  })

  return promise
}

function* requestNewGeneratedNumber() {
  const generatedNumber = yield call(generateNewNumber)
  yield put(numberRequestCompletedAction(generatedNumber))
}
