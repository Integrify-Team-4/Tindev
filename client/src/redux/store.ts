import { createStore, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { rootReducers } from './reducers'
import { rootSaga } from './saga'

const sagaMiddleware = createSagaMiddleware()
let composeEnhancer = compose
if (process.env.NODE_ENV === 'development') {
  if ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  }
}

export const store = createStore(
  rootReducers,
  {},
  composeEnhancer(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(rootSaga)
