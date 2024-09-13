//alarm code
chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log(alarm.name);

  const alarmDataRetrieved = alarm.name.replace("alarm", "");

  const [alarmNumber, reminder] = alarmDataRetrieved.split(":");

  console.log("THIS IS THE: ", reminder);

  console.log("notification works");

  chrome.notifications.create({
    type: "basic",
    iconUrl: "images/icon48.png",
    title: "Time's Up!",
    message: `It's time to ${reminder}`,
    priority: 0,
  });
});
