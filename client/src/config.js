let BASE_URL = "https://post-it-heroku.herokuapp.com/";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  BASE_URL = "https://full-stack-social-media-app-three.vercel.app/";
}

export { BASE_URL };
