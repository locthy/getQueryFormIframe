const fs = require('fs');
const path = require('path');

// Function to extract and filter query parameters
function extractAndFilterQueryParams(url) {
    const hashIndex = url.indexOf('#');
    if (hashIndex === -1) {
        console.error('Invalid URL: No hash part found');
        return;
    }
    const hashPart = url.slice(hashIndex + 1);

    const tgWebAppDataIndex = hashPart.indexOf('tgWebAppData=');
    if (tgWebAppDataIndex === -1) {
        console.error('Invalid URL: No tgWebAppData parameter found');
        return;
    }
    const tgWebAppDataPart = hashPart.slice(tgWebAppDataIndex + 13);

    const decodedParams = decodeURIComponent(tgWebAppDataPart);

    const queryParams = decodedParams.split('&').map(param => param.split('=')).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});

    // Filter only the required keys
    const filteredKeys = ['query_id', 'user', 'auth_date', 'hash'];
    const filteredQueryParams = Object.entries(queryParams)
        .filter(([key]) => filteredKeys.includes(key))
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

    return filteredQueryParams;
}

// Read URL from iframe.txt
const iframePath = path.join(__dirname, 'iframe.txt');
fs.readFile(iframePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading iframe.txt:', err);
        return;
    }

    const url = data.trim();
    const queryParams = extractAndFilterQueryParams(url);

    if (queryParams) {
        // Write query parameters to query.txt
        const queryPath = path.join(__dirname, 'query.txt');
        fs.writeFile(queryPath, queryParams, 'utf8', err => {
            if (err) {
                console.error('Error writing to query.txt:', err);
                return;
            }
            console.log('Query parameters written to query.txt');
        });
    }
});
