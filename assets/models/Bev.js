var uuidGenerator = require("../helpers/uuid.js")

var Bev = function(title, ingredients, prices, bevType) {
	return {
		_id: uuidGenerator.generateUuid(),
		title: title,
		ingredients: ingredients,
		prices: prices,
		type: "bev",
		bev_type: bevType
	}
}

module.exports = Bev