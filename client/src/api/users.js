import { BASE_URL } from "../config";

const signup = async (user) => {
  try {
    const res = await fetch(BASE_URL + "/api/users/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      const errData = await res.json();
      return { error: errData.message || "Signup failed" };
    }

    return await res.json();
  } catch (err) {
    console.log("Signup API error:", err);
    return { error: "Server not responding" };
  }
};


const login = async (user) => {
  try {
    const res = await fetch(BASE_URL + "/api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // If response is not OK, return error object
    if (!res.ok) {
      const errData = await res.json();
      return { error: errData.message || "Login failed" };
    }

    return await res.json(); // Successful login returns { token, user, etc. }
  } catch (err) {
    console.log("Login API error:", err);
    return { error: "Server not responding" }; // Return object even on network failure
  }
};


const getUser = async (params) => {
  try {
    const res = await fetch(BASE_URL + "api/users/" + params.id);
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const getRandomUsers = async (query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/users/random?" + new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async (user, data) => {
  try {
    const res = await fetch(BASE_URL + "api/users/" + user._id, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

export { signup, login, getUser, getRandomUsers, updateUser };
