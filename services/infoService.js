const axios = require('axios');
const { User } = require('../models/user');

exports.getTitleInfo = async (imdbID) => {

    const infoPromise = axios.get(
        `https://api.watchmode.com/v1/title/${imdbID}/details/?apiKey=${process.env.WATCHMODE_KEY}&append_to_response=episodes,sources&regions=US`
    );

    const sourceListPromise = axios.get(
        `https://api.watchmode.com/v1/sources/?apiKey=${process.env.WATCHMODE_KEY}`
    );

    const [infoRes, sourceListRes] = await Promise.all([infoPromise, sourceListPromise]);

    const info = infoRes.data;
    const sourceList = sourceListRes.data;

    let title = {
        id: info.id,
        name: info.title,
        summary: info.plot_overview,
        genre: info.genre_names,
        poster: info.poster,
        backdrop: info.backdrop,
        runtime: info.runtime_minutes,
        releaseYear: info.year,
        rating: info.user_rating,
        ...(info.episodes && { episodes: info.episodes })
    };

    let uniqueSources = getUniqueSources(info.sources);

    sourceList.sort((a, b) => a.id - b.id);

    let sources = [];

    uniqueSources.forEach(source => {
        let target = binarySearch(sourceList, source.source_id);

        sources.push({
            name: source.name,
            iosURL: source.ios_url,
            androidURL: source.android_url,
            webURL: source.web_url,
            logo: target ? target.logo_100px : null
        });
    });

    title.sources = sources;

    if (info.episodes) {
        title.episodes = info.episodes.map(ep => {
            let uniqueEpSources = getUniqueSources(ep.sources || []);

            let mappedEpSources = uniqueEpSources.map(src => {
                const target = binarySearch(sourceList, src.source_id);

                return {
                    name: src.name,
                    iosURL: src.ios_url,
                    androidURL: src.android_url,
                    webURL: src.web_url,
                    logo: target ? target.logo_100px : null
                };
            });

            return {
                ...ep,
                sources: mappedEpSources
            };
        });
    }

    return title;
};

exports.checkInWatchlist = async (userId, titleId) => {
    const filter = {
        _id: userId,
        'watchlist.titleId': titleId
    };

    // 2. Projection Criteria: Only return the 'watchlist' field, using $elemMatch to filter the array content.
    const projection = {
        watchlist: {
            $elemMatch: { titleId: titleId }
        },
        _id: 0 // Optional: exclude the user's main _id from the result
    };

    try {
        const result = await User.findOne(filter, projection).exec();

        if (result && result.watchlist && result.watchlist.length > 0) {
            return result.watchlist[0];
        } else {
            return null; // Return null if nothing matched the criteria
        }
    } catch (error) {
        console.error("Error fetching watchlist item:", error);
        throw error;
    }

}

function getUniqueSources(sources) {
    const seen = new Set();
    const result = [];

    for (const src of sources) {
        if (!seen.has(src.name)) {
            seen.add(src.name);
            result.push(src);
        }
    }

    return result;
}

function binarySearch(arr, targetId) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);

        if (arr[mid].id === targetId) {
            return arr[mid];
        }

        if (arr[mid].id < targetId) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return null;
}
