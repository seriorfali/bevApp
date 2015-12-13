var http = require("http")
  , url = require("url")
  , host = "http://127.0.0.1:5984/"
  , design = "_design/bev-api/"
  
function getDb(docType) {
  var db
  if (docType === "user") {
    db = "_users/"
  } else {
    db = "bev-api/"
  }
  return db
}
  
function showAllDocsOfType(type, resolve, reject) {
  var db = getDb(type)
    , view = "by_type"
    , address = url.parse(host + db + design + "_view/" + view)
  
  var options = {
    hostname: address.hostname,
    path: address.path,
    port: address.port,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }
  
  var req = http.request(options, function(res) {
    var body = ""
    res.on("data", function(data) {
      body += data
    })
    res.on("end", function() {
      var parsedBody = JSON.parse(body)
        , rows = parsedBody.rows
        , docs = []
        
      rows.forEach(function(row) {
        docs.push(row.value)
      })
        
      resolve(docs)
    })
  })
  
  req.on("error", function(err) {
    reject(err)
  })
  
  req.write(JSON.stringify({keys: [type]}))
  
  req.end()
}

function showDocByName(docType, docName, resolve, reject) {
  var db = getDb(docType)
    , view
  
  if (docType === "user") {
    view = "by_name"
  } else {
    view = docType + "s" + "_by_title"
  }
  
  var address = url.parse(host + db + design + "_view/" + view)
    , options = {
    hostname: address.hostname,
    path: address.path,
    port: address.port,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }
  
  var req = http.request(options, function(res) {
    var body = ""
    res.on("data", function(data) {
      body += data
    })
    res.on("end", function() {
      var parsedBody = JSON.parse(body)
        , rows = parsedBody.rows
        , doc
      
      if (rows.length) {
        doc = rows[0].value
      } else {
        doc = null
      }
        
      resolve(doc)
    })
  })
  
  req.on("error", function(err) {
    reject(err)
  })
  
  req.write(JSON.stringify({keys: [docName]}))
  
  req.end()
}

function showDoc(docType, id, resolve, reject) {
  var db = getDb(docType)

  http.get(host + db + id, function(res) {
    var body = ""
    
    res.on("data", function(data) {
      body += data
    })
    res.on("end", function() {
      var doc = JSON.parse(body)
      resolve(doc)
    })
  }).on("error", function(err) {
    reject(err)
  })
}

function showDocs(docType, ids, resolve, reject) {
  var db = getDb(docType)
    , view = "_all_docs"
    , viewOptions = "?include_docs=true"
  
  var address = url.parse(host + db + view + viewOptions)
    , options = {
    hostname: address.hostname,
    path: address.path,
    port: address.port,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }
  
  var req = http.request(options, function(res) {
    var body = ""
    res.on("data", function(data) {
      body += data
    })
    res.on("end", function() {
      var parsedBody = JSON.parse(body)
        , rows = parsedBody.rows
        , docs = []
      
      if (rows.length) {
        rows.forEach(function(row) {
          docs.push(row.doc)
      } else {
        docs = null
      }
        
      resolve(docs)
    })
  })
  
  req.on("error", function(err) {
    reject(err)
  })
  
  req.write(JSON.stringify({keys: ids}))
  
  req.end()
}

function addDoc(newDoc, resolve, reject) {
  var db = getDb(newDoc.type)
  
  var address = url.parse(host + db)
    , options = {
    hostname: address.hostname,
    path: address.path,
    port: address.port,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }
  
  var req = http.request(options, function(res) {
    var body = ""
    
    res.on("data", function(data) {
      body += data
    })
    res.on("end", function() {
      var getAddedDoc = new Promise(function(resolveGet, rejectGet) {
        showDoc(newDoc.type, newDoc._id, resolveGet, rejectGet)
      })
      
      getAddedDoc.then(function(addedDoc) {
        resolve(addedDoc)
      })
      .catch(function(err) {
        reject(err)
      })
    })
  })
  
  req.on("error", function(err) {
    reject(err)
  })
  
  req.write(JSON.stringify(newDoc))
  
  req.end()
}

function addDocs(newDocs, docType, resolve, reject) {
  var db = getDb(docType)
  
  var address = url.parse(host + db)
    , options = {
    hostname: address.hostname,
    path: address.path,
    port: address.port,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }
  
  var req = http.request(options, function(res) {
    var body = ""
    
    res.on("data", function(data) {
      body += data
    })
    res.on("end", function() {
      var ids = []
      
      newDocs.forEach(function(newDoc) {
        ids.push(newDoc._id)
      })
      
      var getAddedDocs = new Promise(function(resolveGet, rejectGet) {
        showDocs(docType, ids, resolveGet, rejectGet)
      })
      
      getAddedDocs.then(function(addedDocs) {
        resolve(addedDocs)
      })
      .catch(function(err) {
        reject(err)
      })
    })
  })
  
  req.on("error", function(err) {
    reject(err)
  })
  
  req.write(JSON.stringify({docs: newDocs}))
  
  req.end()
}

function editDoc(id, updatedDoc, resolve, reject) {
  var db = getDb(updatedDoc.type)
    , address = url.parse(host + db + id)
  
  var options = {
    hostname: address.hostname,
    path: address.path,
    port: address.port,
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  }
  
  var req = http.request(options, function(res) {
    var body = ""
    
    res.on("data", function(data) {
      body += data
    })
    
    res.on("end", function() {
      var getEditedDoc = new Promise(function(resolveGet, rejectGet) {
        showDoc(updatedDoc.type, id, resolveGet, rejectGet)
      })
      
      getEditedDoc.then(function(editedDoc) {
        resolve(editedDoc)
      })
      .catch(function(err) {
        reject(err)
      })
    })
  })
  
  req.on("error", function(err) {
    reject(err)
  })
  
  req.write(JSON.stringify(updatedDoc))
  
  req.end()
}

function deleteAllDocsOfType(type) {
  
}

function deleteDoc(docType, id, resolve, reject) {
  var getDoc = new Promise(function(resolveGet, rejectGet) {
    showDoc(docType, id, resolveGet, rejectGet)
  })
  
  getDoc.then(function(doc) {
    var rev = doc._rev
      , db = getDb(docType)
      , address = url.parse(host + db + id)
      , options = {
      hostname: address.hostname,
      path: address.path,
      port: address.port,
      method: "DELETE",
      headers: {
        "If-Match": rev
      }
    }
    
    var req = http.request(options, function(res) {
      var body = ""
      
      res.on("data", function(data) {
        body += data
      })
      
      res.on("end", function() {
        resolve("Successfully deleted bev.")
      })
    })
    
    req.on("error", function(err) {
      reject(err)
    })
    
    req.end()
  })
  .catch(function(err) {
    reject(err)
  })
}
  
module.exports = {
  showAllDocsOfType: showAllDocsOfType,
  showDocByName: showDocByName,
  showDoc: showDoc,
  addDoc: addDoc,
  editDoc: editDoc,
  deleteAllDocsOfType: deleteAllDocsOfType,
  deleteDoc: deleteDoc
}