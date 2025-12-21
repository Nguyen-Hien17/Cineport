const accountService = require('../services/accountService');

exports.index = async (req, res) => {
    let userId = req.session.userId;

    let user = await accountService.getAccountDetails(userId);

    res.render('account', { user: user });
}