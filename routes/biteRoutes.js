var biteRouter = require("express").Router()
  , bitesController = require("../assets/controllers/bitesController.js")

biteRouter.route("/")
	.get(bitesController.showAllBites)
	.post(bitesController.addBite)
	
biteRouter.route("/:id")
	.get(bitesController.showBite)
	.put(bitesController.editBite)
	.patch(bitesController.editBite)
	.delete(bitesController.deleteBite)
	
module.exports = biteRouter