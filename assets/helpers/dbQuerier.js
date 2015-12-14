var http = require("http")
  , url = require("url")
  , dbConfig = require("../../config/dbConfig.js")
  , protocol = "http://"
  , auth = dbConfig.username + ":" + dbConfig.password
  , host = "@127.0.0.1:5984/"
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
  
function showDocsByField(docType, field, fieldValueOrValues, resolve, reject) {
  var db = getDb(docType)
    , view = "by_" + field
    , address = url.parse(protocol + auth + host + db + design + "_view/" + view)
    , valueOrValues
  
  var options = {
    hostname: address.hostname,
    path: address.path,
    port: address.port,
    auth: address.auth,
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
          docs.push(row.value)
        })
      } else {
        docs = null
      }
         
      resolve(docs)
    })
  })
  
  req.on("error", function(err) {
    reject(err)
  })
  
  if (Array.isArray(fieldValueOrValues)) {
    valueOrValues = fieldValueOrValues
  } else {
    valueOrValues = [fieldValueOrValues]
  }
  
  req.write(JSON.stringify({keys: valueOrValues}))
  
  req.end()
}

function showDocsOfTypeByField(docType, field, fieldValueOrValues, resolve, reject) {
  var db = getDb(docType)
    , view = docType + "s_by_" + field
    , valueOrValues
  
  var address = url.parse(protocol + auth + host + db + design + "_view/" + view)
    , options = {
    hostname: address.hostname,
    path: address.path,
    port: address.port,
    auth: address.auth,
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
          docs.push(row.value)
        })
      } else {
        docs = null
      }
        
      resolve(docs)
    })
  })
  
  req.on("error", function(err) {
    reject(err)
  })
  
  if (Array.isArray(fieldValueOrValues)) {
    valueOrValues = fieldValueOrValues
  } else {
    valueOrValues = [fieldValueOrValues]
  }
  
  req.write(JSON.stringify({keys: valueOrValues}))
  
  req.end()
}

function showDoc(docType, id, resolve, reject) {
  var db = getDb(docType)

  http.get(protocol + auth + host + db + id, function(res) {
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
  
  var address = url.parse(protocol + auth + host + db + view + viewOptions)
    , options = {
    hostname: address.hostname,
    path: address.path,
    port: address.port,
    auth: address.auth,
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
        })
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
  
  var address = url.parse(protocol + auth + host + db)
    , options = {
    hostname: address.hostname,
    path: address.path,
    port: address.port,
    auth: address.auth,
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
  
  var address = url.parse(protocol + auth + host + db + "_bulk_docs")
    , options = {
    hostname: address.hostname,
    path: address.path,
    port: address.port,
    auth: address.auth,
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
    , address = url.parse(protocol + auth + host + db + id)
  
  var options = {
    hostname: address.hostname,
    path: address.path,
    port: address.port,
    auth: address.auth,
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

function deleteAllDocsByField(type) {
  
}

function deleteDoc(docType, id, resolve, reject) {
  var getDoc = new Promise(function(resolveGet, rejectGet) {
    showDoc(docType, id, resolveGet, rejectGet)
  })
  
  getDoc.then(function(doc) {
    var rev = doc._rev
      , db = getDb(docType)
      , address = url.parse(protocol + auth + host + db + id)
      , options = {
      hostname: address.hostname,
      path: address.path,
      port: address.port,
      auth: address.auth,
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
        resolve("success")
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

function deleteDocs(docsToDelete, docType, resolve, reject) {
  var db = getDb(docType)
  
  docsToDelete.forEach(function(docToDelete) {
    docToDelete._deleted = true
  })
  
  var address = url.parse(protocol + auth + host + db + "_bulk_docs")
    , options = {
    hostname: address.hostname,
    path: address.path,
    port: address.port,
    auth: address.auth,
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
      resolve("success")
    })
  })
  
  req.on("error", function(err) {
    reject(err)
  })
  
  req.write(JSON.stringify({docs: docsToDelete}))
  
  req.end()
}
  
module.exports = {
  showDocsByField: showDocsByField,
  showDocsOfTypeByField: showDocsOfTypeByField,
  showDoc: showDoc,
  showDocs: showDocs,
  addDoc: addDoc,
  addDocs: addDocs,
  editDoc: editDoc,
  deleteAllDocsByField: deleteAllDocsByField,
  deleteDoc: deleteDoc,
  deleteDocs: deleteDocs
}