import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
export const onEventAdded = functions.database
  .ref("/events/{eventId}")
  .onCreate((snapshot, context) => {
    let eventId = context.params.eventId;
    let event = snapshot.val();
    console.log("Created event with id ", eventId, " at ", event.place);
    var payload = {
      data: {
        title: "DataTitle = " + eventId,
        body: "DataBody = " + event.place
      }
    };
    let ref = admin.database().ref("/players/");
    return ref.once("value", snapshot => {
      let players = snapshot.val();
      let tokens = [] as string[];
      Object.keys(players).forEach(key => {
        let token = players[key]["fcm_token"];
        tokens.push(token);
        console.log(token);
      });
      admin.messaging().sendToDevice(tokens, payload);
    });
  });

export const player = functions.https.onRequest((req, res) => {
  let ref_to_players = admin.database().ref("/players/");
  if (req.method === "POST") {
    console.log("POST");
    let player = req.body;
    return ref_to_players.push(player).then(() => {
      res.send(player);
    });
  }

  else if (req.method === "GET") {
	  console.log("GET");
	  return ref_to_players.once("value").then(snapshot => {
		  let players = snapshot.val();
		  res.send(players);
    });
  }
  return;
});

export const event = functions.https.onRequest((req, res) => {
	let ref_to_events = admin.database().ref("/events/");
  if (req.method === "POST") {
    console.log("POST");
    let event = req.body;
    return ref_to_events.push(event).then(() => {
      res.send(event);
    });
  }

  else if (req.method === "GET") {
	  console.log("GET");
	  return ref_to_events.once("value").then(snapshot => {
		  let events = snapshot.val();
		  res.send(events);
    });
  }
  return;

});
