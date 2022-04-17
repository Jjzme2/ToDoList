module.exports.getDate = GetDate;

function GetDate() {
  let today = new Date();
  let dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  let day = today.toLocaleDateString("en-US", dateOptions);
  return day;
}

module.exports.getTime = GetTimeOfDay;

function GetTimeOfDay() {
  let today = new Date();
  let timeOfDay = "";

  if (today.getHours() > 0 && today.getHours() < 12) {
    timeOfDay = "Morning";
  } else if (today.getHours() > 12 && today.getHours() < 17) {
    timeOfDay = "Afternoon";
  } else if (today.getHours() > 17 && today.getHours() < 20) {
    timeOfDay = "Evening";
  } else {
    timeOfDay = "Night";
  }
  return timeOfDay;
}

module.exports.getTimeString = GetTimeString;

function GetTimeString() {
  let today = new Date();

  let t = today.toTimeString();
  return t.slice(0, 5);
}
