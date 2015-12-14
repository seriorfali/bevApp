var uuidGenerator = require("../helpers/uuid.js")

var Order = function(userId, cafeId, cost) {
	return {
		_id: uuidGenerator.generateUuid(),
		user_id: userId,
		cafe_id: cafeId,
		placed_at: new Date(),
		cost: cost,
		type: "order"
	}
}

module.exports = Order