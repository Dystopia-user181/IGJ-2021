var vdata = {
	el: "#v",
	data: {
		player,
	}
}

Vue.component("app", {
	props: [],
	data: _=> {return {
		player
	}},
	template: `<div>
		<h1>IGJ 2021 Submission</h1>
		<a href="changelog.md">changelog</a> |
		<hr>
		This doesn't exist yet
		<br><br>
		<button>Here is a button that does nothing</button>
	</div>`
})

var v = new Vue(vdata);