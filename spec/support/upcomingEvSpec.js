//     ReferenceError: listUpcomingEvents is not defined

const { listUpcomingEvents } = require("../../index.js");

describe("listUpcomingEvents", function () {
  let originalGapiClient;
  let eventsMock;

  // Mocking the gapi object
  const gapi = {
    client: {
      calendar: {
        events: {
          list: jasmine.createSpy().and.callFake(async function (request) {
            // Simulate the response based on the request
            // For example, simulating data based on the calendarId
            if (request.calendarId === "primary") {
              return Promise.resolve({
                result: {
                  items: [
                    /* your simulated events here */
                  ],
                },
              });
            } else {
              return Promise.reject(new Error("Invalid calendarId"));
            }
          }),
        },
      },
    },
  };

  // Make copy of gapi as global object (specific to Node / Jasmine)
  global.gapi = gapi;

  beforeEach(function () {
    // Save the original gapi.client.calendar.events.list function
    originalGapiClient = gapi.client.calendar.events.list;

    // Mock the gapi.client.calendar.events.list function
    gapi.client.calendar.events.list = jasmine
      .createSpy()
      .and.callFake(async function (request) {
        // Mocking the API call, you can return a resolved Promise with simulated data
        if (request.calendarId === "primary") {
          return Promise.resolve({
            result: {
              items: eventsMock, // Simulated events data
            },
          });
        } else {
          return Promise.reject(new Error("Invalid calendarId"));
        }
      });

    // Mocking events data for testing
    eventsMock = [
      // Your simulated events
    ];
  });

  afterEach(function () {
    // Restore the original gapi.client.calendar.events.list function
    gapi.client.calendar.events.list = originalGapiClient;
  });

  it("should fetch upcoming events", function (done) {
    // Simulate the function call
    listUpcomingEvents()
      .then(() => {
        expect(gapi.client.calendar.events.list).toHaveBeenCalled();
        expect(events).toEqual(eventsMock); // Check if 'events' are set correctly
        // Add more expectations or assertions based on the behavior you expect
        done();
      })
      .catch((error) => {
        done.fail(error); // Fail the test in case of an error
      });
  });
});
