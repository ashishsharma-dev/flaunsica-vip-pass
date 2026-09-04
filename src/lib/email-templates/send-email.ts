import * as React from 'react'
import { render } from '@react-email/render'
import { Resend } from 'resend'
import { TEMPLATES } from './registry'

// Server-only: reads RESEND_API_KEY. Never import from client components.

const SITE_NAME = "Flaunsica VIP Pass"
const FROM_EMAIL = process.env.EMAIL_FROM || `${SITE_NAME} <noreply@notify.flaunsica.com>`

export type SendTemplateEmailResult =
  | { sent: true }
  | { sent: false; reason: string }

export interface SendTemplateEmailOptions {
  templateData?: Record<string, any>
  /** Dedupes retries of the same logical send. */
  idempotencyKey?: string
  replyTo?: string
}

/**
 * Renders a registered React Email template and sends it through Resend.
 */
export async function sendTemplateEmail(
  templateName: string,
  to: string,
  options: SendTemplateEmailOptions = {}
): Promise<SendTemplateEmailResult> {
  const apiKey = process.env['RESEND_API_KEY']
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY is not configured. Email send skipped.')
    return { sent: false, reason: 'api_key_missing' }
  }

  const template = TEMPLATES[templateName]
  if (!template) {
    throw new Error(
      `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(', ')}`
    )
  }

  // Template-level `to` takes precedence — notification templates always
  // send to their fixed address.
  const recipient = template.to || to
  if (!recipient) {
    throw new Error('Recipient is required (the template defines no fixed recipient)')
  }

  const templateData = options.templateData ?? {}
  const element = React.createElement(template.component, templateData)
  const html = await render(element)
  const text = await render(element, { plainText: true })
  const subject =
    typeof template.subject === 'function'
      ? template.subject(templateData)
      : template.subject

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: recipient,
    subject,
    html,
    text,
    headers: options.idempotencyKey ? { 'X-Entity-Ref-ID': options.idempotencyKey } : undefined,
    replyTo: options.replyTo || "vip@flaunsica.com",
  })

  if (error) {
    console.error('[Email] Resend delivery error:', error)
    return { sent: false, reason: error.message }
  }

  return { sent: true }
}
