import { Configuration, OpenAIApi } from "openai";

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

    // Extract the subject line
    const subjectLineMatch = text.match(/^Subject Line: (.+)$/m);
    const subjectLine = subjectLineMatch
      ? subjectLineMatch[1]
      : "Email from ZooTools";

    // Remove the subject line from the text
    text = text.replace(/^Subject Line: .+$/m, "");

    res.status(200).json({ result: text, subjectLine });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: { message: "An error occurred during your request." } });
  }
}

function generatePrompt(emailGoal) {
  return `You are a marketing assistant at ZooTools, a company that helps businesses grow their users with referral marketing, waitlists, referral programs, and gamified competitions. The user has provided the following goal for an email campaign: "${emailGoal}". Please craft an engaging email that aligns with this goal and highlights the benefits of ZooTools.`;
}
