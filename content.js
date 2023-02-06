// adds p (policy data), p2 (cluster data), p3 (form data) elements to body
// ------------------------------------------------
let a = document.body;
let ab = window.location.href;
let p = document.createElement("p");
let p2 = document.createElement("p");
let p3 = document.createElement("p");
p.style.display = "none";
p.id = "policyData";
p2.style.display = "none";
p2.id = "clusterData";
p3.style.display = "none";
p3.id = "pid";
a.appendChild(p);
a.appendChild(p2);
a.appendChild(p3);
// ------------------------------------------------




function observeDOMChanges() {
    var targetNode = document.body;
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if ((mutation.target.id === "framework" 
                    && (document.getElementById("pid").getAttribute("boolean") === null 
                        || document.getElementById("pid").getAttribute("boolean") === "false"))
                || (mutation.removedNodes[0].className == "semi-spin-wrapper" 
                    && (document.getElementById("pid").getAttribute("boolean") === null 
                        || document.getElementById("pid").getAttribute("boolean") === "false"))) {
                document.getElementById("pid").setAttribute("boolean", true)
                // appends script "inject.js" to body
                // ------------------------------------------------
                let s = document.createElement('script');
                s.src = chrome.runtime.getURL('inject.js');
                s.setAttribute("id", "inject");
                s.setAttribute("extension", chrome.runtime.getURL('bytecounter-form.html'))
                document.body.appendChild(s);
                // ------------------------------------------------
            }
        });
    });
    var config = {
        attributes: false,
        childList: true,
        subtree: true
    };
    observer.observe(targetNode, config);
}
observeDOMChanges();


// Sets policy data in element p (id=policyData)
// --------------------------------------------------
let data = [];
chrome.storage.local.get(['key'], function (result) {
    if (result.key) {
        data = JSON.parse(result.key);
        p.innerText = (JSON.stringify(data));
    }
});
// --------------------------------------------------


// Sends message to background script when the body is clicked, with the URL, form data and cluster data
// --------------------------------------------------
function sendMessageToBackground() {
    let dataToSend = {};
    if (ab.includes("https://tcs-sg.bytedance.net/workprocess/")) {
        dataToSend["url"] = ab.split("?")[0].substring(ab.split("?")[0].length - 19, ab.split("?")[0].length);
    } else if (ab.includes("https://rock-va.bytedance.net/appeal_center/workbench?")) {
        dataToSend["project"] = document.querySelectorAll("[class*='headerProject']")[0].lastChild.innerText.substring(2);
        let app = document.getElementsByClassName("semi-collapsible-wrapper");
        let objApp = {};
        for (div of app) {
            let role = div.innerText.split("-")[0].substr(0,div.innerText.split("-")[0].length-1);
            let appeal = div.innerText.split("\n\n").splice(2,div.innerText.split("\n\n").length-3);
            if (appeal != "") {
                objApp[role] = appeal.toString()
            }
        }
        dataToSend["appealData"] = objApp;
    }
    dataToSend["pidData"] = document.getElementById("pid").innerText;
    dataToSend["clusterData"] = document.getElementById("clusterData").getAttribute("clusterdata");
    chrome.runtime.sendMessage({data: dataToSend});
    console.log(dataToSend)

}

document.body.addEventListener("click", function () {
    sendMessageToBackground();
})
// ---------------------------------------------------



