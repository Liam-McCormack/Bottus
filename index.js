import puppeteer from "puppeteer";

const checkTickets = async () => {
  const browser = await puppeteer.launch({
    headless: true,  // Set to false to see the browser
    defaultViewport: null,
  });

  //Proxy devices and ip

  const page = await browser.newPage();

  try {
    await page.goto(
      "https://www.twickets.live/en/event/1828748567179698176#sort=FirstListed&typeFilter=Any&qFilter=All",
      {
        waitUntil: "domcontentloaded",
      }
    );

    // await page.goto(
    //   "https://www.twickets.live/en/event/1820124064153346048#sort=FirstListed&typeFilter=Any&qFilter=All",
    //   {
    //     waitUntil: "domcontentloaded",
    //   }
    // );

    // Wait for the selector '.buy-button' to appear, with a 10-second timeout
    await page.waitForSelector('.buy-button', { timeout: 5000 }); // 10 seconds

    // If we reach this point, the selector was found
    console.log('Buy button found! Tickets are available. Alerting Bottus!');
    //NOTIFY DISCORD

  } catch (error) {
    // If the selector was not found within the timeout period, handle the error
    if (error.name === 'TimeoutError') {
      console.log('No tickets found or the buy button did not appear. Closing...');
    } else {
      console.error('An unexpected error occurred:', error);
    }
  } finally {
    await browser.close();
  }
};

// Start the scraping
checkTickets();
