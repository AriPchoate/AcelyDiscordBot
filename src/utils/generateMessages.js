// utils/generateReminderMessage.js
/**

// utils/generateReminderMessage.js

/**
 * Generates a personalized reminder message for a user's test.
 * @param {Object} user - The user document from MongoDB
 * @returns {string} - The message to send
 */

module.exports = (user, timeLength) => {
  const testName = user.test || "your test";
  const date = new Date(user.testDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
//   console.log(timeLength);
  let message = '';
  let file = '';

  if (timeLength===1) {
    message = `📣 Reminder: Your **${testName}** is tomorrow on **${formattedDate}**. 

You let us know that your test date is tomorrow, and we just wanted to say *good luck*! All of your hard work is going to pay off tomorrow. 
- Watch this [video](<https://www.tiktok.com/@acely_ai/video/7343730498444725546?utm_source=Klaviyo&utm_medium=flow&utm_campaign=Day%20Before&_kx=kw9xHG2uxzUyMnP0OhfypA.Wj7HDL>) and read our [guide](<https://drive.google.com/file/d/1Za0_8LQ--Lj6HORA-6OUcAl5toTLDOET/view?usp=sharing&utm_source=Klaviyo&utm_medium=flow&utm_campaign=Day%20Before&_kx=kw9xHG2uxzUyMnP0OhfypA.Wj7HDL>)!
- Get lots of rest tonight. You want to be focused and energized. 
- Eat a nutritious breakfast to fuel up your brain. 
- Arrive early so you have time to settle in and review your notes. 
- Take a few deep breaths before the test starts. You've got this! 
- Trust in the test-taking strategies we've worked on. You know what to do. 
- Stay positive and believe in yourself! You are prepared and ready to succeed.  

Make sure you have the following items ready for tomorrow: 
- Your fully charged device. You must have the app installed and the exam setup complete.
- Your admission ticket. You'll show this to the proctor when you check-in.
- An approved photo ID
- A power cord and/or a portable charger. You may not have access to an outlet during testing. Your device should be able to hold a charge for 3-4 hours.
- A pencil or pen. Scratch paper will be provided—do not bring your own.
- (optional) An approved calculator. There's a graphing calculator built into the app, but you can bring your own if you like.
- (optional) An external mouse if you use one.
- (optional) An external keyboard if you use one (you can only use external keyboards with tablets—not laptops).

We believe in you and know you have what it takes to do your very best tomorrow.
 
Your Acely Team
    `;
    
    if (testName==='SAT') {
      file = './src/files/NightBefore.pdf';
    }
    
  } else if (timeLength===7) {
    message = `📣 Reminder: Your **${testName}** test is next week on **${formattedDate}**! 

It's the last week before test day! Want to feel more confident on ${testName} day? Let's practice under real conditions. Take a final full-length practice exam to see your progress.

🕒 Get used to the timing & pace of the test.

☕ Practice test-day breaks to mimic the real day.

Review what you get wrong, but don't try to cram concepts you haven't mastered. Instead, focus on topics you are getting right at least 50% of the time. Also, review test-taking strategies you will want to remember the day of.
    
Last, but certainly not least, give yourself some time the day or two before to relax and breathe, and don't keep trying to cram last-minute things.
    
You've prepped hard - now go into the ${testName} feeling ready to succeed! You've got this!

Your Acely team
`;

    if (testName==='SAT') {
      file = './src/files/SATMathSheet.pdf';
    }
    if (testName==='ACT') {
      file = './src/files/ACTMathSheet.pdf';
    }


  } else if (timeLength===30) {
    message = `📣 Reminder: Your **${testName}** test is in a month on **${formattedDate}**! 💪📚
- Take a full practice test - Simulate the real exam, identify your strengths, and spot areas that need improvement.
- Use Acely's dashboard - Our dashboard will highlight your areas to focus on, so you can compare them with your full-length test.
- Pinpoint key weaknesses - See where your diagnostic and practice test results align to prioritize study topics.
- Practice smarter with Acely's chatbot - Drill down on tricky questions, and if you get one wrong, ask the chatbot why to ensure you fully understand the concept.

Now over the next few weeks, you know where to focus your study, and then when you take another diagnostic you can compare your scores.
Stay focused - you've got this!

Best,
The Acely Team
`;

  if (testName==='SAT') {
    file = './src/files/SAT1Month.pdf';
  }


} 
//else if (timeLength===60) {
//     message = `📣 Reminder: Your **${testName}** test is in a two months on **${formattedDate}**. Stay sharp and good luck! 💪📚`;

//   }

  return {message, filePath: file};
};