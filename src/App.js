import "./App.css";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { Home } from "./views";
import {Edit} from "./views";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}>
          {/* <Route path="dashboard" element={<Dashboard />} /> */}

          {/* <Route path="*" element={<NoMatch />} /> */}
        </Route>
        
        <Route path="edit" element={<Edit />} />
      </Routes>
    </div>
  );
}

export default App;
