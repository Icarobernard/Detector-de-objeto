import React from 'react';
import logo from './favicon.png';
import './App.css';
import DetectorVideo from './components/DetectorVideo';




function App() {

  return (
    <>

      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="App-subheading">Detecção de objeto com Tensorflow by  <a className="Loading" href="https://github.com/Icarobernard">Icaro Bernard</a></p>
        <header className="App-header">
          <DetectorVideo />
          <p className="Loading">
            Carregando...
        </p>
        </header>
      </div>
    </>
  );
}

export default App;
