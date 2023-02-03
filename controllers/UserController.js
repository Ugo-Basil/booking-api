const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const jwtSecret =`${process.env.JWT_SECRET}`;

const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });
    res.json({ userDoc });
  } catch (err) {
    res.status(500).json(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    if (!userDoc) {
      res.status(400).json("User not found");
    }

    if (userDoc) {
      const isMatch = await bcrypt.compare(password, userDoc.password);
      if (!isMatch) {
        res.status(400).json("Password is incorrect");
      } else {
        const token = jwt.sign({ id: userDoc._id },jwtSecret, {
          expiresIn: "1d",
        });
        res.cookie("token", token, { httpOnly: true }).json({
          token,
          user: {
            name: userDoc.name,
            email: userDoc.email,
            _id: userDoc._id,
          },
        });
      }
    }
  } catch (error) {
    res.status(500).json("Failed to login");
  }
};


const logout = async (req, res) => {
    res.clearCookie('token').json('logged out');
}


const index = async (req, res) => {
   res.json("test ok");
}

const profile = async (req, res) => {
    const { token } = req.cookies;
    if (token) {
         jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
             res.json({ name, email, _id });
             
         });
    } else {
        res.json(null);
    }
}

module.exports = {
    register,
    login,
    logout,
    index,
    profile
}