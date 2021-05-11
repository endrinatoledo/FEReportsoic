/* eslint eqeqeq: 0 */
/* eslint-disable import/first */
import './assets/css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Navigation from './components/Navigation/Navigation'
import Login from './components/Login/Login2';
import NotRegistered from './components/NotRegistered/view';
if(
    localStorage.getItem("notReg") === "true" &&
    localStorage.getItem("usrEmail") === null &&
    localStorage.getItem("usrName") === null &&
    localStorage.getItem("usrRol") === null &&
    localStorage.getItem("usrStatus") === null 
    ){
    ReactDOM.render(<NotRegistered />, document.getElementById('root'));
}else if(
    localStorage.getItem("usrEmail") === null ||
    localStorage.getItem("usrName") === null ||
    localStorage.getItem("usrRol") === null ||
    localStorage.getItem("usrStatus") === null 
    ){
    ReactDOM.render(<Login />, document.getElementById('root'));
}else{
    ReactDOM.render(<Navigation />, document.getElementById('root'));
}
