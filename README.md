# Flaunsica VIP Pass

Act as an elite UI/UX designer and full-stack landing page developer. Build a luxury, mobile-first guest registration and VIP pass landing page for "Flaunsica Hyderabad – 10th Refined Edition".

### 1. Brand Identity & Aesthetic

- Brand: Flaunsica Hyderabad (curated by Aishwarya & Prestha)

- Tone: High-fashion, exclusive, editorial, luxurious, clean.

- Color Palette: Deep Crimson/Burgundy (#7B1113 / #8B1E22), Off-White/Alabaster (#FAF8F5), Crisp White (#FFFFFF), Warm Charcoal/Black (#1A1A1A), subtle Champagne/Gold accents.

- Typography: High-contrast Editorial Serif for headlines (Playfair Display / Cormorant Garamond / Bodoni) paired with clean geometric Sans-serif for body & form fields (Inter / Montserrat).

### 2. Page Structure & Copy

#### Hero Section

- Sub-badge: "10TH REFINED EDITION"

- Main Heading: "55+ Brands. One Curated Edit."

- Subheading: "Hyderabad's most coveted luxury designer trunk show returns to Park Hyatt. Experience hand-picked couture, bridal trousseau, fine jewelry, and contemporary pret — all under one roof."

- Event Meta Pills:

  - Date: 23 September 2026

  - Venue: Park Hyatt, Banjara Hills, Hyderabad

  - Access: Exclusive VIP Entry by RSVP

- Primary CTA: "Request VIP Invitation / RSVP Now" (smooth-scrolls to the form)

#### The Lead Magnet / Value Proposition Hook

- "Why Pre-Register?"

  - Priority VIP Entry (Fast-track queue via your personal digital QR Pass)

  - Curated Preview Access to 55+ premier designer labels

  - Direct styling and custom bridal trousseau consults

#### Guest Registration Form (Lead Capture)

Design a high-converting, single-column, minimalist luxury form with subtle micro-interactions:

1. Full Name (Text input)

2. WhatsApp / Mobile Number (Tel input with +91 default)

3. Email Address (Email input)

4. Are you a bride? (Toggle / Pill selection: [Yes] [No])

5. Purpose of Visit (Multi-pill or Radio select):

   - Wedding Shopping

   - Trousseau

   - Casual Shopping

   - Workwear

6. Who are you attending with? (Pill selection):

   - Just me

   - Friends

   - Family

7. What are you most likely to buy? (Multi-select check pills):

   - Jewellery

   - Clothing

   - Accessories

### 3. Submission & Verification Flow (Interactive Logic)

1. Step 1: User fills the form details above and clicks "Get My VIP QR Pass".

2. Step 2 (Mobile OTP Verification): A clean modal / inline state appears: "Enter the 4-digit code sent to your WhatsApp/SMS to verify your pass."

3. Step 3 (Confirmation & QR Generation):

   - Upon successful OTP submission, show a sleek "Digital VIP Invitation Pass" card on screen.

   - The card displays:

     - Flaunsica logo & "10th Refined Edition" badge

     - Attendee Name, Contact details, Category (e.g., Bride / Wedding Shopper)

     - A dynamically generated QR Code (encodes the guest details JSON payload or check-in verification URL).

     - Notice: "A copy of this digital entry QR pass has been dispatched via WhatsApp to [User Number] and emailed to [User Email]."

     - Action buttons: "Download QR Pass (PNG/PDF)" and "Add to Apple/Google Wallet / Calendar".

### 4. Technical / UI Guidelines

- Ensure full mobile responsiveness (most traffic arrives from Instagram/Meta ads).

- Inputs should have floating labels or clean border-bottom luxury line styling with smooth focus animations.

- Output clean, accessible, semantic HTML/Tailwind CSS with fully functioning React/JS state transitions for the form steps.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6bdcd211-928b-4319-845e-cfdf58f332a6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
