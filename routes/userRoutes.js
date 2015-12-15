var userRouter = require("express").Router()
  , usersController = require("../assets/controllers/usersController.js")

userRouter.route("/")
	.get(usersController.showAllUsers)
	.post(usersController.addUser)
	
userRouter.route("/:id")
	.get(usersController.showUser)
	.put(usersController.editUser)
	.patch(usersController.editUser)
	.delete(usersController.deleteUser)
	
userRouter.route("/login")
	.post(usersController.login)
	
module.exports = userRouter