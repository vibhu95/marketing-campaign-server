const G = require('../../globals');

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
}

module.exports = Dao;