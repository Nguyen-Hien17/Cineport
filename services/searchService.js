const axios = require('axios');

exports.searchByKeyword = async (keyword) => {
    let results = await axios.get(`
        https://api.watchmode.com/v1/search/?apiKey=${process.env.WATCHMODE_KEY}&search_field=name&search_value=${keyword}`);

    let titleResults = results.data.title_results;

    const promises = [];

    // watchlist is now an array of objects: { titleId, status }
    for (let i = 0; i < titleResults.length; i++) {
        const id = titleResults[i].id;

        // skip if no titleId just in case
        if (!id) continue;

        promises.push(
            axios.get(`https://api.watchmode.com/v1/title/${id}/details/?apiKey=${process.env.WATCHMODE_KEY}`)
        );
    }

    const responses = await Promise.all(promises);

    const titles = responses.map((result, index) => ({
        id: result.data.id,
        title: result.data.title,
        image: result.data.poster
    }));

    return titles;
}