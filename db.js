const fs = require('fs')
let PATH = "./db.json"

function randomID(){
    let id = ""
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');
    for(let i = 1; i <= 6;i++){
        let index = Math.floor(Math.random() * chars.length)
        id += chars[index]
    }
    return id
}

function init(tables = ["data"],file = "db.json"){
    if(!fs.existsSync(PATH)){
        PATH = file
        let obj = {}
        for(i of tables){
            obj[i] = []
        }
        obj = JSON.stringify(obj)
        fs.writeFile(file,obj,(err) =>{
            if(err){
                console.log(err)
            }
        })
}
}

function readData(){
    return new Promise((res,rej) =>{
        fs.readFile(PATH,'utf8',(err,data) =>{
            if(err){
                rej(err)
            }
            else{
                let val = JSON.parse(data)
                res(val)
            }
        })
    })
}

async function addNewValue(table,newData){
    let data = await readData(PATH)
    let arr = data[table];
    if(typeof newData == 'object'){
        newData.id = randomID()
    }
    else{
        let tmp = {val:newData,id:randomID()}
        newData = tmp;
    }
    arr.push(newData)
    data[table] = arr
    let dataToWrite = JSON.stringify(data)
    fs.writeFile(PATH,dataToWrite,(err) =>{
        if(err){
            console.log(err)
        }
    })
}

function getIdFromTable(data,ID,table){
    let arr = data[table]
    for(let i of arr){
       if(i.id == ID){
           return i
       }
    }
}

async function changeValue(table,ID,newValue){
    let data = await readData()
    let arr = data[table]
    console.log(arr)
    for(let i = 0; i < arr.length;i++){
        if(arr[i].id == ID){
            arr[i] = (typeof newValue === 'object')? {...newValue,id:ID} : {val:newValue,id:ID}
            break;
        }
    }
    data[table] = arr
    data = JSON.stringify(data)
    fs.writeFile(PATH,data,(err)=>{if(err){console.log(err)}})
}


async function deleteValue(table,ID){
    let data = await readData()
    let arr = data[table]
    let result = []
    for(let i of arr){
        if(i.id != ID){
            result.push(i)
        }
    }
    data[table]= result
    data = JSON.stringify(data)
    fs.writeFile(PATH,data,(err)=>{if(err){console.log(err)}})
}

module.exports = {
    PATH,
    deleteValue,
    randomID,
    changeValue,
    readData,
    getIdFromTable,
    addNewValue,
    init
}