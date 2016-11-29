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

    return destoyedMissionsCount <= evilsAllowed
  },
  getNextKingIndex(currentIndex, playerCount) {
    return currentIndex === playerCount - 1 ? 0 : currentIndex + 1
  }
}
