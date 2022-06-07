#!/usr/bin/env node

require("dotenv").config();

net = require("net");

const axios = require("axios");

const datagrams = [{}];

const var_dump = require("var_dump");

//var sys = require("sys");
//var exec = require("child_process").exec;

// 26 September 2021
console.log("thing-jobs 1.0.0 5 June 2022");

/*
Standard stack stuff above.
*/

var hosts = process.env.STATIONS.split(" ");
var channel = process.env.CHANNEL;
var transport = process.env.TRANSPORT;
var interval_minutes = process.env.INTERVAL;
var http_transport = process.env.HTTP_TRANSPORT;
var station = process.env.STATION;

//var minutes = 1,
the_interval = interval_minutes * 60 * 1000;

// Set a node interval.

setTimer0 = setInterval(function () {
  //exec("ping -c 3 localhost", puts);

  //  console.log("I am doing my 1 minute check again");
  // do your stuff here
  console.log("hosts", hosts);

}, the_interval);

// Run jobs at specific times. dev.

let jobs = [
{nuuid:'abcd', subject:'weather', agentInput:{runAt:'16:00'}},
{nuuid:'abce', subject:'weather', agentInput:{runAt:'08:00'}},

]


setTimer1 = setInterval(function () {

  let date_ob = new Date();
  minute = date_ob.getMinutes();
  hour = date_ob.getHours();
  day = date_ob.getDay();
  week = date_ob.getWeek();
  weekYear = date_ob.getWeekYear();

  clockTime = ('00'+hour).slice(-2) + ":" + ('00'+minute).slice(-2);

  minimumInterval = 1 * 60 * 60 * 1000;

  jobs.map((job) => {
    console.log(job.agentInput.runAt);
    if (job.agentInput.runAt === clockTime) {

    // Check the age.
    // If run within the hour don't run again.
    let age = date_ob - job['lastRunat'];
    if (age < minimumInterval) {
      console.log("too soon", age);
      return;
    }

    console.log("age", age);

    console.log(job.subject);
    handleLine(job.subject, 'agent', null);
      job['lastRunat'] = date_ob;
    }
  });


  //  console.log("I am doing my 1 minute check again");
  // do your stuff here
  console.log("jobs",hour, minute, day, week, weekYear);
}, 5000);


function handleLine(subject, from = 'ping', agent_input = 'ping') {
  /*
        REFERENCE
        $datagram = [
            "to" => "null" . $this->mail_postfix,
            "from" => "job",
            "subject" => "s/ job stack",
        ];
  */

  var to = channel;

  //const subject = line;

  console.log(subject);

  // Otherwise this is a different datagram.
  // Save it in local memory cache.

  //console.log("SUBJECT", subject);
  const timestamp = new Date();
  const utc = timestamp.toUTCString();

  var arr = { from: from, to: to, subject: subject, agent_input: agent_input, precedence:'routine' };
  var datagram = JSON.stringify(arr);

  if (transport === "apache") {
    axios
       .post(http_transport, datagram, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((result) => {
const thing_report = result.data.thingReport;

console.log("thing_report", thing_report);


    // Create a fallback message.
    // Which says 'sms'.
    sms = "sms";
    message = "sms";

    try {
//      var thing_report = JSON.parse(job.response);
      var sms = thing_report.sms;
      var message = thing_report.message;
      //var agent = thing_report.agent;
      //var uuid = thing_report.thing.uuid;
    } catch (e) {
      console.log(e);

      var sms = "quiet";
      var message = "Quietness. Just quietness.";
    }

    console.log(sms);
    console.log(message);
    console.log(thing_report.png);
    console.log(thing_report.pngs);

    thing_report.log = "nulled";
    console.log(thing_report);
    console.log(thing_report.link);
    //    const image_url = thing_report && thing_report.link ? thing_report.link + '.png' : null

    const image_url =
      thing_report && thing_report.image_url ? thing_report.image_url : null;

    console.log(image_url);
    if (sms !== null) {
      if (image_url === null) {
console.log(sms);
//        discordMessage.channel.send(sms);
      } else {
console.log(sms);
console.log("image(s) available");
//        discordMessage.channel.send(sms, { files: [image_url] });
      }
    }




      })
      .catch((error) => {
        console.log(error);
      });
  }






}



// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function() {
  var date = new Date(this.getTime());
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  return date.getFullYear();
}
