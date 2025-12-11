const searchService = require('../services/searchService');

exports.index = async (req, res) => {
    let keyword = req.query.keyword;
    let results = await searchService.searchByKeyword(keyword);

    res.render('search', { results: results });
}