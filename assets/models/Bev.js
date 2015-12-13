var Bev = function(title, ingredients, prices, bevType) {
	return {
		title: title,
		ingredients: ingredients,
		prices: prices,
		type: "bev",
		bev_type: bevType
	}
}

module.exports = Bev