// To access Bite model.
var Bite = require("../models/Bite.js")
  // To access database querier helper functions.
  , dbQuerier = require("../helpers/dbQuerier.js")

// To send all bite documents.
function showAllBites(req, res) {
  // Retrieve documents.
  var dbGetAllBites = new Promise(function(resolve, reject) {
    dbQuerier.showDocsByField("bite", "type", "bite", resolve, reject)
  })
  
  // If documents retrieved, send them.
  dbGetAllBites.then(function(allBites) {
    res.json(allBites)
  })
  // If documents not retrieved, send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to retrieve bites."})
  })
}

// To send bite document with specified ID.
function showBite(req, res) {
  // Retrieve document from database.
  var dbGetBite = new Promise(function(resolve, reject) {
    dbQuerier.showDoc("bite", req.params.id, resolve, reject)
  })
  
  // If document retrieved, send it.
  dbGetBite.then(function(bite) {
    res.json(bite)
  })
  // If document not retrieved send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to retrieve bite."})
  })
}

// To add bite document to database.
function addBite(req, res) {
  var title = req.body.title
    , ingredients = req.body.ingredients
    , prices = req.body.prices
    , biteType = req.body.biteType
    // Retrieve any bite document with specified title in database.
    , dbGetBite = new Promise(function(resolve, reject) {
        dbQuerier.showDocsOfTypeByField("bite", "title", title, resolve, reject)
      })
  
  // If response received, check if bite was found.
  dbGetBite.then(function(bite) {
    // If no bite found, generate new bite document and add it to database.
    if (!bite) {
      var newBite = new Bite(title, ingredients, prices, biteType)
        , dbAddBite = new Promise(function(resolve, reject) {
          dbQuerier.addDoc(newBite, resolve, reject)
        })
        
      dbAddBite.then(function(addedBite) {
        res.json(addedBite)
      })
      // If document not added, send error message.
      .catch(function(err) {
        console.log(err.message)
        res.json({message: "Failed to add bite."})
      })
    // If bite found, send message to indicate.
    } else {
      res.json({message: "Bite with that name already in database!"})
    }
  })
  // If response not received, send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to verify if bite is already in database."})
  })
}

// To edit bite document with specified ID.
function editBite(req, res) {
  var biteId = req.params.id
  // Retrieve document from database.
  var dbGetBite = new Promise(function(resolve, reject) {
    dbQuerier.showDoc("bite", biteId, resolve, reject)
  })
  
  // If document retrieved, update it with specified field values.
  dbGetBite.then(function(bite) {
    var updatedBite = {
          _rev: bite._rev,
          title: req.body.title || bite.title,
          ingredients: req.body.ingredients || bite.ingredients,
          prices: req.body.prices || bite.prices,
          type: "bite",
          bite_type: req.body.biteType || bite.bite_type
        }
      , dbEditBite = new Promise(function(resolve, reject) {
            dbQuerier.editDoc(biteId, updatedBite, resolve, reject)
        })
    
    // If document edited, send edited document.
    dbEditBite.then(function(editedBite) {
      res.json(editedBite)
    })
    // If document not edited, send error message.
    .catch(function(err) {
      console.log(err.message)
      res.json({message: "Failed to edit bite."})
    })
  })
  // If document not retrieved, send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to access bite."})
  })
}

// To delete bite document with specified ID.
function deleteBite(req, res) {
  // Delete document in database.
  var dbDeleteBite = new Promise(function(resolve, reject) {
    dbQuerier.deleteDoc("bite", req.params.id, resolve, reject)
  })
  
  // If document deleted, send success message.
  dbDeleteBite.then(function() {
    res.json("Successfully deleted bite.")
  })
  // If document not deleted, send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json("Failed to delete bite.")
  })
}

module.exports = {
  showAllBites: showAllBites,
  showBite: showBite,
  addBite: addBite,
  editBite: editBite,
  deleteBite: deleteBite
}