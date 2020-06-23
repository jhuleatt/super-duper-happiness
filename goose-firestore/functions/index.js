const functions = require('firebase-functions');

exports.convertToGooseLanguage = functions.handler.firestore.document.onWrite(
  async (change) => {
    const after = change.after.data();

    // exit if this  has already been translated
    if (after.isTranslated === true) {
      return;
    }
    console.log(JSON.stringify(after));

    const textToTranslate = after.text;
    const translatedText = textToTranslate.replace(/([a-z]|[A-Z])\w+/g, 'HONK');

    await change.after.ref.set({
      isTranslated: true,
      originalText: textToTranslate,
      text: translatedText,
    });
  }
);
