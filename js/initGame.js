const initPlayer = () => { return {
	points: 0,
	version: "v0.0",
	base: {
		atoms: 1,
		auto: 0,
		autoTicks: 0,
		autoCrit: 0,
		upgrades: 0,
		super: {
			effect: 0,
			time: 0
		}
	},
	ref: {
		reflectors: 0,
		warps: 0,
		upgrades: 0
	},
	star: {
		stars: 0,
		unlockedAtoms: 0,
		primary: "H",
		secondary: {
			C: {t:0, a:0},
			O: {t:0, a:0},
		},
		reactor: {
			create: "CO2",
			time: 0,
			amt: 0,
			isReacting: false,
			products: {
				CO2: 0
			}
		},
		upgrades: 0,
	},
	auto: {
		unlAutoFluc: false,
		autoFluc: false,
		unlAutoRef: false,
		autoRef: false,
		unlAutoWarp: false,
		autoWarp: false
	},
	options: {
		displayPrimary: true,
		displaySecondary: true,
		drawPhotons: true,
		draw: true
	},
	unlocks: {
		startedGame: false,
		photon: false,
		atoms: false,
		auto: false,
		upgrade: false,
		super: false,
		reflectors: false,
		warps: false,
		star: false
	},
	tab: "base"
}}
var player = initPlayer(), spacePressed = 0;