const RecipientSchema = require("./Recipient"),
    mongoose = require("mongoose"),
    { Schema } = mongoose, /// or Schema = mongoose.Schema
    SurveySchema = new Schema({
        title: String,
        body: String,
        subject: String,
        recipients: [RecipientSchema],
        yes: { type: Number, default: 0 },
        no: { type: Number, default: 0 },
        _user: { type: Schema.Types.ObjectId, ref: "User" },
        dateSent: Date,
        lastResponded: Date,
    });
mongoose.model("Survey", SurveySchema);