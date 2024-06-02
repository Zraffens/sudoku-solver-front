import logo from "./logo.svg";
import "./App.css";
import { Uploader } from "./components";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { Home } from "./views";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}>
          {/* <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="*" element={<NoMatch />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
