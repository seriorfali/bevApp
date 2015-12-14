// To access Bev model.
var Bev = require("../models/Bev.js")
  // To access database querier helper functions.
  , dbQuerier = require("../helpers/dbQuerier.js")

// To send all beverage documents.
function showAllBevs(req, res) {
  // Retrieve documents.
  var dbGetAllBevs = new Promise(function(resolve, reject) {
    dbQuerier.showDocsByField("bev", "type", "bev", resolve, reject)
  })
  
  // If documents retrieved, send them.
  dbGetAllBevs.then(function(allBevs) {
    res.json(allBevs)
  })
  // If documents not retrieved, send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to retrieve bevs."})
  })
}

// To send beverage document with specified ID.
function showBev(req, res) {
  // Retrieve document from database.
  var dbGetBev = new Promise(function(resolve, reject) {
    dbQuerier.showDoc("bev", req.params.id, resolve, reject)
  })
  
  // If document retrieved, send it.
  dbGetBev.then(function(bev) {
    res.json(bev)
  })
  // If document not retrieved send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to retrieve bev."})
  })
}

// To add beverage document to database.
function addBev(req, res) {
  var title = req.body.title
    , ingredients = req.body.ingredients
    , prices = req.body.prices
    , bevType = req.body.bevType
    // Retrieve any beverage document with specified title in database.
    , dbGetBev = new Promise(function(resolve, reject) {
        dbQuerier.showDocsOfTypeByField("bev", "title", title, resolve, reject)
      })
  
  // If response received, check if beverage was found.
  dbGetBev.then(function(bev) {
    // If no beverage found, generate new beverage document and add it to database.
    if (!bev) {
      var newBev = new Bev(title, ingredients, prices, bevType)
        , dbAddBev = new Promise(function(resolve, reject) {
          dbQuerier.addDoc(newBev, resolve, reject)
        })
        
      dbAddBev.then(function(addedBev) {
        res.json(addedBev)
      })
      // If document not added, send error message.
      .catch(function(err) {
        console.log(err.message)
        res.json({message: "Failed to add bev."})
      })
    // If beverage found, send message to indicate.
    } else {
      res.json({message: "Bev with that name already in database!"})
    }
  })
  // If response not received, send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to verify if bev is already in database."})
  })
}

// To edit beverage document with specified ID.
function editBev(req, res) {
  var bevId = req.params.id
  // Retrieve document from database.
  var dbGetBev = new Promise(function(resolve, reject) {
    dbQuerier.showDoc("bev", bevId, resolve, reject)
  })
  
  // If document retrieved, update it with specified field values.
  dbGetBev.then(function(bev) {
    var updatedBev = {
          _rev: bev._rev,
          title: req.body.title || bev.title,
          ingredients: req.body.ingredients || bev.ingredients,
          prices: req.body.prices || bev.prices,
          type: "bev",
          bev_type: req.body.bevType || bev.bev_type
        }
      , dbEditBev = new Promise(function(resolve, reject) {
            dbQuerier.editDoc(bevId, updatedBev, resolve, reject)
        })
    
    // If document edited, send edited document.
    dbEditBev.then(function(editedBev) {
      res.json(editedBev)
    })
    // If document not edited, send error message.
    .catch(function(err) {
      console.log(err.message)
      res.json({message: "Failed to edit bev."})
    })
  })
  // If document not retrieved, send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to access bev."})
  })
}

// To delete beverage document with specified ID.
function deleteBev(req, res) {
  // Delete document in database.
  var dbDeleteBev = new Promise(function(resolve, reject) {
    dbQuerier.deleteDoc("bev", req.params.id, resolve, reject)
  })
  
  // If document deleted, send success message.
  dbDeleteBev.then(function() {
    res.json("Successfully deleted bev.")
  })
  // If document not deleted, send error message.
  .catch(function(err) {
    console.log(err.message)
    res.json("Failed to delete bev.")
  })
}

module.exports = {
  showAllBevs: showAllBevs,
  showBev: showBev,
  addBev: addBev,
  editBev: editBev,
  deleteBev: deleteBev
}