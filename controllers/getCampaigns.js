const Dao = require('../data/dao/common');

const getCampaigns = res => {
    const commonDao = new Dao();
    commonDao.getCampaings(data => {
        res.json(data);
    });
}

module.exports = getCampaigns;