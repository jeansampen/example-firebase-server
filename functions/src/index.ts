import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Sending notifications upon event creations
export const onEventAdded = functions.database
  .ref("/events/{eventId}")
  .onCreate((snapshot, context) => {
    let event = snapshot.val();    
    let ref = admin.database().ref("/players/");
    return ref.once("value", snapshot => {
        var payload = {
            data: {
              title: "New event has been created",
              body: event.owner + " is hosting a game at " + event.place
            }
          };
      let players = snapshot.val();
      let tokens = [] as string[];
      
      Object.keys(players).forEach(key => {
        // Here we add a condition which will send a notification to all users a part from the owner
        if(players[key]["facebook_name"] !== event.owner){
            let token = players[key]["fcm_token"];
            tokens.push(token);
        }
      });
      admin.messaging().sendToDevice(tokens, payload);
    });
  });   


// API for adding a player
export const player = functions.https.onRequest((req, res) => {
  let ref_to_players = admin.database().ref("/players/");
  if (req.method === "POST") {
    console.log("POST");
    let player = req.body;
    return ref_to_players.push(player).then(() => {
      res.send("Success!");
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


// API for adding an event
export const event = functions.https.onRequest((req, res) => {
	let ref_to_events = admin.database().ref("/events/");
  if (req.method === "POST") {
    console.log("POST");
    let event = req.body;
    return ref_to_events.push(event).then(() => {
      res.send("Success!");
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
