let BASE_URL = "https://full-stack-social-media-app-1-xsru.onrender.com";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  BASE_URL = "https://full-stack-social-media-app-1-xsru.onrender.com/";
}

export { BASE_URL };
  // frontendurl="https://full-stack-social-media-app-view.vercel.app/"