const Dao = require('../data/dao/common');

const getRecipients = res => {
    const commonDao = new Dao();
    commonDao.getRecipients(data => {
        res.json(data);
    });
}

module.exports = getRecipients;