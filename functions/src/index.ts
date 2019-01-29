import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
export const testEvent = functions.database
  .ref("/events/{eventId}")
  .onCreate((snapshot, context) => {
    let eventId = context.params.eventId;
    let event = snapshot.val();
    console.log("Created event with id ", eventId, " at ", event.place);
    var payload = {
      notification: {
        title: "Hi from Realtime database with id = " + eventId,
        body: "New event at " + event.place + " has been created"
      }
    };
    let token =
      "cJYDx5adUeg:APA91bHqMH8rk9n5W681mB8RRNVZECMm72tKT7hgQ1uaZwuIq4BRFHFN2P3fMyPtUA1CxVv3VMV9ltyA2V5NcCXiD-i7E_h7JQnCb2Cc9rguHZSAzEp5qB0DISWUZH7-FEfpEmPgQ2Xg";
    admin
      .messaging()
      .sendToDevice(token, payload)
      .then(() => {});

    return "Wassup!";
  });
