var Bite = function(title, ingredients, prices, biteType) {
	return {
		title: title,
		ingredients: ingredients,
		prices: prices,
		type: "bite",
		bite_type: biteType
	}
}

module.exports = Bite