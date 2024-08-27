import React, { useState, useEffect } from "react";
import { supabase } from "../../../src/lib/helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import Login from "../../../Pages/Login/Login";

const Navbar = ({ searchTerm, updatedSearch }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      } else {
        navigate("/login"); // Redirect to login if user is not authenticated
      }
    };

    checkUser();
  }, [navigate]);

  const [shadow, setShadow] = useState(false);

  const handleScroll = () => {
    setShadow(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchChange = (event) => {
    updatedSearch(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent page reload on form submit
    // No need to do anything here since the searchTerm is updated on change
  };

  return (
    <div className={`top-bar ${shadow ? "shadow" : ""}`}>
      <nav>
        <div className="logo">
          Vit<span style={{ color: "black" }}>daa</span>
        </div>

        <ul>
          <li className="active">All</li>
          <li>Restaurants</li>
          <li>Hotels</li>
          <li>Cooking Videos</li>
        </ul>

        <form onSubmit={handleSearchSubmit}>
          <input
            type="search"
            name="search"
            id="main-search"
            placeholder="Search Restaurants, Hotels & Videos"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>

        <div className="user">
          <i className="fa fa-user fa-lg">
            {user ? (
              <h6>Welcome {user.email}</h6>
            ) : (
              <Link to="/login">
                <h6>Login</h6>
              </Link>
            )}
          </i>
        </div>
      </nav>

      <div className="add">.</div>
    </div>
  );
};

export default Navbar;
