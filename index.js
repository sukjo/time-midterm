let events = null;
let chosenEvent = null;
let fenceW, fenceH;

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID =
  "121936930744-flf735hnbsmb7d3dremltg9adal7q8ii.apps.googleusercontent.com";
const API_KEY = "AIzaSyAbACdW8kF9HKRcDj08AGt2ZcW0xroiM8s";

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

let tokenClient;
let gapiInited = false;
let gisInited = false;

$("#authorize_button").hide();
$("#signout_button").hide();
$("#addspace_button").hide();
// $("#fence").hide();
$("#modalContainer").hide();

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    $("#authorize_button").show();
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    $("#signout_button").show();
    $("#addspace_button").show();
    $("#authorize_button").hide();
    // $("#authorize_button").innerText = "Refresh";
    await listUpcomingEvents();
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

/**
 *  Sign out the user upon button click.
 */
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

function setFenceSize(totalFreeTime) {
  //   const avgSleepDuration = 60 * 8 * 7;
  //   const wakingMinsPerWeek = 10080 - avgSleepDuration;
  //   const spaceRatio = (wakingMinsPerWeek - totalBusyTime) / wakingMinsPerWeek; // spacious hours in a week
  const spaceRatio = totalFreeTime / 10080; // spacious minutes in a week

  const windowWidth = $(window).width();
  const windowHeight = $(window).height();
  const aspectRatio = windowWidth / windowHeight;

  if (aspectRatio >= 1) {
    // landscape view
    fenceW = Math.floor(
      Math.sqrt(spaceRatio * aspectRatio * windowWidth * windowHeight)
    );
    fenceH = Math.floor(fenceW / aspectRatio);
  } else {
    // portrait view
    fenceH = Math.floor(
      Math.sqrt((spaceRatio / aspectRatio) * windowWidth * windowHeight)
    );
    fenceW = Math.floor(fenceH * aspectRatio);
  }

  setFlora("\\|/", 500, 12);
  setFlora("⚚", 20, 18);
  setFlora("⚘", 20, 16);
  setFlora("✿", 20, 16);
  setEnclosure(fenceW, fenceH);
  setSheep(fenceW / 2, fenceH / 2);

  //   $("#fence")
  //     .width(fenceW + "px")
  //     .height(fenceH + "px")
  //     .show()
  //     .css({
  //       top: `calc(50% - ${fenceH / 2}px)`,
  //       left: `calc(50% - ${fenceW / 2}px)`,
  //       borderRadius: `${fenceW}px / ${fenceH}px`,
  //     });

  console.log("fence size set to " + fenceW + " by " + fenceH);
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

/**
 * Print the summary and start datetime/date of the next events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */

//  if you want, put below function inside a settimeout to keep events updated
async function listUpcomingEvents() {
  let response;
  try {
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
    response = await gapi.client.calendar.events.list(request);
  } catch (err) {
    console.log(err.message);
    return;
  }

  events = response.result.items;
  console.log(events);

  // Get aggregate time of events (busy times)
  /*
  let totalMinutes = 0;
  let totalHours = 0;
  let totalModMins = 0; */

  let totalMillis = 0;

  if (events.length > 0) {
    events.forEach((ev) => {
      const startDateTime = new Date(ev.start.dateTime);
      const endDateTime = new Date(ev.end.dateTime);

      const millisPerEv = endDateTime - startDateTime; // find duration of each event in millis
      totalMillis += millisPerEv;

      /*
      const minsPerEv = Math.floor(millisPerEv / 60000); // convert ms to mins
      const hoursPerEv = Math.floor(minsPerEv / 60); // convert mins to hrs
      const modMinsPerEv = Math.floor(minsPerEv % 60); // find leftover mins

      totalMinutes += minsPerEv;
      totalHours += hoursPerEv;
      totalModMins += modMinsPerEv;*/
    });

    // Calculate total busy time
    const totalMinutes = Math.floor(totalMillis / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalModMins = Math.floor(totalMinutes % 60);

    console.log(
      `total time of gcal events: ${totalMinutes} minutes, or ${totalHours} hours and ${totalModMins} minutes.`
    );

    // Calculate free time using total busy time as input
    const avgSleepDuration = 60 * 8 * 7;
    const wakingMinsPerWeek = 10080 - avgSleepDuration;
    const totalFreeTime = wakingMinsPerWeek - totalMinutes;

    console.log(`free time: ${totalFreeTime} minutes`);
    setFenceSize(totalFreeTime);

    // Update explanation
    $("#explanationContainer > p").text(
      `You have ${totalHours} hours and ${totalModMins} minutes of obligations in the next week. That leaves you with ${Math.floor(
        totalFreeTime / 60
      )} hours and ${Math.floor(
        totalFreeTime % 60
      )} minutes of "free" time, granted you are sleeping 8 hours a night (which is understandably no guarantee in this day and age).`
    );
  } else {
    console.log("No events found.");
    return;
  }

  // Flatten to string to display
  //   const output = events.reduce(
  //     (str, event) =>
  //       `${str}${event.summary} (${event.start.dateTime || event.start.date}) (${
  //         event.end.dateTime || event.end.date
  //       })\n`
  //   );
  //   console.log(output);
}
