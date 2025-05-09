const { Router } = require("express");
const router = Router();

const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('assets/placePhotos'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
    }
})

const load = multer({storage})

const placeController = require("../controllers/placeController");

router.post("/create", load.array('photos', 5), placeController.create);
router.put("/edit/:idPlace", load.array('photos', 5), placeController.edit);
router.put("/specialSuggest/:idPlace",load.array('photos', 5), placeController.specialSuggest);
router.put("/editSpecialSuggest/:idPlace/:idSpecialSuggest",load.array('photos', 5), placeController.editSpecialSuggest);
router.delete("/delete/:idPlace", placeController.deletePlace);
router.get("/place/:idPlace", placeController.getPlace);
router.get("/place/:productName ", placeController.getPlacesByProductName);
router.get("/place/specialSuggest/:specialSuggestId ", placeController.getPlacesBySpecialSuggest);
router.get("/place/top-rated ", placeController.getTopRatedPlaces);
router.get("/place/most-reviewed", placeController.getMostReviewedPlaces);
router.get("/places", placeController.getAllPlaces);
router.get("/places/near", placeController.getPlacesNear);
router.get("/places/discounts", placeController.getPlacesWithDiscounts);
router.get("/places/:id/products/top-sold", placeController.getTopSoldProducts);

module.exports = router;