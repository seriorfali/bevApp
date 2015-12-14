// To access User model.
var User = require("../models/User.js")
  // To access database querier helper functions.
  , dbQuerier = require("../helpers/dbQuerier.js")

// To send all user documents.
function showAllUsers(req, res) {
  // Retrieve documents.
  var dbGetAllUsers = new Promise(function(resolve, reject) {
    dbQuerier.showDocsByField("user", "api", "bev", resolve, reject)
  })
  
  // If documents retrieved, send them.
  dbGetAllUsers.then(function(allUsers) {
    res.json(allUsers)
  })
  // If documents not retrieved, send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to retrieve users."})
  })
}

// To send user document with specified ID.
function showUser(req, res) {
  // Retrieve document from database.
  var dbGetUser = new Promise(function(resolve, reject) {
    dbQuerier.showDoc("user", req.params.id, resolve, reject)
  })
  
  // If document retrieved, send it.
  dbGetUser.then(function(user) {
    res.json(user)
  })
  // If document not retrieved send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to retrieve user."})
  })
}

// To add user document to database.
function addUser(req, res) {
  var title = req.body.title
    , ingredients = req.body.ingredients
    , prices = req.body.prices
    // Retrieve any user document with specified title in database.
    , dbGetUser = new Promise(function(resolve, reject) {
        dbQuerier.showDocsOfTypeByField("user", "title", title, resolve, reject)
      })
  
  // If response received, check if user was found.
  dbGetUser.then(function(user) {
    // If no user found, generate new user document and add it to database.
    if (!user) {
      var newUser = new User(email, firstName, lastName, phone)
        , dbAddUser = new Promise(function(resolve, reject) {
          dbQuerier.addDoc(newUser, resolve, reject)
        })
        
      dbAddUser.then(function(addedUser) {
        res.json(addedUser)
      })
      // If document not added, send error message.
      .catch(function(err) {
        console.log(err.message)
        res.json({message: "Failed to add user."})
      })
    // If user found, send message to indicate.
    } else {
      res.json({message: "User with that name already in database!"})
    }
  })
  // If response not received, send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to verify if user is already in database."})
  })
}

// To edit user document with specified ID.
function editUser(req, res) {
  var userId = req.params.id
  // Retrieve document from database.
  var dbGetUser = new Promise(function(resolve, reject) {
    dbQuerier.showDoc("user", userId, resolve, reject)
  })
  
  // If document retrieved, update it with specified field values.
  dbGetUser.then(function(user) {
    var updatedUser = {
          _rev: user._rev,
          title: req.body.title || user.title,
          ingredients: req.body.ingredients || user.ingredients,
          prices: req.body.prices || user.prices,
          type: "user",
        }
      , dbEditUser = new Promise(function(resolve, reject) {
            dbQuerier.editDoc(userId, updatedUser, resolve, reject)
        })
    
    // If document edited, send edited document.
    dbEditUser.then(function(editedUser) {
      res.json(editedUser)
    })
    // If document not edited, send error message.
    .catch(function(err) {
      console.log(err.message)
      res.json({message: "Failed to edit user."})
    })
  })
  // If document not retrieved, send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to access user."})
  })
}

// To delete user document with specified ID.
function deleteUser(req, res) {
  // Delete document in database.
  var dbDeleteUser = new Promise(function(resolve, reject) {
    dbQuerier.deleteDoc("user", req.params.id, resolve, reject)
  })
  
  // If document deleted, send success message.
  dbDeleteUser.then(function() {
    res.json("Successfully deleted user.")
  })
  // If document not deleted, send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json("Failed to delete user.")
  })
}

module.exports = {
  showAllUsers: showAllUsers,
  showUser: showUser,
  addUser: addUser,
  login: login,
  editUser: editUser,
  deleteUser: deleteUser
}