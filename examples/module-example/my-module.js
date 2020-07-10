module.exports = {
	doSomething: function(a, c) {
		if (c && a.hello) {
			return a.hello;
		} else {
			if (a.world) {
				return a.world;
			}
		}
	},
	doAnotherThing: function(a) {
		return a;
	}
};