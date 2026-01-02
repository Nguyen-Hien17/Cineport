const watchlistService = require('../services/watchlistService');

exports.index = async (req, res) => {
    let list = await watchlistService.getWatchlist(req.session.user.watchlist);
    res.render('watchlist',{watchlist: list});
};

exports.add = async (req, res) =>{
    let userId = req.session.userId;
    let status = req.query.watchStatus;
    let titleId = req.query.titleId;
    let episodesWatched = req.query.episodesWatched;

    console.log(episodesWatched)

    await watchlistService.addToWatchlist(userId, titleId, status, episodesWatched);

    res.redirect(`/info/${titleId}`);
}