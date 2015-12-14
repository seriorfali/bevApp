var Order = require("../models/Order.js")
  , OrderItem = require("../models/OrderItem.js")
  , dbQuerier = require("../helpers/dbQuerier.js")
  
function showOrdersByParent(parentType, parentId, req, res) {
	var dbGetOrders = new Promise(function(resolve, reject) {
    var field = parentType + "_id"
    dbQuerier.showDocsOfTypeByField("order", field, parentId, resolve, reject)
  })
  
  dbGetOrders.then(function(orders) {     
    var ids = []
    
    orders.forEach(function(order) {
      ids.push(order._id)
      order.items = []
    })
    
    console.log(ids)
    
    var dbGetOrderItems = new Promise(function(resolve, reject) {
      dbQuerier.showDocsOfTypeByField("order_item", "order_id", ids, resolve, reject)
    })
    
    dbGetOrderItems.then(function(orderItems) {
      var ordersWithItems = orders
      
      orderItems.forEach(function (orderItem) {
        orderIndex = ids.indexOf(orderItem.order_id)
        ordersWithItems[orderIndex].items.push(orderItem)
      })
      
      res.json(ordersWithItems)
    })
    .catch(function(err) {
      console.log(err.message)
      res.json({message: "Failed to retrieve order items."})
    })
  })
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

function addOrderItems(orderId, orderItems, resolve, reject) {
  var newOrderItems = []
  orderItems.forEach(function(orderItem) {
    var newOrderItem = new OrderItem(orderId, orderItem.menuItemId, orderItem.size, orderItem.price)
    newOrderItems.push(newOrderItem)
  })
  
  var dbAddOrderItems = new Promise(function(resolveAdd, rejectAdd) {
    dbQuerier.addDocs(newOrderItems, "order_item", resolveAdd, rejectAdd)
  })
    
  dbAddOrderItems.then(function(addedOrderItems) {
    resolve(addedOrderItems)
  })
  .catch(function(err) {
    reject(err)
  })
}

function addOrder(req, res) {
  var userId = req.body.userId
    , cafeId = req.body.cafeId
    , cost = req.body.cost
    , orderItems = req.body.items
    , newOrder = new Order(userId, cafeId, cost)
    , orderId = newOrder._id
    , newOrderAndItems = [newOrder]
    
  orderItems.forEach(function(orderItem) {
    var menuItemId = orderItem.menuItemId
      , size = orderItem.size
      , price = orderItem.price
      , newOrderItem = new OrderItem(orderId, menuItemId, size, price)
    
    newOrderAndItems.push(newOrderItem)
  })

  var dbAddOrderAndItems = new Promise(function(resolve, reject) {
    dbQuerier.addDocs(newOrderAndItems, "order", resolve, reject)
  })
  
  dbAddOrderAndItems.then(function(addedOrderAndItems) {
    var addedOrder
      , addedItems = []
      
    addedOrderAndItems.forEach(function(addedOrderOrItem) {
      if (addedOrderOrItem._id === orderId) {
        addedOrder = addedOrderOrItem
      } else {
        addedItems.push(addedOrderOrItem)
      }
    })
    
    addedOrder.items = addedItems
    res.json(addedOrder)
  })
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to add order."})
  })
}

function editOrder(req, res) {
  var orderId = req.params.id
    , orderItemsToDeleteIds = req.body.items.deleted
    , newOrderItems = req.body.items.new
  
  var dbGetOrderItemsToDelete = new Promise(function(resolve, reject) {
    dbQuerier.showDocs("order_item", orderItemsToDeleteIds, resolve, reject)
  })
  
  dbGetOrderItemsToDelete.then(function(orderItemsToDelete) {
    var dbDeleteOrderItems = new Promise(function(resolve, reject) {
      dbQuerier.deleteDocs(orderItemsToDelete, "order_item", resolve, reject)
    })
    
    dbDeleteOrderItems.then(function() {
      console.log("Here!")
      var getOldOrderItems = new Promise(function(resolveGet, rejectGet) {
        dbQuerier.showDocsOfTypeByField("order_item", "order_id", orderId, resolveGet, rejectGet)
      })
      
      getOldOrderItems.then(function(oldOrderItems) {
        console.log("old")
        var dbAddOrderItems = new Promise(function(resolve, reject) {
          addOrderItems(orderId, newOrderItems, resolve, reject)
        })
      
        dbAddOrderItems.then(function(addedOrderItems) {
          console.log("added")
          var orderItems
          
          if (oldOrderItems) {
            orderItems = oldOrderItems.concat(addedOrderItems)
          } else {
            orderItems = addedOrderItems
          }
          
          return orderItems
        })
        .then(function(orderItems) {
          console.log("orderItems")
          var dbGetOrder = new Promise(function(resolve, reject) {
            dbQuerier.showDoc("order", orderId, resolve, reject)
          })
      
          dbGetOrder.then(function(order) {
            console.log("order!")
            var updatedOrder = {
              _rev: order._rev,
              user_id: order.user_id,
              cafe_id: req.body.cafeId || order.cafe_id,
              placed_at: order.placed_at,
              last_updated_at: new Date(),
              cost: req.body.cost,
              type: "order"
            }
              , dbEditOrder = new Promise(function(resolve, reject) {
                dbQuerier.editDoc(orderId, updatedOrder, resolve, reject)
            })
              
            dbEditOrder.then(function(editedOrder) {
              console.log("edited order! ")
              editedOrder.items = orderItems
              res.json(editedOrder)
            })
            .catch(function(err) {
              console.log(err.message)
              res.json({message: "Failed to edit order."})
            })
          })
          .catch(function(err) {
            console.log(err.message)
            res.json({message: "Failed to access order."})
          })
        })
        .catch(function(err) {
          console.log(err.message)
          res.json({message: "Failed to add new order items."})
        })
      })
      .catch(function(err) {
        console.log(err.message)
        res.json({message: "Failed to retrieve previously added order items."})
      })
    })
    .catch(function(err) {
      console.log(err.message)
      res.json({message: "Failed to delete order items."})
    })
  })
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to retrieve order items to delete."})
  })
}

function deleteOrder(req, res) {
	var orderId = req.params.id
  
  var dbGetOrderItems = new Promise(function(resolve, reject) {
    dbQuerier.showDocsOfTypeByField("order_item", "order_id", orderId, resolve, reject)
  })
  
  dbGetOrderItems.then(function(orderItems) {
    var dbGetOrder = new Promise(function(resolve, reject) {
      dbQuerier.showDoc("order", orderId, resolve, reject)
    })
    
    dbGetOrder.then(function(order) {
      var orderAndItems = orderItems.concat(order)
      
      var dbDeleteOrderAndItems = new Promise(function(resolve, reject) {
        dbQuerier.deleteDocs(orderAndItems, "order_id", resolve, reject)
      })
      
      dbDeleteOrderAndItems.then(function() {
        res.json({message: "Successfully deleted order."})
      })
      .catch(function(err) {
        console.log(err.message)
        res.json({message: "Failed to delete order."})
      })
    })
    .catch(function(err) {
      console.log(err.message)
      res.json({message: "Failed to access order."})
    })
  })
  .catch(function(err) {
    console.log(err.message)
    res.json({message: "Failed to access order items."})
  })
}

module.exports = {
  showCafeOrders: showCafeOrders,
  showUserOrders: showUserOrders,
  showOrder: showOrder,
  addOrder: addOrder,
  editOrder: editOrder,
  deleteOrder: deleteOrder
}