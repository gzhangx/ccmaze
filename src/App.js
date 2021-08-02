import logo from './logo.svg';
import './App.css';
import Game from './Game'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo}  alt="logo" height={10}/>
        <p>
          <Game/>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
