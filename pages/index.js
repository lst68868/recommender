import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [emailGoal, setEmailGoal] = useState("");
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
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
        body: JSON.stringify({
          emailGoal,
          senderName,
          recipientName,
          recipientEmail,
          websiteUrl,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error.message);
        return;
      }

      setSubjectLine(data.subjectLine);
      setResult(data.result);
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    }
  }

  return (
    <div>
      <Head>
        <title>ZooTools Email Generator</title>
        <link rel="icon" href="/zootools.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the ZooTools Email Generator
        </h1>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="emailGoal"
            placeholder="Enter your email goal"
            value={emailGoal}
            onChange={(e) => setEmailGoal(e.target.value)}
            required
          />
          <input
            type="text"
            name="senderName"
            placeholder="Enter your name"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            required
          />
          <input
            type="text"
            name="recipientName"
            placeholder="Enter the recipient's name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            required
          />
          <input
            type="email"
            name="recipientEmail"
            placeholder="Enter the recipient's email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
          />
          <input
            type="text"
            name="websiteUrl"
            placeholder="Enter your website URL"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
          <button type="submit">Generate Email</button>
        </form>
        {result && (
          <div className={styles.result}>
            <h2>{subjectLine}</h2>
            <pre>{result}</pre>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>ZooTools - Helping businesses grow</p>
      </footer>
    </div>
  );
}
