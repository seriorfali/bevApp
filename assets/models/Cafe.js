var uuidGenerator = require("../helpers/uuid.js")

var Cafe = function(title, coordinates) {
	return {
		_id: uuidGenerator.generateUuid(),
		title: title,
		coordinates: coordinates,
		type: "cafe"
	}
}

module.exports = Cafe