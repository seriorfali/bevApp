var orderRouter = require("express").Router()
  , ordersController = require("../assets/controllers/ordersController.js")

orderRouter.route("/users/:user_id/orders")
	.get(ordersController.showAllUserOrders)

orderRouter.route("/cafes/:cafe_id/orders")
	.get(ordersController.showAllCafeOrders)
	
orderRouter.route("/orders/:id")
	.get(ordersController.showOrder)
	.put(ordersController.editOrder)
	.patch(ordersController.editOrder)
	.delete(ordersController.deleteOrder)
	
module.exports = orderRouter