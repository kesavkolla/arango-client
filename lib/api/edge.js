/* 
 * Copyright (c) 2012 Kaerus (kaerus.com), Anders Elo <anders @ kaerus com>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }
define(function (require) {

return function(db){
  var X = db.request
    , path = "/_api/edge/"
    , xpath = "/_api/edge?collection="
    , ypath = "/_api/edges/";

  function getMatched(type,path,rev,callback){
    var headers = {};
    headers[type] = JSON.stringify(rev);
    return X.raw({headers:headers},path,null,callback);
  }
  
  function putMatched(type,path,rev,data,callback){
    var headers = {};
    headers[type] = JSON.stringify(rev);
    return X.raw({"method":"PUT",headers:headers},path,data,callback);
  }
  
  return {
    "get": function(id,callback) {
      return X.get(path+id,callback);
    },
    "getIfNoneMatch": function(id,rev,callback) {
      return getMatched("If-None-Match",path+id,rev,callback);
    },
    "getIfMatch": function(id,rev,callback) {
      return getMatched("If-Match",path+id,rev,callback);
    },
    "create": function() {
      var collection, from, to, data = {}, callback, i = 0;
      if(typeof arguments[i] === "string") collection = arguments[i++];
      if(typeof arguments[i] === "string") from = arguments[i++];
      if(typeof arguments[i] === "string") to = arguments[i++];
      if(typeof arguments[i] === "object") data = arguments[i++];
      if(typeof arguments[i] === "function") callback = arguments[i++];
      if(!to) {
        to = from;
        from = collection
        collection = db.name;  
      }
      return X.post(xpath+collection+'&from='+from+'&to='+to,data,callback);
    },
    "put": function(id,data,callback) {
      return X.put(path+id,data,callback);
    },
    "putIfNoneMatch": function(id,rev,data,callback) {
      return putMatched("if-none-match",path+id,rev,data,callback);
    },
    "putIfMatch": function(id,rev,data,callback) {
      return putMatched("if-match",path+id,rev,data,callback);
    },
    "head": function(id,callback) {
      return X.head(path+id,callback);
    },
    "patch": function(id,data,callback) {
      return X.patch(path+id,data,callback);
    },
    "delete": function(id,callback) {
      return X.delete(path+id,callback);
    },
    "list": function() {
      var collection, vertex, direction, callback, i = 0;
      if(arguments.length > 0) {
        if(typeof arguments[i] === "string") collection = arguments[i++];
        if(typeof arguments[i] === "string") vertex = arguments[i++];
        if(typeof arguments[i] === "string") direction = arguments[i++];
        if(typeof arguments[i] === "function") callback = arguments[i++];
      }
      if(!direction) {
        direction = vertex || 'any';
        vertex = collection;
        collection = db.name;
      }
      var options = '?vertex='+vertex+'&direction='+direction;
      return X.get(ypath+collection+options,callback);
    }
  }
};

});