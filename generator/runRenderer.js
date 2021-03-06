const path = require("path");
const cp = require("child_process");
const axios = require("axios");
const urljoin = require("url-join");

const apiServer = "http://web:8000/"

const urls = {
  all: urljoin(apiServer, "api/v1/ar/not_rendered/"),
  update: (id) => urljoin(apiServer, "api/v1/ar/not_rendered/", String(id), "/")
}

let working = false;


const main = () => checkForNewProjects().then(startRender).catch(finishWorking)

const startRender = data => startWorking(data).then(startChildProcess).then(updateProjectStatus).then(main).catch(console.log)

// Fetches not rendered projects from API and if finds any, resolves, else rejects
const checkForNewProjects = () => axios.get(urls.all).then(manageWork)

const manageWork = ({data}) => newProjectsExist(data) ? Promise.resolve(data[0]) : Promise.reject()

const newProjectsExist = responseData => responseData.length > 0


function startWorking(data) {
  console.log("Started working with data:", data)
  working = true;
  return Promise.resolve(data)
}

function finishWorking() {
  working = false;
  console.log("Projects are all done. Falling asleep back")
}

function startChildProcess({id, imagename}) {
  return new Promise(resolve => {
    const childProcess = cp.fork("./app.js", ["-i", getImagePath(imagename)])
    childProcess.on("exit", code => resolve({id, code}))
  })
}

const updateProjectStatus = async ({id, code}) => {
  console.log("Finished rendering project #id:", id)
  await axios.put(urls.update(id), {code})
}

const getImagePath = imagename => path.join("./main_backend_images/", imagename)

module.exports.render = main
module.exports.getWorking = () => working;
