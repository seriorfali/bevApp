var User = function(email, firstName, lastName, phone) {
	return {
		_id: "org.couchdb.user:" + email
		name: email,
		first_name: firstName,
		last_name: lastName,
		phone: phone,
		joined_at: new Date(),
		type: "user"
	}
}

module.exports = User