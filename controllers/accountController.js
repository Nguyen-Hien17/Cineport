const accountService = require('../services/accountService');

exports.index = async (req, res) => {
    let userId = req.session.userId;

    let user = await accountService.getAccountDetails(userId);

    res.render('account', { user: user });
}

exports.export = async (req, res) => {
    let userId = req.session.userId;

    await accountService.exportWatchlist(userId);

    res.download(`./public/watchlist/${userId}-watchlist.json`);
};

exports.delete = async (req, res) => {
    let userId = req.session.userId;
    await accountService.deleteAccount(userId);

    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
}

exports.toggleAddon = async (req, res) => {
    const userId = req.session.userId;
    const { service, isEnabled } = req.body;

    // 1. Update the Database
    await accountService.setAddonStatus(userId, service, isEnabled);

    // 2. Update the Session (so the UI reflects the change on refresh)
    if (req.session.user && req.session.user.addOn) {
        const addon = req.session.user.addOn.find(a => a.service === service);

        if (addon) {
            // Update existing entry in session
            addon.isEnabled = isEnabled;
        } else {
            // If it didn't exist in session yet, push it
            req.session.user.addOn.push({ service, isEnabled });
        }

        // Explicitly tell express-session the data has changed
        req.session.save();
    }

    res.status(200).json({ message: 'Add-on status updated successfully' });
};