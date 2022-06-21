import fs from "fs";
import {parse} from "csv-parse";
var csvFile = "Transactions2014.csv";
import readlineSync from 'readline-sync';

import { User } from "./user.js"
import { Person } from "./Person.js"


var userList = []
// Reads the CSV file into an array
const processData = (err, data) => {
    if (err) {
        console.log(`An error was encountered: ${err}`);
        return;
    }
    data.shift()
    const userList = data.map(row => new User(...row))

    // MAIN PROGRAM STARTS
    let Names = []

    for (let i=0;i < userList.length;i++) {
        let found_namea = 0
        let found_nameb = 0

        for (let j=0;j < Names.length;j++) {
            if (userList[i].From === Names[j].Name) {
                found_namea = 1
                Names[j].owe += parseFloat(userList[i].Amount)
            }
            if (userList[i].To === Names[j].Name) {
                found_nameb = 1
                Names[j].owe -= parseFloat(userList[i].Amount)
            }
        }

        if (found_namea === 0) {
            Names.push(new Person(userList[i].From,0))
            Names[Names.length-1].owe += parseFloat(userList[i].Amount)
        }
        if (found_nameb === 0) {
            Names.push(new Person(userList[i].To,0))
            Names[Names.length-1].owe -= parseFloat(userList[i].Amount)
        }
    }
    var input = readlineSync.question("")

    if (input === "List All") {
        console.log("Names & Owes...")
        for (let i = 0; i < Names.length;i++) {
            console.log(Names[i].Name + " Owes: £" + (Names[i].owe).toFixed(2))
        }
    }
    for (let i = 0; i < Names.length;i++) {
        if (input == "List "+Names[i].Name){
            for (let j = 0; j < userList.length; j++) {
                if ((userList[j].From === Names[i].Name) || (userList[j].To === Names[i].Name)) {
                    console.log("Date: " + userList[j].Date + "  From:" + userList[j].To + "  To:" + userList[j].From + "  Narrative: " + userList[j].Narrative + "  Amount: " + userList[j].Amount)
                }
            }
        }
    }
}


fs.createReadStream(csvFile).pipe(parse({ delimiter: ',' }, processData))
//async function readAndProcessFile() {
    //const userList = await fs.createReadStream(csvFile).pipe(parse({ delimiter: ',' }, processData))
//}