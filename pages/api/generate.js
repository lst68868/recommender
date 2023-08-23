import { Configuration, OpenAIApi } from 

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

  if (
    emailGoal.trim().length === 0 ||
    senderName.trim().length === 0 ||
    recipientName.trim().length === 0
  ) {
    res.status(400).json({ error: { message: "Please fill in all fields" } });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(emailGoal),
      temperature: 0.6,
      max_tokens: 500,
    });
    let text = completion.data.choices[0].text
      .replace(/\[Name\]/g, recipientName)
      .replace(/\[Your Name\]/g, senderName);

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

function generatePrompt(emailGoal) {
  let promptDetails = "";

  if (
    emailGoal.includes("waitlist") ||
    emailGoal.includes("referral") ||
    emailGoal.toLowerCase().includes("Zootools Acquire")
  ) {
    promptDetails +=
      " Include details about ZooTools Acquire, the #1 tool for creating waitlists and referral programs.";
  }
  if (
    emailGoal.includes("email marketing") ||
    emailGoal.includes("engagement") ||
    emailGoal.toLowerCase().includes("Zootools Engage")
  ) {
    promptDetails +=
      " Highlight ZooTools Engage for modern email marketing with built-in virality.";
  }
  if (
    emailGoal.includes("forms") ||
    emailGoal.includes("user segmentations") ||
    emailGoal.toLowerCase().includes("Zootools Pandas")
  ) {
    promptDetails +=
      " Mention Zootools Pandas for an alternative to old-fashioned forms and powerful user segmentations.";
  }

  return `You are a marketing assistant at ZooTools, a company that helps businesses grow their users with referral marketing, waitlists, referral programs, and gamified competitions. The user has provided the following goal for an email campaign: "${emailGoal}".${promptDetails} Please craft an engaging email that aligns with this goal and highlights the benefits of ZooTools. Provide a subject for the email with the format "Subject:"`;
}
