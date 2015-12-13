var uuidGenerator = require("../helpers/uuid.js")

var Bite = function(title, ingredients, prices, biteType) {
	return {
		_id: uuidGenerator.generateUuid(),
		title: title,
		ingredients: ingredients,
		prices: prices,
		type: "bite",
		bite_type: biteType
	}
}

module.exports = Bite