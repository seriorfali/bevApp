var OrderItem = function(orderId, menuItemId, price) {
	return {
		order_id: orderId,
		menu_item_id: menuItemId,
		price: price,
		type: "order item"
	}
}

module.exports = OrderItem