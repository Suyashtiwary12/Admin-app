import React, { useState} from "react";
import { SignIn } from "./signup/signin";
import { SignUp } from "./signup/signup";
import { Dashboard } from "./dashboard/dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { FirebaseProvider } from "./store/firebase";
function App() {
  const [isSignIn, setIsSignIn] = useState(true);
  const[isDashboard,setDashboard]=useState(false);

  const switchMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <>
      <FirebaseProvider>
      {isSignIn&&!isDashboard ? <SignIn onSwitchMode={switchMode} toRenderdash={setDashboard} /> : (!isDashboard)?<SignUp onSwitchMode={switchMode} />:null}
      {isDashboard? <Dashboard />:null }
      </FirebaseProvider>
    </>
  );
}

export default App;
