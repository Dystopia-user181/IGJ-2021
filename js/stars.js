const star = {
	get resetGain() { return Math.floor(Math.pow(player.points/1e9, 1/3)) },
	get nextAt() { return Math.pow(this.resetGain+1, 3)*1e9 },
	get effect() { return Math.pow(1+player.star.stars, 1.5) },
	get nextAtom() {
		switch(player.star.unlockedAtoms) {
			case 0: return 2;
			case 1: return 10;
			case 2: return 100;
			case 3: return Infinity;
		}
	}
}
const getAtomCosts = {
	get C() { return Math.floor(Math.pow(1.2, player.star.secondary.C.t)*50) },
	get O() { return Math.floor(Math.pow(1.2, player.star.secondary.O.t)*50) }
}
function doStarReset() {
	if (player.points < 1e9) return;
	player.star.stars += star.resetGain;
	player.points = 0;
	player.base.atoms = 1;
	player.base.auto = 0;
	player.base.autoTicks = 0;
	player.base.super.effect = 0;
	player.base.super.time = 0;
	Vue.set(player.star, "secondary", initPlayer().star.secondary)
	player.star.reactor.time = 0;
	player.star.reactor.amt = 0;
	player.star.reactor.isReacting = false;
	Vue.set(player.star.reactor, "products", initPlayer().star.reactor.products)
	if (player.auto.unlAutoRef) player.ref.reflectors = 0;
	if (player.star.stars >= 2) {
		player.star.unlockedAtoms = Math.max(1, player.star.unlockedAtoms);
	}
	if (player.star.stars >= 10) {
		player.star.unlockedAtoms = Math.max(2, player.star.unlockedAtoms);
	}
	if (player.star.stars >= 100) {
		player.star.unlockedAtoms = Math.max(3, player.star.unlockedAtoms);
	}
}
function buySecondaryAtom(atom) {
	if (getAtomCosts[atom] > player.points) return;
	player.points -= getAtomCosts[atom];
	player.star.secondary[atom].t++;
	player.star.secondary[atom].a++;
}

const reactions = {
	CO2: {
		get amt() { return player.star.reactor.isReacting?player.star.reactor.amt:Math.floor(Math.min(player.star.secondary.C.a, player.star.secondary.O.a/2)) },
		get effectDisplay() { return [
			`Multiply photon amount by ${n(this.effects[0], 2)}`
		]},
		get effects() { return [
			Math.pow(Math.log10(this.amt+1+player.star.reactor.products.CO2)/5+1, 4)/Math.pow(Math.log10(player.star.reactor.products.CO2+1)/5+1, 4)
		]},
		start() {
			player.points *= this.effects[0];
			var a = this.amt;
			player.star.reactor.amt = a;
		},
		finish() {
			var a = this.amt;
			player.star.reactor.products.CO2 += a;
			player.star.secondary.C.a -= a;
			player.star.secondary.O.a -= a*2;
		},
		time: 3
	}
}
function startReaction () {
	if (player.star.reactor.isReacting) return;
	reactions[player.star.reactor.create].start()
	player.star.reactor.isReacting = true;
}