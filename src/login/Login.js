
"use strict";

const Login = function () {
	lod("fs");
	loadStyle("login/Login.css");

	var screenDoom = loadHtml(fs.readFileSync("src/login/Login.html").toString());

	var loginLoadWrapp = screenDoom.querySelector("#LoginLoadWrapp");
	var premBtn = screenDoom.querySelector("#prem");

	var premium = screenDoom.querySelector("#premium");
	var email = screenDoom.querySelector("#Email");
	var password = screenDoom.querySelector("#Password");

	premium.btn = premium.querySelector("input[type=button]");
	premium.btn.update = function () {
		if (email.getAttribute("valid") === "true" && password.getAttribute("valid") === "true") {
			this.removeAttribute("disabled");
		} else {
			this.setAttribute("disabled", "");
		}
	}
	premium.btn.update();

	email.update = function (val) {
		if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.value.toLowerCase())) {
			this.setAttribute("valid", "true");
		}
		else if (this.hasAttribute("valid") || val) {
			this.setAttribute("valid", "false");
		}
		premium.btn.update();
		getClass("McAuth","login/McAuth.js");
		cfg.email=this.value;
	};
	email.onkeydown = function () { setTimeout(() => this.update(false), 0); }
	email.onchange = function () { this.update(true) }

	password.update = function (val) {
		if (this.value.length > 0) {
			this.setAttribute("valid", "true");
		}
		else if (this.hasAttribute("valid") || val) {
			this.setAttribute("valid", "false");
		}
		cfg.password=this.value;
		premium.btn.update();
	};
	password.onkeydown = function () { setTimeout(() => this.update(false), 0); }
	password.onchange = function () { this.update(true) }


	var nonpremium = screenDoom.querySelector("#nonpremium");
	var username = screenDoom.querySelector("#Username");
	nonpremium.btn = nonpremium.querySelector("input[type=button]");
	nonpremium.btn.update = function () {
		if (username.getAttribute("valid") === "true") {
			this.removeAttribute("disabled");
		} else {
			this.setAttribute("disabled", "");
		}
	}
	nonpremium.btn.update();

	username.update = function (val) {
		if (this.value.length > 0) {
			this.setAttribute("valid", "true");
		}
		else if (this.hasAttribute("valid") || val) {
			this.setAttribute("valid", "false");
		}
		cfg.username=this.value;
		nonpremium.btn.update();
	};
	username.onkeydown = function () { setTimeout(() => this.update(false), 0); }
	username.onchange = function () { this.update(true) }


	var cfg;
	function saveCfg(){
		cfg.premiumMode=premBtn.checked;
		writeAppFile("login-config.json",JSON.stringify(cfg));
	}
	try{
		cfg=JSON.parse(readAppFile("login-config.json"));
	}catch(e){
		cfg={
			premiumMode:true,
			pwd:"",
			get password(){
				return b64DecodeUnicode(this.pwd);
			},
			set password(pass){
				this.pwd=b64EncodeUnicode(pass);
			}
		}
		saveCfg();
	}
	premBtn.checked=cfg.premiumMode;

	if(cfg.email){
		email.value=cfg.email;
		email.onkeydown();
	}
	if(cfg.password){
		password.value=cfg.password;
		password.onkeydown();
	}
	if(cfg.username){
		username.value=cfg.username;
		username.onkeydown();
	}
	premBtn.checked=cfg.premiumMode;

	var l={
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
			this.updateMode();
			showUI(screenDoom);
		},
		updateMode: function () {
			premium.setAttribute("show", premBtn.checked);
			nonpremium.setAttribute("show", !premBtn.checked);
		},
		loginPremium: async function () {
			loginLoadWrapp.style.display = "block";
			this.svg.show();
			setTimeout(() => loginLoadWrapp.setAttribute("show", ""), 1);

			//TODO: ask server for login
			var account = undefined;

			await sleep(1000);
			return;

			loginLoadWrapp.removeAttribute("show");
			setTimeout(() => loginLoadWrapp.style.display = "none", 200);

			(await getClass("Start")).show();
			// if (account) {
			// } else {

			// }

			saveCfg();

		},
		loginNonpremium: async function () {
			(await getClass("Start")).show();
			saveCfg();
		}
	};

	if(premBtn.checked){
		return l;
	}else{
		if(cfg.username){
			setTimeout(async () => {
				(await getClass("Start")).show();
			}, 1);
			return l;
		}
	}
	l.show();
	return l;
}();
