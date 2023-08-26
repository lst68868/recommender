import { generatePrompt } from "../pages/api/generate"; // Adjust this import to the location of your function

describe("generatePrompt function", () => {
  it("should include details about ZooTools Acquire for waitlist goal", () => {
    const emailGoal = "waitlist";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Include details about ZooTools Acquire, the leading tool for creating waitlists and referral programs."
    );
  });

  it("should include details about ZooTools Acquire for referral goal", () => {
    const emailGoal = "referral";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Include details about ZooTools Acquire, the leading tool for creating waitlists and referral programs."
    );
  });

  it("should include details about ZooTools Acquire when goal mentions 'ZooTools Acquire'", () => {
    const emailGoal = "Zootools Acquire";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Include details about ZooTools Acquire, the leading tool for creating waitlists and referral programs."
    );
  });

  it("should include details about ZooTools Engage for email marketing goal", () => {
    const emailGoal = "email marketing";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Highlight ZooTools Engage for advanced email marketing with integrated virality."
    );
  });

  it("should include details about ZooTools Engage for engagement goal", () => {
    const emailGoal = "engagement";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Highlight ZooTools Engage for advanced email marketing with integrated virality."
    );
  });

  it("should include details about ZooTools Engage when goal mentions 'ZooTools Engage'", () => {
    const emailGoal = "Zootools Engage";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Highlight ZooTools Engage for advanced email marketing with integrated virality."
    );
  });

  it("should include details about ZooTools Pandas for forms goal", () => {
    const emailGoal = "forms";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Mention Zootools Pandas as an upgrade to traditional forms with powerful user segmentation capabilities."
    );
  });

  it("should include details about ZooTools Pandas for user segmentations goal", () => {
    const emailGoal = "user segmentations";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Mention Zootools Pandas as an upgrade to traditional forms with powerful user segmentation capabilities."
    );
  });

  it("should include details about ZooTools Pandas when goal mentions 'ZooTools Pandas'", () => {
    const emailGoal = "Zootools Pandas";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Mention Zootools Pandas as an upgrade to traditional forms with powerful user segmentation capabilities."
    );
  });
});
