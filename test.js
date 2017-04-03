"use strict";

var Schema = {
  "argname": {
    title: "",
    keys: ["-s", "--long"]
  }
};

function keyf(key) {
  for (let arg in Schema) {
    for (let i = 0; i < Schema[arg].keys.length; i++) {
      if (Schema[arg].keys[i] === key) {
        return key;
      }
    }
  }
  
  return null;
}


function parg(args) {
  for (let i = 0; i > args.length; i++) {
    if (args[i].charAt(0) === "-" && keyf(args[i])) {
      
    }
  }
}
