# Observe Notifier


## Usage

```js
var obj = {};
var objNotifier = new ObserveNotifier(obj);

objNotifier.on("change", function(new_value, old_value, change_type, property_name) {
  // something was added, deleted or updated
});

objNotifier.on("change:abc", function(new_value, old_value, change_type) {
  // the property 'abc' was added, deleted or updated
});

objNotifier.on("add:abc", function(new_value, old_value, change_type) {
  // the property 'abc' was added to the obj
});

objNotifier.on("delete:abc", function(new_value, old_value, change_type) {
  // the property 'abc' was deleted from the obj
  // NOTE: 'remove:abc' can be used too
});

objNotifier.on("update:abc", function(new_value, old_value, change_type) {
  // the property 'abc' was updated
});

/*

  Removing observers

*/

// remove a specific observer relating to 'change'
objNotifier.off("change", callback_function_which_was_used_before);
// remove all observers relating to 'change'
objNotifier.off("change");
```


## To do

- Support nested objects
- Release v0.1.0
