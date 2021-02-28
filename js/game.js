function makePhoton(cap=Infinity, affect=false, base=true) {
	if (pData.expand >= 0 && !affect) return;
	player.points += Math.floor(Math.pow(Math.min(cap, player.base.atoms), 1+upgrades.base[1].bought*0.2)*(1+upgrades.base[3].bought*9)*(1+(player.base.super.effect&&!upgrades.ref[2].bought)*2)*star.effect*(1+(player.star.primary == "He")*3))*(1+(player.star.primary == "Ne")*19);
	player.unlocks.photon = true;
	if (player.points >= 50) player.unlocks.atoms = true;
	if (player.points >= 500) player.unlocks.auto = true;
	if (player.points >= 2500) player.unlocks.upgrade = true;
	if (player.points >= 100000 && player.base.atoms >= 80 && player.base.auto >= 5) player.unlocks.super = true;
	if (player.points >= 1e9) player.unlocks.star = true;
	if (base) pData.expand = Math.max(0, pData.expand);
	for (var i = 0; i++ < (1+upgrades.base[3].bought*9)*(1+(player.base.super.effect&&!upgrades.ref[2].bought)*2);) pData.lastPhotonTicks.push([new Date().getTime(), Math.random()*360, pData.electronPositions]);
	if (Math.random() < effect.reflectors) {
		setTimeout(makePhoton, 150-(upgrades.ref[2].bought && player.base.super.effect)*112.5, cap, true, false);
	}
	for (var i = 0; i++ < 1+upgrades.star[0].bought*19;) {
		if (Math.random() < effect.reflectors*0.5) {
			player.base.atoms++;
		}
	}
}
function activateSuper() {
	if (player.base.super.effect || player.base.atoms < 4) return;
	player.base.super.effect = 1;
	player.base.atoms -= 3;
}
document.addEventListener("keydown", _=> {
	if (_.code == "Space") {
		spacePressed = 1;
		_.preventDefault();
	}
})
document.addEventListener("keyup", _=> {
	if (_.code == "Space") {
		spacePressed = 0;
		_.preventDefault();
	}
})

var lastTick = new Date().getTime();
const gameLoop = function (diff) {
	diff /= 1000;
	lastTick = new Date().getTime();
	if (upgrades.ref[2].bought && player.base.super.effect) diff *= 4;
	drawAtom(diff);
	if (spacePressed) makePhoton();
	if (player.base.auto) {
		player.base.autoTicks += diff;
		if (player.base.autoTicks > 0) {
			for (player.base.autoTicks; player.base.autoTicks > 0; player.base.autoTicks -= effect.auto[1]) {
				makePhoton(effect.auto[0], true);
				if (upgrades.base[1].bought && Math.random() < 0.2) player.base.autoCrit = 1;
				else player.base.autoCrit = 0;
			}
		}
	}
	if (upgrades.ref[2].bought && player.base.super.effect) diff /= 4;
	if (player.base.super.effect) {
		player.base.super.time += diff;
		if (player.base.super.time > 60) {
			player.base.super.effect = 0;
			player.base.super.time = 0;
		}
	}
	if (player.star.reactor.isReacting) {
		if (reactions[player.star.reactor.create].update) reactions[player.star.reactor.create].upgrade(Math.min(diff, reactions[player.star.reactor.create].time-player.star.reactor.time));
			player.star.reactor.time += diff;
		if (player.star.reactor.time >= reactions[player.star.reactor.create].time) {
			reactions[player.star.reactor.create].finish();
			player.star.reactor.isReacting = false;
			player.star.reactor.time = 0;
		}
	}
	if (player.auto.autoFluc && player.auto.unlAutoFluc) buy.auto();
	if (player.auto.autoRef && player.auto.unlAutoRef) buy.reflectors();
}
var loop = setInterval(_=>{gameLoop(new Date().getTime()-lastTick)}, 20)