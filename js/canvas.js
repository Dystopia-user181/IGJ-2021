var canvas = document.querySelector("#c");
var ctx = canvas.getContext("2d");
var pData = {
	rotation: 0,
	expand: -1,
	expandMul: 0,
	lastPhotonTicks: [],
	electronPositions: []
}
var shells = [2, 8, 8, 18, 18, 32, 32, 1000]
var electronNum = {
	H: 1,
	He: 2,
	Ne: 10
}

function drawParticle(x, y, radius, colour="255, 255, 255", fade=0,) {
	var gradient = ctx.createRadialGradient(x, y, radius/2, x, y, radius/2 + fade/2);
	gradient.addColorStop(0, `rgba(${colour}, 1)`);
	gradient.addColorStop(1, `rgba(${colour}, 0)`);

	ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

	ctx.fillStyle = gradient;
	ctx.fillRect(x-radius/2-fade/2, y-radius/2-fade/2, radius+fade, radius+fade);
}

function drawNucleus(radius=40) {
	drawParticle(innerWidth/2-8, innerHeight/2-8, radius, "255, 0, 0", radius/2);
}
function drawShell(size) {
	ctx.beginPath();
	ctx.arc(innerWidth/2-8, innerHeight/2-8, size, 0, 2*Math.PI, false);
	ctx.strokeStyle="#555";
	ctx.stroke();
}
function drawElectron(rotation, radius) {
	drawParticle(innerWidth/2-8+Math.cos(rotation)*radius, innerHeight/2-8+Math.sin(rotation)*radius, 10, "255, 255, 255", 5);
}
function drawPhoton(x, y, rotation, radius) {
	drawParticle(x+Math.cos(rotation)*radius, y+Math.sin(rotation)*radius, 2, "255, 255, 128", 10)
}

function drawAtom(diff) {
	canvas.height = innerHeight-16;
	canvas.width = innerWidth-16;
	ctx.clearRect(0, 0, 100000, 100000);
	if (!player.unlocks.photon) return;

	pData.rotation += diff/3*Math.PI
	if (pData.expand >= 0) {
		pData.expand += diff*3*Math.PI*(1+(upgrades.base[0].bought*0.5))/(1+upgrades.base[3].bought*4)*effect.warps[0];
		if (pData.expand >= Math.PI) pData.expand = -1;
	}
	pData.electronPositions = [];

	if ((player.tab == "ref" || player.tab == "base") && player.options.draw) drawNucleus(player.tab == "ref"?10:40);

	const jump = (1+(Math.sin(Math.max(0, pData.expand))/2)*(1+upgrades.base[3].bought*2));
	var electronsLeft = electronNum[player.star.primary];
	if (player.tab == "base" && player.options.draw) {
		for (var i = 0; electronsLeft > 0; i++) {
			drawShell(70 + i*30);
			var tmpLeft = electronsLeft;
			for (var j = 0; j < shells[i] && tmpLeft > 0; j++) {
				tmpLeft--;
				drawElectron(pData.rotation + (1/Math.min(electronsLeft, shells[i]))*j*Math.PI*2, (70 + i*30)*jump);
				pData.electronPositions.push([innerWidth/2-8+Math.cos(pData.rotation + (1/Math.min(electronsLeft, shells[i]))*j*Math.PI*2)*(70 + i*30)*jump, innerHeight/2-8+Math.sin(pData.rotation + (1/Math.min(electronsLeft, shells[i]))*j*Math.PI*2)*(70 + i*30)*jump])
			}
			electronsLeft = tmpLeft;
		}
		for (var i = 0; i < pData.lastPhotonTicks.length && player.options.drawPhotons; i++) {
			for (var j = 0; j < pData.lastPhotonTicks[i][2].length; j++) {
				drawPhoton(pData.lastPhotonTicks[i][2][j][0], pData.lastPhotonTicks[i][2][j][1], pData.lastPhotonTicks[i][1], (new Date().getTime()-pData.lastPhotonTicks[i][0])*(1+(upgrades.ref[2].bought && player.base.super.effect)*3))
			}
		}
	}
	if (pData.lastPhotonTicks.length) {
		for (var i = 0; i < pData.lastPhotonTicks.length; i++) {
			if (new Date().getTime()-pData.lastPhotonTicks[i][0] > 1500/(1+(upgrades.ref[2].bought && player.base.super.effect)*3)) {
				pData.lastPhotonTicks.splice(i, 1);
			}
		}
	}
	if (player.tab == "ref" && player.options.draw) {
		ctx.beginPath();
		ctx.strokeStyle = "#222";
		ctx.lineWidth = 5
		ctx.arc(innerWidth/2-8, innerHeight/2-8, 200, 0, 2 * Math.PI);
		ctx.stroke();
		if (player.ref.reflectors) {
			ctx.beginPath();
			ctx.strokeStyle = "#666";
			ctx.arc(innerWidth/2-8, innerHeight/2-8, 200, Math.sin(pData.rotation/10)*30, (2*effect.reflectors*Math.PI) + Math.sin(pData.rotation/10)*30);
			ctx.stroke();
		}
	}

	if (player.tab == "star" && player.options.draw) {
		drawParticle(innerWidth/2-8, innerHeight/2-8, 150*(1+Math.sin(pData.rotation)/6), "255, 255, 0", 10);
	}
}