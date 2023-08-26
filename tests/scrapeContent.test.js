import { scrapeContent } from "../pages/api/generate";

describe("scrapeContent function", () => {
  test("should scrape the content of a given URL", async () => {
    const url = "www.google.com";
    const expectedContent = expect(url).not.toEqual("");

    // Call the scrapeContent function with the test URL
    const content = await scrapeContent(url);

    // Check if the content matches the expected result
    expect(typeof content).toBe("string" || "object");
  }, 10000);
});
