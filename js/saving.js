function capOldSaves(version) {

}
function save() {
	localStorage.setItem("igj2021save", JSON.stringify(player));
	console.log("Game saved.");
}
setInterval(function() {
	save();
}, 10000);
function runReset(obj, obj2) {
	Object.keys(obj2).forEach(function (key, index) {
		if (obj2[key].constructor == Object && obj2[key].constructor == Object) {
			reseter(obj[key], obj2[key]);
		} else {
			obj[key] = obj2[key];
		}
	});
	return (obj);
}
function load(save, isOnload=false) {
	if (typeof save !== "object") return;
	if (save === null) return;
	if (save.version !== initPlayer().version) {
		capOldSaves(save.version)
	}
	player = runParse(save, initPlayer());
}
function runParse(obj, obj2) {
	Object.keys(obj2).forEach(function (key, index) {
		if (obj[key] === undefined) {
			obj[key] = obj2[key];
		} else if (obj2[key].constructor == Object && obj[key].constructor == Object) {
			runParse(obj[key], obj2[key]);
		} else if (obj[key].constructor != obj2[key].constructor) {
			obj[key] = obj2[key];
		}
	});
	return obj;
}
var parsedsave = JSON.parse(localStorage.getItem("growthsimsave"));
if (localStorage.getItem("igj2021save") !== null) {
	load(parsedsave, true);
} else {
	localStorage.setItem("igj2021save", JSON.stringify(initPlayer()));
	location.reload();
}