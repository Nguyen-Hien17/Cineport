const watchlistService = require('../services/watchlistService');

exports.index = async (req, res) => {
    let list = await watchlistService.getWatchlist(req.session.user.watchlist);
    res.render('watchlist',{watchlist: list});
};