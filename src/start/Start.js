Start=function(){

    var startDoom = loadHtml(fs.readFileSync("src/start/Start.html").toString());

    return {
        show:function(){
            showUI(startDoom);
        }
    }
}();