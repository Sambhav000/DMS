const mailjet = require('node-mailjet')

const trasporter = new mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC || '06bade4aafed3cff194ed8dc37a73b3c',
    apiSecret: process.env.MJ_APIKEY_PRIVATE || '74c023521899c98c2afa6206a1619500'
  });



 module.exports = function sendMail(email,title,body,html){
   const request = trasporter.post('send').request({
  FromEmail: 'documentmanagement019@gmail.com',
  FromName: 'Document Management System',
  Subject: title,
  'Text-part': body,
   'Html-part': html,
  Recipients: [{ Email: email }],
})
request
  .then(result => {
    console.log(result.body)
  })
  .catch(err => {
    console.log(err.statusCode)
  })
 }