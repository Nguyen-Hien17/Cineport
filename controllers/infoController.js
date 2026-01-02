const infoService = require('../services/infoService');

exports.index = async (req, res) => {
    // 1. Determine the region.
    // Priority: Query Param -> User Session -> Default to 'US'
    const region = req.query.region || req.session.region || 'US';

    // 2. Pass the region to the service
    let info = await infoService.getTitleInfo(req.params.imdb_id, region, req.session.user);

    // 3. Check watchlist status (usually independent of region)
    let status = await infoService.checkInWatchlist(req.session.userId, req.params.imdb_id);

    // 4. Render with info, status, and the current region (useful for UI dropdowns)
    res.render('info', {
        info: info,
        status: status,
        region: region,
        user: req.session.userId
    });
}