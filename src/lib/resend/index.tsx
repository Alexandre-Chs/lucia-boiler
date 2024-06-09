import { Resend } from "resend";
import Email from "./template/Welcome";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail() {
  try {
    const response = await resend.emails.send({
      from: "you@example.com",
      to: "alexandre@yopmail.com",
      subject: "hello world",
      react: <Email url="https://example.com" />,
    });
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
