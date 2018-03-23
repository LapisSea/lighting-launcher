"use strict";

window.McAuth = function () {

	async function post(url, data) {
		var xhttp = new XMLHttpRequest();
		var p = new Promise(resolve => {

			xhttp.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					resolve();
				}
			};
		});
		data = JSON.stringify(data);
		xhttp.open("POST", url, true);
		xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		xhttp.setRequestHeader("Content-Length", data.length);
		xhttp.send(data);
		await p;
		return xhttp.responseText;
	}
	return {
		auth: async function () {
			var response = (await post("https://authserver.mojang.com/authenticate", {
				agent: "???",
				username: "???",
				password: "???",
				clientToken: "???",
				requestUser: true,
			}))
		},
		get launcher_profiles() {
			if (!this._launcher_profiles) {
				try {
					this._launcher_profiles = JSON.parse(readAppFile("../.minecraft/launcher_profiles.json"));
				} catch (e) {}
			}else return this._launcher_profiles;
			
			if (!this._launcher_profiles) {
				try {
					this._launcher_profiles = JSON.parse(readAppFile("launcher_profiles.json"));
				} catch (e) {}
			}
			if (!this._launcher_profiles) {
				this._launcher_profiles = {
					clientToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); })
				};
				writeAppFile("launcher_profiles.json",JSON.stringify(this._launcher_profiles));
			}
			
			return this._launcher_profiles;
		}
	}
}();
