import puppeteer from 'puppeteer-extra';


import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin())

// Function to create a random delay between 1 and 5 seconds
const delay = Math.floor(Math.random() * 5) + 1;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const targetEvent = "https://www.twickets.live/en/event/1828748567179698176#sort=FirstListed&typeFilter=Any&qFilter=All";
const targetEvent = "https://www.twickets.live/en/event/1796529798533615616#sort=FirstListed&typeFilter=Any&qFilter=All";

const sendMessage = async (price) => {
  console.log(`Sending a message and price ${price}!`)
}


// Asynchronous main function to run the bot
const bottus = async () => {
  // Wait for a random delay between 1-5 seconds before proceeding
  await sleep(delay * 1000);

  // Function to check for tickets
  const checkTickets = async () => {
    const browser = await puppeteer.launch({
      headless: false, // Set to false if you want to see the browser
      defaultViewport: null,
    });

    const page = await browser.newPage();

    try {
      await page.goto(
        targetEvent,
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

      // If the selector is found, tickets are available
      console.log("Buy button found! Tickets are available. Alerting Bottus!");

      await page.screenshot({path: "tickets/tickets-available.png"})

      const price = await page.evaluate(() => {
        return document.querySelectorAll('.no-of-ticket-summary strong')[1].innerText;
      })
      sendMessage(price);
      

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
