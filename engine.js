////////////////////////////////////////////////////////////////////////////////
/*/ Engine Global Constants ////////////////////////////////////////////// X /*/
////////////////////////////////////////////////////////////////////////////////
const ENGINE_NAME             = "realtodo.js";
const ENGINE_VERSION          = "1.0.0";

const SESSION_START_TIMESTAMP = new Date().toISOString();

const ETC_HEADER_CONTENT_TYPE = "data:text/plain;charset=utf-8";

const SERVER_DEFAULT_PORT = 5461;

// error_no-such-command
// error_id-not-specified
// success_task-added
// success_authorized-manually
// success_authorized-auto
// confirm_clear-storage
// confirm_import-tasks
// confirm_authorize
// error_default-title

////////////////////////////////////////////////////////////////////////////////
/*/ Global Initializer /////////////////////////////////////////////////// X /*/
////////////////////////////////////////////////////////////////////////////////

var Module = (function () {
  "use strict";
  let module = {};
  return module;
}());


var Initializer = (function () {
  "use strict";
  let module = {};

  module.init = function() {
    let pm0 = performance.now();
    
    Storage.init();
    Shell.init();
    GUI.init();
    
    let pm1 = performance.now();
    console.log("This all took " + Math.round(pm1 - pm0) + "ms.");
  };

  return module;
}());


////////////////////////////////////////////////////////////////////////////////
/*/ Shell //////////////////////////////////////////////////////////////// X /*/
////////////////////////////////////////////////////////////////////////////////
var Shell = (function () {
  "use strict";
  let module = {};
  
  let tokens = ["/", "."];
  let commands = {
    "add": {
      manual: "Adds a new task with text specified.",
      tokens: ["add", "a"]
    },
    "pop": {
      manual: "Removes one or more (if number specified) last task(s).",
      tokens: ["pop", "p"]
    },
    "clear": {
      manual: "Clears all the storage, including tasks, credentials and settings.",
      tokens: ["clear"]
    },
    "less": {
      manual: "(GUI)",
      tokens: ["less"]
    },
    "more": {
      manual: "(GUI)",
      tokens: ["more"]
    },
    "auth": {
      manual: "Authorize at server as user@server:port. ",
      tokens: ["auth"]
    },
    "push": {
      manual: "",
      tokens: ["push"]
    },
    "pull": {
      manual: "",
      tokens: ["pull"]
    }
  };
  
  let manuals = {
    "add": "",
  };
  
  function parseId(string) {
    let id = Number.parseInt(string);
    
    if (Number.isInteger(id) && (Storage.index(id) > f-1)) {
      return id;
    } else {
      return null;
    }
  }
  
  module.init = function() {
    
    if (this.token && this.server) {
      GUI.toast(ENGINE_NAME, "Automaticaly authorized as " + this.token + "@" + this.server + ".");}
    
    return 0;
  };
  
  module.parse = function(line) {
    if (!/^\s*$/.test(line)) {
      line = line.trim().replace(/\s\s+/g, " ");

      if (tokens.includes(line[0])) {
        let args = line.slice(1).split(" "),
            command = this.find(["commands", args[0]]);
            
        if (command) {
          this[command](args);
        } else {
          GUI.toast("Error", "There is no command \"/" + command + "\".");
        }
      } else {
        this.add([line]);
      }
    }
  };
  
  module.find = function(args) {
    let type = args[0],
        name = args[1];
        
    for (let entry in this[type]) {
      for (let token of this[type][entry].tokens) {
        if (name === token) {
          return token;
        }
      }
    }
    
    return null;
  };
  
  module.list = function(args) {
    
  };
  
  module.edit= function(args) {
    if (this.parseId(args[1])) {
      GUI.edit(args[1]);
    } else {
      GUI.toast("Error", "Please enter a correct number first to use task.");
    }
  };
  
  module.more = function(args) {
    if (this.parseId(args[1])) {
      GUI.more(args[1]);
    } else {
      GUI.toast("Error", "Please enter correct number first to use task."); 
    }
  };
  
  module.less = function(args) {
    console.log(args);
    if (this.parseId(args[1])) {
      GUI.less(args[1]);
    } else {
      GUI.toast("Error", "Please enter correct number first to use task."); 
    }
  };
  
  module.help = function(args) {
    
  };
  
  module.add = function(args) {
    let task = Task.parse(args.join(""));
    
    Storage.add(task);
    GUI.add(task);
    
    GUI.toast(ENGINE_NAME, "New task added: " + task.body.toString() + ".");
  };
  
  module.pop = function(args) {
    Storage.pop();
    GUI.pop();
  }; 
  
  module.insert = function(args) {
    let id, task;
    
    if (this.parseId(args[1])) {
      id = args[1];
      task = args.slice(1).join(" ");
    } else {
      id = Storage.lastId;
      task = args.join(" ");  
    }
      
    Storage.insert(id, task);
    GUI.insert(id, task);
  };
  
  module.modify = function(args) {
    if (this.parseId(args[1])) {
      let id = args[1]; 
      Storage.modify();
      GUI.modify();
    } else {
     
    }
  };
    
  module.remove = function(args) {
    if (this.parseId(args[1])) {
      
    } else {
      
    }
  };
  
  module.done = function(args) {
    if (this.parseId(args[1])) {
      
    } else {
      
    }    
  };
  
  module.undone = function(args) {
    if (this.parseId(args[1])) {
      
    } else {
      
    }    
  };
  
  module.priority = function(args) {
    if (this.parseId(args[1])) {
      
    } else {
      
    }    
  };
  
  module.date = function(args) {
    if (this.parseId(args[1])) {
      
    } else {
      
    }    
  };
  
  module.body = function(args) {
    if (this.parseId(args[1])) {
      
    } else {
      
    }    
  };
  
  module.clear = function(args) {
    if (GUI.confirm("Are you sure you want to clear all storage with all the tasks and credentials stored?\r\n\r\nThis operation can't be undone.")) {
      Storage.clear();
      GUI.clear();
      GUI.toast(ENGINE_NAME, "Storage cleared.");
    }
  };
  
  module.auth = function(args) {
    const DEFAULT_SERVER = "localhost";
    const DEFAULT_PORT = "12345";
    
    let rx = /^[^@:]+(@[^@:]+(:\d+|)|)$/,
        input = args[1].split("@"),
        token = input[0],
        server = input[1] || DEFAULT_SERVER + ":" + DEFAULT_PORT;
    
    if (rx.test(args[1])) {
      if (GUI.confirm("Authorize as " + token + "@" + server + "?")) {
        GUI.toast(ENGINE_NAME, "Manually authorised as " + token + "@" + server + ".");
        Storage.auth(token, server);
      }
    } else {
      GUI.toast();
    }
  };
  
  module.push = function(args) {
    
  };
  
  module.pull = function(args) {
    // might be dangerous, require confirmation
  };
  
  module.importTasks = function(args) {
    let message = "Are you sure you want to import new tasks?\n\n" + 
      "This operation will replace all the existing tasks and CAN NOT be undone.";
    
    if (GUI.confirm(message)) {
      Storage.importTasks(GUI.importTasks());
    }
  };
  
  module.exportTasks = function(args) {
    GUI.exportTasks(Storage.exportTasks());
  };

  return module;
}());



////////////////////////////////////////////////////////////////////////////////
/*/ GUI ////////////////////////////////////////////////////////////////// X /*/
////////////////////////////////////////////////////////////////////////////////
var GUI = (function () {
  "use strict";
  let module = {};
  
  let toastTimeOutInterval = 0;
  let cssClassNames = {
    editorShown: "editor-shown",
    controlsShown: "controls-shown",
    taskDone: "task-done"
  };
  
  let buttonValues = {
    done:   "done",
    undone: "undone",
    edit:   "edit",
    save:   "save",
    less:   "less",
    remove: "remove",
  };
  
  let baseform = document.getElementById("baseform");
  
  let inputs = {
    command: baseform.elements["command"],
    task:    baseform.elements["task"],
    submit:  baseform.elements["x-submit"],
    file:    baseform.elements["file"],
    import:  baseform.elements["import"],
  };
  
  let outputs = {
    tasks:   baseform.elements["tasks"]
  };
    
  let templates = {
    task:  document.getElementById("tasktemplate").content.querySelector("article")
  };
  
  module.init = function() {
    baseform.addEventListener("submit", function(event) {
      event.preventDefault();
      
      Shell.parse(inputs.task.value);
      inputs.task.value = "";
      
      return false;
    });
    
    inputs.command.addEventListener("click", function() {
      let value = GUI.inputs.task.value;

      if (value[0] === "/" && value.length > 1) {
        todoform.submit();
      } else {
        GUI.inputs.task.value = "/" + value;
        GUI.inputs.task.selectionEnd = GUI.inputs.task.value.length;
        GUI.inputs.task.focus();
      }
    });
    
    // draft zone here
    for (let tag in Schema.tags) {
      let input = document.createElement("button");
      input.textContent = Schema.tags[tag].token + tag;
      input.classList.add(tag);

      baseform.elements["tags"].appendChild(input);
    }
    
    for (let task of Storage.tasks) {
      this.add(task);
    }
    
    return 0;
  };
  
  module.alert = function(message) {
    alert(message);
  };
  
  module.confirm = function(message) {
    return confirm(message);
  };
  
  module.prompt = function(message, prompt) {
    return prompt(message, prompt);
  };
  
  module.list = function(regex) {
    
  };
  
  module.edit = function(id) {
    // let taskElement = document.getElementById("task-" + id);
    // taskElement.querySelector("section").click();
    // taskElement.querySelector("button[value='edit']").click();
    // taskElement.querySelector("textarea").focus();
  };
  
  module.more = function(id) {
    
  };
  
  module.less = function(id) {
    
  };
  
  module.toast = function(title, body) {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        new Notification(title, {body: body});
      }
    });
  };
  
  module.add = function(task) {
    let message = templates.task.cloneNode(true);
        
    message.id = "task-" + task.id;
        
    message.querySelector("section").innerHTML = task.toHTML();
    message.querySelector("textarea").textContent = task.toString();
    
    outputs.tasks.insertBefore(message, outputs.tasks.children[0]);
  };
  
  module.pop = function(count) {
    
  }; 
  
  module.insert = function(id, task) {
    
  };
  
  module.modify = function(id, task) {
    
  };
    
  module.remove = function(id) {
    
  };
  
  module.done = function(id) {
    
  };
  
  module.undone = function(id) {
    
  };
  
  module.priority = function(args) {
    
  };
  
  module.date = function(args) {
    
  };
  
  module.body = function(args) {
    
  };
  
  module.clear = function() {
    this.outputs.tasks.querySelectorAll("article").forEach(function(task) {
      task.remove()
    });

  };
  
  module.importTasks = function() {
    let result = [];
  
    this.inputs.import.click();
    
    if (this.inputs.impurt.files) {
      
      let fileReader = new FileReader();
      
      fileReader.addEventListener("load", function() {
        return this.result;      
      });
      
      fileReader.readAsText(form.elements["texts"].files[i]);
    } else {
      
    }
    
    return false;
  };
  
  module.exportTasks = function(tasks) {
    let anchor = document.createElement("a");

    anchor.target = "_blank";
    anchor.download = "todo-" + new Date().getTime() + ".txt";
    anchor.href = ETC_HEADER_CONTENT_TYPE + "," + encodeURIComponent(tasks);

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    GUI.toast(ENGINE_NAME, "Export over.");
  };
  
  return module;
}());



////////////////////////////////////////////////////////////////////////////////
/*/ Storage //////////////////////////////////////////////////////////////////*/
////////////////////////////////////////////////////////////////////////////////
var Storage = (function () {
  "use strict";
  let module = {};
  
  
  
  return module;
}());


var Storage = {
  get token() {
    return ClientStorage.token;
  },
  
  set token(value) {
    ClientStorage.token = value;
  },
  
  get server() {
    return ClientStorage.server;
  },
  
  set server(value) {
    ClientStorage.server = value;
  },
  
  get tasks() {
    return ClientStorage.tasks;
  },
  
  get lastId() {
    return ClientStorage.lastId;
  },
  
  init() {
    ClientStorage.init();
    ServerStorage.init();
    
    return 0;
  },
  
  id(index) {
    return ClientStorage.id(index);
  },
  
  index(id) {
    return ClientStorage.index(id);
  },
  
  add(task) {
    ClientStorage.add(task);
  },
  
  pop(count) {
    ClientStorage.pop();
  }, 
  
  insert(index, task) {
    ClientStorage.insert(index, task);
  },
  
  save(index, task) {
    ClientStorage.insert(index, task);
  },
    
  remove(index) {
    ClientStorage.insert(index);
  },
  
  clear() {
    ClientStorage.clear();
  },
  
  importTasks(todotxt) {
    this.clear();
    
    todotxt.replace(/\r\n/g, "\n").split("\n").forEach(function(element) {
      Shell.add([element]);
    });
  },
  
  exportTasks() {
    let tasks = [];
    
    this.tasks.forEach(function(element) {
      tasks.push(element.toString());
    });
    
    return tasks.join("\r\n");
  },
  
  push() {
    ServerStorage.push();
  },
  
  pull() {
    ServerStorage.pull();
  },
  
  auth(token, server) {
    this.token = token;
    this.server = server;
  }
};

////////////////////////////////////////////////////////////////////////////////
/*////////////////////////////////////////////////////////////////////////////*/
////////////////////////////////////////////////////////////////////////////////
var ClientStorage = {
  buffer: {},
  updateInterval: 0,
  
  get keyName() {
    return ENGINE_NAME;
  },
  
  get updateIntervalValue() {
    return 1000;
  },
  
  get dummy() {
    return {
      meta: { version: ENGINE_VERSION, date: new Date().toISOString() },
      credentials: { token: "", server: "" },
      tasks: []
    };
  },
  
  get token() {
    return this.buffer.credentials.token;
  },
  
  set token(value) {
    this.buffer.credentials.token = value;
  },
  
  get server() {
    return this.buffer.credentials.server;
  },
  
  set server(value) {
    this.buffer.credentials.server = value;
  },
  
  get tasks() {
    return this.buffer.tasks;
  },
  
  get lastId() {
    let id = 0;
    
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id > id) {
        id = this.tasks[i].id;
      }
    }
    
    return id;
  },
  
  init() {
    if (!this.load()) {
      this.clear();
    }
    
    this.updateInterval = setInterval(function() {
      ClientStorage.save();
    }, this.updateIntervalValue);
    
    for (let i = 0; i < this.buffer.tasks.length; i++) {
      this.buffer.tasks[i] = Task.fromJSON(this.buffer.tasks[i]);
    }
    
    return 0;
  },
  
  load() {
    return this.buffer = JSON.parse(localStorage.getItem(this.keyName));
  },
  
  save() {
    this.buffer.meta.date = new Date().toISOString();
    
    localStorage.setItem(this.keyName, JSON.stringify(this.buffer));
  },
  
  id(index) {
    if (this.buffer.tasks[index]) {
      return this.buffer.tasks[index].id;
    } else {
      return null;
    }
  },
  
  index(id) {
    for (let i = 0; i < this.buffer.tasks.length; i++) {
      if (this.buffer.tasks[i].id === id) {
        return i;
      }
    }
    
    return -1;
  },
  
  add(task) {
    task.id = this.lastId + 1;
    
    this.buffer.tasks.push(task);
  },
  
  pop(count) {
    this.buffer.tasks.pop();
  }, 
  
  insert(index, task) {
    this.buffer.tasks.splice(index, 0, task);
  },
  
  modify(index, task) {
    this.buffer.tasks[index] = task;
  },
    
  remove(index) {
    this.buffer.tasks.splice(index, 1);
  },
  
  clear() {
    this.buffer = this.dummy;
    this.save();
  } 
};


////////////////////////////////////////////////////////////////////////////////
/*////////////////////////////////////////////////////////////////////////////*/
////////////////////////////////////////////////////////////////////////////////
var ServerStorage = {
  init() {
    return 0;
  },
  
  get server() {
    return Storage.server;
  },
  
  get token() {
    return Storage.token;
  },
  
  get tasks() {
    return encodeURIComponent(JSON.stringify(Storage.tasks));
  },
  
  push() {
    let x = new XMLHttpRequest();
    x.addEventListener("load", function() {
      console.log(this.responseText);
    });
    
    x.open("POST", this.server + "/push");
    x.setRequestHeader("Content-Type", ETC_HEADER_CONTENT_TYPE);
    x.send(this.tasks);
  },
  
  pull(index) {
    let x = new XMLHttpRequest();
    x.addEventListener("load", function() {
      
    });
    
    x.open("GET", this.server + "/pull");
    x.setRequestHeader("Content-Type", ETC_HEADER_CONTENT_TYPE);
    x.send();
  },
};


////////////////////////////////////////////////////////////////////////////////
/*////////////////////////////////////////////////////////////////////////////*/
////////////////////////////////////////////////////////////////////////////////
var Schema = {
  head: {
    state: {
      iterable: false,
      list: {
        todo: { text: "", value: 0 },
        done: { text: "x", value: 128 }
      },
      check: function(input) {
        return input === "x";
      },
      getValue: function(text) {
        for (let state in this.list) {
          if (text === this.list[state].text) {
            return this.list[state].value;
          }
        }
      },
      getText: function(value) {
        for (let state in this.list) {
          if (value === this.list[state].value) {
            return this.list[state].text;
          }
        }
      },
      getDefaultValue: function() {
        return this.getValue("");
      },
      getDefaultText: function() {
        return this.getText(0);
      }
    },
    priority: {
      iterable: true,
      pattern: /\([A-Fa-f]\)/,
      list: {
        unknown: { text: "", value: 0 },
        a: { text: "(A)", value: 1 },
        b: { text: "(B)", value: 2 },
        c: { text: "(C)", value: 3 },
        d: { text: "(D)", value: 4 },
        e: { text: "(E)", value: 5 },
        f: { text: "(F)", value: 6 },
      },
      check: function(input) {
        return this.pattern.test(input);
      },
      getValue: function(text) {
        for (let priority in this.list) {
          if (text === this.list[priority].text) {
            return this.list[priority].value;
          }
        }
      },
      getText: function(value) {
        for (let priority in this.list) {
          if (value === this.list[priority].value) {
            return this.list[priority].text;
          }
        }
      },
      getDefaultValue: function() {
        return this.getValue("");
      },
      getDefaultText: function() {
        return this.getText(0);
      }
    },
    id: {
      iterable: true,
      pattern: /task-\d+/,
      check: function(input) {
        return this.pattern.test(input);
      },
      getValue: function(text) {
        return parseInt(text.slice(5));
      },
      getText: function(value) {
        if (/\d+/.test(value) && value > 0) {
          return "task-" + value;
        } else {
          return "";
        }
      },
      getDefaultValue: function() {
        return 0;
      }
    },
    date: {
      iterable: true,
      pattern: /\d{4}-\d{2}-\d{2}/,
      check: function(input) {
        return this.pattern.test(input) && Date.parse(input);
      },
      getValue: function(text) {
        return new Date(text);
      },
      getText: function(value) {
        return value.toISOString().slice(0, 10);
      },
      getDefaultValue: function() {
        return new Date();
      },
      getDefaultText: function() {
        return new Date().toISOString().slice(0, 10);
      }
    }
  },
  tags: {
    context: {
      token: "@",
    },
    project: {
      token: "+",
    },
    dependency: {
      token: "~",
    },
    hashtag: {
      token: "#",
    }
  }
};

////////////////////////////////////////////////////////////////////////////////
/*////////////////////////////////////////////////////////////////////////////*/
////////////////////////////////////////////////////////////////////////////////
class Task {
  static parse(text) {
    text = text.trim().replace(/\s\s+/g, " ");

    let words = text.split(" "),
        head  = Schema.head,
        task  = {};

    if (head.state.check(words[0])) {
      task.state = head.state.getValue(words[0]);
      words.shift();
    }

    let headers = {}, length = 0;
    for (let header in head) {
      if (head[header].iterable) {
        headers[header] = head[header];
        length++;
      }
    }

    for (let i = 0, run = true; i < words.length && run; i++) {
      var count = 0;
      for (let header in headers) {
        count++;

        if (task[header] === undefined) {
          if (head[header].check(words[i])) {
            task[header] = head[header].getValue(words[i]);
            break;
          }
        }

        if (count === length) {
          task.body = words.slice(i, words.length).join(" ");
          run = false;
          break;
        }
      }
    }

    return new Task(
      task.state,
      task.priority,
      task.date,
      task.id,
      new TaskBody(task.body)
    );
  }
  
  static fromString(source) {
    return Task.parse(source);
  }
  
  static fromJSON(json) {
    return new Task(
      json.state,
      json.priority,
      new Date(json.date),
      json.id,
      new TaskBody(json.body.textContent)
    );
  }
  
  static fromJSONString(jsonString) {
    return Task.fromJSON(JSON.parse(jsonString));
  }

  constructor(
    state         = Schema.head.state.getDefaultValue(),
    priority      = Schema.head.priority.getDefaultValue(),
    date          = Schema.head.date.getDefaultValue(),
    id            = Schema.head.id.getDefaultValue(),
    body          = Schema.body.getDefaultValue()
  ) {
    this.state    = state;
    this.priority = priority;
    this.id       = id;
    this.date     = date;
    this.body     = body;
  }

  toString() {
    return (
      Schema.head.state.getText(this.state)       + " " +
      Schema.head.priority.getText(this.priority) + " " +
      Schema.head.id.getText(this.id)             + " " +
      Schema.head.date.getText(this.date)         + " " +
      this.body.toString()
    );
  }

  toHTML() {
    return (
      Schema.head.state.getText(this.state)       + " " +
      Schema.head.priority.getText(this.priority) + " " +
      Schema.head.id.getText(this.id)             + " " +
      Schema.head.date.getText(this.date)         + " " +
      this.body.innerHTML
    );
  }
}

class TaskBody {
  constructor(string) {
    this.textContent = string;
  }
  
  static fromString(string) {
    return new TaskBody(string.trim().replace(/\s\s+/g, " "));
  }
  
  static fromJSON(json) {
    return new TaskBody(json.textContent);
  }
  
  static fromJSONString(jsonString) {
    return new TaskBody(JSON.parse(jsonString).textContent);
  }
  
  get contexts() { return this.getTags("context"); }
  get projects() { return this.getTags("project"); }
  get dependencies() { return this.getTags("dependency"); }
  get hashtags() { return this.getTags("hashtag"); }
 
  get innerHTML() {
    let result = this.textContent.split(" ");
    
    for (let tag in Schema.tags) {
      for (let word of result) {
        if (word.charAt(0) === Schema.tags[tag].token) {
          console.log(1);
          word = "s";
        }
      }
    }
    
    result.join(" ").split("::").join("<br />")
    
    return result;
  }
  
  toString() { return this.textContent; }
  
  getTags(tagName) {
    let words = this.textContent.split(" "),
        tags  = [];

    for (let word of words) {
      if ((word.charAt(0) === Schema.tags[tagName].token) && (!tags.includes(word.slice(1)))) {
        tags.push(word.slice(1));
      }
    }

    return tags;
  }
}

class TaskHead {
  constructor() {
    
  }
}

class TaskHeader {
  constructor() {
    
  }
}

Initializer.init();
