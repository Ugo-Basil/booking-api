const router = require("express").Router();

const {createBooking,
    bookings } = require("../controllers/BookingController");
    
router.post("/create", createBooking);
router.get("/all", bookings);


module.exports = router;