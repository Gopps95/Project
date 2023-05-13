import axios from "axios"; // Importing axios library for making HTTP requests
import * as cheerio from "cheerio"; // Importing cheerio library for parsing HTML
import * as fs from "fs"; // Importing file system library for reading/writing files
import * as csv from "fast-csv"; // Importing fast-csv library for writing CSV files

// Defining the interface for the scraped data object
interface ScrapedData {
  links: string[]; // An array of links found on the page
  text: string; // The text content of the page, with HTML tags removed
}

// Async function that scrapes a website and returns a Promise with ScrapedData object
async function scrapeWebsite(url: string): Promise<ScrapedData> {
  const response = await axios.get(url); // Making an HTTP GET request to the URL using axios
  const html = response.data; // Saving the response data to a variable as HTML
  const $ = cheerio.load(html); // Using cheerio to load the HTML into a jQuery-like object

  const links: string[] = []; // Creating an empty array to store links found on the page
  $("a").each((index, element) => { // Looping through all the <a> elements on the page
    const link = $(element).attr("href"); // Extracting the "href" attribute from the element
    if (link) { // If the "href" attribute is not empty
      links.push(link); // Add the link to the links array
    }
  });

  const text = $("body").html()?.toString().replace(/(<([^>]+)>)/gi, "") || ""; // Extracting the text content from the <body> element, removing HTML tags

  return { links, text }; // Return the ScrapedData object
}

// Async function that saves the scraped data as a JSON file
async function storeScrapedDataAsJSON(data: ScrapedData, filename: string): Promise<void> {
  const content = JSON.stringify(data); // Convert the data object to a JSON string
  await fs.promises.writeFile(filename, content); // Write the JSON string to a file using the file system library
}

// Async function that saves the scraped data as a CSV file
async function storeScrapedDataAsCSV(data: ScrapedData, filename: string): Promise<void> {
  const writeStream = fs.createWriteStream(filename); // Create a write stream for the file using the file system library
  csv.writeToStream(writeStream, [data], { headers: true }).on("finish", () => { // Use fast-csv library to write the data object to the file as a CSV
    console.log(`Scraped data saved to ${filename}`); // Log a message to the console when the write stream finishes
  });
}

// Async function that serves as the entry point of the program
async function main() {
  const url = process.argv[2]; // Get the URL argument from the command line
  if (!url) { // If the URL argument is not provided
    console.error("Please provide a URL as an argument"); // Log an error message to the console
    process.exit(1); // Terminate the program with a non-zero exit code
  }

  const data = await scrapeWebsite(url); // Scrape the website and get the ScrapedData object
  const jsonFilename = "scraped-data.json"; // Define the filename for the JSON file
  await storeScrapedDataAsJSON(data, jsonFilename); // Save the scraped data as a json file

  const csvFilename = "scraped-data.csv";
  await storeScrapedDataAsCSV(data, csvFilename);
}

main();
