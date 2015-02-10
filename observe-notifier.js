/* globals define, exports, require */

(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["exports", "b"], factory);
  } else if (typeof exports === "object") {
    // CommonJS
    factory(exports, require("b"));
  } else {
    // Browser globals
    factory((root.ObserveNotifier = {}), root.b);
  }
}(this, function(exports, b) {

  "use strict";


  var ObserveNotifier = function(obj) {
    this.obj = obj;

    this.path_observers = {};
    this.path_observer_counter = 1;
  };



  ObserveNotifier.prototype.on = function(key, callback) {
    var split = key.split(":");
    var operator = split[0];
    var path = split.slice(1, split.length).join(":");
    var conditions = {}, observer, obj;

    // check
    if (!callback) {
      console.error("StateManager — ObserveNotifier (on) — No callback given");
      return;
    }

    // conditions
    conditions.name = (path.length ? path : false);

    switch (operator) {
      case "change":
        conditions.type = "update";
        break;

      case "add":
        conditions.type = "add";
        break;

      case "remove":
      case "delete":
        conditions.type = "delete";
        break;

      default:
        return;
    }

    // new observation
    Object.observe(this.obj, make_new_observer_function(conditions, callback));

    obj = {
      id: this.path_observer_counter,
      key: key,
      operator: operator,
      path: path,
      observer: observer,
      callback: callback
    };

    this.path_observers[key] = this.path_observers[key] || [];
    this.path_observers[key].push(obj);

    // increase counter
    this.path_observer_counter++;
  };



  function make_new_observer_function(conditions, callback) {
    return function(changes) {
      var l = conditions.name ? changes.length : 1;

      for (var k=0; k<l; ++k) {
        var change = changes[k];
        var name_check = (conditions.name ? change.name === conditions.name : true);
        var type_check = (change.type === conditions.type);

        if (name_check && type_check) {
          callback(change.object[change.name], change.oldValue);
        }
      }

    };
  }



  ObserveNotifier.prototype.off = function(key, callback) {
    var obj = this.path_observers[key];
    if (!obj) return;

    for (var i=0, j=obj.length; i<j; ++i) {
      if (obj[i].callback === callback || !callback) {
        Object.unobserve(this.obj, obj[i].observer);
        obj[i] = null;
      }
    }
  };



  //
  //  Export
  //
  exports.action = ObserveNotifier;

}));