import Head from "next/head";
import { useState, CSSProperties } from "react";
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

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailGoal, senderName, recipientName }),
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
          <input type="submit" value="Generate email" />
        </form>

        {loading ? (
          <PacmanLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
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
      </main>
    </div>
  );
}
