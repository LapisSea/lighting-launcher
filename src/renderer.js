"use strict";

// if(!("path" in window))path=require('path');
// if(!("fs"   in window))fs  =require('fs');
// if(!("AES"  in window))AES =require('crypto-js/aes');

//lod("electron");

var ui=document.getElementById("UI");
var showingUi=ui.children[0];

function showUI(newUi){
    var hidingUi=showingUi;
    hidingUi.removeAttribute("showing");
    ui.appendChild(newUi);
    
    setTimeout(()=>hidingUi.remove(),200);
    setTimeout(()=>newUi.setAttribute("showing",""),1);
}