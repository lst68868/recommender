import { Configuration, OpenAIApi } from "openai";
import puppeteer from "puppeteer";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function scrapeContent(url) {
  let content = "";
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (
        ["image", "stylesheet", "font", "media"].includes(req.resourceType())
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto("https://" + url, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });

    content += await page.evaluate(() => document.body.innerText);
    await browser.close();
  } catch (error) {
    console.warn(
      "An error occurred while scraping the URL. Skipping scraping.",
      error
    );
    return null; // Return null in case of an error.
  }
  return content;
}

export default async function (req, res) {
  if (!configuration.apiKey) {
    res
      .status(500)
      .json({ error: { message: "OpenAI API key not configured" } });
    return;
  }

  const emailGoal = req.body.emailGoal || "";
  const senderName = req.body.senderName || "";
  const recipientName = req.body.recipientName || "";
  const recipientEmail = req.body.recipientEmail || "";
  const scrapeUrl = req.body.scrapeUrl || "";
  const emailTone = req.body.emailTone || "";

  if (
    emailGoal.trim().length === 0 ||
    senderName.trim().length === 0 ||
    recipientName.trim().length === 0
  ) {
    res.status(400).json({ error: { message: "Please fill in all fields" } });
    return;
  }

  try {
    const content = await scrapeContent(scrapeUrl);
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(
        emailGoal,
        content,
        scrapeUrl,
        senderName,
        recipientName,
        emailTone
      ),
      temperature: 0.7,
      max_tokens: 500,
    });

    let text = completion.data.choices[0].text
      .replace(/\[Name\]/g, recipientName)
      .replace(/\[Your Name\]/g, senderName)
      .replace(/\[Recipient\]/g, recipientName);
    const subjectLineMatch = text.match(/^Subject: (.+)$/m);
    const subjectLine = subjectLineMatch
      ? subjectLineMatch[1]
      : "Hello from ZooTools :)";

    text = text.replace(/^Subject: .+$/m, "");

    res.status(200).json({ result: text, subjectLine });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: { message: "An error occurred during your request." } });
  }
}

export function generatePrompt(
  emailGoal,
  urlContent,
  scrapeUrl,
  senderName,
  recipientName,
  emailTone
) {
  let promptDetails = "";

  if (
    emailGoal.includes("waitlist") ||
    emailGoal.includes("referral") ||
    emailGoal.toLowerCase().includes("Zootools Acquire".toLocaleLowerCase())
  ) {
    promptDetails +=
      " Include details about ZooTools Acquire, the leading tool for creating waitlists and referral programs.";
  }
  if (
    emailGoal.includes("email marketing") ||
    emailGoal.includes("engagement") ||
    emailGoal.toLowerCase().includes("Zootools Engage".toLocaleLowerCase())
  ) {
    promptDetails +=
      " Highlight ZooTools Engage for advanced email marketing with integrated virality.";
  }
  if (
    emailGoal.includes("forms") ||
    emailGoal.includes("user segmentations") ||
    emailGoal.toLowerCase().includes("Zootools Pandas".toLocaleLowerCase())
  ) {
    promptDetails +=
      " Mention Zootools Pandas as an upgrade to traditional forms with powerful user segmentation capabilities.";
  }

  let recipientPart = recipientName ? `${recipientName}` : "Hey there!";
  let basedOnWebsitePart =
    scrapeUrl && urlContent
      ? `Based on your website, ${scrapeUrl}, ${urlContent}`
      : "From our analysis of potential partners";

  return `As ${senderName}, a marketer at ZooTools, craft an email promoting our referral marketing, waitlists, referral programs, and gamified competitions to ${recipientPart}.
  
  Initial Info: ${basedOnWebsitePart}.
  Email Goal: ${emailGoal}
  Details: ${promptDetails}
  Desired Tone: ${emailTone}
  
  Guidelines:
  1. Incorporate any given information about the recipient's website.
  2. Highlight the benefits of ZooTools.
  3. Ensure a human-like tone.
  4. Start with "Subject:" followed by the email's subject.
  5. End the email with a signature: ${senderName}.
  6. Do not include bracketed content like [topic] or mention the word "undefined".
  `;
}
