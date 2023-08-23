import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [emailGoal, setEmailGoal] = useState("");
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subjectLine, setSubjectLine] = useState("Hello From ZooTools");
  const [result, setResult] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
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
      setResult(
        data.result
          .replace(/\[Name\]/g, recipientName)
          .replace(/\[Your Name\]/g, senderName)
          .trim()
      );
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
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
            placeholder="Enter an email goal"
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
        <textarea
          className={styles.result}
          value={result}
          onChange={(e) => setResult(e.target.value)}
        />
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
          className={styles.mailButton}
          onClick={() => {
            // Clear all form data
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
      </main>
    </div>
  );
}
