"use strict";
const Login = function () {
    lod("fs");

    fs.readFile("src/login/Screen.css", (err, dat) => {
        var style = document.createElement("style");
        style.innerHTML = dat.toString();
        document.head.appendChild(style);
    });

    function openStart(){
        if(!("Start" in window)){
            var StartUI=document.createElement("script");
            StartUI.src="start/Start.js";
            document.head.appendChild(StartUI);
        }

        var tryOpen=function(){
            setTimeout(()=>{
                if(!("Start" in window))tryOpen();
                else Start.show();
            }, 10);
        }
        tryOpen();
    }

    var screenDoom = loadHtml(fs.readFileSync("src/login/Screen.html").toString());

    var premium = screenDoom.querySelector("#premium");
    var email = screenDoom.querySelector("#Email");
    var password = screenDoom.querySelector("#Password");

    var nonpremium = screenDoom.querySelector("#nonpremium");
    var username = screenDoom.querySelector("#Username");
    var loginLoadWrapp = screenDoom.querySelector("#LoginLoad").parentElement;
    return {
        svgload: undefined,
        get svg() {
            if (!this.svgload) {
                this.svgload = createLoadSvg();
                this.svgload.style.width = "100px";
                this.svgload.style.height = "100px";
                document.getElementById("LoginLoad").appendChild(this.svgload);
            }
            return this.svgload;
        },
        show: function () {
            showUI(screenDoom);
        },
        updateMode: function (mode) {
            premium.setAttribute("show", mode);
            nonpremium.setAttribute("show", !mode);
        },
        loginPremium: function () {
            loginLoadWrapp.style.display = "block";
            this.svg.show();
            setTimeout(() => loginLoadWrapp.setAttribute("show",""), 1);

            //TODO: ask server for login

            setTimeout(() => {
                loginLoadWrapp.removeAttribute("show");
                setTimeout(() => loginLoadWrapp.style.display = "none", 200);

                
                openStart();
            }, 1000);

        },
        loginNonpremium:function(){
            openStart();
        }
    }
}();

function Account() {

}

Login.show();
