// Package inclusions.
var app = require("express")
  , session = require("express-session")
  , bodyParser = require("body-parser")
  , logger = require("morgan")
  , couchdb = require("couchdb")
  , path = require("path")
  
// Middleware implementations.
// To parse data submitted in request body and populate body object attached to request object.
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
// To log all requests in the console using the 'dev' syntax.
app.use(logger("dev"))
// To ensure that static files are searched for in public folder.
app.use(express.static(path.join(__dirname, "public")))

// API routes.
var userRoutes = require("./routes/userRoutes.js")
  , cafeRoutes = require("./routes/cafeRoutes.js")
  , bevRoutes = require("./routes/bevRoutes.js")
  , biteRoutes = require("./routes/biteRoutes.js")
  
app.use("/api/users", userRoutes)
app.use("/api/cafes", cafeRoutes)
app.use("/api/bevs", bevRoutes)
app.use("/api/bites", biteRoutes)

// Frontend routes.
app.get("*", function(req, res) {
  res.sendFile(__dirname + "/public/views/index.html")
})

// To run server.
var port = process.env.PORT || 3000
app.listen(port, function() {
  console.log("Server running on port " + port + ".")
})


// userRoutes.$inject = ["$urlRouterProvider", "$stateProvider"]

// function userRoutes($urlRouterProvider, $stateProvider) {
// 	$urlRouterProvider.otherwise("/")
// 	$stateProvider
// 		.state("users", {
// 			url: "/users",
			
// 		})
// }