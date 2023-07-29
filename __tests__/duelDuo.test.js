const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });

  test("Test is clicking on draw shows up a div with the id of choices", async () => {
    const draw = await driver.findElement(By.id("draw"));
    await draw.click();
    const choices = await driver.findElement(By.id("choices"));
  
    const displayed = await choices.isDisplayed();
    expect(displayed).toBe(true);
  })

  test("Title shows up when page loads", async () => {
    const title = await driver.findElement(By.id("title"));
    const displayed = await title.isDisplayed();
    expect(displayed).toBe(true);
  });
})