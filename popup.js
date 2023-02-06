window.onload = function () {

    let policy;

    // displays toast message
    // -------------------------------------------------------------------
    function toast(x) {
        var toastLiveExample = document.getElementById('liveToast');
        var toast = new bootstrap.Toast(toastLiveExample);
        document.getElementsByClassName('toast-body')[0].innerHTML = x;
        toast.show();
    }
    // -------------------------------------------------------------------


    // Saves the string in JSON input field to load policies and clusters
    // -------------------------------------------------------------------
    document.getElementById("save").addEventListener("click", function () {
        try {
            let value = document.getElementById("inputPolicy").value;
            var jsonStr = value.replace(/(\w+:)|(\w+ :)/g, function (s) {
                return '"' + s.substring(0, s.length - 1) + '":';
            });
            JSON.parse(jsonStr);
            chrome.storage.local.set({
                key: jsonStr
            }, toast("Success! Close and open extension to display results."))
        } catch (err) {
            toast("Invalid format! :(")
        }
    });
    // -------------------------------------------------------------------



        // Saves the string in JSON input field to load policies and clusters
    // -------------------------------------------------------------------
    document.getElementById("saveScript").addEventListener("click", function () {
        try {
            let value = document.getElementById("inputScript").value;
            chrome.storage.local.set({
                script: value
            }, toast("Success!"))
        } catch (err) {
            toast("Invalid format! :(")
        }
    });
    // -------------------------------------------------------------------



    // for debugging: logs policy data on console when pressing the logpolicy button
    // -------------------------------------------------------------------
    chrome.storage.local.get(['key'], function (result) {
        policy = JSON.parse(result.key)
        document.getElementById("logPolicy").addEventListener("click", function () {
            if (result.key) {
                console.log(JSON.parse(result.key))
            } else {
                console.log("no policy data to display")
            }
        });
    })
    // -------------------------------------------------------------------

    // for debugging: logs policy data on console when pressing the logpolicy button
    // -------------------------------------------------------------------
    chrome.storage.local.get(['script'], function (result) {
        document.getElementById("logScript").addEventListener("click", function () {
            if (result.script) {
                console.log(result.script)
            } else {
                console.log("no policy data to display")
            }
        });
    })
    // -------------------------------------------------------------------



    // -------------------------------------------------------------------
    chrome.storage.local.get(['lol'], function (result) {
        let arr = []
        let obj = result.lol

        // for debugging: logs policy data on console when pressing the logpolicy button
        // -------------------------------------------------------------------
        document.getElementById("logVideo").addEventListener("click", function () {
            if (obj) {
                console.log(obj)
            } else {
                console.log("no video data to display")
            }
        })
        // -------------------------------------------------------------------
        
        

        // formats video JSON data for dataTables; [TODO] change "policy" variable to JSON parse the policy data in localstorage
        // -------------------------------------------------------------------
        for (let key in obj) {
            for (let key2 in obj[key]) {
                for (let key3 in obj[key][key2]) {
                    for (let key4 in obj[key][key2][key3]) {
                        let data = [
                            new Date(parseInt(key3)).toLocaleDateString(),
                            qs[key],
                            obj[key][key2][key3][key4].objectId,
                            obj[key][key2][key3][key4].QAPolicy.split(",").map(x => policy[x] != undefined ? policy[x]["value"] : "").join(" /// "),
                            obj[key][key2][key3][key4].difficulty,
                            obj[key][key2][key3][key4].cluster,
                            obj[key][key2][key3][key4].escalateButton
                        ]
                        arr.push(data)
                    }
                }
            }
        }
        // -------------------------------------------------------------------
        

        // Displays total count of cases to date
        // -------------------------------------------------------------------
        document.getElementById("count").innerHTML = arr.length;
        // -------------------------------------------------------------------
        
        // Displays list of queues and the tickets done for each
        // -------------------------------------------------------------------
        let queues = [...new Set(arr.map(x => x[1]))];
        let countQueues = []
        for (y of queues) {
            countQueues.push(arr.map(x => x[1]).filter(x => x == y).length);
        }
        for (let i = 0; i < queues.length; i++) {
            let q = document.createElement("tr");
            let w = document.createElement("td");
            let e = document.createElement("td");
            w.innerText = queues[i];
            e.innerText = countQueues[i];
            q.appendChild(w);
            q.appendChild(e);
            document.getElementById("cpqueue").appendChild(q)
        }
        // -------------------------------------------------------------------
        

        // Displays the number of tickets done per date
        // -------------------------------------------------------------------
        let dates = [...new Set(arr.map(x => x[0]))];
        let countDates = []
        for (y of dates) {
            countDates.push(arr.map(x => x[0]).filter(x => x == y).length);
        }
        for (let i = 0; i < dates.length; i++) {
            let q = document.createElement("tr");
            let w = document.createElement("td");
            let e = document.createElement("td");
            w.innerText = dates[i];
            e.innerText = countDates[i];
            q.appendChild(w);
            q.appendChild(e);
            document.getElementById("cpdate").appendChild(q)
        }
        // -------------------------------------------------------------------
        


        // [TODO] DataTable initialization; create and move to datatable js doc
        // ----------------------------------------------------------------
        $(document).ready(function () {
            $('#example').DataTable({
                data: arr,
                pageLength: 50,
                columns: [
                    {
                        title: 'Date'
                    },
                    {
                        title: 'Queue'
                    },
                    {
                        title: 'ObjectID'
                    },
                    {
                        title: 'QAPolicy'
                    }, {
                        title: 'Diff'
                    }, {
                        title: 'Cluster'
                    }, {
                        title: 'Esc'
                    }
                ],
                searchPanes: {
                    initCollapsed: true,
                    cascadePanes: false
                },
                columnDefs: [
                    {
                        targets: 5,
                        className: 'nowrap'
                    },
                    {
                        searchPanes: {
                            show: false
                        },
                        targets: [0]
                    },
                    {
                        searchPanes: {
                            show: false
                        },
                        targets: [1]
                    },
                    {
                        searchPanes: {
                            show: false
                        },
                        targets: [2]
                    }, {
                        searchPanes: {
                            show: false
                        },
                        targets: [3]
                    }, {
                        searchPanes: {
                            show: false
                        },
                        targets: [4]
                    }, {
                        searchPanes: {
                            show: false
                        },
                        targets: [5]
                    }, {
                        searchPanes: {
                            show: false
                        },
                        targets: [6]
                    }
                ]
            });
            $('#example').on('draw.dt', function () {
                copyButton("example", 2)
                changeButtons("example", 1)
                changeButtons("example", 3)
                changeButtons("example", 4)
                changeButtons("example", 5)
            });
            copyButton("example", 2)
            changeButtons("example", 1)
            changeButtons("example", 3)
            changeButtons("example", 4)
            changeButtons("example", 5)
            // changes the styling of the columns to ommit overflowing text
            // -----------------------------------------------------------
            function changeButtons(id, colnum) {
                let rows = document.getElementById(id).childNodes[1].childNodes;
                for (row of rows) {
                    let val = row.childNodes[colnum].innerText;
                    if (val != "" && row.childNodes[colnum].title == "") {
                        row.childNodes[colnum].style = "max-width:1rem;white-space:nowrap;text-overflow:ellipsis;overflow:hidden";
                        row.childNodes[colnum].title = val;
                    }
                }
            }
            // -----------------------------------------------------------

            // copies the selected column to the clipboard
            // -----------------------------------------------------------
            function copyButton(id, colnum) {
                let rows = document.getElementById(id).childNodes[1].childNodes;
                for (row of rows) {
                    if (row.childNodes[colnum].getAttribute("listener") !== "true") {
                        row.childNodes[colnum].setAttribute("listener", "true")
                        row.childNodes[colnum].addEventListener("click", function (e) {
                            navigator.clipboard.writeText(e.target.innerText);
                            toast("Copied to clipboard!")
                        });
                    }
                }
            }
            // ------------------------------------------------------------


        });
        // ----------------------------------------------------------------

    });

    // deletes all data stored in localstorage by pressing the RESET button
    // --------------------------------------------------------------------
    document.getElementById("reset").addEventListener("click", function () {
        if (confirm("Delete all JSON data?")) {
            chrome.storage.local.clear()
        }
    });
    // --------------------------------------------------------------------
    

    // downloads all the stored video data in csv format
    // --------------------------------------------------------------------
    document.getElementById("download").addEventListener("click", function () {
        let title = "bytecounter" + new Date(new Date().getTime()).toLocaleString('sv') + ".csv";
        chrome.storage.local.get(['lol'], function (result) {
            let obj = result.lol;
            console.log(obj)
            let arr = ["Date,Queue,ObjectID,QAPolicy,Difficulty,Cluster,Escalate"];
            for (let key in obj) {
                for (let key2 in obj[key]) {
                    for (let key3 in obj[key][key2]) {
                        for (let key4 in obj[key][key2][key3]) {
                            let row = [];
                            row.push(key3);
                            row.push(key);
                            row.push(obj[key][key2][key3][key4].objectId);
                            row.push(obj[key][key2][key3][key4].QAPolicy);
                            row.push(obj[key][key2][key3][key4].difficulty);
                            row.push(obj[key][key2][key3][key4].cluster.replaceAll(",", ";"));
                            row.push(obj[key][key2][key3][key4].escalateButton);
                            arr.push(row.join(","))
                        }
                    }
                }
            }
            download(title, arr.join("\n"))
        });
    })
    // --------------------------------------------------------------------
    


}


// download function: downloads the file with the name in first parameter and the text in second parameter
// -------------------------------------------------------------------------
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};
// -------------------------------------------------------------------------



let qs = {
    "6976922424310759937": "Sampling-TT-video-report-ES-C-LIS-4.0",
    "6953906321179574786": "QA-Video SPS-ES",
    "6976921032556872193": "Sampling-TT-video-recall-ES-C-LIS-4.0",
    "7099342358524903938": "Sampling-TT-TTF Creator Videos-ES-TP-LIS-4.0",
    "7132729224120517122": "Sampling-TT-Video-report-ES-TP-LIS-4.0",
    "7132729224120533506": "Sampling-TT-Video-recall-ES-TP-LIS-4.0"
};


