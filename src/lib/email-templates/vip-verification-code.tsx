import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  name?: string;
  code?: string;
}

const Email = ({ name, code }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`${code ?? "----"} is your Flaunsica VIP verification code`}</Preview>
    <Body style={main}>
      <Container style={wrapper}>
        <Container style={header}>
          <Text style={brand}>FLAUNSICA</Text>
          <Text style={edition}>10TH REFINED EDITION · HYDERABAD</Text>
        </Container>
        <Container style={content}>
          <Heading style={heading}>Verify Your VIP Registration</Heading>
          <Text style={text}>{name ? `Hi ${name},` : "Hi there,"}</Text>
          <Text style={muted}>
            Use this code to verify your VIP registration. It works for both
            your mobile number and email address.
          </Text>
          <Text style={codeStyle}>{code ?? "----"}</Text>
          <Text style={muted}>This code expires in 10 minutes.</Text>
        </Container>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `${data["code"] ?? "----"} is your Flaunsica VIP verification code`,
  displayName: "VIP verification code",
  previewData: { name: "Aisha", code: "4821" },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, Helvetica, sans-serif" };
const wrapper = {
  maxWidth: "520px",
  margin: "0 auto",
  border: "1px solid #eee",
  borderRadius: "8px",
  overflow: "hidden",
};
const header = {
  backgroundColor: "#7B1113",
  padding: "24px",
  textAlign: "center" as const,
};
const brand = {
  color: "#FAF8F5",
  fontFamily: "Georgia, serif",
  fontSize: "24px",
  letterSpacing: "4px",
  margin: "0",
};
const edition = {
  color: "#FAF8F5",
  fontSize: "11px",
  letterSpacing: "2px",
  opacity: 0.85,
  margin: "6px 0 0",
};
const content = { padding: "28px", textAlign: "center" as const };
const heading = {
  color: "#1A1A1A",
  fontFamily: "Georgia, serif",
  fontSize: "22px",
  margin: "0 0 16px",
};
const text = { color: "#1A1A1A", margin: "0 0 8px" };
const muted = { color: "#6B6B6B", fontSize: "13px", margin: "0 0 20px" };
const codeStyle = {
  color: "#1A1A1A",
  fontFamily: "Georgia, serif",
  fontSize: "38px",
  letterSpacing: "12px",
  margin: "0 0 20px",
};
