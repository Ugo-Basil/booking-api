const Place = require("../models/Place");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const createPlace = async (req, res) => {
    const { token } = req.cookies;
    const {
        title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
    } = req.body;

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const placeDoc = await Place.create({
            owner: decoded.id,
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price,
        });
        res.json(placeDoc);
    }
    catch (err) {
        res.status(500).json(err);
    }
};


const getPlace = async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
};


const getPlacesByUserId = async (req, res) => {
    const { token } = req.cookies;
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const placeDoc = await Place.find({ owner: decoded.id });
        res.json(placeDoc);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

const updatePlace = async (req, res) => {
    const { id } = req.params;
    const {
        title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
    } = req.body;

    try {
        const placeDoc = await Place.findByIdAndUpdate(id, {
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price,
        });

        await placeDoc.save();
        res.json(placeDoc);
    }
    catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        });
    }
}


const deletePlace = async (req, res) => {
    const { id } = req.params;
    try {
        await Place.findByIdAndDelete(id);
        res.json('deleted');
    }
    catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        });
    }
}

const getPlaces = async (req, res) => {
   
    try {
        const placeDoc = await Place.find();
        res.json(placeDoc);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    createPlace,
    getPlace,
    getPlacesByUserId,
    updatePlace,
    deletePlace,
    getPlaces
}


