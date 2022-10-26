const mongoose = require("mongoose");

exports.dbConnection = async () => {
  try {
    mongoose.connect('mongodb+srv://project_marketplace:uIcSWjueQ3RdYQrP@cluster0.pqlta.gcp.mongodb.net/url_shortener?retryWrites=true&w=majority', {
      useNewUrlParser: true,
  });

    console.log("connected to database");
  } catch (err) {
    console.log(err);
    throw new Error("Cannot Connect to database...");
  }
};

