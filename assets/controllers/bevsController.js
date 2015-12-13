var Bev = require("../models/Bev.js")
  , dbQuerier = require("../helpers/dbQuerier.js")
  
function showAllBevs(req, res) {
  var dbGetAllBevs = new Promise(function(resolve, reject) {
    dbQuerier.showAllDocsOfType("bev", resolve, reject)
  })
  
  dbGetAllBevs.then(function(allBevs) {
    res.json(allBevs)
  })
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to retrieve bevs."})
  })
}

function showBev(req, res) {
  var dbGetBev = new Promise(function(resolve, reject) {
    dbQuerier.showDoc("bev", req.params.id, resolve, reject)
  })
  
  dbGetBev.then(function(bev) {
    res.json(bev)
  })
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to retrieve bev."})
  })
}

function addBev(req, res) {
  var title = req.body.title
    , ingredients = req.body.ingredients
    , prices = req.body.prices
    , bevType = req.body.bevType
    , dbGetBev = new Promise(function(resolve, reject) {
    dbQuerier.showDocByName("bev", title, resolve, reject)
  })
  
  dbGetBev.then(function(bev) {
    if (!bev) {
      var newBev = new Bev(title, ingredients, prices, bevType)
        , dbAddBev = new Promise(function(resolve, reject) {
          dbQuerier.addDoc(newBev, resolve, reject)
        })
        
      dbAddBev.then(function(addedBev) {
        res.json(addedBev)
      })
      .catch(function(err) {
        console.log(err.message)
        res.json({message: "Failed to add bev."})
      })
    } else {
      res.json({message: "Bev with that name already in database!"})
    }
  })
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to verify if bev is already in database."})
  })
}

function editBev(req, res) {
  var dbGetBev = new Promise(function(resolve, reject) {
    dbQuerier.showDoc("bev", req.params.id, resolve, reject)
  })
  
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
        dbQuerier.editDoc(req.params.id, updatedBev, resolve, reject)
    })
      
    dbEditBev.then(function(editedBev) {
      res.json(editedBev)
    })
    .catch(function(err) {
      console.log(err.message)
      res.json({message: "Failed to edit bev."})
    })
  })
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to access bev."})
  })
}

function deleteAllBevs(req, res) {
  
}

function deleteBev(req, res) {
  var dbDeleteBev = new Promise(function(resolve, reject) {
    dbQuerier.deleteDoc("bev", req.params.id, resolve, reject)
  })
  
  dbDeleteBev.then(function(successMessage) {
    res.json(successMessage)
  })
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
  deleteAllBevs: deleteAllBevs,
  deleteBev: deleteBev
}