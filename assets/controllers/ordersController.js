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
    var dbGetOrderItems = new Promise(function(resolve, reject) {
      dbQuerier.showDocsOfTypeByField("order_item", "order_id", order._id, resolve, reject)
    })
    
    dbGetOrderItems.then(function(orderItems) {
      order.items = orderItems
      res.json(order)
    })
    .catch(function(err) {
      console.log(err.message)
      res.json({message: "Failed to retrieve order items."})
    })
  })
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to retrieve order."})
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