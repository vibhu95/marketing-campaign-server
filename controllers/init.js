const Q = require('q');
const G = require('../globals');
const sendGrid = require("@sendgrid/mail");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const Dao = require('../data/dao/common');
const cron = require('node-cron');

const _init = ()=>{
    Q(undefined)
    .then(()=>{
        return _initConfig()
    })
    .then(()=>{
        return _initMailer()
    })
    .then(()=>{
        return _initMongoConnection()
    })
    .then(()=>{
        return _initCronJobs()
    })
    .fail((err)=>{
        console.error(err);
    })
    .done();
}

function _initConfig(){
    const config = require(`../data/config/${process.env.NODE_ENV.toLowerCase()}`);
    G.congif = config;
    return Q.resolve();
}

function _initMailer(){
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    G.mailer = sendGrid;
    return Q.resolve();
}

function _initMongoConnection(){
    const mongoConfig = G.congif.mongo;
    MongoClient.connect(mongoConfig.url, {useUnifiedTopology:true}, (err,client)=>{
        assert.equal(null, err);
        console.log('Successfully Connected');
        const db = client.db(mongoConfig.database);
        G.DB = db;
        G.mongoClient = client;
        return Q.resolve();
    });
}

function _initCronJobs(){
    const commonDao = new Dao();
    Q(undefined)
    .then(()=>{
        commonDao.getSubscribedRecipients(result=>{
            return result;
        });
    }).then(recipients => {
        commonDao.getCampaings(result => {
            result.forEach(element => {

                let mailCounter = `${G.congif.global.host}/auth/${element._id}/counter`;

                cron.schedule(`* * * * ${element.scheduler}`,()=>{
                    recipients.map(recipient=>{
                        let unsubscribeUrl = `${G.congif.global.host}/auth/${element._id}/${recipient._id}/unsubscribe`;
                        const msg = {
                            to: recipient._Email,
                            from: 'vibhuti@antrepriz.com',
                            subject: element.subject,
                            // text: element.mail,
                            html: `<h2>Hi , ${recipient._Name}</h2><h4>${element.mail}</h4><img width='5px' height='5px' src='${mailCounter}'/><a href='${unsubscribeUrl}'>unsubscribe</a>`,
                          };
                          (async () => {
                            try {
                              await G.mailer.send(msg);  // we can use sendMultiple as well if unsubcribe is not required
                            } catch (error) {
                              console.error(error);
                          
                              if (error.response) {
                                console.error(error.response.body)
                              }
                            }
                          })();
                    });
                });
            });
        });
    }).fail(()=>{

    }).done();
}

module.exports = _init;