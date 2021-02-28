var vdata = {
	el: "#v",
	data: {
		player,
		startColour: "#000",
		startOpacity: "1",
	}
}

Vue.component("app", {
	props: ["startcolour", "startopacity"],
	data: _=> { return {
		player,
	}},
	template: `<div>
		<div v-if="startopacity >= 0" :style="{background: startcolour, opacity: startopacity, transitionDuration: '1s', transitionProperty: 'background, opacity',
		width: '200vw', height: '200vh', transform: 'translate(-50%, -50%)', position: 'absolute', zIndex: '100'}"></div>
		<div v-if="!player.unlocks.startedGame" :style="{width: '200vw', height: '200vh', background: '#000', transform: 'translate(-50%, -50%)', position: 'absolute', zIndex: '98'}"></div>
		<div v-if="!player.unlocks.startedGame" class="startButton" onclick="player.unlocks.startedGame = true"></div>
		<main-tab></main-tab>
	</div>`
})
Vue.component("main-tab", {
	data: _=> { return {
		player,
		n,
		activateSuper,
		upgrades,
		star,
		doStarReset
	}},
	template: `<div>
		<h1>Genesis</h1>
		<button @click="player.tab = 'base'">Main</button>
		<button @click="player.tab = 'ref'" v-if="player.unlocks.reflectors">Reflection</button>
		<button @click="player.tab = 'star'" v-if="player.unlocks.star">Stars</button>
		<button @click="player.tab = 'auto'" v-if="upgrades.star[1].bought">Automation</button>
		<button @click="player.tab = 'options'">Options</button>
		<hr>
		<div v-if="player.unlocks.upgrade" style="position: absolute; right: 8px;">
			<h2 style="display: inline-block">Upgrades</h2><br>
			<upgrade :layer="player.tab" v-for="(u, id) in upgrades[player.tab]" :upgrade="u" :id="id"></upgrade>
		</div>
		You have {{n(player.points)}} photons.
		<br>
		<button onclick="makePhoton()">Energize the atoms. (Press space)</button>
		<br>
		<button v-if="player.unlocks.super" @click="activateSuper()" :disabled="player.base.super.effect || player.base.atoms < 4">Super-energize the atoms{{player.base.super.effect?". (Time left: " + n(60-player.base.super.time) + " seconds)":(", " + (upgrades.ref[2].bought?"quadrupling time speed":"tripling photon generation") + " for 60 seconds but consuming 3 atoms.")}}</button>
		<div v-if="player.unlocks.star">
			<br><br>
			You have <b style="color: #da2">{{n(player.star.stars)}}</b> stars, boosting photon generation by x{{n(star.effect, 2)}}<br>
			<button @click="doStarReset()" :disabled="player.points < 1e9">Reset photons, atoms, and fluctuations.<br>
			Gain <b>{{n(star.resetGain)}}</b> stars. (Next at {{n(star.nextAt)}})</button>
		</div>
		<br><br><br>
		<component :is="player.tab+'-tab'"></component>
		<canvas id="c" style="transition: all 0s; position: absolute; top: 8px; left: 8px; width: calc(100vw - 16px); height: calc(100vh - 16px); z-index: -1"></canvas>
	</div>`
})
Vue.component("base-tab", {
	data: _=> {return {
		player,
		n,
		effect,
		upgrades
	}},
	template: `<div>
		<buyable layer="base" name="atoms" dispname="atoms" singname="atom" buydisp="Condense,photons into" :currAmnt="player.points"></buyable>
		<br>
		<buyable layer="base" name="auto" dispname="fluctuations" singname="fluctuation"
		:effectdisp="'exciting up to ' + n(effect.auto[0]) + ' atoms every ' + n(effect.auto[1], 2) + ' seconds'"
		buydisp="Deplete,photons to create" :currAmnt="player.points"></buyable>
	</div>`,
})
Vue.component("ref-tab", {
	data: _=> {return {
		player,
		n,
		effect,
		upgrades
	}},
	template: `<div>
		<buyable layer="ref" name="reflectors" dispname="reflectors" singname="reflector"
		:effectdisp="'giving a ' + n(effect.reflectors*100, 2) + '% chance to energize an atom again after energizing.<br>(This is applied 150 ms after the initial energization, and can happen more than once)'"
		buydisp="Use,atoms to create" :currAmnt="player.base.atoms"></buyable>
		<br>
		<buyable layer="ref" name="warps" dispname="perceptive warps" singname="perceptive warp"
		:effectdisp="'reducing the nerf of <b>High-energy Orbit</b> by /' + n(effect.warps[0], 2) + ', and increasing the fluctuation cap by x' + n(effect.warps[1], 1)"
		buydisp="Construct,reflectors together to build" :currAmnt="player.ref.reflectors"></buyable>
	</div>`
})
Vue.component("star-tab", {
	data: _=> {return {
		player,
		n,
		effect,
		star,
		doStarReset,
		reactions,
		startReaction
	}},
	template: `<div style="display: flex;">
	<div>
		<h2 style="display: inline-block">Unlocked atom types</h2>
		<br>
		<h3>Next at: {{star.nextAtom}} stars</h3>
		<br><br>
		<atom-display></atom-display>
	</div>
	<div style="width: 30px"></div>
	<div v-if="player.star.unlockedAtoms >= 2">
		<div style="border: 5px solid #fff; border-top: 5px dashed #fff8; background: #000a; width: 300px; height: 300px;
		display: flex; flex-direction: column; align-items: center; justify-content: center;">
			<h2 style="display: inline-block">Reactor</h2>
			<br>
			<div v-if="!player.star.reactor.isReacting">The reaction will create {{reactions[player.star.reactor.create].amt}} <select v-model="player.star.reactor.create">
				<option>CO2</option>
			</select>.
			</div>
			<div v-else style="text-align: center">Reaction undergoing, please wait for it to finish.<br>({{n(player.star.reactor.time, 2)}}/{{n(reactions[player.star.reactor.create].time, 2)}})</div>
			<br><br>
			Effects: <span v-for="e in reactions[player.star.reactor.create].effectDisplay">{{e}}<br></span>
			<br><br><button :disabled="player.star.reactor.isReacting || reactions[player.star.reactor.create].amt == 0" @click="startReaction()">Start reaction</button>
		</div>
	</div>
	</div>`
})
Vue.component("auto-tab", {
	data: _=> {return {
		player,
		buyAutoFluc() {
			if (player.points >= 5e14 && player.base.auto == 0) player.auto.unlAutoFluc = true;
		},
		buyAutoRef() {
			if (player.star.stars >= 500) player.auto.unlAutoRef = true;
		}
	}},
	template: `<div style="display: flex">
		<div><button :class="{bought: player.auto.unlAutoFluc}" :disabled="player.points < 5e14 || player.base.auto > 0"
		@click="buyAutoFluc()">Reach 5.00e14 photons without fluctuations.<br>Unlock Auto-Fluctuations, and they don't consume photons.</button>
		<br><br>
		<button :class="{bought: player.auto.unlAutoRef}" :disabled="player.star.stars < 500"
		@click="buyAutoRef()">Reach 500 stars.<br>
		Reflectors scale twice as slow but you don't keep them on resets.</button></div>
		<div style="margin: 0 5px"><span v-if="player.auto.unlAutoFluc">Auto-Fluctuations: <input type="checkbox" v-model="player.auto.autoFluc"/></span>
		<br><br><br>
		<span v-if="player.auto.unlAutoRef">Auto-Reflectors: <input type="checkbox" v-model="player.auto.autoRef"/></span></div>
	</div>`
})
Vue.component("options-tab", {
	data: _=> {return {
		player,
		yesno: t => t?"Yes":"No"
	}},
	template: `<div>
		<button style="width: 300px" @click="player.options.drawPhotons = !player.options.drawPhotons">
		Draw Photons: {{yesno(player.options.drawPhotons)}}
		</button><br><br>
		<button style="width: 300px" @click="player.options.draw = !player.options.draw">
		Draw Anything At All: {{yesno(player.options.draw)}}
		</button>
	</div>`
})
Vue.component("atom-display", {
	data: _=> {return {
		player,
		star,
		primary: [{
			symbol: "H",
			name: "Hydrogen",
			desc: "Nothing interesting, the base atom you start with.",
			req: 0
		},
		{
			symbol: "He",
			name: "Helium",
			desc: "Releases 4 times as many photons.",
			req: 1
		},
		{
			symbol: "Ne",
			name: "Neon",
			desc: "Releases 20 times as many photons, and make fluctuations 1.5 times cheaper.",
			req: 3
		}],
		secondary: [{
			symbol: "C",
			name: "Carbon",
			desc: "The building block of life. Sadly life doesn't exist here.",
			req: 2
		},
		{
			symbol: "O",
			name: "Oxygen",
			desc: "Reacts with Carbon to create a fruitful bang.",
			req: 2
		}],
	}},
	template: `<div style="width: 500px;">
		<div>
			Primary atoms
			<span style="position: absolute; left: 500px; cursor: pointer;"
			@click="player.options.displayPrimary = !player.options.displayPrimary">{{player.options.displayPrimary?"v":">"}}</span>
			<hr>
			<div v-if="player.options.displayPrimary" style="padding: 0 50px; text-align: center"><atom v-for="atom in primary" :obj="atom"></atom></div>
		</div>
		<div>
			Secondary atoms
			<span style="position: absolute; left: 500px; cursor: pointer;"
			@click="player.options.displaySecondary = !player.options.displaySecondary">{{player.options.displaySecondary?"v":">"}}</span>
			<hr>
			<div v-if="player.options.displaySecondary" style="padding: 0 50px; text-align: center"><atom2 v-for="atom in secondary" :obj="atom"></atom2></div>
		</div>
	</div>`
})
Vue.component("atom", {
	props: ["obj"],
	data: _=> {return {
		player
	}},
	template: `<button @click="player.star.primary = obj.symbol"
	:class="{atomBtn: true, bought: player.star.primary == obj.symbol}"
	v-if="player.star.unlockedAtoms >= obj.req"
	:tooltip="obj.name + ': ' + obj.desc + ' (Click to use as primary)'">{{obj.symbol}}
	</button>`
})
Vue.component("atom2", {
	props: ["obj"],
	data: _=> {return {
		player,
		buySecondaryAtom,
		getAtomCosts,
		nc,
		n,
		slashChar: '\\'
	}},
	template: `<button @click="buySecondaryAtom(obj.symbol)"
	class="atomBtn"
	v-if="player.star.unlockedAtoms >= obj.req"
	:tooltip="obj.name + ': ' + obj.desc + ' You have ' + nc(player.star.secondary[obj.symbol].a) + ' (' + nc(player.star.secondary[obj.symbol].t) + ' bought) ' + obj.name + ' atoms. (Buy 1. Cost: ' + n(getAtomCosts[obj.symbol]) + ' photons)'"
	:disabled="getAtomCosts[obj.symbol] > player.points">{{obj.symbol}}
	</button>`
})
Vue.component("buyable", {
	props: ["layer", "name", "dispname", "singname", "effectdisp", "buydisp", "currAmnt", "canAfford"],
	data: _=> {return {
		player,
		n,
		nc,
		buy,
		costs,
	}},
	template: `<div v-if="player.unlocks[name]">
		You have {{nc(player[layer][name])}} {{player[layer][name] == 1 ? singname : dispname}}<span v-if="effectdisp">, <span v-html="effectdisp"></span></span>.
		<br>
		<button @click="buy[name]()" :disabled="(!(canAfford==undefined) && !canAfford) || currAmnt < costs[name]">{{buydisp.split(",")[0]}} {{n(costs[name])}} {{buydisp.split(",")[1]}} 1 {{singname}}.</button>
	</div>`
})
Vue.component("upgrade", {
	props: ["layer", "upgrade", "id"],
	data: _=> {return {
		player,
		n,
		buyUpg,
		upgrades,
		upgData
	}},
	template: `<div v-if="upgrade.show"><button :class="{upg: true, bought: upgrade.bought}" :disabled="upgrade.cost > upgData[layer].currLoc[upgData[layer].currName] || upgrade.bought || (!upgrade.canAfford && upgrade.canAfford != undefined)" @click="buyUpg(layer, id)">
		<h3 v-if="upgrade.title" style="display: inline-block;">{{upgrade.title}}</h3>
		<br><br>
		<span v-html="upgrade.desc"></span>
		<br><br>
		Cost: {{n(upgrade.cost)}} {{upgData[layer].currDisp}}
	</button></div>`
})

var v = new Vue(vdata);

setTimeout(_=>{v.startColour = "#888"}, 30)
setTimeout(_=>{v.startOpacity = "0"}, 2000)
setTimeout(_=>{v.startOpacity = "-1"}, 3000)