const axios = require('axios');
const { User } = require('../models/user');

exports.getWatchlist = async (watchlist) => {
    const promises = [];

    // watchlist is now an array of objects: { titleId, status }
    for (let i = 0; i < watchlist.length; i++) {
        const id = watchlist[i].titleId;

        // skip if no titleId just in case
        if (!id) continue;

        promises.push(
            axios.get(`https://api.watchmode.com/v1/title/${id}/details/?apiKey=${process.env.WATCHMODE_KEY}`)
        );
    }

    const results = await Promise.all(promises);

    // Build result array with status included
    const shows = results.map((result, index) => ({
        id: result.data.imdb_id,
        title: result.data.title,
        image: result.data.poster,

        // attach the user's status from watchlist[index]
        status: watchlist[index].status
    }));

    return shows;
};

exports.addToWatchlist = async (userId, titleId, status) => {
    // 1. Check if the title already exists in the watchlist
    // 2. If it exists, update its status
    // 3. If it doesn't exist, push a new entry to the watchlist

    const doc = await User.updateOne(
        {
            _id: userId,
            // Check if the titleId already exists in the watchlist array
            "watchlist.titleId": titleId
        },
        {
            // If the filter (above) matches (title exists), $set the new status.
            // The arrayFilters specifies which element to update.
            $set: { "watchlist.$.status": status }
        }
    );

    // If doc.matchedCount is 0, it means the title was NOT found in the watchlist.
    if (doc.matchedCount === 0) {
        // The title does not exist, so we use the $push operator to add a new entry.
        await User.updateOne(
            { _id: userId },
            {
                $push: {
                    watchlist: { titleId: titleId, status: status }
                }
            }
        );
    }
}