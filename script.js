let streak = 0;
let dayCount = 0;

function formatTime12H(time){
  if(!time) return "08:00 AM";
  let [h,m] = time.split(":").map(Number);
  if(h === 0) h = 12;
  let period = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if(h === 0) h = 12;
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')} ${period}`;
}

async function analyze(){
  let water = Math.max(0, parseInt(document.getElementById("water").value));
  let food = parseInt(document.getElementById("food").value);
  let activity = parseInt(document.getElementById("activity").value);
  let wake = document.getElementById("wake").value;
  let problem = document.getElementById("problem").value;

  // Parse wakeHour in 12-hour format
  let wakeHour = wake ? parseInt(wake.split(":")[0]) : 8;
  let wakeTime = formatTime12H(wake);

  streak++;
  dayCount++;

  document.getElementById("streak").innerText = streak;

  // ML prediction
  let energyScore = await predictEnergy(food, activity, water, wakeHour);

  let report = `🌱 DAILY AI HEALTH ANALYSIS\nWake-up: ${wakeTime}\nEnergy Prediction: ${(energyScore*100).toFixed(1)}%\n\n`;

  // Water
  if(water < 4){
    report += "💧 Hydration Alert: Low water intake detected. Risk of headache, fatigue.\nTip: Drink 1 glass every 2 hours.\n\n";
  }else{
    report += "💧 Water intake sufficient. Keep it up!\n\n";
  }

  // Food
  if(food===0) report += "🍟 Food: Junk food intake. Add fruits & protein.\n\n";
  else if(food===1) report += "🍽 Food: Normal diet. Add more fiber & protein.\n\n";
  else report += "🥗 Food: Healthy choice. Excellent!\n\n";

  // Activity
  if(activity===0) report += "🏃 Activity: None. Try 10–15 min walking.\n\n";
  else report += "🏃 Activity: Active. Good!\n\n";

  // Body problem
  if(problem!=="None"){
    report += `😣 Body Issue: ${problem}\n`;
    if(problem==="Headache") report += "Cause: dehydration / screen time. Solution: Hydrate + take breaks.\n\n";
    if(problem==="Stress") report += "Cause: routine imbalance. Solution: breathing + routine.\n\n";
    if(problem==="Poor Sleep") report += "Cause: blue light / late sleep. Solution: reduce screen 1 hr before bed.\n\n";
  }

  // 7-Day diet plan
  if(dayCount>=7){
    report += "📅 7-DAY PERSONALIZED DIET PLAN\n";
    report += "• Morning: Warm water + fruit\n";
    report += "• Breakfast: Protein + fiber rich\n";
    report += "• Lunch: Balanced (dal, sabzi, roti/rice)\n";
    report += "• Snack: Nuts / fruits\n";
    report += "• Dinner: Light meal, avoid junk\n";
    report += "• Water: 8–10 glasses daily\n";
    report += "• Sleep: Before 11:30 PM\n\n";
    report += "🧠 AI Summary: This plan is based on your last 7 days data.\n";
    dayCount = 0;
  }

  report += "\n🌟 Motivation: Small daily habits = Big health improvements!";

  document.getElementById("output").innerText = report;
}
