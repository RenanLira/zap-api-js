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

    // function to detect conflits and change status
    // Force it to keep the current session
    // Possible state values:
    // CONFLICT
    // CONNECTED
    // DEPRECATED_VERSION
    // OPENING
    // PAIRING
    // PROXYBLOCK
    // SMB_TOS_BLOCK
    // TIMEOUT
    // TOS_BLOCK
    // UNLAUNCHED
    // UNPAIRED
    // UNPAIRED_IDLE
    client.onStateChange((state) => {
        console.log('State changed: ', state);
        // force whatsapp take over
        if ('CONFLICT'.includes(state)) client.useHere();
        // detect disconnect on whatsapp
        if ('UNPAIRED'.includes(state)) console.log('logout');
    })
    
    // DISCONNECTED
    // SYNCING
    // RESUMING
    // CONNECTED
    let time = 0
    client.onStreamChange((state) => {
        console.log('State Connection Stream: ' + state);
        clearTimeout(time);
        if (state === 'DISCONNECTED' || state === 'SYNCING') {
        time = setTimeout(() => {
            client.close();
        }, 80000);
        }
    })
    
    
    
    
}





