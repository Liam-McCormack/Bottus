import puppeteer from 'puppeteer-extra';
import pluginStealth from 'puppeteer-extra-plugin-stealth'

import dotenv from 'dotenv'; 
import { Webhook } from 'discord-webhook-node';

// Configure dotenv to load environment variables
dotenv.config();
puppeteer.use(pluginStealth())
const hook = new Webhook(process.env.DISCORD);

// Function to create a random delay between 1 and 5 seconds
const delay = Math.floor(Math.random() * 5) + 1;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const targetEventURL = "https://www.twickets.live/en/event/1828748567179698176#sort=FirstListed&typeFilter=Any&qFilter=All";
const targetEventURL = "https://www.twickets.live/en/event/1796529798533615616#sort=FirstListed&typeFilter=Any&qFilter=All";

const updateDiscord = async (file, page, message) => {
  try {
    await page.screenshot({ path: "./screenshots/" + file }, { fullPage: true });
    console.log(message)
    hook.send(message);
    hook.sendFile("./screenshots/" + file);
  } catch (e) {
    console.log(e)
    process.exit(0)
  }
}

// Asynchronous main function to run the bot
const bottus = async () => {
  // Wait for a random delay between 1-5 seconds before proceeding
  await sleep(delay * 1000);

  // Function to check for tickets
  const checkTickets = async () => {
    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      headless: false, // Set to false if you want to see the browser
    });

    const page = await browser.newPage();
    await page.emulate({
      name: "Desktop 1024x1200",
      viewport: {
        width: 1024,
        height: 1200,
      },
    });

    try {
      await page.goto(
        targetEventURL,
        {
          waitUntil: "domcontentloaded",
        }
      );

      await page.evaluate(() => {
        const element = document.querySelector('.container');
        if (element) {
          element.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
        }
      })

      // Wait for the selector '.buy-button' to appear, with a 5-second timeout
      await page.waitForSelector(".buy-button", { timeout: 5000 });
      const buyButtonText = await page.$eval('.buy-button', el => el.innerText);
      console.log(buyButtonText, 'Buy Button Text')

      // If the selector is found, tickets are available
      if (buyButtonText === "BUY") {
        const priceString = await page.$eval('.no-of-ticket-summary', el => el.innerText);
        // const priceMatch = priceString.match(/[\d]+[.,]\d{2}/);

        // Extract the price if found
        // const price = priceMatch ? priceMatch[0] : null;
        console.log("Buy button found! Tickets are available. Alerting Bottus!");
        // await page.screenshot({path: "tickets/available.png"})

        await updateDiscord('available.png', page, `@everyone TICKETS AVAILABLE! ${priceString} BUY HERE - ${targetEventURL}`);
      }        
    } catch (error) {
      // Handle errors, especially TimeoutError when the selector is not found
      if (error.name === "TimeoutError") {
        console.log("No tickets found. Sleeping...");
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      // Ensure the browser is closed in all cases
      await browser.close();
    }
  };
  // Execute the checkTickets function
  await checkTickets();
};

// Execute the main function
bottus().catch((error) => {
  console.error("Error executing main function:", error);
});
