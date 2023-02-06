let lastMessage;
let objectId;

function getObjectId(str) {
    let objectIdIndex;
    if (str.includes("object_id")) {
        objectIdIndex = str.indexOf('"object_id');
    } else if (str.includes("video_id")) {
        objectIdIndex = str.indexOf('"video_id')-1;
    }
    return str.substring(objectIdIndex + 13, objectIdIndex + 32);
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      lastMessage = request.data;
    });


function logRequests() {
    chrome.webRequest.onBeforeRequest.addListener(function (details) {
        if (details.url == "https://tcs-sg.bytedance.net/api/v2/resolve_task/") {
            let projectId = lastMessage["url"];
            chrome.storage.local.get(["lol"], function (result) {
                let stor = result.lol;
                let date = Date.now();
                let obj = {};
                let parsedData = JSON.parse(details.requestBody.formData.data[0]);
                obj[date] = JSON.parse(lastMessage["pidData"]);
                for (let i = 0; i < obj[date].length; i++) {
                    obj[date][i]["objectId"] = Object.values(parsedData)[i].mainForm[0].value.object_id;
                    obj[date][i]["QAPolicy"] = Object.values(parsedData)[i].mainForm[1].value.code;
                }
                if (! result.lol) {
                    let newObj = {};
                    newObj[projectId] = [];
                    newObj[projectId].push(obj)
                    chrome.storage.local.set({lol: newObj});
                } else if (! stor[projectId]) {
                    stor[projectId] = [];
                    stor[projectId].push(obj)
                    chrome.storage.local.set({lol: stor});
                } else {
                    stor[projectId].push(obj)
                    chrome.storage.local.set({lol: stor});
                }
            });
            chrome.storage.local.get(['key'], function (result) {
                if (result.key) {
                    let o = JSON.parse(result.key);
                    let q = JSON.parse(lastMessage["clusterData"]);
                    for (key in q) {
                        if (! o[q[key][0]]["cluster"].includes(q[key][1])) {
                            o[q[key][0]]["cluster"].push(q[key][1])
                        }
                    }
                    console.log(o)
                    chrome.storage.local.set({key: JSON.stringify(o)})
                }
            });
        } else { //https://rock-va.bytedance.net/api/v3/releaseTask
            console.log(lastMessage);
            console.log(details.url);
            console.log("OBJECT ID: " + objectId);
            if (details.requestBody.raw[0].bytes !== undefined) {
                var decoder = new TextDecoder();
                var string = decoder.decode(details.requestBody.raw[0].bytes).replace(/\\/g, "");
                if (string.includes('"object_id') || string.includes('"video_id')){
                    objectId = getObjectId(string);
                    console.log(string);
                    console.log(JSON.parse(string));
                }
            }
            // let projectId = lastMessage["url"];
            // chrome.storage.local.get(["appData"], function (result) {
            //     let stor = result.appData;
            //     let date = Date.now();
            //     let obj = {};
            //     obj[date] = JSON.parse(lastMessage["pidData"]);
            //     if (! result.appData) {
            //         let newObj = {};
            //         newObj[projectId] = [];
            //         newObj[projectId].push(obj)
            //         chrome.storage.local.set({appData: newObj});
            //     } else if (! stor[projectId]) {
            //         stor[projectId] = [];
            //         stor[projectId].push(obj)
            //         chrome.storage.local.set({appData: stor});
            //     } else {
            //         stor[projectId].push(obj)
            //         chrome.storage.local.set({appData: stor});
            //     }
            //     console.log(stor)
            // });
            // chrome.storage.local.get(['key'], function (result) {
            //     if (result.key) {
            //         let o = JSON.parse(result.key);
            //         let q = JSON.parse(lastMessage["clusterData"]);
            //         for (key in q) {
            //             if (! o[q[key][0]]["cluster"].includes(q[key][1])) {
            //                 o[q[key][0]]["cluster"].push(q[key][1])
            //             }
            //         }
            //         chrome.storage.local.set({key: JSON.stringify(o)})
            //         console.log(o)
            //     }
            // });
        }
    }, {
        urls: ["<all_urls>"]
    }, ["requestBody"]);
}
logRequests();