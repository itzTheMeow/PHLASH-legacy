const fs = require("fs");
const db = {
  fetch: (key) => {
    return require("./database.json")[key];
  },
  add: (key, value) => {
    let data = require("./database.json");
    data[key] = data[key] || 0;
    data[key] += value;
    fs.writeFileSync("./database.json", JSON.stringify(data));
    return data;
  },
  subtract: (key, value) => {
    let data = require("./database.json");
    data[key] = data[key] || 0;
    data[key] -= value;
    fs.writeFileSync("./database.json", JSON.stringify(data));
    return data;
  },
  set: (key, value) => {
    let data = require("./database.json");
    data[key] = value;
    fs.writeFileSync("./database.json", JSON.stringify(data));
    return data;
  },
};
db.get = db.set;
db.sub = db.subtract;
// chmod +x ./database.json
