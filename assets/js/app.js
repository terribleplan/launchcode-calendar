var helpers = {
  //This expects it in MM-DD-YYYY HH:MM
  formatDate: function (item) {
    var dstring = item["date"] + " " + window["locations"][item["location"]]["timeZone"];
    var momentInstance = moment(dstring, "MM-DD-YYYY hh:mma Z");
    if (!momentInstance.isValid()) {
      debugger;
    }

    item["date"] = {
      date: momentInstance.format("MMMM Do YYYY"),
      time: momentInstance.format("h:mm:ss a"),
      unix: momentInstance.unix()
    };

    return item;
  }
};

var template = {
  date: function (item) {
    var rendered = "<div class='calendar-item";

    if (item["date"]["unix"] * 1000 <= new Date().getTime()) {
      rendered += " past"
    }

    rendered +="'><div class='well'><h2>" + item["date"]["date"] + "</h2><h4>" + item["title"] +
      "</h4><p>" + item["description"] + "</p>";

    if (item["teacher"]) {
      rendered += "<small><p>Taught by:";
      for (var i = 0; i < item["teacher"].length; i++) {
        rendered += " " + window["people"][item["teacher"][i]]["displayName"] + ",";
      }
      rendered = rendered.slice(0, -1);
      rendered += "</p></small>"
    }

    if (item["launchcodeTv"]) {
      rendered += "<p><a href='" + item["launchcodeTv"] + "'>LaunchCode TV</a></p>"
    }

    return rendered + "</div></div >";
  },

  dateList: function (arr) {
    var retVal = "";

    for (var i = 0; i < arr.length; i++) {
      retVal += template.date(arr[i]);
    }

    return retVal;
  }
};

var preCompute = {
  toMoment: function (arr) {
    var retVal = [];

    for (var i = 0; i < arr.length; i++) {
      arr[i] = helpers.formatDate(arr[i]);
    }

    return arr;
  }
};

//Polyfill for document ready
var interval = window.setInterval(function () {
  if (document.readyState === "complete") {
    window.clearInterval(interval);

    //Relies on data having been loaded by the HTML
    document.querySelectorAll(".calendar")[0].innerHTML = template.dateList(preCompute.toMoment(window["calendarData"]));
  }
}, 70);