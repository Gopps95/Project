import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as csv from "fast-csv";

interface ScrapedData {
  links: string[];
  text: string;
}

async function scrapeWebsite(url: string): Promise<ScrapedData> {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const links: string[] = [];
  $("a").each((index, element) => {
    const link = $(element).attr("href");
    if (link) {
      links.push(link);
    }
  });

  const text = $("body").html()?.toString().replace(/(<([^>]+)>)/gi, "") || "";

  return { links, text };
}

async function storeScrapedDataAsJSON(data: ScrapedData, filename: string): Promise<void> {
  const content = JSON.stringify(data);
  await fs.promises.writeFile(filename, content);
}

async function storeScrapedDataAsCSV(data: ScrapedData, filename: string): Promise<void> {
  const writeStream = fs.createWriteStream(filename);
  csv.writeToStream(writeStream, [data], { headers: true }).on("finish", () => {
    console.log(`Scraped data saved to ${filename}`);
  });
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("Please provide a URL as an argument");
    process.exit(1);
  }

  const data = await scrapeWebsite(url);
  const jsonFilename = "scraped-data.json";
  await storeScrapedDataAsJSON(data, jsonFilename);

  const csvFilename = "scraped-data.csv";
  await storeScrapedDataAsCSV(data, csvFilename);
}

main();
