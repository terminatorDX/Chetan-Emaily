const mongoose = require("mongoose");
require("../models/Survey");
const Survey = mongoose.model("Survey");
const FeedBack = require("../models/FeedBack");
const requireLogin = require("../middlewares/requireLogin");
module.exports = (app) => {
    app.post("/api/feedbackForm", (req, res) => {
        const { feedback_id } = req.body;
        FeedBack.find(
            {
                _id: feedback_id,
            },
            (err, feedbackForm) => {
                if (feedbackForm) {
                    return res.status(200).send(feedbackForm);
                }
                if (err) {
                    return res.send({
                        error: err,
                        errorMessage:
                            "Cannot Find Form, Please Click on Given Link on Mail Again",
                    });
                }
            }
        );
    });
    app.get("/api/feedbacks", requireLogin, async (req, res) => {
        const feedbacks = await FeedBack.find({ _user: req.user.id });
        res.send(feedbacks);
    });
    app.post("/api/feedback", (req, res) => {
        const { feedback, surveyId, feedBackId } = req.body;
        let emailExist = false;
        let errorMessage = [];
        Survey.findById(surveyId)
            .then((survey) => {
                if (survey) {
                    survey.recipients.find((ele) => {
                        console.log(ele.email, feedback.email);
                        if (ele.email === feedback.email) {
                            emailExist = true;
                            if (ele.responded) {
                                //?user has already resonded
                                console.log("you have already responded");
                                errorMessage.push("You've submitted review");
                                return res.send({
                                    error: true,
                                    errorMessage,
                                });
                            }
                            if (!ele.responded) {
                                //? so the user has not responded
                                //prettier-ignore
                                feedbackUpdate(feedBackId, feedback, errorMessage, res );
                                ele.responded = true; //? confirming the user has responded
                            }
                        }
                    });
                    if (emailExist && !error) {
                        console.log("saving your response");
                        survey.save().catch((err) => {
                            //?saving the user response
                            console.log("Server Error, Please try again", err);
                            errorMessage.push("Server Error, Please try again");
                            return res.send({ error: true, errorMessage });
                        });
                    }
                    if (!emailExist) {
                        console.log(
                            "You Are Not Eligible for participating on this Survey"
                        );
                        errorMessage.push("You're Not Eligible for Survey");
                        return res.send({
                            error: true,
                            errorMessage,
                        });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                errorMessage.push("Please Reclick on Feedback Link Provided");
            });
    });
};
const feedbackUpdate = (feedBackId, feedback, errorMessage, res) => {
    console.log("inside feedback");
    FeedBack.findById(feedBackId)
        .then((fdbk) => {
            if (fdbk) {
                console.log("fdbk", fdbk);
                const { email, group, group0, group1 } = feedback;
                fdbk.question1[group]++;
                let answers = [];
                for (let i in feedback) {
                    if (i === "email" || i === "group") {
                        console.log(i === "email", i, "email");
                    } else {
                        answers.push(feedback[i]);
                    }
                }
                fdbk.Questions.forEach((ele, index) => {
                    const i = index;
                    ele[answers[i]]++;
                });
                console.log("feedback fdbk : ", fdbk);
                fdbk.save() //?saving feedback of the user
                    .then(() => {
                        error = false;
                        console.log("FeedBack is Added");
                        return res.send({
                            error: false,
                            successMessage: "FeedBack Added",
                        });
                    })
                    .catch((err) => {
                        error = true;
                        errorMessage.push("error with saving Your Response"); //TODO: if there is an error, user should not proceed
                        return res.send({
                            error: err,
                            errorMessage,
                        });
                    });
            }
        })
        .catch((err) => {
            error = true;
            errorMessage.push(
                "Server Error, Please Click on Link Provided in You Mail again"
            );
            return res.send({
                error: err,
                errorMessage,
            });
        });
};

//TODO: search through User using userId and return
