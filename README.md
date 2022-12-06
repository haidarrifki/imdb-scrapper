# imdb-scrapper
this tool that can be used to extract data from the IMDB website. This data can include information about title movies and reviews. The scraper can be used to collect data for research, analysis, or personal use.

To use this tool, you will need to provide the URL reviews of the IMDB page that you want to scrape. The scraper will then extract the relevant data from the page and present it in a structured format, such as a CSV file. You can then use this data for further analysis or to create a custom database of IMDB information.

The IMDB scrapper is easy to use and can save you a lot of time and effort compared to manually collecting data from the IMDB website. It is a valuable tool for anyone who needs to work with IMDB data on a regular basis.

## Prerequisites
- Node.js >= v16.14.2

## Library
- [csv](https://www.npmjs.com/package/csv)
- [puppeteer](https://www.npmjs.com/package/puppeteer)

## How To
- ```yarn install``` or ```npm install```
- ```node scrapper.js [url movie review]```
- eg: ```node scrapper.js https://www.imdb.com/title/tt0468820/reviews```

## References
this project is related to:
- [Dashboard Sentiment Analyzer](https://github.com/haidarrifki/dashboard-sentiment-analyzer)
- [Movie Review Sentiment](https://github.com/haidarrifki/movie-review-sentiment)