import React from "react";
import Copyright from "./Copyright";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center">
            <span className="text-muted">Made with</span>
            <i className="bi bi-heart-fill text-danger"></i>
            <span className="text-muted">by the community</span>
            <span className="text-muted d-none d-sm-inline">•</span>
            <a
              href="https://github.com/ihtasham42/social-media-app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
            >
              <i className="bi bi-star"></i>
              Star
            </a>
          </div>
          <div>
            <Copyright />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;