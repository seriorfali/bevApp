var cafeRouter = require("express").Router()
  , cafesController = require("./assets/controllers/cafesController.js")

cafeRouter.route("/")
	.get(cafesController.showAllCafes)
	.post(cafesController.addCafe)
	.delete(cafesController.deleteAllCafes)
	
cafeRouter.route("/:id")
	.get(cafesController.showCafe)
	.put(cafesController.editCafe)
	.patch(cafesController.editCafe)
	.delete(cafesController.deleteCafe)
	
module.exports = cafeRouter