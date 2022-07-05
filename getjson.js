const fs = require('fs')




const setdata = (data) => {
    let datajson = JSON.stringify(data)
    fs.writeFile('./data.json', datajson, (err) => {
        if(err) {
            console.log(err)
        }
        else{
            console.log('salvo')
        }
    })
}

exports.setdata = setdata