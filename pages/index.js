import Head from "next/head";
import { useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";
import styles from "./index.module.css";

const override = {
  display: "block",
  margin: "89px auto",
  borderColor: "red",
};

export default function Home() {
  let [color, setColor] = useState("#10a37f");
  const [emailGoal, setEmailGoal] = useState("");
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subjectLine, setSubjectLine] = useState("Hello From ZooTools");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [emailTone, setEmailTone] = useState("");

  function addToEmailGoal(textToAdd) {
    setEmailGoal(emailGoal + " " + textToAdd);
  }

  function addToRecipientEmail(emailDomain) {
    setRecipientEmail(recipientEmail + emailDomain);
  }

  function addToEmailTone(emailTone) {
    setEmailTone(emailTone);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailGoal,
          senderName,
          recipientName,
          scrapeUrl,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      const extractedSubjectLine = data.subjectLine || "Hello from ZooTools :)";
      setSubjectLine(extractedSubjectLine);
      setResult(data.result.trim());
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>ZooTools Email Generator</title>
        <link rel="icon" href="/zootools.png" />
      </Head>

      <main className={styles.main}>
        <img src="/zootools.png" className={styles.icon} />
        <h3>Generate your Email</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="emailGoal"
            placeholder="What is the goal of this email?"
            value={emailGoal}
            onChange={(e) => setEmailGoal(e.target.value)}
          />
          <div className={styles.buttonRowContainer}>
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.mailButton}
                onClick={() =>
                  addToEmailGoal(
                    "Convince the recipient to sign up for Zootools."
                  )
                }
              >
                Convince to sign up
              </button>
              <button
                type="button"
                className={styles.mailButton}
                onClick={() =>
                  addToEmailGoal(
                    "I'm trying to upsell an existing ZooTools user."
                  )
                }
              >
                Upsell existing user
              </button>
            </div>
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.mailButton}
                onClick={() =>
                  addToEmailGoal(
                    "Convince the recipient to buy a ZooTools product."
                  )
                }
              >
                Convince to buy
              </button>
              <button
                type="button"
                className={styles.mailButton}
                onClick={() =>
                  addToEmailGoal(
                    "I want to get a former ZooTools customer back"
                  )
                }
              >
                Regain customer
              </button>
            </div>
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.mailButton}
                onClick={() =>
                  addToEmailGoal("I want to help onboard a new Zootools user.")
                }
              >
                Onboard new user
              </button>
              <button
                type="button"
                className={styles.mailButton}
                onClick={() =>
                  addToEmailGoal("I want to share a Zootools product update.")
                }
              >
                Share product update
              </button>
            </div>
          </div>
          <input
            type="text"
            name="emailTone"
            placeholder="What is the tone of this email?"
            value={emailTone}
            onChange={(e) => addToEmailTone(e.target.value)}
          />
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.mailButton}
              onClick={() => addToEmailTone("Formal")}
            >
              Formal
            </button>
            <button
              type="button"
              className={styles.mailButton}
              onClick={() => addToEmailTone("Casual")}
            >
              Casual
            </button>
          </div>
          <input
            type="text"
            name="scrapeUrl"
            placeholder="Recipient's website, e.g. zootools.com"
            value={scrapeUrl}
            onChange={(e) => setScrapeUrl(e.target.value)}
          />
          <input
            type="text"
            name="senderName"
            placeholder="Enter your name"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
          <input
            type="text"
            name="recipientName"
            placeholder="Enter the recipient's name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
          <input
            type="text"
            name="recipientEmail"
            placeholder="Enter the recipient's email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.mailButton}
              onClick={() => addToRecipientEmail("@gmail.com")}
            >
              ...@gmail.com
            </button>
            <button
              type="button"
              className={styles.mailButton}
              onClick={() => addToRecipientEmail("@outlook.com")}
            >
              ...@outlook.com
            </button>
          </div>
          {!loading && <input type="submit" value="Generate email" />}
        </form>

        {loading ? (
          <>
            <PacmanLoader
              color={color}
              classname={styles.pacmanloader}
              loading={loading}
              cssOverride={override}
              size={30}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <h4>Scraping for relevant data from your target company... </h4>
            <h4>If the target site doesn't allow scraping, don't worry!</h4>
            <h4>
              We'll still return a custom AI-generated email, just without that
              added content.
            </h4>
          </>
        ) : (
          <textarea
            className={`${styles.result} ${
              loading ? styles.loadingMessage : ""
            }`}
            placeholder={
              'Your email will appear here. You can edit the text directly or click "send email" to edit and send from your default email provider.'
            }
            value={result}
            onChange={(e) => setResult(e.target.value)}
            readOnly={loading}
          />
        )}

        {!loading && (
          <div className={styles.buttonContainer}>
            <button
              className={styles.mailButton}
              onClick={() =>
                window.open(
                  `mailto:${recipientEmail}?subject=${encodeURIComponent(
                    subjectLine
                  )}&body=${encodeURIComponent(result)}`,
                  "_blank"
                )
              }
            >
              Send Email
            </button>
            <button
              className={styles.clearButton}
              onClick={() => {
                setEmailGoal("");
                setSenderName("");
                setRecipientName("");
                setRecipientEmail("");
                setSubjectLine("Hello From ZooTools");
                setResult("");
              }}
            >
              Clear Form
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
