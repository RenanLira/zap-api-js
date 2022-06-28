const venom = require('venom-bot');
const fs = require('fs');
const path = require('path')
const mime = require('mime-types');


const lista = require('./lista')

venom.create({
    session: 'renan'
}).then(client => start(client))
.catch(erro => console.log(erro))



const start = (client) => {
    client.onAnyMessage( async (message) => {
        console.log(message)
        if ( message.text == 'oi' ) {
            
            await client.sendListMenu(message.from, 'Title', 'subTitle', 'Description', 'menu', lista)
              .then((result) => {
                console.log('Result: ', result); //return object success
              })
              .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
              });
        }

        if ( message.isGroupMsg == false && message.type === 'image') {

            console.log(message)

            const buffer = await client.decryptFile(message);
             // At this point you can do whatever you want with the buffer
             // Most likely you want to write it into a file
            const fileName = `${message.from}.${mime.extension(message.mimetype)}`;
            await fs.writeFileSync('images/' + fileName, buffer)

            await client.sendImageAsSticker(message.from, `${__dirname}/images/${fileName}`)
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
            });
        }
    })
}