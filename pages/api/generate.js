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
        ["image", "stylesheet", "font", "media", undefined].includes(
          req.resourceType()
        )
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
    console.log(content);
    await browser.close();
  } catch (error) {
    console.warn(
      "An error occurred while scraping the URL. Skipping scraping.",
      error
    );
  }
  console.log(content);
  return content;
}

export function trimUrl(url) {
  return url.replace(/\.com$/, "");
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
  const scrapeUrl = req.body.scrapeUrl || "";
  const emailTone = req.body.emailTone || "";

  console.log(req.body);

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
      prompt: generatePrompt(emailGoal, content),
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
  emailTone
) {
  let promptDetails = "";

  if (
    emailGoal.includes("waitlist") ||
    emailGoal.includes("referral") ||
    emailGoal.toLowerCase().includes("Zootools Acquire".toLocaleLowerCase())
  ) {
    promptDetails +=
      " Include details about ZooTools Acquire, the #1 tool for creating waitlists and referral programs.";
  }
  if (
    emailGoal.includes("email marketing") ||
    emailGoal.includes("engagement") ||
    emailGoal.toLowerCase().includes("Zootools Engage".toLocaleLowerCase())
  ) {
    promptDetails +=
      " Highlight ZooTools Engage for modern email marketing with built-in virality.";
  }
  if (
    emailGoal.includes("forms") ||
    emailGoal.includes("user segmentations") ||
    emailGoal.toLowerCase().includes("Zootools Pandas".toLocaleLowerCase())
  ) {
    promptDetails +=
      " Mention Zootools Pandas for an alternative to old-fashioned forms and powerful user segmentations.";
  }

  return `You are ${senderName}, a marketer for ZooTools, a company that helps businesses grow their users with referral marketing, waitlists, referral programs, and gamified competitions. This is your goal for an email you are writing: "${emailGoal}".${promptDetails}. This is the website of the person you are trying to market to: ${scrapeUrl}. Here is some information about the person you are marketing to: ${urlContent}. Please craft an engaging email that aligns with this goal, highlights the benefits of ZooTools, and makes use of the information provided about the person you are marketing to. The tone of your email should be ${emailTone}. When possible, use a sentence that begins with "Based on your website..." and references the information (${urlContent}) from their website ${scrapeUrl}. If there is no useful information provided, skip that step. Provide a subject for the email with the format "Subject:". Sign the email as ${senderName}. Important: do not ever return ANY placeholder content wrapped in brackets like [topic] or [website]. Never use the word "undefined". You want to sound like a human, not a robot.`;
}
