const upgrades = {
	base: [
		{
			title: "Stimulated Emission",
			desc: "Decrease the delay in between energizations</br>1/3 -> 1/4.5",
			cost: 2500,
			get bought() { return player.base.upgrades%2 },
			get show() { return player.unlocks.upgrade }
		},
		{
			title: "Chain Reaction",
			get desc() { return this.canAfford?
				"Atoms affect the photon gain more, and fluctuations have a 20% chance to have a lower delay.":
				"LOCKED<br>(Requires: 25 atoms)"
			},
			cost: 5000,
			get bought() { return Math.floor(player.base.upgrades%4/2) },
			get show() { return player.unlocks.upgrade },
			get canAfford() { return player.base.atoms >= 25 }
		},
		{
			title: "Conversion Efficiency",
			get desc() { return this.canAfford?
				"Greatly reduce the amount of photons it takes to make an atom.<br>50(1.2^x) -> 5x^2 + 5x + 10":
				"LOCKED<br>(Requires: 30 atoms)"
			},
			cost: 7500,
			get bought() { return Math.floor(player.base.upgrades%8/4) },
			get show() { return player.unlocks.upgrade },
			get canAfford() { return player.base.atoms >= 30 }
		},
		{
			title: "High-energy Orbit",
			get desc() { return this.canAfford?
				"Make the energization and fluctuation delay 5 times slower, but each energization releases 10 times as many photons.":
				"LOCKED<br>(Requires: 4 fluctuations)"
			},
			cost: 20000,
			get bought() { return Math.floor(player.base.upgrades%16/8) },
			get show() { return player.unlocks.upgrade },
			get canAfford() { return player.base.auto >= 4 }
		},
	],
	ref: [
		{
			title: "Enhanced Duplication",
			get desc() { return `Every energization has a reduced chance of producing an atom.<br>Currently: ${n(effect.reflectors*50, 2)}%` },
			cost: 1e6,
			get bought() { return Math.floor(player.ref.upgrades%2) },
			get show() { return player.unlocks.upgrade }
		},
		{
			title: "Instability",
			get desc() { return this.canAfford?
				"Make fluctuations scale half as fast.":
				"LOCKED<br>(Requires: 7 fluctuations)"
			},
			cost: Math.floor(Math.PI*1e6),
			get bought() { return Math.floor(player.ref.upgrades%4/2) },
			get show() { return player.unlocks.upgrade },
			get canAfford() { return player.base.auto >= 7 }
		},
		{
			title: "Temporal Energy",
			get desc() { return this.canAfford?
				"Super-energy now makes time pass by 4x faster for all mechanics below reflection and super-energy.":
				"LOCKED<br>(Requires: 512 atoms and 16 fluctuations)"
			},
			cost: 1e7,
			get bought() { return Math.floor(player.ref.upgrades%8/4) },
			get show() { return player.unlocks.upgrade },
			get canAfford() { return player.base.atoms >= 512 && player.base.auto >= 16 }
		},
		{
			title: "Enhanced Distortion",
			get desc() { return this.canAfford?
				"Raise all perceptive warp effects to the 1.3.":
				"LOCKED<br>(Requires: 6 perceptive warps)"
			},
			cost: 2e8,
			get bought() { return Math.floor(player.ref.upgrades%16/8) },
			get show() { return player.unlocks.upgrade && player.unlocks.warps },
			get canAfford() { return player.ref.warps >= 6 }
		},
	],
	star: [
		{
			title: "Advanced Cloning Techniques",
			desc: "You can clone at most 20 atoms at once.",
			cost: 8,
			get bought() { return player.star.upgrades%2 },
			show: true
		},
		{
			title: "Full Autonomy",
			desc: "Unlock automation.",
			cost: 200,
			get bought() { return Math.floor(player.star.upgrades%4/2) },
			show: true
		}
	]
}
const upgData = {
	base: {
		currDisp: "photons",
		get currLoc() {return player},
		currName: "points"
	},
	ref: {
		currDisp: "photons",
		get currLoc() {return player},
		currName: "points"
	},
	star: {
		currDisp: "stars",
		get currLoc() {return player.star},
		currName: "stars"
	}
}
function buyUpg(layer, id) {
	if (upgrades[layer][id].cost > upgData[layer].currLoc[upgData[layer].currName] || upgrades[layer][id].bought || (!upgrades[layer][id].canAfford && upgrades[layer][id].canAfford != undefined)) return;
	upgData[layer].currLoc[upgData[layer].currName] -= upgrades[layer][id].cost;
	player[layer].upgrades += Math.round(Math.pow(2, id));
}