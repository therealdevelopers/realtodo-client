"use strict";

////////////////////////////////////////////////////////////////////////////////
/*/ Engine Global Constants ////////////////////////////////////////////// X /*/
////////////////////////////////////////////////////////////////////////////////
const ENGINE_NAME                    = "realtodo.js";
const ENGINE_VERSION                 = "1.0.0";

const SESSION_START_TIMESTAMP = new Date().toISOString();

const ETC_HEADER_CONTENT_TYPE = "data:text/plain;charset=utf-8";


// error_no-such-command
// error_id-not-specified
// success_task-added
// success_authorized-manually
// success_authorized-auto
// confirm_clear-storage
// confirm_import-tasks
// error_default-title

////////////////////////////////////////////////////////////////////////////////
/*/ Global Initializer /////////////////////////////////////////////////// X /*/
////////////////////////////////////////////////////////////////////////////////
var Initializer = {
  init() {
    let pm0 = performance.now();
    
    Storage.init();
    Shell.init();
    GUI.init();
    
    let pm1 = performance.now();
    
    console.log("Took %dms.", Math.round(pm1 - pm0));
  }
};


////////////////////////////////////////////////////////////////////////////////
/*/ Shell //////////////////////////////////////////////////////////////// X /*/
////////////////////////////////////////////////////////////////////////////////
var Shell = {
  
  tokens: ["/", "."],
  
  commands: {
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
      manual: "",
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
  },
  
  manuals: {
    "add": "",
  },
  
  init() {
    return 0;
  },
  
  parse(line) {
    if (!/^\s*$/.test(line)) {
      line = line.trim().replace(/\s\s+/g, " ");

      if (this.tokens.includes(line[0])) {
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
  },
  
  parseId(string) {
    let id = Number.parseInt(string);
    
    if (Number.isInteger(id) && (Storage.index(id) > f-1)) {
      return id;
    } else {
      return null;
    }
  },
  
  find(args) {
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
  },
  
  list(args) {
    
  },
  
  edit(args) {
    if (this.parseId(args[1])) {
      GUI.edit(args[1]);
    } else {
      GUI.toast("Error", "Please enter a correct number first to use task.");
    }
  },
  
  more(args) {
    if (this.parseId(args[1])) {
      GUI.more(args[1]);
    } else {
      GUI.toast("Error", "Please enter correct number first to use task."); 
    }
  },
  
  less(args) {
    console.log(args);
    if (this.parseId(args[1])) {
      GUI.less(args[1]);
    } else {
      GUI.toast("Error", "Please enter correct number first to use task."); 
    }
  },
  
  help(args) {
    
  },
  
  add(args) {
    let task = Task.parse(args.join(""));
    
    Storage.add(task);
    GUI.add(task);
    
    GUI.toast(ENGINE_NAME, "New task added: " + task.body.toString() + ".");
  },
  
  pop(args) {
    Storage.pop();
    GUI.pop();
  }, 
  
  insert(args) {
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
  },
  
  modify(args) {
    if (this.parseId(args[1])) {
      let id = args[1]; 
      Storage.modify();
      GUI.modify();
    } else {
     
    }
  },
    
  remove(args) {
    if (this.parseId(args[1])) {
      
    } else {
      
    }
  },
  
  done(args) {
    if (this.parseId(args[1])) {
      
    } else {
      
    }    
  },
  
  undone(args) {
    if (this.parseId(args[1])) {
      
    } else {
      
    }    
  },
  
  priority(args) {
    if (this.parseId(args[1])) {
      
    } else {
      
    }    
  },
  
  date(args) {
    if (this.parseId(args[1])) {
      
    } else {
      
    }    
  },
  
  body(args) {
    if (this.parseId(args[1])) {
      
    } else {
      
    }    
  },
  
  clear(args) {
    if (GUI.confirm("Are you sure you want to clear all storage with all the tasks and credentials stored?\r\n\r\nThis operation can't be undone.")) {
      Storage.clear();
      GUI.clear();
      GUI.toast(ENGINE_NAME, "Storage cleared.");
    }
  },
  
  auth(args) {
    let rx = /\w+@\w+?(:\d+|)/;
    
    if (GUI.confirm("Authorize as " + token + "@" + server + "?")) {
      Storage.auth(token, server);
      GUI.toast(ENGINE_NAME, "Manually authorized as " + token + "@" + server + ".");
    }
  },
  
  push(args) {
    
  },
  
  pull(args) {
    // might be dangerous, require confirmation
  },
  
  importTasks(args) {
    let message = "Are you sure you want to import new tasks?\n\n" + 
      "This operation will replace all the existing tasks and CAN NOT be undone.";
    
    if (GUI.confirm(message)) {
      Storage.importTasks(GUI.importTasks());
    }
  },
  
  exportTasks(args) {
    GUI.exportTasks(Storage.exportTasks());
  },
};


////////////////////////////////////////////////////////////////////////////////
/*/ GUI ////////////////////////////////////////////////////////////////// X /*/
////////////////////////////////////////////////////////////////////////////////
var GUI = {
  toastTimeOutInterval: 0,
  
  cssClassNames: {
    editorShown: "editor-shown",
    controlsShown: "controls-shown",
    taskDone: "task-done"
  },
  
  buttonValues: {
    done:   "done",
    undone: "undone",
    edit:   "edit",
    save:   "save",
    less:   "less",
    remove: "remove",
  },
  
  baseform: document.getElementById("baseform"),
  
  inputs: {
    command: this.baseform.elements["command"],
    task:    this.baseform.elements["task"],
    submit:  this.baseform.elements["x-submit"],
    file:    this.baseform.elements["file"],
    import:  this.baseform.elements["import"],
  },
  
  outputs: {
    tasks:   this.baseform.elements["tasks"]
  },
    
  templates: {
    task:  document.getElementById("tasktemplate").content.querySelector("article")
  },
  
  init() {
    baseform.addEventListener("submit", function(event) {
      event.preventDefault();
      
      Shell.parse(GUI.inputs.task.value);
      GUI.inputs.task.value = "";
      
      return false;
    });
    
    this.inputs.command.addEventListener("click", function() {
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
  },
  
  alert(message) {
    alert(message);
  },
  
  confirm(message) {
    return confirm(message);
  },
  
  prompt(message, prompt) {
    return prompt(message, prompt);
  },
  
  list(regex) {
    
  },
  
  edit(id) {
    // let taskElement = document.getElementById("task-" + id);
    // taskElement.querySelector("section").click();
    // taskElement.querySelector("button[value='edit']").click();
    // taskElement.querySelector("textarea").focus();
  },
  
  more(id) {
    
  },
  
  less(id) {
    
  },
  
  toast(title, body) {
    
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        new Notification(title, {body: body});
      }
    });
  },
  
  add(task) {
    let message = this.templates.task.cloneNode(true);
        
    message.id = "task-" + task.id;
        
    message.querySelector("section").innerHTML = task.toHTML();
    message.querySelector("textarea").textContent = task.toString();
    
    this.outputs.tasks.insertBefore(message, this.outputs.tasks.children[0]);
  },
  
  pop(count) {
    
  }, 
  
  insert(id, task) {
    
  },
  
  modify(id, task) {
    
  },
    
  remove(id) {
    
  },
  
  done(id) {
    
  },
  
  undone(id) {
    
  },
  
  priority(args) {
    
  },
  
  date(args) {
    
  },
  
  body(args) {
    
  },
  
  clear() {
    this.outputs.tasks.querySelectorAll("article").forEach(function(task) {
      task.remove()
    });

  },
  
  importTasks() {
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
  },
  
  exportTasks(tasks) {
    let anchor = document.createElement("a");

    anchor.target = "_blank";
    anchor.download = "todo-" + new Date().getTime() + ".txt";
    anchor.href = ETC_HEADER_CONTENT_TYPE + "," + encodeURIComponent(tasks);

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    GUI.toast(ENGINE_NAME, "Export over.");
  },
};


////////////////////////////////////////////////////////////////////////////////
/*/ Storage //////////////////////////////////////////////////////////////////*/
////////////////////////////////////////////////////////////////////////////////
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
    
    if (this.token && this.server) {
      GUI.toast(ENGINE_NAME, "Automaticaly authorized as " + this.token + "@" + this.server + ".");
    }
    
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
      console.log(this.responseText);
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
