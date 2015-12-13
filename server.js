// Package inclusions.
var express = require("express")
  , app = express()
  , bodyParser = require("body-parser")
  , logger = require("morgan")
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
  
// app.use("/api/v1/users", userRoutes)
// app.use("/api/v1/cafes", cafeRoutes)
app.use("/api/v1/bevs", bevRoutes)
// app.use("/api/v1/bites", biteRoutes)
app.use("/api/v1/", orderRoutes)

// To run server.
var port = process.env.PORT || 3000
app.listen(port, function() {
  console.log("Server running on port " + port + ".")
})