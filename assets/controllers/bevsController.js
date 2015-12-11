var Bev = require("../models/Bev.js")
  , dbQuerier = require("../helpers/db.js")
  , xhr = dbQuerier.xhr
  , host = dbQuerier.host
  , db = dbQuerier.db
  
function showAllBevs(req, res) {
  var allBevs = dbQuerier.showAllDocsOfType("bev")
  res.json(allBevs)
}

function showBev(req, res) {
  var bev = dbQuerier.showDoc("bev", req.params.id)
  res.json(bev)
}

function addBev(req, res) {
  var name = req.body.name
      , ingredients = req.body.ingredients
      , type = req.body.type
      
  var bev = dbQuerier.showDocByName(type, name)
  if (!bev) {
    var newBev = new Bev(name, ingredients, type)
      
    dbQuerier.addDoc(newBev)
  }
}

function editBev(req, res) {
  var bev = dbQuerier.showDoc("bev", req.params.id)
    , updatedBev = {
      _rev: bev._rev
      name: req.body.name || bev.name,
      ingredients: req.body.ingredients || bev.ingredients,
      type: "bev",
      bevType: req.body.bevType || bev.bevType
    }
   
  dbQuerier.editDoc(req.params.id, updatedBev)
}

function deleteAllBevs(req, res) {
  
}

function deleteBev(req, res) {
  
}

module.exports = {
  showAllBevs: showAllBevs,
  showBev: showBev,
  addBev: addBev,
  editBev: editBev,
  deleteAllBevs: deleteAllBevs,
  deleteBev: deleteBev
}