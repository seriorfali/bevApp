var Order = require("../models/Order.js")
  , OrderItem = require("../models/OrderItem.js")
  , dbQuerier = require("../helpers/dbQuerier.js")
  
function showAllCafeOrders(req, res) {
	
}

function showAllUserOrders(req, res) {
	
}

function showOrder(req, res) {
  var dbGetOrder = new Promise(function(resolve, reject) {
    dbQuerier.showDoc("order", req.params.id, resolve, reject)
  })
  
  dbGetOrder.then(function(order) {
    res.json(bev)
  })
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to retrieve bev."})
  })
}

function editOrder(req, res) {

}

function deleteOrder(req, res) {
	
}

module.exports = {
  showAllCafeOrders: showAllCafeOrders,
  showAllUserOrders: showAllUserOrders,
  showOrder: showOrder,
  editOrder: editOrder,
  deleteOrder: deleteOrder
}