import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, logoutUser } from "../helpers/authHelper";
import UserAvatar from "./UserAvatar";
import {
  AiFillFileText,
  AiFillHome,
  AiFillMessage,
  AiOutlineSearch,
  AiOutlineBell,
} from "react-icons/ai";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = isLoggedIn();
  const username = user && user.username;
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Initialize Bootstrap dropdowns manually if needed
    const initBootstrap = () => {
      if (typeof window.bootstrap !== 'undefined') {
        const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        dropdownElementList.map(function (dropdownToggleEl) {
          return new window.bootstrap.Dropdown(dropdownToggleEl);
        });
      }
    };

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initBootstrap);
    } else {
      initBootstrap();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate("/search?" + new URLSearchParams({ search }));
      setShowMobileSearch(false);
    }
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarContent = document.getElementById('navbarContent');
    
    if (navbarToggler && navbarContent && navbarContent.classList.contains('show')) {
      navbarToggler.click(); // This will close the navbar
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          {/* Brand Logo */}
          <Link className="navbar-brand d-flex align-items-center fw-bold text-decoration-none" to="/">
            <AiFillFileText size={28} className="text-primary me-2" />
            <span className="fs-4">PostIt</span>
          </Link>

          {/* Mobile Search Toggle */}
          {isMobile && (
            <button
              className="btn btn-outline-secondary btn-sm border-0 d-lg-none me-2"
              onClick={toggleMobileSearch}
              type="button"
            >
              <AiOutlineSearch size={18} />
            </button>
          )}

          {/* Navbar Toggler - Fixed version */}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Content */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Search Bar - Desktop */}
            {!isMobile && (
              <form className="d-flex mx-auto my-2 my-lg-0" style={{ maxWidth: "400px", width: "100%" }} onSubmit={handleSearchSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for posts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="btn btn-outline-primary" type="submit">
                    <AiOutlineSearch size={18} />
                  </button>
                </div>
              </form>
            )}

            {/* Navigation Links */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {/* Home Link */}
              <li className="nav-item">
                <Link 
                  className="nav-link d-flex align-items-center" 
                  to="/"
                  onClick={closeMobileMenu}
                >
                  <AiFillHome size={20} className="me-2" />
                  Home
                </Link>
              </li>

              {user ? (
                // Authenticated User Menu
                <>
                  {/* Messages */}
                  <li className="nav-item">
                    <Link 
                      className="nav-link d-flex align-items-center" 
                      to="/messenger"
                      onClick={closeMobileMenu}
                    >
                      <AiFillMessage size={20} className="me-2" />
                      Messages
                    </Link>
                  </li>

                  {/* Notifications Dropdown */}
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle d-flex align-items-center"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <AiOutlineBell size={20} className="me-2" />
                      Notifications
                      <span className="badge bg-danger ms-1">3</span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><span className="dropdown-item-text">New notification</span></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><span className="dropdown-item-text">No new notifications</span></li>
                    </ul>
                  </li>

                  {/* User Dropdown */}
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle d-flex align-items-center"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <UserAvatar width={32} height={32} username={user.username} className="me-2" />
                      {user.username}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link 
                          className="dropdown-item" 
                          to={`/users/${username}`}
                          onClick={closeMobileMenu}
                        >
                          <i className="bi bi-person me-2"></i>
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link 
                          className="dropdown-item" 
                          to="/settings"
                          onClick={closeMobileMenu}
                        >
                          <i className="bi bi-gear me-2"></i>
                          Settings
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button 
                          className="dropdown-item text-danger" 
                          onClick={() => {
                            closeMobileMenu();
                            handleLogout();
                          }}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                // Guest User Menu
                <>
                  <li className="nav-item">
                    <Link 
                      className="nav-link" 
                      to="/login"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className="btn btn-primary ms-2" 
                      to="/signup"
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobile && showMobileSearch && (
          <div className="container-fluid bg-light py-2 border-top">
            <form onSubmit={handleSearchSubmit} className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search for posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <button className="btn btn-primary me-2" type="submit">
                <AiOutlineSearch size={18} />
              </button>
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={toggleMobileSearch}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Add spacer to prevent content from being hidden under fixed navbar */}
      <div style={{ height: '80px' }}></div>
    </>
  );
};

export default Navbar;