const axios = require('axios');

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
        name: info.title,
        summary: info.plot_overview,
        genre: info.genre_names,
        poster: info.poster,
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

    return title;
};


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
