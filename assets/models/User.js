var User = function(email, password, firstName, lastName, phone) {
	return {
		_id: "org.couchdb.user:" + email,
		name: email,
		password: password,
		password_scheme: "pbkdf2",
		first_name: firstName,
		last_name: lastName,
		phone: phone,
		joined_at: new Date(),
		type: "user",
		api: "bev",
		roles: ["customer"]
	}
}

module.exports = User