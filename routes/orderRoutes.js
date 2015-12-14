var orderRouter = require("express").Router()
  , ordersController = require("../assets/controllers/ordersController.js")

orderRouter.route("/users/:user_id/orders")
	.get(ordersController.showUserOrders)

orderRouter.route("/cafes/:cafe_id/orders")
	.get(ordersController.showCafeOrders)
	
orderRouter.route("/orders/")
	.post(ordersController.addOrder)
	
orderRouter.route("/orders/:id")
	.get(ordersController.showOrder)
	.put(ordersController.editOrder)
	.patch(ordersController.editOrder)
	.delete(ordersController.deleteOrder)
	
module.exports = orderRouter