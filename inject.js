(function () {

    // LIST OF FUNCTIONS
    // --------------------------------------------------------------------------------------------
    function addHTMLFile() { // Add HTML file to the page
        let url = document.getElementById("inject").getAttribute("extension");
        fetch(url).then(response => response.text()).then(data => {
            let q;
            if (window.location.href.includes("https://rock-va.bytedance.net/appeal_center/workbench?") &&
                !document.getElementsByClassName("newOptions")[0]) {
                q = document.getElementById("audit_info");
                let newData = data;
                let newDiv = document.createElement("div");
                newDiv.className = "newOptions";
                newDiv.innerHTML = newData.replace('<datalist id=""', '<datalist id="policyInit"').replace('class="policy" type="text" list=""', 'class="policy" type="text" list="policyInit"').replace('class="clusters" id=""', 'class="clusters" id="init"').replace('class="clusterDatalist" type="text" list=""', 'class="clusterDatalist" type="text" list="init"')
                q.appendChild(newDiv);
            }
            else if (window.location.href.includes("https://tcs-sg.bytedance.net/workprocess/") &&
            !document.getElementsByClassName("newOptions")[0]) {
                q = document.getElementsByClassName("ivu-card ivu-card-bordered");
                for (let i = 0; i < q.length; i++) {
                    let newData = data;
                    let newDiv = document.createElement("div");
                    newDiv.className = "newOptions";
                    newDiv.innerHTML = newData.replace('<datalist id=""', '<datalist id="policyInit' + i + '"').replace('class="policy" type="text" list=""', 'class="policy" type="text" list="policyInit' + i + '"').replace('class="clusters" id=""', 'class="clusters" id="init' + i + '"').replace('class="clusterDatalist" type="text" list=""', 'class="clusterDatalist" type="text" list="init' + i + '"')
                    q[i].appendChild(newDiv);
                    q[i].style.minHeight = "1000px"
                }
            }
        });
    };

    function addPolicyClusters(json, elm) { // Add policy clusters to the datalists
        let ab = elm.getElementsByClassName("policyDatalist")[0];
        for (let i = 0; i < ab.children.length; i++) {
            if (elm.getElementsByClassName("policy")[0].value == ab.children[i].value) {
                let a = ab.children[i].getAttribute("code");
                let b = json[a]["cluster"];
                let c = elm.getElementsByClassName("clusters")[0];
                while (c.firstChild) {
                    c.removeChild(c.lastChild)
                }
                for (elm of b) {
                    let option = document.createElement("option");
                    option.innerText = elm
                    c.appendChild(option)
                }
                break;
            }
        }
    };

    function addPolicies(json, elm) { // Add policies to the datalists
        for (key in json) {
            let option = document.createElement("option");
            option.setAttribute("code", key)
            option.innerText = json[key].value;
            elm.appendChild(option)
        }
    };
    // --------------------------------------------------------------------------------------------


    let p = document.getElementById("pid");
    addNewOptions();

    function addNewOptions() { // if the page is loaded...
            let o = JSON.parse(document.getElementById("policyData").innerText); // policy data
            addHTMLFile();
            // ... adds click eventlistener to body
            document.body.addEventListener("click", function () { // whenever the body is clicked, if there are no "newOptions" elements...
                if (document.getElementById("pid").getAttribute("boolean") == "true") {
                    // this loop iterates through every "newOptions" element,
                    // adds policies to policy datalists,
                    // adds "add/remove" logic for clusters to "add" buttons,
                    // adds clusters to policy cluster datalists when the policies change
                    // ----------------------------------------------------------------------------------------------------
                    let newOpt = document.getElementsByClassName("newOptions");
                    for (let i = 0; i < newOpt.length; i++) {
                        let policyLista = document.getElementsByClassName("policyDatalist")[i]; // policy datalist
                        let policyInputlista = document.getElementsByClassName("policy")[i];
                        // policy input


                        // this adds policies to the datalists;
                        // ----------------------------------
                        addPolicies(o, policyLista)
                        // ----------------------------------


                        // this adds the duplicate/remove logic to the "add" buttons; transform to function
                        // --------------------------------------------------------------------------------------------
                        document.getElementsByClassName("add")[i].addEventListener("click", function () {
                            let a = document.getElementsByClassName("selector")[i].cloneNode(true);
                            let parent = document.getElementsByClassName("general")[i];
                            let time = Date.now().toString()
                            a.getElementsByClassName("remove")[0].style.display = "initial"
                            a.getElementsByClassName("clusterDatalist")[0].value = ""
                            parent.appendChild(a);
                            a.getElementsByClassName("clusterDatalist")[0].setAttribute("list", time)
                            a.getElementsByClassName("clusters")[0].id = time;
                            while (a.getElementsByClassName("clusters")[0].firstChild) {
                                a.getElementsByClassName("clusters")[0].removeChild(a.getElementsByClassName("clusters")[0].lastChild)
                            }
                            a.getElementsByClassName("policy")[0].addEventListener("change", function () {
                                addPolicyClusters(o, a)
                            })
                            a.getElementsByClassName("remove")[0].addEventListener("click", function () {
                                parent.removeChild(this.parentNode)
                            })
                        })
                        // --------------------------------------------------------------------------------------------


                        // this updates the clusters when the policy is changed
                        // ----------------------------------
                        policyInputlista.addEventListener("change", function () {
                            addPolicyClusters(o, policyInputlista.parentNode)
                        })
                        // ----------------------------------


                    }
                    // end of loop ----------------------------------------------------------------------------------------------------
                    document.getElementById("pid").setAttribute("boolean", false);
                } else if (window.location.href.includes("https://rock-va.bytedance.net/appeal_center/workbench?")) {

                    let arr = [];
                    let difficulty = document.getElementsByClassName("difficulty");
                    let escalateButton = document.getElementsByClassName("escalateButton");
                    let clusterParents = document.getElementsByClassName("general");
                    for (let i = 0; i < clusterParents.length; i++) {
                        let f = '"difficulty": "' + difficulty[i].value + '", ';
                        let j = '"escalateButton": "' + escalateButton[i].checked + '"';
                        let input = clusterParents[i].getElementsByClassName("policy");
                        let clusters = clusterParents[i].getElementsByClassName("clusterDatalist");
                        let policy = clusterParents[i].getElementsByClassName("policyDatalist");
                        let str = [];
                        // This transforms the selected clusters into JSON readable data in the format "policy.cluster###policy2.cluster"
                        // --------------------------------------
                        for (let ii = 0; ii < clusters.length; ii++) {
                            if (clusters[ii].value != "") {
                                let val = input[ii].value;
                                let opts = policy[ii].children;
                                for (opt of opts) {
                                    if (opt.value == val) {
                                        str.push(opt.getAttribute("code") + "." + clusters[ii].value)
                                    }
                                }
                            }
                        }
                        let g = '"cluster": "' + str.join("###").replaceAll(",", ";") + '", ';
                        // --------------------------------------
                        arr.push('{' + f + g + j + '}')
                    };

                    // This adds the clusters to be evaluated in content.js for new clusters to be included in JSON data
                    // --------------------------------------
                    let rr = document.getElementsByClassName("policyDatalist");
                    let rq = document.getElementsByClassName("clusterDatalist");
                    let rs = document.getElementsByClassName("policy");
                    let q = [];
                    for (let m = 0; m < rs.length; m++) {
                        let val = rs[m].value;
                        let opts = rr[m].children;
                        if (val != "") {
                            for (let k = 0; k < opts.length; k++) {
                                if (opts[k].value == val) {
                                    if (val != "" && rq[m].value != "") {
                                        q.push([
                                            opts[k].getAttribute("code"),
                                            rq[m].value
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                    document.getElementById("clusterData").setAttribute("clusterdata", JSON.stringify(q));
                    // --------------------------------------


                    p.innerHTML = '[' + arr.join(",") + ']';

                    



                } else {
                    {

                        let arr = [];
                        let difficulty = document.getElementsByClassName("difficulty");
                        let escalateButton = document.getElementsByClassName("escalateButton");
                        let clusterParents = document.getElementsByClassName("general");
                        for (let i = 0; i < clusterParents.length; i++) {
    
                            let f = '"difficulty": "' + difficulty[i].value + '", ';
                            let j = '"escalateButton": "' + escalateButton[i].checked + '"';
                            let input = clusterParents[i].getElementsByClassName("policy");
                            let clusters = clusterParents[i].getElementsByClassName("clusterDatalist");
                            let policy = clusterParents[i].getElementsByClassName("policyDatalist");
                            let str = [];
    
    
                            // This transforms the selected clusters into JSON readable data in the format "policy.cluster###policy2.cluster"
                            // --------------------------------------
                            for (let ii = 0; ii < clusters.length; ii++) {
                                if (clusters[ii].value != "") {
                                    let val = input[ii].value;
                                    let opts = policy[ii].children;
                                    for (opt of opts) {
                                        if (opt.value == val) {
                                            str.push(opt.getAttribute("code") + "." + clusters[ii].value)
                                        }
                                    }
                                }
                            }
                            let g = '"cluster": "' + str.join("###").replaceAll(",", ";") + '", ';
                            // --------------------------------------
    
    
                            arr.push('{' + f + g + j + '}')
                        };
    
                        // This adds the clusters to be evaluated in content.js for new clusters to be included in JSON data
                        // --------------------------------------
                        let rr = document.getElementsByClassName("policyDatalist");
                        let rq = document.getElementsByClassName("clusterDatalist");
                        let rs = document.getElementsByClassName("policy");
                        let q = [];
                        for (let m = 0; m < rs.length; m++) {
                            let val = rs[m].value;
                            let opts = rr[m].children;
                            if (val != "") {
                                for (let k = 0; k < opts.length; k++) {
                                    if (opts[k].value == val) {
                                        if (val != "" && rq[m].value != "") {
                                            q.push([
                                                opts[k].getAttribute("code"),
                                                rq[m].value
                                            ]);
                                        }
                                    }
                                }
                            }
                        }
                        document.getElementById("clusterData").setAttribute("clusterdata", JSON.stringify(q));
                        // --------------------------------------
    
    
                        p.innerHTML = '[' + arr.join(",") + ']';
    
                        
    
    
    
                    }
                }
            });

    }
})();
