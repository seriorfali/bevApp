var bevRouter = require("express").Router()
  , bevsController = require("../assets/controllers/bevsController.js")

bevRouter.route("/")
	.get(bevsController.showAllBevs)
	.post(bevsController.addBev)
	
bevRouter.route("/:id")
	.get(bevsController.showBev)
	.put(bevsController.editBev)
	.patch(bevsController.editBev)
	.delete(bevsController.deleteBev)
	
module.exports = bevRouter