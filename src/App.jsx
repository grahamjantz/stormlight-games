import React, { useState } from "react";
import { 
  Route, 
  Routes, 
  useNavigate,
} from 'react-router-dom'

import GuessHeraldName from "./components/GuessHeraldName";
import Header from "./components/Header";
import OrdersGuessingGame from "./components/OrdersGuessingGame";
import HeraldSurgeGuessingGame from "./components/HeraldSurgeGuessingGame";
import SurgesGuessingGame from "./components/SurgesGuessingGame";
import RadiantOrderGame from "./components/RadiantOrderGame";
import RadiantSprenGame from "./components/RadiantSprenGame";

const App = () => {
  return (
    <div className="w-full flex flex-col items-center ">
      <Header />
      <Routes>
        <Route path='/' element={
          <GuessHeraldName />
        }></Route>
        <Route path='/guess-order' element={
          <OrdersGuessingGame />
        }></Route>
        <Route path='/guess-surges' element={
          <SurgesGuessingGame />
        }></Route>
        <Route path='/guess-herald-surges' element={
          <HeraldSurgeGuessingGame />
        }></Route>
        <Route path='/radiant-glyphs' element={
          <RadiantOrderGame />
        }></Route>
        <Route path='/radiant-spren' element={
          <RadiantSprenGame />
        }></Route>
      </Routes>
    </div>
  );
};

export default App;
