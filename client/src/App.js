import React from 'react';
import logo from './logo.png';
import './App.css';
import Toplist from './Toplist';
import TweetsPerSecond from './TweetsPerSecond';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <div className="Stats-container">

        <Toplist name="words"/>
        <Toplist name="users"/>
        <Toplist name="hashtags"/>

      </div>

      <TweetsPerSecond/>

    </div>
  );
}

export default App;
