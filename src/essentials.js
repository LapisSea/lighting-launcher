Element.prototype.remove = function () {
	this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
	for (var i = this.length - 1; i >= 0; i--) {
		if (this[i] && this[i].parentElement) {
			this[i].parentElement.removeChild(this[i]);
		}
	}
}
NodeList.prototype.forEach = function (callback) {
	for (var i = 0; i <this.length; i++) {
		callback(this[i]);
	}
}
String.prototype.contains = function (str) {
	return this.indexOf(str)!==-1;
}

function lod(name, path = name) {
	if (!(name in window)) window[name] = require(path);
	return window[name];
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function getClass(name, loadPath=name.toLowerCase()+"/"+name+".js") {
	if (!(name in window)) {
		var source = document.createElement("script");
		source.src = loadPath;
		var p=new Promise(resolve => source.onload=resolve)
		document.head.appendChild(source);
		await p;
	}
	return window[name];
}
function loadStyle(path){
	if(document.head.querySelector("lonk[href=\""+path+"\"]"))return;

	var style = document.createElement("link");
	style.rel = "stylesheet";
	style.href = path;
	document.head.appendChild(style);
}

function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}
function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function loop(count,tim,callback){
	if(count<=0)return;
	setTimeout(() => {
		callback(count);
		loop(count-1,tim,callback);
	}, tim);
}