import { Score } from "./schemas/index"

export function sortLeaderboard(leaderboard: Score[]) {
    const sortedLeaderboard = [...leaderboard]
    sortedLeaderboard.sort((a: Score, b: Score) => {
        return b.amtPoints - a.amtPoints
    })
    return sortedLeaderboard
}
