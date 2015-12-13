var Order = function(userId, cafeId, cost) {
	return {
		user_id: userId,
		cafe_id: cafeId,
		date_time: new Date(),
		cost: cost,
		type: "order"
	}
}

module.exports = Order