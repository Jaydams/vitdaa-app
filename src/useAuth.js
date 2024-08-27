import React, { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "./supabaseClient";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("session", session.user.metadata);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error fetching session:", error.message);
      }
    };

    //Fetch initial session on Component Mount
    fetchUser();

    //Clean up listener on Component Unmount

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
