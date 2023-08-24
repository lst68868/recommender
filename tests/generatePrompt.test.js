import { generatePrompt } from "../pages/api/generate"; // Adjust this import to the location of your function

describe("generatePrompt function", () => {
  it("should include details about ZooTools Acquire for referral goal", () => {
    const emailGoal = "waitlist";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Include details about ZooTools Acquire, the #1 tool for creating waitlists and referral programs."
    );
  });

  it("should include details about ZooTools Acquire for referral goal", () => {
    const emailGoal = "referral";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Include details about ZooTools Acquire, the #1 tool for creating waitlists and referral programs."
    );
  });

  it("should include details about ZooTools Acquire for referral goal", () => {
    const emailGoal = "zootools acquire";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Include details about ZooTools Acquire, the #1 tool for creating waitlists and referral programs."
    );
  });

  it("should include Highlight ZooTools Engage for modern email marketing with built-in virality.", () => {
    const emailGoal = "email marketing";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Highlight ZooTools Engage for modern email marketing with built-in virality."
    );
  });

  it("should include Highlight ZooTools Engage for modern email marketing with built-in virality.", () => {
    const emailGoal = "engagement";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Highlight ZooTools Engage for modern email marketing with built-in virality."
    );
  });

  it("should include Highlight ZooTools Engage for modern email marketing with built-in virality.", () => {
    const emailGoal = "Zootools Engage";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Highlight ZooTools Engage for modern email marketing with built-in virality."
    );
  });

  it("should include Mention Zootools Pandas for an alternative to old-fashioned forms and powerful user segmentations.", () => {
    const emailGoal = "forms";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Mention Zootools Pandas for an alternative to old-fashioned forms and powerful user segmentations."
    );
  });

  it("should include Mention Zootools Pandas for an alternative to old-fashioned forms and powerful user segmentations.", () => {
    const emailGoal = "user segmentations";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Mention Zootools Pandas for an alternative to old-fashioned forms and powerful user segmentations."
    );
  });

  it("should include Mention Zootools Pandas for an alternative to old-fashioned forms and powerful user segmentations.", () => {
    const emailGoal = "Zootools Pandas";
    const result = generatePrompt(emailGoal);
    expect(result).toContain(
      "Mention Zootools Pandas for an alternative to old-fashioned forms and powerful user segmentations."
    );
  });
});
