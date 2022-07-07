import FetchFullContent from './FetchFullContent'
import './App.css';
import React, {useState} from 'react';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider, connect} from 'react-redux';



function promiseReducer(state, {type, status, name, payload, error}){ 
  
    if (state === undefined){
        return {}
    }

    if (type === 'PROMISE'){
        return {
            ...state,
            [name]: {status, payload ,error}
        }
    }
    return state 
}

const store = createStore(promiseReducer, applyMiddleware(thunk))


const actionPending   = name            => ({type: 'PROMISE', status: 'PENDING', name})
const actionFulfilled = (name, payload) => ({type: 'PROMISE', status: 'FULFILLED', name, payload})
const actionRejected  = (name, error)   => ({type: 'PROMISE', status: 'REJECTED', name, error})

const actionPromise = (name, promise) =>
    async dispatch => {
        dispatch(actionPending())
        try{
            let payload = await promise
            console.log('PAYLOAD')
            dispatch(actionFulfilled(name, payload))
            return payload
        }
        catch(err){
            dispatch(actionRejected(name, err))
        }
    }

    
    store.dispatch(actionPromise('FetchFullContent', FetchFullContent('https://swapi.dev/api/people/10')))
    store.dispatch(actionPromise('FetchSecondContent', FetchFullContent('https://swapi.dev/api/films/1/')))
    
    
    
const PromiseViewer = ({status, payload, error}) =>

<div>
    <strong>Status</strong>: {status}<br/>
    {status === 'FULFILLED' &&  <><strong>Payload</strong>: {payload}<br/></>}
    {status === 'REJECTED'  &&  <><strong>ERROR</strong>: {error}<br/></>}
</div>



const PromiseVue = ({status, payload, error}) =>

<div className='hero'>
    {status === 'REJECTED'  &&  <><strong>ERROR</strong>: {error}</>}
    {status === 'FULFILLED' &&  <><strong>Name</strong> {payload.name}</>}
    {status === 'FULFILLED' &&  <><strong>Birth</strong>: {payload.birth_year}</>}
    {status === 'FULFILLED' &&  <><strong>Films:</strong></>}
    {status === 'FULFILLED' &&  <><ul>{payload.films  ? payload.films.map((film, index) => <li key={index}>{JSON.parse(payload.films[index]).title}</li>) : 'LOADING'}</ul></>} 
</div>

const PromiseHero = ({status, payload, error}) =>

<div className='film'>
    {status === 'REJECTED'  &&  <><strong>ERROR</strong>: {error}</>}
    {status === 'FULFILLED' &&  <><strong>Name</strong> {payload.title}</>}
    {status === 'FULFILLED' &&  <><strong>Director</strong> {payload.director}</>}
    {status === 'FULFILLED' &&  <><strong>Heroes:</strong></>}
    {status === 'FULFILLED' &&  <><ul>{payload.characters  ? payload.characters.map((hero, index) => <li key={index}>{JSON.parse(payload.characters[index]).name}</li>) : 'LOADING'}</ul></>} 

</div>



const ShowFullContent =      connect(state => (state.FetchFullContent) || {})(PromiseVue)
const ShowSecondContent =      connect(state => (state.FetchSecondContent) || {})(PromiseHero)


console.log(store.getState().FetchFullContent)

function App() {
  return (
    <Provider store={store}>
        <div className="App">
          <ShowFullContent/>
          <ShowSecondContent/>
        </div>
    </Provider>
  );
}

export default App;
