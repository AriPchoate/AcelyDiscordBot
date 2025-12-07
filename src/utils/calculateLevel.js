module.exports = (xp) => {
  if (xp < 200) {
    return Math.floor(xp / 50) + 1;
  } else if (xp < 1000) {
    return Math.floor((xp - 200) / 100) + 5;
  } else {
    return Math.floor((xp - 1000) / 200) + 13;
  }
};



// Level 1: 0 XP  
// Level 2: 50 XP  
// Level 3: 100 XP  
// Level 4: 150 XP  
// Level 5: 200 XP  
// Level 6: 300 XP  
// Level 7: 400 XP  
// Level 8: 500 XP  
// Level 9: 600 XP  
// Level 10: 700 XP  
// Level 11: 800 XP  
// Level 12: 900 XP
// Level 13: 1000 XP  
// Level 14: 1200 XP  
// Level 15: 1400 XP  
// Level 16: 1600 XP  
// Level 17: 1800 XP  
// Level 18: 2000 XP  
// Level 19: 2200 XP  
// Level 20: 2400 XP  
// Level 21: 2600 XP