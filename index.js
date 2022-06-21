import fs from "fs";
import log4js from "log4js"
import {parse} from "csv-parse";
var csvFile = "Dodgy Transaction.csv";
import readlineSync from 'readline-sync';
import { Transaction } from "./Transaction.js"
import { Person } from "./Person.js"

// LOGGING CODE
log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});
const logger = log4js.getLogger("index.js")

// MAIN CODE
function ProcessFile() {
    let Names = []

    for (let i=1;i < userList.length;i++) {
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
            for (let j = 1; j < userList.length; j++) {
                if ((userList[j].From === Names[i].Name) || (userList[j].To === Names[i].Name)) {
                    console.log("Date: " + userList[j].Date + "  From:" + userList[j].To + "  To:" + userList[j].From + "  Narrative: " + userList[j].Narrative + "  Amount: " + userList[j].Amount)
                }
            }
        }
    }
}

let userList = []

function loadOneTransaction(csvRow) {
    userList.push(new Transaction(csvRow[0], csvRow[1], csvRow[2], csvRow[3], csvRow[4]))
}

fs.createReadStream(csvFile)
    .pipe(parse({delimiter: ','}))
    .on('data', loadOneTransaction)
    .on('end', () => ProcessFile())


