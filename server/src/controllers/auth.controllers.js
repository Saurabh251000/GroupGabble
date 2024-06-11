import jwt from 'jsonwebtoken';
import asyncHandler from "express-async-handler";
import User from '../models/user.models.js';
import bcrypt from 'bcrypt';
// import dotenv from "dotenv";
// dotenv.config();


export const signup = asyncHandler(async (req, res) => {

  try {
    const { username, password, confirmPassword, name } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    if ([name, username, password].some((field) => field?.trim() === "")) {
      return res.status(411).json({ msg: "All fields required" });
    }

    const existinguser = await User.findOne({ username });

    if (existinguser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // HASH PASSWORD HERE
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashPwd,
      name
    });

    return res.status(201).json({ user, msg: "User registered Successfully" });
  }
  catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }

});

export const login = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: " User does not exist" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // const accessToken = await user.generateAccessToken();
    // const refreshToken = await user.generateRefreshToken();
    const accessToken = jwt.sign(
      {
        UserInfo: {
          userid: user._id,
          userName: user.username,
          name: user.name
        },
      },
      process.env.ACCESSTOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // console.log(" ynha tak shi hai");
    const refreshToken = jwt.sign(
      { userName: user.username },
      process.env.REFRESHTOKEN_SERCRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });

  }
  catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken)
    return res.status(401).json({ msg: "no jwt found in cookies" });

  const refreshToken = cookies.refreshToken;
  // console.log("bro you are right");
  jwt.verify(
    refreshToken,
    process.env.REFRESHTOKEN_SERCRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ msg: "Forbidden" });
      console.log(decoded.userName);
      const foundUser = await User.findOne({
        username: decoded.userName,
      }).exec();

      if (!foundUser) return res.status(401).json({ msg: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            userid: foundUser._id,
            userName: foundUser.username,
            name: foundUser.name
          },
        },
        process.env.ACCESSTOKEN_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ accessToken });
    }
  );
});

export const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    return res
      .status(204)
      .json({ msg: "No refresh token found in cookies" });
  }
  res.clearCookie("refreshToken", {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000,

  });
  return res.status(200).json({ msg: "Cookie cleared successfully." });
});




