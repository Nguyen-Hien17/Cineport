const { User } = require('../models/user');
const axios = require('axios');
const fs = require('fs');

exports.getAccountDetails = async (id) => {
    const user = await User.findOne({ _id: id });

    return user;
}

exports.exportWatchlist = async (userId) => {
    const user = await User.findOne({ _id: userId });
    let watchlist = user.watchlist;

    const promises = [];

    for (let i = 0; i < watchlist.length; i++) {
        const id = watchlist[i].titleId;

        // skip if no titleId just in case
        if (!id) continue;

        promises.push(
            axios.get(`https://api.watchmode.com/v1/title/${id}/details/?apiKey=${process.env.WATCHMODE_KEY}`)
        );
    }

    const results = await Promise.all(promises);

    const watchlistData = results.map(result => result.data);

    // Write the entire array to the file once
    // Using '2' as the third argument creates a clean, readable 2-space indentation
    const jsonString = JSON.stringify(watchlistData, null, 2);

    fs.writeFileSync(`./public/watchlist/${userId}-watchlist.json`, jsonString);
};