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
  var bev = dbQuerier.showDoc(req.params.id)
  res.json(bev)
}

function addBev(req, res) {
  var bev = dbQuerier.showDocByName("bevs", req.body.name)
  if (!bev) {
    var name = req.body.name
      , ingredients = req.body.ingredients
      , type = req.body.type
      , newBev = new Bev(name, ingredients, type)
      
    dbQuerier.addDoc(newBev)
  }
}

function editBev(req, res) {
  
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