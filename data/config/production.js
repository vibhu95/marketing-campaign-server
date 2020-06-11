let config = {
    "mongo":{
        "host":"cluster0-shard-00-00-lnl2v.mongodb.net",
        "port":"27017",
        "url":"mongodb://vibhuti:qwerty12345@cluster0-shard-00-00-lnl2v.mongodb.net:27017,cluster0-shard-00-01-lnl2v.mongodb.net:27017,cluster0-shard-00-02-lnl2v.mongodb.net:27017/gerald_assignment?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",
        "database":"gerald_assignment"
    },
    "global":{
        "host":'https://hackbug.herokuapp.com'
    }
}

module.exports = config;