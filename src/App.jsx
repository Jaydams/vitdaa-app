import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./style.css";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import ProfileSetup from "../Pages/ProfileSetup/ProfileSetup";
import { supabase } from "./lib/helper/supabaseClient";

const App = () => {
  const [user, setUser] = useState(null);

  // Check user session on initial load
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session ? data.session.user : null);
    };

    checkUser();

    // Optionally, listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session ? session.user : null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login user={user} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/profile-setup" element={<ProfileSetup user={user} />} />
      </Routes>
    </>
  );
};

export default App;
