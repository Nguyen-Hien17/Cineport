const axios = require('axios');

exports.getWatchlist = async (watchlist) => {
    const promises = [];

    for (let i = 0; i < watchlist.length; i++) {
        promises.push(axios.get(`https://api.watchmode.com/v1/title/${watchlist[i]}/details/?apiKey=${process.env.WATCHMODE_KEY}`));
    }

    const results = await Promise.all(promises);
    let shows = [];

    results.forEach(result => {
        let show = {
            id: result.data.imdb_id,
            title: result.data.title,
            image: result.data.poster
        }
        shows.push(show);
    })

    return shows;
}