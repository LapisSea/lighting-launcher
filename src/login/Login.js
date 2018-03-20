"use strict";
const Login = function () {
    lod("fs");

    fs.readFile("src/login/Screen.css", (err, dat) => {
        var style = document.createElement("style");
        style.innerHTML = dat.toString();
        document.head.appendChild(style);
    });
    
    var loader = document.createElement("div");
    loader.innerHTML = fs.readFileSync("src/login/Screen.html").toString();
    var screenDoom = loader.children[0];

    var premium = screenDoom.querySelector("#premium");
    var email = screenDoom.querySelector("#Email");
    var password = screenDoom.querySelector("#Password");

    var nonpremium = screenDoom.querySelector("#nonpremium");
    var username = screenDoom.querySelector("#Username");

    return {
        show: function () {
            showUI(screenDoom);
        },
        updateMode: function (mode) {
            premium.setAttribute("show",mode);
            nonpremium.setAttribute("show",!mode);
        }
    }
}();

Login.show();
