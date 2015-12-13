var uuidGenerator = require("../helpers/uuid.js")

var OrderItem = function(orderId, menuItemId, price) {
	return {
		_id: uuidGenerator.generateUuid(),
		order_id: orderId,
		menu_item_id: menuItemId,
		price: price,
		type: "order item"
	}
}

module.exports = OrderItem