const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

exports.checkIfAsteroidIsDangerous = functions.handler.firestore.document.onWrite(
  async (change) => {
    const after = change.after.data();

    // exit if this asteroid has already been evaluates
    if (after.isDangerous !== undefined) {
      return;
    }

    const asteroidId = after.asteroidId;

    // don't call NASA API if we don't have an asteroid id
    if (!asteroidId) {
      console.warn('AsteroidId not provided');
      return;
    }

    const API_KEY = process.env['NASA_API_KEY'];

    const nasaRes = await fetch(
      `https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${API_KEY}`
    );
    const asteroidData = await nasaRes.json();
    const isDangerous = asteroidData['is_potentially_hazardous_asteroid'];

    await change.after.ref.set(
      {
        isDangerous,
      },
      { merge: true }
    );
  }
);
