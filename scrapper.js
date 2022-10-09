const puppeteer = require('puppeteer');
const url = process.argv[2];

async function scrap() {
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

  console.log(url);

  const page = await browser.newPage();
  await page.goto(url);

  const loadMoreSelector = '#load-more-trigger';
  for (let i = 0; i < 2; i++) {
    await page.waitForSelector(loadMoreSelector);
    await page.click(loadMoreSelector);
    await page.waitForTimeout(2000);
  }

  const reviewSelector = `#main > section > div.lister > div.lister-list > div`;

  const reviews = await page.$$eval(reviewSelector, (list) => {
    const results = [];
    for (let index = 0; index < list.length; index++) {
      const usernameSelector = `#main > section > div.lister > div.lister-list > div:nth-child(${
        index + 1
      }) > div.review-container > div.lister-item-content > div.display-name-date > span.display-name-link > a`;
      const headlineSelector = `#main > section > div.lister > div.lister-list > div:nth-child(${
        index + 1
      }) > div.review-container > div.lister-item-content > a`;
      const reviewSelector = `#main > section > div.lister > div.lister-list > div:nth-child(${
        index + 1
      }) > div.review-container > div.lister-item-content > div.content > div.text.show-more__control`;
      const timestampSelector = `#main > section > div.lister > div.lister-list > div:nth-child(${
        index + 1
      }) > div.review-container > div.lister-item-content > div.display-name-date > span.review-date`;

      const data = {
        username: document.querySelector(usernameSelector).textContent.trim(),
        headline: document.querySelector(headlineSelector).textContent.trim(),
        review: document.querySelector(reviewSelector).textContent.trim(),
        timestamp: document.querySelector(timestampSelector).textContent.trim(),
      };
      results.push(data);
    }

    return results;
  });

  console.log(reviews);
  console.log('Total Data:', reviews.length);

  await page.close();
  await browser.close();
}

scrap();
