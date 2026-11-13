import ContactForm from "./ContactForm";
import styles from "./contact.module.css";

export default function EmailCta() {
  return (
    <section id="enquiry" className={styles.enquiry} aria-labelledby="enquiry-title">
      <div className={styles.enquiryInner}>
        <div>
          <h2 id="enquiry-title" className={styles.enquiryTitle}>
            Send us your plot details
          </h2>
          <p className={styles.enquiryLead}>
            Write a few lines about your land. We reply by call or WhatsApp.
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
