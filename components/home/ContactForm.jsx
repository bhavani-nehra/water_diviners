"use client";
import { useState } from "react";
import styles from "./contact.module.css";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", note: "" });
  const [state, setState] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (state === "sending") return;
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Message not sent. Check the fields and try again.");
        setState("idle");
        return;
      }
      setForm({ name: "", email: "", note: "" });
      setState("done");
    } catch {
      setError("No connection. Check your network and try again.");
      setState("idle");
    }
  };

  if (state === "done") {
    return (
      <p className={styles.done} role="status">
        Message sent. We will get back to you soon.
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.row}>
        <label>
          <span>Your name</span>
          <input name="name" value={form.name} onChange={change} maxLength={80} required disabled={state === "sending"} autoComplete="name" />
        </label>
        <label>
          <span>Email address</span>
          <input type="email" name="email" value={form.email} onChange={change} required disabled={state === "sending"} autoComplete="email" />
        </label>
      </div>
      <label>
        <span>Village, plot size and what you need</span>
        <textarea name="note" value={form.note} onChange={change} rows={4} maxLength={1000} required disabled={state === "sending"} />
      </label>
      <button type="submit" className={styles.send} disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
