var xhr = new XMLHttpRequest()
  , host = "http://127.0.0.1:5984/"
  , db = "bev-api/"
  , design = "_design/bev-api/"
  , uuidGenerator = require("./uuid.js")
  
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

function showDocByName(collection, docName) {
  var view = collection + "_by_name"
  
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

function showDoc(id) {
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
  var id = uuidGenerator.generateUuid()
  
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
  
module.exports = {
  xhr: xhr,
  host: host,
  db: db,
  showAllDocsOfType: showAllDocsOfType,
  addDoc: addDoc
}