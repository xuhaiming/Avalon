module.exports = {
  merlin: {
		camp: 'justice',
		canSee: [
			'morgana',
			'assassin',
			'oberon',
			'minions'
		]
	},
	percivale: {
		camp: 'justice',
		canSee: [
			'merlin',
			'morgana'
		]
	},
	loyal: {
		camp: 'justice',
		canSee: []
	},
	morgana: {
		camp: 'evil',
		canSee: [
			'assassin',
			'mordred',
			'minions'
		]
	},
	assassin: {
		camp: 'evil',
		canSee: [
			'morgana',
			'mordred',
			'minions'
		]
	},
	mordred: {
		camp: 'evil',
		canSee: [
			'morgana',
			'assassin',
			'mordred',
			'minions'
		]
	},
	oberon: {
		camp: 'evil',
		canSee: []
	},
	minions: {
		camp: 'evil',
		canSee: [
			'morgana',
			'assassin',
			'mordred',
			'minions'
		]
	}
}
