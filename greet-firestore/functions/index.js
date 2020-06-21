const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.greetFirestore = functions.handler.firestore.document.onWrite(
  async (change) => {
    const after = change.after.data();

    // exit if this has already been greeted
    if (after.greeting !== undefined) {
      return;
    }

    const name = after.name;

    if (!name) {
      console.warn('you did not provide a name to greet!');
    }

    const greetingStart = process.env['GREETING_START'];
    const greeting = greetingStart + (name ? `, ${name}!` : '!');

    await change.after.ref.set(
      {
        greeting,
      },
      { merge: true }
    );
  }
);
