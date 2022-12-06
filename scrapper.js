const puppeteer = require('puppeteer');
const url = process.argv[2];
const { stringify } = require('csv-stringify');
const { createWriteStream } = require('fs');

const columns = ['review', 'sentiment'];

async function scrap() {
  console.log('>>> Executed.');
  const browser = await puppeteer.launch({
    headless: true,
    waitUntil: 'documentloaded',
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process',
    ],
  });

  // csv stringifier
  const stringifier = stringify({ header: true, columns });

  console.log(url);

  const page = await browser.newPage();
  await page.goto(url);

  const loadMoreSelector = '#load-more-trigger';

  for (let i = 0; i < 9999; i++) {
    try {
      await page.waitForSelector(loadMoreSelector);
      await page.click(loadMoreSelector);
      await page.waitForTimeout(2000);
    } catch (error) {
      break;
    }
  }

  const titleSelector = `#main > section > div.subpage_title_block > div > div > h3 > a`;
  const titleElement = await page.$(titleSelector);
  const titleText = await (
    await titleElement.getProperty('textContent')
  ).jsonValue();

  const reviewSelector = `#main > section > div.lister > div.lister-list > div`;
  const reviews = await page.$$eval(reviewSelector, async (list) => {
    const results = [];
    for (let index = 0; index < list.length; index++) {
      const reviewSelector = `#main > section > div.lister > div.lister-list > div:nth-child(${
        index + 1
      }) > div.review-container > div.lister-item-content > div.content > div.text.show-more__control`;
      const ratingSelector = `#main > section > div.lister > div.lister-list > div:nth-child(${
        index + 1
      }) > div.review-container > div.lister-item-content > div.ipl-ratings-bar > span > span:nth-child(2)`;

      const ratingElement = document.querySelector(ratingSelector)?.textContent;

      if (ratingElement === null) {
        continue;
      }

      const rating = parseInt(ratingElement);
      let sentiment = '';
      if (rating > 6) {
        sentiment = 'positive';
      } else {
        sentiment = 'negative';
      }

      const data = {
        review: document.querySelector(reviewSelector).textContent.trim(),
        sentiment: sentiment,
      };
      results.push(data);
    }

    return results;
  });

  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];
    stringifier.write(review);
  }

  const title = titleText.replaceAll(' ', '_');
  const filename = `output/${title}.csv`;
  const writeableStream = createWriteStream(filename);
  stringifier.pipe(writeableStream);

  console.log('>>> Completed.');
  console.log('Total Data:', reviews.length);

  await page.close();
  await browser.close();
}

scrap();
