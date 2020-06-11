const G = require('../../globals');
const Q = require('q');

class Dao{
    constructor(){
        this.db = G.DB;
    }

    addRecipients(list, cb){
        const collection = this.db.collection('recipients');
        collection.insertMany(list, (err, result)=>{
            console.log("Recipients added into the collection");
            cb(result);
        });
    }

    addCampaings(mail, cb){
        const collection = this.db.collection('campaings');
        collection.insert(mail, (err, result)=>{
            console.log("Campaings added");
            cb(result);
        });
    }

    getRecipients(cb){
        const collection = this.db.collection('recipients');
        collection.find({}).toArray((err, result)=>{
            console.log("Recipients returned");
            cb(result);
        });
    }

    getCampaings(cb){
        const collection = this.db.collection('campaings');
        collection.find({}).toArray((err, result)=>{
            console.log("Campaings returned");
            cb(result);
        });
    }

    campaignCounter(campaignId,cb){
        const collection = this.db.collection('campaings');
        collection.findOne({_id: campaignId}).toArray((err, result)=>{
            console.log("Campaings counter triggered");
            let updatedCounter = result[0].counter ? (result[0].counter + 1) : 1;
            collection.updateOne({ _id : campaignId }
                , { $set: { counter : updatedCounter } }, {upsert : true}, function(err, updatedResult) {
                console.log("Updated the counter of campaign");
                cb(updatedResult);
              });
        });
    }

    unsubscribeRecipient(campaignId,recipientId,cb){
        Q(undefined)
        .then(()=>{
            const collection = this.db.collection('recipients');
            collection.updateOne({ _id : recipientId }
                , { $set: { _Status : 'unsubscribed' } }, {upsert : true}, function(err, updatedResult) {
                console.log("unsubscribed successfully");
                return Q.resolve('');
              });
        })
        .then(()=>{
            const collection = this.db.collection('campaings');
            collection.findOne({_id: campaignId}).toArray((err, result)=>{
                console.log("Campaings unsubscribe counter triggered");
                let updatedCounter = result[0].unsubscribeCounter ? (result[0].unsubscribeCounter + 1) : 1;
                collection.updateOne({ _id : campaignId }
                    , { $set: { unsubscribeCounter : updatedCounter } }, {upsert : true}, function(err, updatedResult) {
                    console.log("Updated the counter of campaign");
                    cb('Successfully Unsubscribed');
                  });
            });
        })
        .fail(()=>{
            cb('Failed !! Please try again.');
        })
        .done();
    }

    getSubscribedRecipients(cb){
        const collection = this.db.collection('recipients');
        collection.find({_Status:'subscribed'}).toArray((err, result)=>{
            console.log("Recipients returned");
            cb(result);
        });
    }

}

module.exports = Dao;