import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../routers/Home";
import Auth from "../routers/Auth";

const AppRouter = ({isLoggin}) => {

    return (
          <Router>
              <div>
                  <p> 네비게이션 영역 </p>
              </div>

              <Routes>
                  {isLoggin ? (
                        <>
                            <Route exact path="/home" element={<Home />} >
                            </Route>
                        </>
                    ):( <Route exact path="/" element={ <Auth />}>
                        </Route>
                    )}
              </Routes>
          </Router>


    );
}

export default AppRouter;