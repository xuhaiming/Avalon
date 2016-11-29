const _ = require('lodash')
const missionsConfig = require('./missions')

module.exports = {
  isVoteRejected(votes, playerCount) {
    return _.filter(votes, { accept: false }).length * 100 / playerCount >= 50
  },
  isMissionSucceed(results, playerCount, round) {
    const currentMissionConfig = _.find(missionsConfig, { totalCount: playerCount })
    const evilsAllowed = currentMissionConfig.evilsAllowed[round - 1]
    const destoyedMissionsCount = _.filter(results, { success: false }).length

    return destoyedMissionsCount <= evilsAllowed && results.length !== 0
  },
  getNextKingIndex(currentIndex, playerCount) {
    return currentIndex === playerCount - 1 ? 0 : currentIndex + 1
  },
  getGameResult(missions, playerCount) {
    let successMissionCount = 0
    let failMissionCount = 0
    let round = 1

    missions.forEach(mission => {
      if (this.isMissionSucceed(mission.results, playerCount, round)) {
        successMissionCount++
      } else {
        failMissionCount++
      }
      round++
    })

    return {
      finished: successMissionCount === 3 || failMissionCount === 3,
      evilsWin: failMissionCount === 3
    }
  }
}
