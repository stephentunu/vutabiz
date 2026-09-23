# vutabiz

{
  "role": "You are a Senior Full-Stack Engineer and UI/UX Architect specializing in Kenyan e-commerce platforms and the Lovable.ai / Supabase stack.",
  "goal": "Build 'Vutabiz', a professional Kenyan marketplace for home appliances and building materials, featuring a high-end custom UI based on specific layout requirements and a 6-factor pricing engine.",
  "task": "Develop a full-stack React application with the following specifications: 1. HOME PAGE UI: Replicate the provided layout structure. Replace branding with 'Vutabiz'. Change background hero images from artifacts to high-quality Kenyan home appliances (fridges, kettles, solar panels). Adjust the 'Search Marketplace' bar positioning higher to ensure categories below it are fully visible. 2. AUTHENTICATION: User signup requiring Name, Email, Phone, and a hierarchical Kenyan Location Picker (County > Ward > Town > Building). 3. CATEGORIZATION: Taxonomy for Appliances (Sufurias, TVs, etc.) and Building Materials (Iron sheets, Sand, etc.) similar to Jiji.co.ke. 4. DYNAMIC PRICING: Implement an algorithm for ad fees based on Location, Distance, Market Share, Risk, Value, and Duration. 5. COUNTER-OFFER SYSTEM: Buyer makes an offer; Seller contact (Chat/Call) remains locked until the Seller clicks 'Accept'. 6. POST-PAYMENT FLOW: Trigger a 'Thank You' message with a dynamic shareable URL to the user's account/storefront. 7. ADMIN PANEL: Dashboard at /admin (Login: admins@gmail.com / adminpass1234) to monitor all site activity.",
  "input": "User visual preferences (Layout based on reference image) and functional requirements for a localized Kenyan trade platform.",
  "desiredOutput": {
    "format": "Functional Vite + Tailwind CSS + Supabase application code.",
    "criteria": [
      "UI must not look like standard AI templates; use professional typography and the specific color scheme from the reference image.",
      "The search bar must be elevated to prevent overlapping with category tiles.",
      "Mobile-first responsiveness is mandatory for the Kenyan smartphone market.",
      "Contact activation logic must be strictly tied to the 'Accept Offer' state."
    ],
    "validation": "Check that the dynamic URL in the thank-you message correctly redirects to the specific user's public profile.",
    "example": "A user uploads a 'Solar Panel' in 'Kisumu, Manyatta'; the system calculates a KSh 200 ad fee; once paid, the user gets a link 'vutabiz.com/user/store/123' to share on WhatsApp."
  },
  "temperature": 0.2,
  "tone": "Technical, precise, and design-oriented.",
  "audience": "Developers using Lovable.ai to generate production-ready code.",
  "guardrails": {
    "mustInclude": [
      "Kenyan 47 Counties database",
      "M-Pesa payment UI integration points",
      "Inventory toggle to 'Delete' or 'Mark as Sold'"
    ],
    "mustAvoid": [
      "Generic hero images",
      "Overlapping UI elements in the header",
      "Default Shadcn/UI styling without custom branding"
    ]
  },
  "verification": [
    "Is the search bar moved up as requested?",
    "Does the background show appliances instead of artifacts?",
    "Is the admin login functional with the provided credentials?"
  ]
}

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6ce7f7b9-ec68-492a-91d4-d08617c4f005).

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
