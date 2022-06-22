import fs from "fs";
import log4js from "log4js"
import {parse} from "csv-parse";

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

function CreateListOfPeople(TransactionList) {
    let Names = []

    for (let i=1;i < TransactionList.length;i++) {
        let found_name_from = false
        let found_name_to = false

        for (let j=0;j < Names.length;j++) {
            if (TransactionList[i].From === Names[j].Name) {
                found_name_from = true
                Names[j].transactions_from.push(TransactionList[i])
            }
            if (TransactionList[i].To === Names[j].Name) {
                found_name_to = true
                Names[j].transactions_to.push(TransactionList[i])
            }
        }
        if (found_name_from === false) {
            Names.push(new Person(TransactionList[i].From,0,[],[TransactionList[i]]))
        }
        if (found_name_to === false) {
            Names.push(new Person(TransactionList[i].To,0,[TransactionList[i]],[]))
        }
    }
    return Names
}

function ListAll(Names) {
    logger.info("User has selected List All")
    console.log("\nNames & Owes...")
    for (let i = 0; i < Names.length;i++) {
        Names[i].calculateamountowed()
        Names[i].displayamountowed()
    }
}


function ProgramMainBody() {
    logger.info("Data is Loaded!")

    let Names = CreateListOfPeople(TransactionList)

    // DEAL WITH USER INPUT FUNCTIONS
    var input = readlineSync.question("")

    // LIST ALL
    if (input === "List All") {
        ListAll(Names)
    }
    // LIST NAME
    for (let i = 0; i < Names.length;i++) {
        if (input === "List "+Names[i].Name){
            logger.info("User has selected List " + Names[i].Name)
            Names[i].listalltransactions()
        }
    }
    logger.info("Program has Ended!\n")
}

let TransactionList = []

function loadOneTransaction(csvRow) {
    TransactionList.push(new Transaction(csvRow[0], csvRow[1], csvRow[2], csvRow[3], csvRow[4]))
}
logger.info("Program has Started")


function ReadCsvFile(FileName) {
    fs.createReadStream(FileName)
        .pipe(parse({delimiter: ','}))
        .on('data', loadOneTransaction)
        .on('end', () => ProgramMainBody())
}
function ReadJsonFile(FileName) {
    console.log("Sorry, we don't have the capabilites to do this right now...")
}

//Pre Processing Details
var input = readlineSync.question("Name of File: ")

if (!(input.search(".csv") === -1)) {
    logger.info("User has opened " + input)
    ReadCsvFile(input)
}
else if  (!(input.search(".json") === -1)) {
    ReadJsonFile(input)
}