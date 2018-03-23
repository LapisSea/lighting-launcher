loadStyle("start/Start.css");

window.Start = function () {

	function compare(a, b) {
		if (a < b) return 1;
		if (a > b) return -1;
		return 0;
	}

	////////////////// RESIZER COMUNICATION //////////////////
	var resx, resy, ipcRenderer, resizeWindow, closeHook, resizeEnd;
	(async function () {
		ipcRenderer = lod("electron").ipcRenderer;
		ipcRenderer.on("ResolutionX", (event, arg) => resx.value = arg + 1);
		ipcRenderer.on("ResolutionY", (event, arg) => resy.value = arg + 1);
		ipcRenderer.on("ResolutionEnd", (event, arg) => {
			resizeEnd = arg;
			resizeWindow.close();
			closeHook();
		});
	})();

	////////////////// READ AND HOOK HTML //////////////////
	var startDoom = loadHtml(fs.readFileSync("src/start/Start.html").toString());
	resx = startDoom.querySelector("#resx");
	resy = startDoom.querySelector("#resy");
	var profiles = startDoom.querySelector("#profiles");
	profiles.search = profiles.querySelector(".search");
	profiles.searchMsg = profiles.querySelector(".message");
	profiles.list = profiles.querySelector(".list");
	profiles.list.onkeydown = function (e) {
		if (e.key === "Enter") {
			var active = profiles.list.querySelector(":focus");
			if (active) active.onclick();
		} else if (e.key !== "Tab") profiles.search.focus();
	}
	profiles.search.onkeydown = function (e) {
		if (e.key == "Tab") {
			profiles.list.querySelector('[tabIndex="1"]').focus();
			e.preventDefault();
		} else if (e.key == "Enter" && profiles.list.count == 1) {
			profiles.list.querySelector('[tabIndex="-1"]').onclick();
			e.preventDefault();
		} else setTimeout(() => profiles.list.filterBy(this.value), 0);

	}

	function setProfile(e) {
		var ch = [];
		for (let i = 0; i < profiles.list.children.length; i++) {
			var c = profiles.list.children[i];
			c.removeAttribute("selected");
			ch.push(c);
		}
		e.setAttribute("selected", "");

		profiles.search.value = "";
		profiles.search.onkeydown({ key: "" });
		profiles.search.focus();

		///////SORT///////

		ch.sort((a, b) => {
			if (a.hasAttribute("selected")) return -1;
			if (b.hasAttribute("selected")) return 1;

			a = a.profile;
			if (!a.lastUsed) return -1;
			b = b.profile;
			if (!b.lastUsed) return 1;
			return compare(a.lastUsed, b.lastUsed);
		});

		for (let i = 0; i < ch.length; i++) {
			ch[i].tabIndex=ch[i].style.order=ch[i].pos=i;
		}
	}

	profiles.search.onchange = function () { this.setAttribute("value", this.value) }
	profiles.upd = function () { this.setAttribute("arrow", this.list.scrollWidth > document.body.clientWidth) };

	profiles.list.filterBy = function (search) {
		var ch = profiles.list.children;

		loop(7, 50, () => profiles.upd());

		this.count = 0;

		for (var i = 0; i < ch.length; i++) {
			var child = ch[i];
			var selected = child.hasAttribute("selected");
			child.match = search == "" || child.profile.name.contains(search) && !selected;
			if (child.match) {
				this.count++;
				child.tabIndex = selected ? -1 : child.pos;
			} else child.tabIndex = -1

			child.setAttribute("match", child.match);
		}
		if (search == "") profiles.searchMsg.innerHTML = "";
		else if (this.count == 0) profiles.searchMsg.innerHTML = "No matches";
		else if (this.count == 1) profiles.searchMsg.innerHTML = "Exact match (press enter to select it)";
		else profiles.searchMsg.innerHTML = this.count + " matches";

		profiles.search.setAttribute("badSearch", this.count == 0);
	};

	////////////////// SCROLLING //////////////////
	{
		profiles.list.onmousedown = function () { this.down = true; this.coolDown = 0 }
		startDoom.onmouseup = function () { profiles.list.down = false; }
		startDoom.onmousemove = e => {
			if (!profiles.list.down) return;
			if ((profiles.list.coolDown += Math.abs(e.movementX)) < 20) return;
			profiles.list.scrollLeft -= e.movementX;
		};

		var scroll = function (step) {
			var ticks = 10;
			loop(ticks, 16, i => profiles.list.scrollLeft += step * (i / ticks));
		}
		profiles.querySelector("#arr1").onclick = () => scroll(-20);
		profiles.querySelector("#arr2").onclick = () => scroll(20);

		profiles.querySelector(".listwrapp").addEventListener("mousewheel", e => {
			scroll((e.deltaX + e.deltaY) / 10)
			e.preventDefault();
			return false;
		});
	}

	//load things from json
	(async function () {
		await getClass("McAuth", "login/McAuth.js");
		var profilesRaw = McAuth.launcher_profiles.profiles;
		var latestProfile;
		
		for (const key in profilesRaw) {
			var profile = profilesRaw[key];

			///////// PARSE ////////

			if (profile.lastUsed) profile.lastUsed = new Date(profile.lastUsed);
			if (!profile.name && profile.type !== "custom") profile.name = "<" + profile.type + ">";

			/////// CREATE HTML ///////

			var btn = document.createElement("div");
			btn.className = "entry"
			btn.profile = profile;
			btn.appendChild(document.createTextNode(profile.name));

			btn.onclick = function () {
				if (!this.hasAttribute("selected")) setProfile(this);
			};

			profiles.list.appendChild(btn);
			btn.style.maxWidth = btn.clientWidth + "px";

			//////// FIND LATEST ////////
			
			if(!latestProfile||latestProfile.profile.lastUsed<profile.lastUsed)latestProfile=btn;
		}
		profiles.list.style.height = profiles.list.clientHeight + "px";
		setProfile(latestProfile);
		profiles.upd();
	})();
	return {
		onResize: function () {
			profiles.upd();
		},
		show: function () {
			showUI(startDoom);
			this.onResize();
		},
		sizeConfig: function (btn) {

			btn.setAttribute("disabled", "");
			var orgSize = { x: resx.value, y: resy.value };

			var r = lod("electron").remote;
			var winRect = r.getCurrentWindow().getBounds();
			resizeWindow = new r.BrowserWindow({
				x: winRect.x + winRect.width,
				y: winRect.y + winRect.height,
				alwaysOnTop: true,
				fullscreen: true,
				transparent: true,
				resizable: false,
				frame: false,
				show: false
			});

			resizeWindow.loadURL(lod("url").format({ pathname: lod("path").join(__dirname, "start/sizewin/index.html"), protocol: 'file:' }) + "?x=" + orgSize.x + "&y=" + orgSize.y);
			resizeWindow.once('ready-to-show', async () => {
				resizeWindow.show();
				resizeWindow.focus();

				await (new Promise(resolve => {
					closeHook = resolve;
					resizeWindow.on('closed', () => {
						resizeEnd = false;
						resolve();
					});
				}));
				btn.removeAttribute("disabled");

				if (!resizeEnd) {
					resx.value = orgSize.x;
					resy.value = orgSize.y;
				}
				console.log("resize end")
			});
		}
	}
}();