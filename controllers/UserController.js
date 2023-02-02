const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");


const jwtSecret = process.env.JWT_SECRET;


const register = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const userDoc = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
    
        });
        res.json(userDoc);
    } catch (err) {
        res.status(500).json(err);

    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
   if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
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