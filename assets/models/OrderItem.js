var uuidGenerator = require("../helpers/uuid.js")

var OrderItem = function(orderId, menuItemId, size, price) {
	return {
		_id: uuidGenerator.generateUuid(),
		order_id: orderId,
		menu_item_id: menuItemId,
		size: size,
		price: price,
		type: "order_item"
	}
}

module.exports = OrderItem