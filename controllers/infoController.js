const infoService = require('../services/infoService');

exports.index = async (req, res) => {
    let info = await infoService.getTitleInfo(req.params.imdb_id);
    let status = await infoService.checkInWatchlist(req.session.userId, req.params.imdb_id);
    res.render('info', { info: info, status: status });
}