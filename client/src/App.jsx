import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from 'react-hot-toast';
import Login from "./components/Login";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <Header setIsLoginOpen={setIsLoginOpen} />
      
      <main className="min-h-[77vh]">
        <Outlet context={{ setIsLoginOpen }} />
      </main> 

      <Footer />
      <Toaster />

      {/* Check if Login Component is Being Rendered */}
      {isLoginOpen && (
        <>
          {console.log("Rendering Login Popup")}
          <Login setIsLoginOpen={setIsLoginOpen} />
        </>
      )}
    </>
  );
}

export default App;
