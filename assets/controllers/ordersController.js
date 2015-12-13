var Order = require("../models/Order.js")
  , OrderItem = require("../models/OrderItem.js")
  , dbQuerier = require("../helpers/dbQuerier.js")
  
function showOrdersByParent(parentType, parentId, req, res) {
	var dbGetOrders = new Promise(function(resolve, reject) {
    var field = parentType + "_id"
    dbQuerier.showDocsOfTypeByField("order", field, parentId, resolve, reject)
  })
  
  dbGetOrders.then(function(orders) {
    var getOrdersWithItems = new Promise(function(resolveLoop, rejectLoop) {
      var ordersWithItems = []
      
      for (var i = 0; i < orders.length) {
        var order = orders[i]
        
        var dbGetOrderItems = new Promise(function(resolve, reject) {
          showDocsOfTypeByField("order_item", "order_id", order._id, resolve, reject)
        })
        
        dbGetOrderItems.then(function(orderItems) {
          order.items = orderItems
          ordersWithItems.push(order)
          
          if (i === orders.length - 1) {
            resolveLoop(ordersWithItems)
          } else {
            i++
          }
        })
        .catch(function(err) {
          rejectLoop(err)
        })
      }
    })
    
    getOrdersWithItems.then(function(ordersWithItems) {
      res.json(ordersWithItems)
    })
    .catch(function(err) {
      console.log(err.message)
      res.json({message: "Failed to retrieve order items."})
    })
  }
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to retrieve orders."})
  })
}

function showCafeOrders(req, res) {
  var cafeId = req.params.cafe_id
	showOrdersByParent("cafe", cafeId, req, res)
}

function showUserOrders(req, res) {
  var userId = req.params.user_id
	showOrdersByParent("user", userId, req, res)
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
  showOrdersByParent: showOrdersByParent,
  showCafeOrders: showCafeOrders,
  showUserOrders: showUserOrders,
  showOrder: showOrder,
  editOrder: editOrder,
  deleteOrder: deleteOrder
}