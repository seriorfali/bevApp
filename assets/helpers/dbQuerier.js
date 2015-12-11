var xhr = new XMLHttpRequest()
  , host = "http://127.0.0.1:5984/"
  , design = "_design/bev-api/"
  , uuidGenerator = require("./uuid.js")
  
function getDb(docType) {
  var db
  if (docType === "user") {
    db = "_users/"
  } else {
    db = "bev-api/"
  }
  return db
}

function showAllDocsInDb(docType) {
  var db = getDb(docType)
  
  xhr.open("GET", host + db + "_all_docs")
  xhr.onload = function() {
    if (xhr.status === 200) {
      var docs = JSON.parse(xhr.responseText)
      return docs
    }
  }
  xhr.send()
}
  
function showAllDocsOfType(type) {
  var view = "by_type"
  
  xhr.open("POST", host + db + design + "_view/" + view)
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.onload = function() {
    if (xhr.status === 200) {
      var docs = JSON.parse(xhr.responseText)
      return docs
    }
  }
  xhr.send(JSON.stringify({key: type}))
}

function showDocByName(docType, docName) {
  var db = getDb(docType)
    , view
  
  if (docType === "user") {
    view = "by_name"
  } else {
    view = docType + "s" + "_by_name"
  }
  
  xhr.open("POST", host + db + design + "_view/" + view)
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.onload = function() {
    if (xhr.status === 200) {
      var doc = JSON.parse(xhr.responseText)
      return doc
    }
  }
  xhr.send(JSON.stringify({key: docName}))
}

function showDoc(docType, id) {
  var db = getDb(docType)
  
  xhr.open("GET", host + db + id)
  xhr.onload = function() {
    if (xhr.status === 200) {
      var doc = JSON.parse(xhr.responseText)
      return doc
    }
  }
  xhr.send()
}

function addDoc(newDoc) {
  var id
    , db = getDb(newDoc.type)
    
  if (newDoc.type === "user") {
    id = "org.couchdb.user:" + newDoc.name
  } else {
    id = uuidGenerator.generateUuid()
  }
  
  xhr.open("PUT", host + db + id)
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.onload = function() {
    if (xhr.status === 200) {
      var addedDoc = JSON.parse(xhr.responseText)
      return addedDoc
    }
  }
  xhr.send(JSON.stringify(doc))
}

function editDoc(id, updatedDoc) {
  
}

function deleteAllDocsOfType(type) {
  
}

function deleteDoc(id) {
  
}
  
module.exports = {
  xhr: xhr,
  host: host,
  db: db,
  showAllDocsInDb: showAllDocsInDb,
  showAllDocsOfType: showAllDocsOfType,
  showDocByName: showDocByName,
  showDoc: showDoc,
  addDoc: addDoc,
  editDoc: editDoc,
  deleteAllDocsOfType: deleteAllDocsOfType,
  deleteDoc: deleteDoc
}