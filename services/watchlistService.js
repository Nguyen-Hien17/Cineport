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
        id: result.data.id,
        title: result.data.title,
        image: result.data.poster,

        // attach the user's status from watchlist[index]
        status: watchlist[index].status
    }));

    return shows;
};

exports.addToWatchlist = async (userId, titleId, status, progress) => {
    // 1. Prepare the progress string (e.g., "S1:E5")
    // Default to S1:E0 if not provided
    const progressString = `${progress || "S1:E0"}`;

    // 2. Try to update an existing entry
    const doc = await User.updateOne(
        {
            _id: userId,
            "watchlist.titleId": titleId
        },
        {
            $set: {
                "watchlist.$.status": status,
                "watchlist.$.episodesWatched": progressString 
            }
        }
    );

    // 3. If no match found, push a new entry
    if (doc.matchedCount === 0) {
        await User.updateOne(
            { _id: userId },
            {
                $push: {
                    watchlist: {
                        titleId: titleId,
                        status: status,
                        episodesWatched: progressString
                    }
                }
            }
        );
    }
};