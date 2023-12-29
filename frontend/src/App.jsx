import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Outlet } from "react-router-dom";
import "./index.css";

function App() {
  return (
    <div className="spacing">
      <div>
        <Header></Header>
        <div className="container mt-4 mb-4">
          <Outlet></Outlet>
        </div>
      </div>
      <ToastContainer></ToastContainer>
      <Footer></Footer>
    </div>
  );
}

export default App;
