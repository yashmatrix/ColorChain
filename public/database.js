import { database } from './auth.js';
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { ref, set, get, query, orderByChild, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

// Save score to database (only updates if new score is higher)
export async function saveHighScore(username, score) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user logged in");
      return;
    }

    const userScoreRef = ref(database, `players/${user.uid}`);

    // Get existing high score
    const snapshot = await get(userScoreRef);
    const existingData = snapshot.val();
    const currentHighScore = existingData?.highScore || 0;

    // Only update if new score is higher
    if (score > currentHighScore) {
      await set(userScoreRef, {
        username: username,
        highScore: score,
        lastPlayed: new Date().toISOString(),
        uid: user.uid
      });
      console.log("High score saved:", score);
    }
  } catch (error) {
    console.error("Error saving score:", error);
  }
}

// Get current player's high score
export async function getPlayerHighScore() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return 0;

    const userScoreRef = ref(database, `players/${user.uid}`);
    const snapshot = await get(userScoreRef);

    if (snapshot.exists()) {
      return snapshot.val().highScore;
    }
    return 0;
  } catch (error) {
    console.error("Error getting high score:", error);
    return 0;
  }
}

// Get top 10 players (Leaderboard) — one-time fetch, returns a Promise
export async function getLeaderboard() {
  try {
    const leaderboardRef = ref(database, 'players');
    const q = query(leaderboardRef, orderByChild('highScore'), limitToLast(10));
    const snapshot = await get(q);

    const players = [];
    snapshot.forEach((childSnapshot) => {
      players.unshift(childSnapshot.val()); // unshift = highest first
    });
    return players;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

// Listen to player's score in real-time (unchanged — used elsewhere if needed)
export function watchPlayerScore(callback) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const userScoreRef = ref(database, `players/${user.uid}`);
    onValue(userScoreRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    });
  } catch (error) {
    console.error("Error watching score:", error);
  }
}
