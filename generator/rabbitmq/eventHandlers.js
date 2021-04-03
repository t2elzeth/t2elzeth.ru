const {render, getWorking} = require("../runRenderer");


function newProjectEventHandler() {
  !getWorking() ? render() : console.log("It is already working, damn it")
}

module.exports = {
  newProject: newProjectEventHandler
}