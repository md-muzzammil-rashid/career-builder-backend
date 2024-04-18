import path from 'path'
import csv from 'csvtojson'
import fs from 'fs'
import XLSX from 'xlsx'

export const convertToJson = (file)=>{
    console.log('stage-1');
    console.log(path.extname(file));
    if(path.extname(file).toLowerCase()==='.json'){
        return file;
    }else if(path.extname(file).toLowerCase()==='.csv'){
        //Converting File From CSV to JSON
        csv().fromFile(file)
        .then((jsonData)=>{
            return jsonData
        })
        
    }else if(path.extname(file).toLowerCase()==='.xlsx'){
        //Converting File From XLSX to JSON
        const workbook = XLSX.readFile(file)
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        console.log(jsonData );
        return jsonData
        
    }else{
        console.log('stage-2');
        return 0;
    }
}