global.fetch = require('node-fetch');

const fs = require('fs-extra');
const path = require('path');

try {
  require('../src/app/store/gallery/gallery.json');

  if (process.argv.length < 3 || process.argv[2] !== "--force") {
    console.log('Using existing gallery.json');

    return;
  }
} catch { }

const unsplash = require('unsplash-js');
const gallery = require('./gallery.json');

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const api = unsplash.createApi({ accessKey: ACCESS_KEY });

async function fetchPhoto(photoId) {
  const result = await api.photos.get({ photoId });

  if (result.type === 'success') {
    const res = result.response;

    const imageData = {
      url: res.urls.thumb,
      description: res.description,
      author: res.user.name,
      link: res.user.links.html
    };

    const { url } = imageData;
    const endQueryLength = '80&w=200'.length;

    const baseUrl = url.substring(0, url.length - endQueryLength);
    const thumbUrl = baseUrl + '50&w=75'; // 10x10 image!
    const paintingUrl = baseUrl + '40&w=200'; // 100x100 image!

    return { ...imageData, thumbUrl, paintingUrl };
  } else if (result.type === 'error') {
    throw Error(result.errors[0]);
  } else {
    throw Error('Couldn\'t fetch photos from unsplash.');
  }
}

function save(paintings) {
  const outputFile = path.join(__dirname, '../src/app/store/gallery/', 'gallery.json');

  fs.writeJsonSync(outputFile, {
    date: new Date().toISOString(),
    paintings
  });

  console.log("Gallery file saved in %s", outputFile);
}

async function start() {
  const paintings = [];

  for (const painting of gallery.paintings) {
    const p1 = await fetchPhoto(painting[0]);
    const p2 = await fetchPhoto(painting[1]);

    paintings.push({
      id: painting[0] + painting[1],

      images: [
        { thumb: p1.thumbUrl, painting: p1.paintingUrl },
        { thumb: p2.thumbUrl, painting: p2.paintingUrl }
      ],

      authors: [
        p1.author,
        p2.author
      ],

      links: [
        p1.link,
        p2.link
      ]
    });
  }

  save(paintings);
}

start();
