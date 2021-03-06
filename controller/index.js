const express = require("express");
const router = express.Router();
const moment = require('moment');
const fs = require('fs');
const { Account } = require("../model/account");
const { Doctor } = require("../model/doctor");
const { CheckDate } = require("../model/checkdate");
const initial = require("../model/file");

router.use("/secretary", require("./secretaryController"));
router.use("/admin", require("./adminController"));
router.use("/dentist", require("./dentistController"));

//gets the first page (Basically for initial setup)
router.get("/", async (req, res) => {
    //username is subject to change

    let account = await Account.getAccountByUsername("admin");
    //if accounts are empty, meaning database is empty, automatically generate admin and secretary account
    if (account == undefined) {
        Account.addAccount(new Account({
            username: "admin",
            password: initial.admin,
            accountType: "admin",
            doctorID: ""
        }), (value) => {
            Account.addAccount(new Account({
                username: "secretary",
                password: initial.secretary,
                accountType: "secretary",
                doctorID: ""
            }), (val) => {
                res.redirect("/login");
            }, (err) => {   
                res.send(err);
            })    
        }, (err) => {   
            res.send(err);
        })
    } else {
        //if the database is not empty and there is no existing session; redirect to the login page
        if (req.session.username == null) {
            res.redirect("/login");
        } else {
            //redirects to different pages if there is a session(There are currently only 3 types of users: Doctors, sect, admin)
            let account = await Account.getAccountByUsername(req.session.username);
            if (account.accountType == "secretary") {
                res.redirect("/secretary");
            } else if (account.accountType == "admin") {
                res.redirect("/admin");
            } else if (account.accountType == "dentist") {
                res.redirect("/dentist");
            }
        }
    }
})

//calls for the login page
router.get("/login", async (req, res) => {
    //Reminds the user to remove data although it's not really written here.
    var date = await CheckDate.findOne({ type: "date"});
    if(date == null) {
        var today = moment().toDate();
        var year;
        // check if today is december
        if(moment(today).isSame(moment('2000-12-31', 'month'))) {
            year = moment(today).year() + 1;
        } else {
            year = moment(today).year();
        }

        CheckDate.create({
            type: "date",
            checkdate: "" + year + "-12-01"
        })
    }
    //if a session exists, login immediately
    if (req.session.username != null) {
        if (req.session.username == "secretary") {
            res.redirect("/secretary");
        } else if (req.session.username == "dentist") {
            res.redirect("/dentist");
        } else if (req.session.username == "admin") {
            res.redirect("/admin");
        }
    //if a session does not exist, go to login page
    } else {
        let acc = await Account.getAllAccounts();
        res.render("page_templates/login_view.hbs", {
            account: JSON.stringify(acc)
        })
    }
})

//Checks if the login is valid; If there exists such an account;
router.post("/validateLogin", async (req, res) => {
    var account = await Account.getAccountByUsername(req.body.username);
    if (account != undefined) {
        account = await Account.authenticate(account.username, req.body.password, account.salt);
        if (account != undefined) {
            req.session.username = account.accountType;
            if(account.accountType == "dentist") {
                req.session.doctorUsername = req.body.username;
                Doctor.updateLogin(account.doctorID, moment(Date.parse(req.body.date)).format("MMM DD, YYYY  hh:mm:ss"));
            }
            res.send({ message: 1 });
        } else {
            res.send({ message: 2 })
        }
    } else {
        res.send({ message: 0 });
    }
})
//simple logout
router.get("/logout", (req, res) => {
    req.session.username = null;
    req.session.doctorUsername = null;
    req.session.id = null
    res.header("Cache-Control", "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");
    res.redirect("/login");
})

module.exports = router;