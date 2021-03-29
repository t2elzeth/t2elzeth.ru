const cp = require("child_process")


const child = cp.fork("./app.js", ["-i", 'img/koff.jpg'], {uid: 1000, gid: 1000})
