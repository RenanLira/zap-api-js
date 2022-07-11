const venom = require('venom-bot');
const fs = require('fs');
const path = require('path')
const mime = require('mime-types');

const {setdata} = require('./getjson')

venom.create({
    session: 'renan'
}).then(client => start(client))
.catch(erro => console.log(erro))


const estoutrabalhando = (date) => {
    let hr = date.getHours() + (date.getMinutes() / 60)
    let dia = date.getDay()
    let trabalho = true

    if (dia == 6) {
        trabalho = hr > 12.5 && hr < 13.5 || hr > 17 ? false : true
    }
    else if (dia > 0) {
        trabalho = hr > 12.5 && hr < 13.5 || hr > 18 ? false : true
    } else {
        trabalho = false
    }
   
    return trabalho
}

const proxResp = (agora, data, id) => {
    let cliente = data[id]
    console.log(cliente)
    let t = new Date(agora)
    console.log(t)
    // agora.setHours(agora.getHours()+3)

    if (cliente){
       return cliente.proxResp < t ? true: false

    } else {
        
        return true
    }

}   


const start = async (client) => {

    client.onAnyMessage( async (message) => {
        const timestamp = message.timestamp
        const id = message.sender.id

        
        console.log(message.sender.displayName, message.text ? message.text : '' )
        if (message.chatId == 'status@broadcast') {

        }
        else if (message.isGroupMsg == false && message.sender.isMyContact == true && message.sender.isMe == false) {
            

            if (message.chat.contact.name.search('TC') != -1){
                const data = JSON.parse(fs.readFileSync('./data.json'))
                let agora = new Date(timestamp * 1000)
                
                if (estoutrabalhando(agora)) {
                    console.log('estou trabalhando')

                } else {
                    if (proxResp(agora, data, id)) {
                        client.sendText(message.from, 'Olá, estou fora de serviço')
                        agora.setHours(agora.getHours()+3)
                        setdata({...data, [id]: {'proxResp': agora.getTime()}})
                    }
                }

            }

        }


    })  
}


