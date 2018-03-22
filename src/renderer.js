"use strict";

// if(!("path" in window))path=require('path');
// if(!("fs"   in window))fs  =require('fs');
// if(!("AES"  in window))AES =require('crypto-js/aes');

lod("electron");
var {ipcRenderer, remote} = electron;

var inited=false;
ipcRenderer.send('init', 0);



var ui=document.getElementById("UI");
var showingUi=ui.children[0];
var loader=document.getElementById("loader");

function __onresize(){
    showingUi.onresize();
}

function showUI(newUi){
    var hidingUi=showingUi;
    showingUi=newUi;

    hidingUi.removeAttribute("showing");
    ui.appendChild(showingUi);
    
    setTimeout(()=>hidingUi.remove(),200);
    setTimeout(()=>showingUi.setAttribute("showing",""),1);
}

function loadHtml(text){
    loader.innerHTML=text;
    loader.querySelectorAll("script").forEach(script =>{
        var parent=script.parentElement;
        script.remove();
        var newScript=document.createElement("script");
        if(script.src)newScript.src=script.src;
        else newScript.innerHTML=script.innerHTML;
        parent.appendChild(newScript);
    });
    if(loader.children.length>0){
        var e=loader.children[0];
        loader.children.remove();
        return e;
    }else return undefined;
}

function writeAppFile(name, content){
    lod("fs").writeFileSync(appdata+"/"+name, content, 'utf-8');
}
function readAppFile(name){
    return lod("fs").readFileSync(appdata+"/"+name).toString();
}

(function(){
    var f=function(){
        if(inited)getClass("Login");
        else setTimeout(f, 2);
    }
    f();
})();