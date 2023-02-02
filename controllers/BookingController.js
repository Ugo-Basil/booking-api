const Booking = require("../models/Booking");


const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

const createBooking = async (req, res) => {
    const userData = await getUserDataFromReq(req);
    const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;
    try {
        const bookingDoc = await Booking.create({
            place,
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            price,
            user: userData.id,
        });
        res.json(bookingDoc);
    }
    catch (err) {
        res.status(500).json(err);
    }
};

const bookings = async (req, res) => {
    const userData = await getUserDataFromReq(req);
    try {
        const bookingDoc = await Booking.find({ user: userData.id }).populate("place");
        res.json(bookingDoc);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    createBooking,
    bookings,
};