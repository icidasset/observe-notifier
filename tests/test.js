/* globals ObserveNotifier */

(function() {

"use strict";


var obj = {};
var objNotifier = new ObserveNotifier(obj);
var test_stack, interval_id;



//
//  Callbacks
//
function rootChange(new_value, old_value, change_type, property_name) {
  var fn_name = "rootChange";

  // test property
  if (property_name == "test_property" && new_value == "Test value") {
    addToLog(fn_name, propertyAdded(property_name, new_value));

  // nested object
  } else if (property_name == "nested_object") {
    addToLog(fn_name, propertyAdded(property_name, new_value));
    addToLog(fn_name, "Detected all necessary changes, removing observer.");
    addHorizontalLineToLog();

    objNotifier.off("change", rootChange);

  // -> other
  } else {
    addToLog(fn_name, "Did not remove this observer on time.", true);
    stopTests(true);

  }
}



function testPropertyChange(new_value, old_value, change_type, property_name) {
  var fn_name = "testPropertyChange";

  if (new_value == "Another value" && old_value == "Test value" &&
      change_type == "update" && property_name == "test_property") {
    addToLog(fn_name, "Passed.");
  } else {
    addToLog(fn_name, "Failed.", true);
  }

  // remove observer
  objNotifier.off("change:test_property", testPropertyChange);

  // horizontal line
  addHorizontalLineToLog();
}



function testPropertyDelete() {
  var fn_name = "testPropertyDelete";

  addToLog(fn_name, "Deleted <b>test_property</b>.");
  addHorizontalLineToLog();
}



function newPropertyAdd(new_value) {
  var fn_name = "newPropertyAdd";

  addToLog(fn_name, "new_property was added.");
}



//
//  Tests
//
test_stack = [

  // rootChange
  function() {
    objNotifier.on("change", rootChange);
    obj.test_property = "Test value";
  },

  function() {
    obj.nested_object = { message: "Hi" };
  },

  // testPropertyChange
  function() {
    objNotifier.on("change:test_property", testPropertyChange);
    obj.test_property = "Another value";
  },

  // testPropertyDelete
  function() {
    objNotifier.on("delete:test_property", testPropertyDelete);
    delete obj.test_property;
  },

  //
  function() {
    objNotifier.on("add:new_property", newPropertyAdd);
  }

];



interval_id = setInterval(function() {
  var test = test_stack.shift();

  if (test) {
    test();
    updateCode();
  } else {
    stopTests();
  }
}, 1000);



//
//  Helpers
//
function addToLog(title, message, error) {
  var el = document.querySelector(".log");
  var msg = document.createElement("div");

  msg.className = "log-item " + (error ? "is-error" : "is-success");
  msg.innerHTML = [
    '<h2>', title, '</h2>',
    '<span>', message, '</span>'
  ].join("");

  el.appendChild(msg);
}


function addHorizontalLineToLog() {
  var el = document.querySelector(".log");
  var hr = document.createElement("hr");
  el.appendChild(hr);
}


function updateCode() {
  var el = document.querySelector("code");
  el.innerHTML = "obj = " + JSON.stringify(obj) + ";";
}


function stopTests(show_error) {
  clearInterval(interval_id);

  if (show_error) {
    addToLog("Tests stopped", "Could not complete all tests.", true);
  }
}


function propertyAdded(p, v) {
  return "Property <b>" + p + "</b> has been added with the value <b>" + JSON.stringify(v) + "</b>.";
}



}());
