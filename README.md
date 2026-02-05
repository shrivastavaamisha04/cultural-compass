# 🧭 Cultural Compass

**Navigate unfamiliar social situations with confidence. Get real-time etiquette guidance anywhere in the world.**

[View Live App](https://ai.studio/apps/drive/1-RkYk8qK8vyscOlqganlybNczSlhyDSm)

## The Problem

Traveling to a new country or moving to a new culture comes with invisible rules: When should you tip? Is it rude to refuse food? Should you take off your shoes? How do you greet someone properly?

**The result?** Awkward moments, unintentional offense, and the constant anxiety of "am I doing this right?"

Even locals face this when attending unfamiliar events—business dinners, religious ceremonies, formal gatherings—where the expected behavior isn't always obvious.

## The Solution

Cultural Compass is an AI-powered Progressive Web App (PWA) that provides instant, context-aware etiquette guidance for travelers and anyone navigating unfamiliar social situations.

### How It Works

1. **Describe Your Situation** - Tell the app where you are and what's happening
2. **Get Instant Guidance** - Receive specific, actionable etiquette advice
3. **Ask Follow-ups** - Clarify details or explore related customs
4. **Save for Later** - Bookmark helpful advice for quick reference

## Key Features

- **Real-Time Etiquette Advice** - Context-aware guidance based on location and situation
- **Conversational Interface** - Ask follow-up questions naturally, like talking to a local friend
- **Offline-Ready (PWA)** - Works without constant internet connection—perfect for travel
- **Multi-Scenario Coverage** - Dining, greetings, business meetings, religious sites, gift-giving, and more
- **Cultural Nuance** - Goes beyond generic tips to explain *why* customs exist

## Product Thinking: Why I Built It This Way

### Trade-offs & Prioritization

**Why conversational AI over pre-written guides?**
Static guides can't cover every situation. A business dinner in Tokyo is different from a casual meal in Kyoto. AI allows for nuanced, personalized advice that adapts to the user's specific context—something no guidebook can match.

**Why PWA over native app?**
Travelers don't want to download yet another app, especially when storage is limited. A PWA installs instantly, works offline, and takes up minimal space. It removes friction right when users need help most—in the moment, in a foreign place.

**Why focus on etiquette over language translation?**
Translation apps already exist and work well. The bigger gap is *behavioral guidance*—knowing what to do, not just what to say. Cultural Compass fills a unique need that Google Translate doesn't address.

**Why AI-powered instead of crowdsourced content?**
Crowdsourced platforms like forums can be outdated or conflicting. AI provides consistent, up-to-date guidance synthesized from reliable cultural knowledge, with the ability to explain context and nuance that user-generated content often lacks.

### Success Metrics (What Good Looks Like)

- **Activation Rate**: % of users who ask a question within first session
- **Engagement Depth**: Average number of follow-up questions per conversation
- **Offline Usage**: % of sessions that occur while offline (indicates travel use case)
- **User Confidence**: Post-interaction survey: "How confident did you feel after using this advice?"
- **Repeat Usage**: % of users who return during the same trip

## Use Cases

**For Travelers:**
- "I'm invited to a Japanese tea ceremony—what should I expect?"
- "Is it rude to tip in Iceland?"
- "How do I politely decline street food in India?"

**For Expats & Newcomers:**
- "I'm attending my first Emirati wedding—what should I wear?"
- "What's the etiquette for business card exchange in South Korea?"

**For Event Attendees:**
- "I'm going to a Jewish Shabbat dinner for the first time—what should I know?"
- "How formal should I dress for a Swiss business meeting?"

## Tech Stack

Built with Google AI Studio (Gemini API) as a Progressive Web App for rapid prototyping and deployment.

---

## Run and Deploy Your Own Version

This contains everything you need to run your app locally.

### Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Run the app: `npm run dev`

### Deploy

The app is already deployed and accessible at the link above. To deploy your own version, follow Google AI Studio's deployment instructions.

---

## What's Next?

Potential future features based on user feedback:
- Location-based automatic context detection (GPS integration)
- Pre-trip planning mode: "I'm visiting Dubai next month—what should I know?"
- Save and organize advice by trip or destination
- Community validation: upvote helpful responses
- Integration with travel booking apps for seamless guidance

---

Built by [Amisha Shrivastava](https://your-portfolio-link.com) as part of my product management portfolio.
