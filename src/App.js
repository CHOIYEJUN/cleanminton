import React from 'react';
import AppRouter from "./components/AppRouter";
import "./styles/AuthStyle.css";


function App() {

  const isLoggedIn = false;

  return (
    <div className="App">

      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} 클린민턴 </footer>
    </div>
  );
}

export default App;
