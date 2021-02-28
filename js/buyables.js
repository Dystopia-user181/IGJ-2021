const costs = {
	get atoms() {
		return upgrades.base[2].bought?
		5*(player.base.atoms*(player.base.atoms-1)+2):
		Math.floor(Math.pow(1.2, player.base.atoms-1)*50)
	},
	get auto() { return Math.floor(Math.pow(4, player.base.auto/(1+upgrades.ref[1].bought)/(1+(player.star.primary == "Ne")*0.5))*500) },
	get reflectors() { return Math.floor(Math.pow(1.1, Math.pow(player.ref.reflectors/(1+player.auto.unlAutoRef), 1.13))*100) },
	get warps() { return Math.ceil(Math.pow(3.2+player.ref.warps*0.5, 1.8)) },
}
const buy = {
	atoms() {
		if (player.points < costs.atoms) return;
		player.points -= costs.atoms;
		player.base.atoms++;
		if (player.base.atoms >= 100) player.unlocks.reflectors = true;
	},
	auto() {
		if (player.points < costs.auto) return;
		if (!player.auto.unlAutoFluc) player.points -= costs.auto;
		player.base.auto++;
	},
	reflectors() {
		if (player.base.atoms < costs.reflectors) return;
		player.ref.reflectors++;
		if (player.ref.reflectors >= 9) player.unlocks.warps = true;
	},
	warps() {
		if (player.ref.reflectors < costs.warps) return;
		player.ref.reflectors -= costs.warps;
		player.ref.warps++;
	}
}
const effect = {
	get auto() {
		return [(4+player.base.auto*6)*effect.warps[1], Math.max(0.05, 4/player.base.auto)/(1+player.base.autoCrit)*(1+upgrades.base[3].bought*4)/effect.warps[0]]
	},
	get reflectors() {
		return Math.min(0.9, 1-1/(Math.pow(player.ref.reflectors/1.5 + 1, 0.2)))
	},
	get warps() {
		return [Math.pow(3-3/Math.pow(player.ref.warps/2+1, 0.5)+1, 1+upgrades.ref[3].bought*0.3), Math.pow(1+3*Math.pow(player.ref.warps, 0.8), 1+upgrades.ref[3].bought*0.3)]
	}
};