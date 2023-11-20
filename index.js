// import setFenceSize from "./setFenceSize";
// import Scene from "./src/Scene";
// import apiConfig from "./src/api.js";
const CLIENT_ID = apiConfig.clientId;
const API_KEY = apiConfig.apiKey;

let events = null;
let totalTimes = [];
let chosenCalsID = [];
let chosenEvent = null;
// let fenceW, fenceH;

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

// Authorization scopes required by the API; multiple scopes can be included, separated by spaces
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

let tokenClient;
let gapiInited = false;
let gisInited = false;

$("#authorize_button").hide();
$("#signout_button").hide();
$("#addspace_button").hide();
// $("#fence").hide();
$("#modalContainer").hide();

// Callback after api.js is loaded
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

// Callback after the API client is loaded. Loads the discovery doc to initialize the API
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

// Callback after Google Identity Services are loaded
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

// Enables user interaction after all libraries are loaded
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    $("#authorize_button").show();
  }
}

// Sign in the user upon button click
async function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }

    $("#signout_button").show();
    $("#addspace_button").show();
    $("#authorize_button").hide();
    // $("#authorize_button").innerText = "Refresh";
    await getCalendarList();
    await getUpcomingEvents();
    // await listUpcomingEvents();

    // const FILTERED_EVENTS = filterEvents(events);
    // console.log("filtered events: ", FILTERED_EVENTS);

    filterEvents(events)
      .then((FILTERED_EVENTS) => {
        const BUSY_TIME_MS = calcBusyTime(FILTERED_EVENTS);
        const FREE_TIME_MS = calcFreeTime(BUSY_TIME_MS);

        const BUSY_TIME = convertTime(BUSY_TIME_MS);
        const FREE_TIME = convertTime(FREE_TIME_MS);

        const scene = new Scene($(window).width(), $(window).height());
        scene.setFenceSize(FREE_TIME_MS / 1000 / 60);
        scene.drawScene();
        updateExplanation(BUSY_TIME, FREE_TIME);
      })
      .catch((err) => {
        console.error("Filter events error", err);
      });

    // const BUSY_TIME_MS = calcBusyTime(FILTERED_EVENTS);
    // const FREE_TIME_MS = calcFreeTime(BUSY_TIME_MS);
    // const BUSY_TIME = convertTime(BUSY_TIME_MS);
    // const FREE_TIME = convertTime(FREE_TIME_MS);
    // const scene = new Scene($(window).width(), $(window).height());
    // scene.setFenceSize(FREE_TIME_MS / 1000 / 60);
    // scene.drawScene();
    // updateExplanation(BUSY_TIME, FREE_TIME);
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

// Sign out the user upon button click
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    $("#authorize_button").show();
    $("#authorize_button").innerText = "Sign in again";
    $("#signout_button").hide();
    $("#addspace_button").hide();
    // $("#fence").hide();
  }
}

function addSpace() {
  chosenEvent = events[Math.floor(Math.random() * events.length)];

  $("#modalContainer").toggle();
  $("#modal > p").text(
    `Would you consider rescheduling or declining ${chosenEvent.summary}?`
  );
}

function modifyEvent() {
  if (chosenEvent !== null) {
    window.open(chosenEvent.htmlLink);
  }
}

function closeModal() {
  $("#modalContainer").toggle();
}

// WIP function to choose which calendars to include
async function getCalendarList() {
  let response;
  try {
    response = await gapi.client.calendar.calendarList.list({});

    const calendars = response.result.items;
    const ownedCalendars = calendars.filter((cal) => {
      if (cal.accessRole == "owner") {
        return true;
      }
      return false;
    });

    ownedCalendars.forEach((cal) => {
      chosenCalsID += cal.id;
    });
    console.log("chosen calendar ID", chosenCalsID);
  } catch (err) {
    console.error("getCalendarList error", err);
  }
}

//  if you want, call the below function inside a setTimeout to keep events updated
function getUpcomingEvents() {
  return new Promise((resolve, reject) => {
    const oneWeekAhead = new Date();
    oneWeekAhead.setDate(oneWeekAhead.getDate() + 7);

    const request = {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      timeMax: oneWeekAhead.toISOString(),
      showDeleted: false,
      showHidden: false,
      singleEvents: true,
      maxResults: 100,
      orderBy: "startTime",
    };

    gapi.client.calendar.events
      .list(request)
      .then((response) => {
        events = response.result.items;
        //console.log(events);
        resolve(events);
      })
      .catch((err) => {
        console.log(err.message);
        reject(err); // reject promise with error
      });
  });
}

// filter out "declined" or "needsAction" events
async function filterEvents(evArray) {
  if (evArray.length > 0) {
    const acceptedEvents = evArray.filter((ev) => {
      if (ev.creator.self) {
        return true;
      }

      if (ev.attendees) {
        for (const person of ev.attendees) {
          if (person.self && person.responseStatus == "accepted") {
            return true;
          }
        }
      }
      return false; // discard the event if none of the above apply
    });
    return acceptedEvents;
  } else {
    console.log("No events found.");
    return [];
  }
}

// Calculate total busy time (ms) using accepted events as input
function calcBusyTime(events) {
  getUpcomingEvents();
  let totalMillis = 0;

  // Get aggregate time of events (busy times), excluding events that were not accepted
  events.forEach((ev) => {
    const startDateTime = new Date(ev.start.dateTime);
    const endDateTime = new Date(ev.end.dateTime);

    const millisPerEv = endDateTime - startDateTime; // find duration of each event in millis
    totalMillis += millisPerEv;
  });

  return totalMillis;
}

// Calculate free time using total busy time as input
function calcFreeTime(busyTimeMs) {
  const avgSleepDuration = 8 * 7 * 60 * 60 * 1000;
  const wakingTimePerWeek = 10080 * 60 * 1000 - avgSleepDuration;
  const totalFreeTimeMs = wakingTimePerWeek - busyTimeMs;
  // const totalFreeTimeMin = wakingTimePerWeek - Math.floor(busyTimeinMs / 60000);

  // console.log(`free time: ${totalFreeTimeMin} minutes`);
  return totalFreeTimeMs;
}

function updateExplanation(busytime, freetime) {
  $("#explanationContainer > p").text(
    `You have ${busytime.hours} hours and ${busytime.modMinutes} minutes of obligations in the next week. That leaves you with ${freetime.hours} hours and ${freetime.modMinutes} minutes of "free" time, granted you are sleeping 8 hours a night (which is understandably no guarantee in this day and age).`
  );

  // $("#explanationContainer > p").text(
  //   `You have ${totalHours} hours and ${totalModMins} minutes of obligations in the next week. That leaves you with ${Math.floor(
  //     totalFreeTime / 60
  //   )} hours and ${Math.floor(
  //     totalFreeTime % 60
  //   )} minutes of "free" time, granted you are sleeping 8 hours a night (which is understandably no guarantee in this day and age).`
  // );
}

function convertTime(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalModMins = Math.floor(totalMinutes % 60);

  const timeObject = {
    hours: totalHours,
    minutes: totalMinutes,
    modMinutes: totalModMins,
  };

  return timeObject;

  // console.log(
  //   `total time of gcal events: ${totalMinutes} minutes, or ${totalHours} hours and ${totalModMins} minutes.`
  // );
}
