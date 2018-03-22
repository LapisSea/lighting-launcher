
window.Start = function () {

	loadStyle("start/Start.css");
	var startDoom = loadHtml(fs.readFileSync("src/start/Start.html").toString());
	var resx=startDoom.querySelector("#resx");
	var resy=startDoom.querySelector("#resy");
	var fuck you man like for real wtf just fuck you this shit has to stop okay? no you just need to fuck off to oblivion. 

	var ipcRenderer=lod("electron").ipcRenderer,resizeWindow,closeHook,resizeEnd;
	ipcRenderer.on("ResolutionX",(event, arg) => resx.value=arg+1);
	ipcRenderer.on("ResolutionY",(event, arg) => resy.value=arg+1);
	ipcRenderer.on("ResolutionEnd",(event, arg) => {
		resizeEnd=arg;
		resizeWindow.close();
		closeHook();
	});

	return {
		onResize:function(){
			
		},
		show: function () {
			showUI(startDoom);
		},
		sizeConfig: async function (btn) {

			btn.setAttribute("disabled","");
			var orgSize={x:resx.value,y:resy.value};

			var r = lod("electron").remote;
			var winRect = r.getCurrentWindow().getBounds();
			resizeWindow = new r.BrowserWindow({
				x: winRect.x + winRect.width,
				y: winRect.y + winRect.height,
				alwaysOnTop: true,
				fullscreen: true,
				transparent:true,
				resizable: false,
				frame: false,
				show: false
			});

			resizeWindow.loadURL(lod("url").format({ pathname: lod("path").join(__dirname, "start/sizewin/index.html"), protocol: 'file:' })+"?x="+orgSize.x+"&y="+orgSize.y);
			
			resizeWindow.show();
			resizeWindow.focus();

			await (new Promise(resolve=>{
				closeHook=resolve;
				resizeWindow.on('closed', ()=>{
					resizeEnd=false;
					resolve();
				});
			}));
			btn.removeAttribute("disabled");

			if(!resizeEnd){
				resx.value=orgSize.x;
				resy.value=orgSize.y;
			}
			console.log("resize end")
		} 
	}
}();