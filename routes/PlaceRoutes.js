const router = require("express").Router();
const {
  createPlace,
  getPlace,
  getPlacesByUserId,
  updatePlace,
  deletePlace,
  getPlaces,
} = require("../controllers/PlaceController");

router.post("/create", createPlace);
router.get("/:id", getPlace);
router.get("/all", getPlaces);
router.get("/user/:id", getPlacesByUserId);
router.put("/:id", updatePlace);
router.delete("/:id", deletePlace);

module.exports = router;