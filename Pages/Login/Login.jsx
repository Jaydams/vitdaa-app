import React, { useState } from "react";
import { supabase } from "../../src/lib/helper/supabaseClient";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Error logging in with Google:", error.message);
    } else {
      navigate("/");
      console.log("Google Login successful!");
    }
  };

  const login = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signIn({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.error("Error logging in:", error.message);
    } else {
      navigate("/");
      console.log("Login successful!");
    }
  };

  const signup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.error("Error signing up:", error.message);
    } else {
      console.log("Signup successful!");
      navigate("/");
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error loggin out:", error.message);
    } else {
      navigate("/");
      console.log("Signed out successful!");
    }
  };

  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        value={formData.email}
        onChange={handleInputChange}
      />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        value={formData.password}
        onChange={handleInputChange}
      />
      <button onClick={login}>Login</button>
      <button onClick={signup}>Sign up</button>
      <button onClick={logout}>Logout</button>
      <button onClick={googleLogin}>Login with Google</button>
    </form>
  );
}

export default Login;
