const { to } = require('await-to-js');
const crypto = require('crypto');

const blogHash = {};

export const bytes2BlobUrl = (imgData) => {
    // make bytes has as array
    let arrayImg = new Uint8Array(Object.values(imgData.bytes));
    let blob = new Blob([arrayImg], { type: 'image/jpeg' });

    let urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
};

export const getFile = async (client, location) => {
    let inputLocation = location;
    if (!inputLocation) { return ''; }
    if (!inputLocation._ || inputLocation._ === 'fileLocation') {
        inputLocation = Object.assign({}, location, { _: 'inputFileLocation' });
    }

    const hash = crypto.createHash('sha1').update(JSON.stringify(location)).digest('hex');

    if (blogHash[hash]) {
        return blogHash[hash];
    }

    let [err, res] = await to(client('upload.getFile',
        {
            location: inputLocation,
            offset: 0,
            limit: 1024 * 1024,
        }, {
            dcID: location.dc_id,
            fileDownload: true,
            createNetworker: true,
            noErrorBox: true,
        }));

    if (err || !res) {
        blogHash[hash] = '';
        return '';
    }

    blogHash[hash] = bytes2BlobUrl(res);
    return blogHash[hash];
};
