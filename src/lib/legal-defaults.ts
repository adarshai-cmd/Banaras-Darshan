import { prisma } from "./db";

export interface LegalPolicyData {
  slug: string;
  title: string;
  category: "LEGAL" | "PRIVACY" | "GUIDELINES" | "COMPLIANCE";
  version: string;
  status: "PUBLISHED" | "DRAFT" | "UNPUBLISHED";
  summary: string;
  lastUpdated: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

export const CANONICAL_LEGAL_POLICIES: Record<string, LegalPolicyData> = {
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    category: "PRIVACY",
    version: "1.0",
    status: "PUBLISHED",
    summary:
      "A transparent, factual disclosure of how Banaras Darshan handles pilgrim accounts, community messages, AI interactions, client-side geolocation, and essential session cookies.",
    lastUpdated: "13 September 2026",
    sections: [
      {
        id: "about-us",
        title: "1. About Banaras Darshan",
        content: `Banaras Darshan (accessible at https://banarasdarshan.com) is an independent, community-driven digital travel companion and cultural directory for the historic city of Varanasi (Kashi), India. 

Our mission is to help pilgrims, backpackers, families, and researchers discover sacred temples, crescent ghats, culinary landmarks, municipal parking facilities, and authentic cultural heritage.

**Important Affiliation Notice:** Banaras Darshan is an independent digital initiative. We are NOT owned by, affiliated with, or an official agency of the Shri Kashi Vishwanath Special Area Development Board, Kashi Vishwanath Temple Trust, Varanasi Nagar Nigam, Uttar Pradesh Tourism, Ministry of Tourism (Government of India), or Indian Railways. We operate as an informational platform committed to factual accuracy and traveler privacy.`,
      },
      {
        id: "information-collected",
        title: "2. Information We Collect",
        content: `We adhere strictly to the principle of data minimization. We do not collect unnecessary personal details.

**A. Account Information (Optional):**
Browsing Banaras Darshan does NOT require an account. If you voluntarily register an explorer account to save itineraries or post in the community, we collect:
- Your chosen display name
- Your email address (used solely for login authentication and account recovery)
- A cryptographically salted and hashed representation of your password (generated using scrypt; your plaintext password is never stored or visible to us)
- Your explorer reputation score and badge (e.g., 'New Explorer', 'Local Guide')

**B. Community Content & Dispatches:**
When you post messages or replies in the Community chat channels, we store your message text, timestamp, chosen channel, and user ID. Only your display name and badge are publicly visible to other travelers. Your email address is strictly private and never displayed publicly.

**C. Feedback, Corrections & Place Suggestions:**
When you submit a place suggestion or feedback form, we collect the message, submitted place details, and any contact information (email or name) you voluntarily supply so our editorial team may verify the recommendation or follow up.

**D. Aggregate Metrics (No Personal Tracking):**
When users view or click promotional banners for local cultural events or verified artisans, we increment an anonymous aggregate numerical counter (impressionCount and clickCount). We do NOT record your IP address, user ID, browser fingerprint, or individual tracking trail.`,
      },
      {
        id: "ai-assistant-privacy",
        title: "3. Banaras AI Assistant Privacy",
        content: `Banaras Darshan includes an interactive digital concierge ("Banaras AI") powered by Google Gemini and grounded in our verified local database.

- **Ephemeral Processing:** Chat queries and prompts you send to Banaras AI are processed in real-time in memory to retrieve relevant pilgrimage advice. We do NOT store your chat logs or conversation transcripts in our database, nor do we associate your prompts with your user profile.
- **Do Not Share Sensitive Data:** Please avoid entering sensitive personal data (e.g., credit card numbers, Aadhaar/passport details, home addresses, or confidential passwords) into the AI assistant.
- **Accuracy & Verification:** AI-generated suggestions are automated informational aids and must not be treated as official decrees. Important temple darshan rules, ticket quotas, and locker guidelines should be verified on-site with temple authorities.
- **Third-Party Processing:** When cloud AI processing is active, your travel query is securely transmitted via TLS encryption to Google Gemini API with system instructions strictly limiting the context to Varanasi tourism.`,
      },
      {
        id: "map-location-privacy",
        title: "4. Map & Geolocation Privacy",
        content: `Our interactive map and 'Explore Near Me' radar help travelers navigate Varanasi's sacred crescent ghats and intricate galliyan.

- **No Continuous Background Tracking:** We never track or record your location in the background.
- **On-Demand Client-Side Haversine Engine:** When you visit the 'Explore Near Me' radar, your browser's precise location is requested ONLY if you explicitly click the "Detect Location / Use GPS" button.
- **Client-Side Calculation:** When permitted, your latitude and longitude coordinates are processed 100% locally in your device's browser to compute walking distances to nearby ghats and temples using the mathematical Haversine formula. Your GPS coordinates are NEVER sent to our database, logged on our servers, or shared with third-party data brokers.
- **Landmark Search Alternative:** If you deny browser location permission or prefer not to share GPS, you can manually select any prominent Varanasi landmark (such as Dashashwamedh Ghat, Assi Ghat, or Cantt Railway Station) as your starting point.
- **Map Tiles:** Map tiles are rendered using Leaflet and fetched directly from OpenStreetMap servers under open-source standards.`,
      },
      {
        id: "cookies-local-storage",
        title: "5. Cookies & Local Storage",
        content: `We respect your digital privacy and do NOT engage in commercial ad profiling.

- **Essential Session Cookie (banaras_session):** When you sign in to your explorer account, an encrypted HTTP-only session cookie named \`banaras_session\` is set. This cookie is strictly necessary to keep you authenticated as you browse saved places and community dispatches. It has a lifetime of 30 days, uses SameSite=Lax protection, and is marked Secure in production environments.
- **Local Storage:** We use browser LocalStorage solely to record whether you have acknowledged our essential privacy and cookie notification (\`bd_cookie_consent_dismissed\`) so that we do not display the banner repeatedly.
- **Zero Advertising or Third-Party Tracking Cookies:** We do NOT load Google Analytics, Meta Pixel, marketing retargeting beacons, or commercial advertising cookies. For complete details, please read our dedicated Cookie Policy.`,
      },
      {
        id: "data-storage-supabase",
        title: "6. Supabase & Database Security",
        content: `Banaras Darshan utilizes Supabase (PostgreSQL) and SQLite infrastructure engineered with modern security best practices:

- **Row-Level Security (RLS):** Database tables enforce Row-Level Security policies at the database engine level. Unauthenticated public visitors can only read published places, approved community messages, and active municipal parking listings.
- **Role Isolation:** Administrative operations, content publishing, and moderation logs are strictly locked behind administrative authentication checks. Privileged service role keys and database credentials are stored in secure server environment variables and are NEVER exposed to client browsers or source repositories.
- **Encrypted Media Storage:** Community and place photos uploaded to Supabase Storage are hosted in isolated storage buckets with verified file-type and size constraints.`,
      },
      {
        id: "community-privacy",
        title: "7. Community Chat & Moderation Privacy",
        content: `When you participate in our traveler community:

- **Public Visibility:** Anything you post in public channels (e.g., General, Food, Ghats, Stays, Help) is visible to other travelers. Please do not post private telephone numbers, hotel room numbers, or sensitive itineraries in public channels.
- **Automated Moderation:** Submitted messages pass through an automated moderation pipeline that screens for spam, vulgarity, financial scams, unauthorized commercial touting, and religious harassment. Content flagged for severe violations is automatically rejected, and an entry is logged in our internal moderation log for administrative review.
- **Reporting System:** Travelers can report problematic or misleading community content. Reports record the target message ID, reason category, and reporter name (default: 'Traveler').`,
      },
      {
        id: "data-retention-rights",
        title: "8. Data Retention, User Rights & Account Deletion",
        content: `You retain full rights over your personal data:

- **Access & Correction:** You can review and update your name and profile information at any time via your Profile page.
- **Account & Data Deletion:** If you wish to permanently delete your account, saved places, or community messages, you may submit a deletion request via our Contact & Support portal or by emailing support@banarasdarshan.com. We will verify your account ownership and permanently erase your user record, associated sessions, and private identifiers within 30 days.
- **Data Security:** We implement industry-standard encryption in transit (HTTPS/TLS) and secure hashing for credential storage. However, no internet transmission is 100% immune, and we urge users to protect their account passwords.`,
      },
      {
        id: "contact-policy-updates",
        title: "9. Contact Us & Policy Revisions",
        content: `We may periodically revise this Privacy Policy to reflect technical enhancements, regulatory developments, or new platform features. Any updates will be published on this page with an updated version number and date.

If you have questions, privacy inquiries, or data access requests, please contact:
- **Email:** privacy@banarasdarshan.com
- **Support Portal:** https://banarasdarshan.com/contact
- **Address:** Kashi Cultural Hub, Chowk / Godowlia Circle, Varanasi, Uttar Pradesh 221001, India.`,
      },
    ],
  },

  "terms-and-conditions": {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    category: "LEGAL",
    version: "1.0",
    status: "PUBLISHED",
    summary:
      "The terms governing your access to and use of Banaras Darshan, acceptable community standards, intellectual property, and disclaimers on travel advice.",
    lastUpdated: "13 September 2026",
    sections: [
      {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        content: `By accessing, browsing, or utilizing the Banaras Darshan platform (including our website, mobile interface, AI assistant, and community features), you agree to be bound by these Terms & Conditions and all applicable laws and regulations of the Republic of India. 

If you do not agree with any of these terms, you are prohibited from using or accessing this platform.`,
      },
      {
        id: "nature-of-service",
        title: "2. Nature of Service (Informational Platform)",
        content: `Banaras Darshan is provided purely as a free digital travel discovery companion, cultural encyclopedia, and community exchange for Varanasi (Kashi).

**No Booking or Financial Transactions:** Banaras Darshan is NOT a travel agency, tour operator, commercial broker, or ticketing portal. We do not sell temple darshan tickets, Aarti passes, boat rides, hotel reservations, or transit passes. We do not collect money, process credit cards, or conduct financial transactions. Any links to external booking engines or service providers represent third-party services outside our direct control.`,
      },
      {
        id: "user-accounts",
        title: "3. User Accounts & Responsibilities",
        content: `You may browse most sections of the platform without an account. When you register an explorer account:
- You must provide accurate, current information (valid email and display name).
- You are responsible for safeguarding the confidentiality of your password and account credentials.
- You accept full responsibility for all activities that occur under your account.
- You must notify us immediately upon suspecting any unauthorized access to your account.
- We reserve the right to suspend or terminate accounts that violate our terms, community guidelines, or system integrity.`,
      },
      {
        id: "acceptable-use",
        title: "4. Acceptable Community Use & Prohibited Activities",
        content: `Our community channels, place reviews, and feedback systems exist to assist fellow pilgrims and travelers. You agree that you will NOT:
- Post commercial advertisements, touting offers, affiliate links, or commission-based solicitations for boat operators, hotels, or unauthorized guides.
- Post content that is defamatory, vulgar, abusive, sexually explicit, threatening, or harassing.
- Post hate speech, derogatory remarks regarding caste, creed, religion, gender, or community traditions.
- Publish false, fabricated, or intentionally misleading information regarding temple darshan timings, ticket rules, safety advisories, or entry fees.
- Solicit or publish private personal information (phone numbers, addresses) of other individuals without their consent.
- Attempt to breach, probe, or compromise the technical infrastructure, Supabase endpoints, or security controls of Banaras Darshan.
- Use automated scraping, bots, or data mining software to extract database records without written permission.`,
      },
      {
        id: "content-moderation",
        title: "5. Content Moderation & Administration Rights",
        content: `We maintain an automated moderation pipeline and human administrative oversight to protect travelers:
- We reserve the right, but assume no ongoing obligation, to review, edit, flag, hide, or permanently remove any user-submitted message, review, or suggestion that violates these terms.
- Repeated violations may result in immediate reputation deductions, temporary channel mutes, or permanent account revocation.
- By submitting messages, photos, or place suggestions, you grant Banaras Darshan a non-exclusive, royalty-free, perpetual license to display, index, and organize such content for platform functionality.`,
      },
      {
        id: "ai-content-disclaimer",
        title: "6. Banaras AI Assistant Disclaimer",
        content: `Banaras AI provides automated conversational responses based on database knowledge and generative language algorithms. 
- AI outputs are intended for general orientation and planning inspiration only.
- AI responses can occasionally contain factual inaccuracies, outdated boat fare estimates, or misinterpreted temple protocols.
- Travelers must independently verify crucial details (such as VIP queue passes, disability access, special festival crowds, or morning aarti entry) directly through official temple administrations before traveling.`,
      },
      {
        id: "intellectual-property",
        title: "7. Intellectual Property Rights",
        content: `The design, layout, logo, code, curated editorial guides, visual identity, and software algorithms of Banaras Darshan are protected by copyright, trademark, and intellectual property laws of India. 

Open-source components (such as Leaflet and OpenStreetMap assets) remain the property of their respective creators under their respective open-source licenses. You may not reproduce, duplicate, copy, or redistribute our proprietary software without prior written consent.`,
      },
      {
        id: "limitation-of-liability",
        title: "8. Limitation of Liability",
        content: `To the maximum extent permitted by applicable law:
- Banaras Darshan and its creators, contributors, and moderators shall NOT be liable for any direct, indirect, incidental, punitive, or consequential damages arising out of your access to, use of, or inability to use this platform.
- We do not guarantee uninterrupted, error-free, or fully secure platform availability.
- We are not responsible for delays, cancellations, rate disputes, physical accidents, thefts, boat mishaps, crowd incidents, or disputes between travelers and local third-party vendors (e.g., boatmen, rickshaw drivers, hotels, tour guides, restaurants).
- Travel in ancient pilgrimage centers involves inherent real-world factors such as weather, dense crowds, narrow alleyways, and ceremonial protocols. Travelers are advised to exercise personal vigilance, safety precautions, and travel insurance.`,
      },
      {
        id: "governing-law",
        title: "9. Governing Law & Jurisdiction",
        content: `These Terms & Conditions shall be governed by and construed in accordance with the substantive laws of the Republic of India. 

Any legal dispute, action, or proceeding arising out of or relating to these terms or your use of the platform shall be subject to the exclusive jurisdiction of the competent courts located in Varanasi, Uttar Pradesh, India.`,
      },
      {
        id: "modifications-contact",
        title: "10. Modifications & Contact Information",
        content: `We reserve the right to revise these Terms & Conditions at any time. Changes become effective immediately upon publication on this URL with an updated version number. Continued use of the platform constitutes acceptance of revised terms.

For legal queries or formal notices:
- **Email:** legal@banarasdarshan.com
- **Support Portal:** https://banarasdarshan.com/contact`,
      },
    ],
  },

  "disclaimer": {
    slug: "disclaimer",
    title: "Disclaimer",
    category: "COMPLIANCE",
    version: "1.0",
    status: "PUBLISHED",
    summary:
      "Important travel advice, dynamic timings, absence of official government affiliation, and independent verification guidance for pilgrims visiting Varanasi.",
    lastUpdated: "13 September 2026",
    sections: [
      {
        id: "general-info",
        title: "1. General Informational & Tourism Purpose",
        content: `The information, guides, historical narratives, transit hints, and cultural tips published on Banaras Darshan are prepared in good faith for general informational, educational, and pilgrimage assistance purposes only. 

While our editorial team endeavors to keep all records verified and up-to-date, Varanasi (Kashi) is a living, dynamic spiritual city where timings, ceremonies, entry gates, pedestrian diversions, and transit routes fluctuate regularly based on festivals, VIP visits, construction, and seasonal rituals.`,
      },
      {
        id: "no-official-affiliation",
        title: "2. No Official Affiliation Disclaimer",
        content: `Banaras Darshan is an independent digital community guide. 

**WE ARE NOT AN OFFICIAL GOVERNMENT WEBSITE, NOR ARE WE AFFILIATED WITH:**
- Shri Kashi Vishwanath Special Area Development Board or the Shri Kashi Vishwanath Temple Trust
- Varanasi Nagar Nigam (Municipal Corporation)
- Uttar Pradesh Tourism Development Corporation (UPTDC)
- Ministry of Tourism or Ministry of Culture, Government of India
- Indian Railways (IRCTC) or Varanasi Cantonment Railway Administration
- Any specific akhada, temple matha, commercial boat association, or private hotel federation

Reference to any specific temple, government helpline, police stand, monument, commercial entity, hotel, or food vendor does NOT constitute an official endorsement, partnership, sponsorship, or recommendation by Banaras Darshan, nor does it imply an endorsement of Banaras Darshan by such third parties.`,
      },
      {
        id: "dynamic-timings-prices",
        title: "3. Dynamic Timings, Pricing & Availability",
        content: `Please note that all travel metrics on Banaras Darshan are subject to dynamic real-world changes:
- **Temple Darshan & Aarti:** Timings for Mangala Aarti, Bhog Aarti, and Shayan Aarti, as well as locker rules, queue regulations, mobile phone bans, and dress codes, are determined solely by temple trusts and local administrative magistrates.
- **Boat Ride Rates:** Shared and private boat hire rates from Dashashwamedh, Assi, and Namo Ghats are subject to seasonal demand, high flood levels during monsoon, river police speed restrictions, and negotiable tariffs. Stated figures are realistic local estimates, not legally binding quotes.
- **Street Food & Stays:** Menus, prices, opening hours, and room tariffs are set independently by private operators.
- **Municipal Parking:** Multi-level and open-surface parking capacities and hourly fees are managed by municipal contractors and may alter without prior notice.

**Traveler Advice:** Always confirm critical darshan rules, ticket slots, and transit plans directly with official temple offices or local administrative helplines before undertaking long-distance travel.`,
      },
      {
        id: "ai-assistant-disclaimer",
        title: "4. Banaras AI Concierge Limitations",
        content: `Our AI travel assistant utilizes automated machine learning models and verified database records. Although engineered to minimize hallucinations:
- AI outputs are generative and may occasionally misunderstand colloquial phrases, provide outdated opening hours, or give inaccurate transit directions through old-city galliyan.
- The AI assistant should be treated as a helpful cultural conversation partner, never as an authoritative travel agent or official temple representative.
- Banaras Darshan assumes no responsibility for any inconvenience, delay, or financial loss resulting from reliance on AI-generated suggestions.`,
      },
      {
        id: "weather-river-safety",
        title: "5. Weather, River Levels & Personal Safety",
        content: `Weather forecasts and travel insights are retrieved from Open-Meteo meteorological models:
- Weather conditions, rainfall probabilities, and river breezes can change suddenly.
- During monsoon months (typically July through September), the River Ganga experiences intense currents and swelling water levels. The Varanasi District Administration and River Police frequently ban all boat operations or restrict evening Aarti viewing.
- Travelers must strictly follow on-ground warnings, red flags erected at ghats, life-jacket regulations, and official police advisories.`,
      },
      {
        id: "external-links",
        title: "6. External Links & Third-Party Websites",
        content: `Banaras Darshan may contain links to third-party portals (such as official temple trust portals, Google Maps routes, OpenStreetMap, or hotel booking sites). We do not control or endorse the content, privacy policies, or commercial practices of external websites. Following external links is done solely at your own discretion and risk.`,
      },
    ],
  },

  "cookie-policy": {
    slug: "cookie-policy",
    title: "Cookie Policy",
    category: "PRIVACY",
    version: "1.0",
    status: "PUBLISHED",
    summary:
      "A clear, honest account of our cookie usage: only essential HTTP-only session cookies are used, with zero advertising or third-party tracking cookies.",
    lastUpdated: "13 September 2026",
    sections: [
      {
        id: "what-are-cookies",
        title: "1. What Are Cookies?",
        content: `Cookies are small text files stored on your computer, tablet, or mobile device by websites that you visit. They are widely used to make websites work efficiently, provide authentication security, and remember user preferences.`,
      },
      {
        id: "our-commitment",
        title: "2. Our Privacy-First Commitment",
        content: `Banaras Darshan is built on a strict privacy-first architecture. 

**WE DO NOT USE:**
- Third-party advertising cookies or cross-site tracking networks
- Google Analytics or marketing tracking pixels (e.g. Meta / Facebook Pixel)
- Behavioral profiling or retargeting scripts
- Commercial data brokers or tracking beacons

We believe pilgrims and travelers exploring the sacred city of Varanasi deserve a clean, fast, and tracking-free digital experience.`,
      },
      {
        id: "cookies-we-use",
        title: "3. Cookies We Actually Use",
        content: `We use strictly necessary functional technologies required to deliver platform functionality:

| Technology Name | Type | Purpose | Expiration | Security Controls |
| :--- | :--- | :--- | :--- | :--- |
| **banaras_session** | HTTP-Only Cookie | Maintains your authenticated user session when you sign in to your explorer account. Contains a cryptographically random token referencing your server session. | 30 Days | HttpOnly, Secure (in production), SameSite=Lax |
| **bd_cookie_consent_dismissed** | Browser LocalStorage | Remembers whether you have acknowledged our privacy and cookie notice so the banner does not repeatedly distract you. | Persistent (until cleared) | Stored only in your local device browser |

**Essential Nature:** The \`banaras_session\` cookie is strictly necessary to allow account holders to access saved places, generate custom itineraries, and post in the community chat. If you use Banaras Darshan without creating an account or logging in, this cookie is not even set.`,
      },
      {
        id: "client-storage",
        title: "4. Temporary In-Memory State",
        content: `When you interact with the Banaras AI assistant or filter places on the Explore and Food discovery pages:
- Your query inputs and filtered categories are held temporarily in React in-memory state during your browsing session.
- These temporary values are discarded as soon as you close or refresh the browser tab.
- They are not stored in tracking cookies or shared with external analytics platforms.`,
      },
      {
        id: "managing-cookies",
        title: "5. How You Can Manage Cookies",
        content: `You have full control over cookies stored on your device:
- **Browser Settings:** Most web browsers allow you to view, manage, and delete cookies through their privacy settings.
- **Blocking Cookies:** You can configure your browser to block all cookies. However, please note that blocking all cookies will prevent you from logging into an explorer account on Banaras Darshan, as authentication requires the secure \`banaras_session\` cookie. Public browsing of temples, ghats, and maps will continue to function normally.
- To learn more about managing cookies in your specific browser, visit:
  - Google Chrome: Settings > Privacy and Security > Cookies and other site data
  - Mozilla Firefox: Settings > Privacy & Security > Cookies and Site Data
  - Apple Safari: Preferences > Privacy > Block all cookies
  - Microsoft Edge: Settings > Cookies and site permissions`,
      },
      {
        id: "updates-contact",
        title: "6. Updates & Contact",
        content: `If we ever introduce new essential functional features that modify our cookie usage, we will update this Cookie Policy accordingly.

For any questions regarding our cookie practices:
- **Email:** privacy@banarasdarshan.com
- **Support Portal:** https://banarasdarshan.com/contact`,
      },
    ],
  },

  "community-guidelines": {
    slug: "community-guidelines",
    title: "Community Guidelines",
    category: "GUIDELINES",
    version: "1.0",
    status: "PUBLISHED",
    summary:
      "Standards of respect, truthfulness, and safety that keep Banaras Darshan a sacred, helpful, and welcoming space for all travelers and locals.",
    lastUpdated: "13 September 2026",
    sections: [
      {
        id: "our-spirit",
        title: "1. The Spirit of Kashi Community",
        content: `Varanasi is world-renowned for its eternal warmth, spiritual tranquility, and hospitality ("Banaraspan"). The Banaras Darshan community is dedicated to honoring that legacy by providing a supportive, welcoming, and truthful forum where travelers, pilgrims, and local residents can share genuine travel guidance, safe walking routes, and authentic cultural tips.

Whether you are helping a solo backpacker find a quiet ghat at dawn or advising an elderly pilgrim on wheelchair-friendly temple entry, your contributions matter.`,
      },
      {
        id: "encouraged-behavior",
        title: "2. Encouraged Community Behavior",
        content: `We encourage all community members to:
- **Be Helpful & Respectful:** Treat fellow pilgrims with warmth, patience, and courtesy regardless of background, language, or spiritual traditions.
- **Share Verified Real-World Experience:** Share factual details about your visits — such as fair boat hire rates you negotiated, current locker waiting times, delicious local food stalls, or clean guest houses.
- **Assist Vulnerable Pilgrims:** Provide considerate guidance to first-time travelers, solo women travelers, families with young children, and elderly pilgrims navigating crowded corridors.
- **Celebrate Cultural Heritage:** Share the rich cultural history of Varanasi's silk weavers, classical music gharanas, Sanskrit traditions, and evening Ganga Aarti ceremonies.`,
      },
      {
        id: "prohibited-content",
        title: "3. Prohibited Content & Violations",
        content: `To protect our travelers from fraud, harassment, and confusion, the following behaviors are strictly prohibited:

**A. Commercial Spam & Touting:**
- Promoting unauthorized commission-based boat rides, touting services, private taxi cartels, or unsolicited tour packages.
- Repeatedly posting commercial links, affiliate codes, or promotional advertisements in public discussion channels.

**B. False, Misleading or Fabricated Information:**
- Posting false timings, fake ticket prices, or fabricated queue shortcuts.
- Impersonating temple priests (pandas), municipal officials, or police officers.
- Spreading unverified rumors or religious misinformation designed to cause crowd panic or distress.

**C. Harassment, Hate & Abusive Conduct:**
- Any form of bullying, stalking, personal insults, derogatory remarks, or hate speech targeting race, caste, religion, gender, or nationality.
- Inappropriate, vulgar, or sexually explicit comments or imagery.

**D. Privacy Violations (Doxing):**
- Posting personal contact details (phone numbers, WhatsApp IDs, private residential addresses) of individuals without their explicit consent.

**E. System Abuse & Spamming:**
- Posting duplicate messages across multiple channels, flooding chat rooms with nonsensical text, or attempting to manipulate helpful voting scores.`,
      },
      {
        id: "moderation-pipeline",
        title: "4. Moderation Pipeline & Enforcement Actions",
        content: `To safeguard our platform, Banaras Darshan operates an automated moderation pipeline combined with administrator review:

- **Automated Screening:** Every message is evaluated by an automated lexical and pattern analysis engine (\`evaluateMessageContent\`) that checks for vulgarity, scams, hate speech, and spam patterns.
- **Content Actions:**
  - **Auto-Reject:** Messages containing severe hate speech, vulgarity, or dangerous scams are immediately rejected and prevented from appearing publicly.
  - **Held for Review:** Messages containing ambiguous commercial terms or suspicious link patterns are placed in an administrative queue for human verification.
  - **Auto-Approved:** Helpful, respectful travel messages are published instantly to the community feed.
- **Administrative Remedies:** Depending on the severity of a violation, administrators may issue:
  1. Formal in-app warnings
  2. Removal of offending messages and replies
  3. Reputation score deductions and removal of contributor badges
  4. Channel mutes or permanent suspension of user accounts.`,
      },
      {
        id: "reporting-appeals",
        title: "5. Reporting Content & Filing Appeals",
        content: `Every community message includes a "Report" action. If you encounter any content that violates these guidelines:
1. Click the flag / report icon on the message.
2. Select the relevant violation category (Spam, Abuse, False Info, Scam, Unsafe, or Other).
3. Our moderation team reviews pending reports and takes appropriate corrective action.

If you believe your message or account was moderated in error, you may file an appeal through our Contact & Support portal (https://banarasdarshan.com/contact) detailing your account display name and the context of the post.`,
      },
    ],
  },

  "accessibility": {
    slug: "accessibility",
    title: "Accessibility Statement",
    category: "COMPLIANCE",
    version: "1.0",
    status: "PUBLISHED",
    summary:
      "Our ongoing commitment to ensuring digital accessibility, keyboard navigation, and screen reader compatibility for all travelers visiting Banaras Darshan.",
    lastUpdated: "13 September 2026",
    sections: [
      {
        id: "our-commitment",
        title: "1. Our Accessibility Commitment",
        content: `Banaras Darshan believes that spiritual and cultural discovery should be accessible to everyone, including individuals with visual, hearing, cognitive, or motor impairments. 

We strive to adhere to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards to provide an inclusive, accessible web experience for all travelers.`,
      },
      {
        id: "measures-taken",
        title: "2. Technical Standards & Measures Taken",
        content: `To support accessibility across devices and assistive technologies, Banaras Darshan implements:

- **Semantic HTML5:** Proper use of landmark tags (\`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<section>\`, \`<footer>\`) and clean heading hierarchies (\`<h1>\` through \`<h3>\`) to facilitate seamless screen reader navigation.
- **Color Contrast:** All text elements and essential user interface controls are tailored to satisfy WCAG AA contrast ratio requirements against our warm parchment and dark footer backgrounds.
- **Keyboard Navigation:** All interactive elements — including navigation menus, modal dialogs, search inputs, tabs, and buttons — are fully operable via keyboard (Tab, Enter, Space, Escape, and Arrow keys) with visible focus indicators.
- **Accessible Form Elements:** Form fields feature descriptive, associated \`<label>\` elements, placeholder assistance, and clear error notifications.
- **Responsive Text Scaling:** Content layouts are built to accommodate browser zoom scaling up to 200% without horizontal scrolling or truncation of text.
- **Reduced Motion Support:** CSS and animation utilities respect user preferences for reduced motion (\`prefers-reduced-motion: reduce\`).
- **Descriptive Image Attributes:** Images feature descriptive \`alt\` text, and decorative icons include appropriate ARIA hidden attributes.`,
      },
      {
        id: "known-limitations",
        title: "3. Known Limitations & Alternatives",
        content: `While we work continuously to optimize accessibility, certain third-party components present inherent limitations:
- **Interactive Map Tiles:** Interactive canvas-rendered map tiles (Leaflet / OpenStreetMap) may be difficult to navigate using screen readers alone. To ensure travelers with visual impairments can still access geographical details, all map listings are simultaneously provided in structured, screen-reader-friendly text cards with complete addresses, distances, and nearby hubs.
- **Third-Party Photography:** Historic crowd and festival images submitted by community members may occasionally have basic descriptions. Our editorial team reviews and enhances captions on an ongoing basis.`,
      },
      {
        id: "feedback-contact",
        title: "4. Accessibility Feedback & Assistance",
        content: `We welcome your feedback on the accessibility of Banaras Darshan. If you encounter any accessibility barriers or require assistance in accessing any portion of this platform, please let us know:
- **Email:** accessibility@banarasdarshan.com
- **Contact Portal:** https://banarasdarshan.com/contact
- We aim to respond to accessibility feedback within 48 business hours.`,
      },
    ],
  },
};

/**
 * Retrieves a published legal policy by slug.
 * Checks the database first; if not found or DB unavailable, returns canonical code baseline.
 */
export async function getPublishedPolicy(slug: string): Promise<LegalPolicyData | null> {
  const canonical = CANONICAL_LEGAL_POLICIES[slug];

  try {
    const record = await prisma.legalPolicy.findUnique({
      where: { slug },
    });

    // Only return if PUBLISHED
    if (record && record.status === "PUBLISHED") {
      let parsedSections: Array<{ id: string; title: string; content: string }> = [];
      try {
        parsedSections = JSON.parse(record.content);
      } catch {
        // If content is pure markdown or text, wrap into a single section
        parsedSections = [
          {
            id: "main-content",
            title: record.title,
            content: record.content,
          },
        ];
      }

      return {
        slug: record.slug,
        title: record.title,
        category: record.category as any,
        version: record.version,
        status: record.status as any,
        summary: record.summary || canonical?.summary || "",
        lastUpdated: record.lastUpdated
          ? new Date(record.lastUpdated).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : canonical?.lastUpdated || "13 September 2026",
        sections: parsedSections.length > 0 ? parsedSections : canonical?.sections || [],
      };
    }
  } catch (err) {
    console.error(`Error querying LegalPolicy for slug "${slug}":`, err);
  }

  // Fallback to canonical baseline if published record not in DB or DB empty
  return canonical || null;
}

/**
 * Returns metadata list of all legal policies for navigation / admin.
 */
export async function getAllLegalPoliciesMeta() {
  try {
    const records = await prisma.legalPolicy.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        version: true,
        status: true,
        summary: true,
        lastUpdated: true,
        updatedAt: true,
      },
      orderBy: { title: "asc" },
    });

    if (records.length > 0) {
      return records;
    }
  } catch (err) {
    console.error("Error querying all legal policies meta:", err);
  }

  // Fallback to canonical list
  return Object.values(CANONICAL_LEGAL_POLICIES).map((p) => ({
    id: p.slug,
    slug: p.slug,
    title: p.title,
    category: p.category,
    version: p.version,
    status: p.status,
    summary: p.summary,
    lastUpdated: new Date(),
    updatedAt: new Date(),
  }));
}

/**
 * Ensure canonical policies exist in the database so admin can edit them immediately.
 */
export async function seedCanonicalPoliciesIfMissing() {
  try {
    for (const [slug, policy] of Object.entries(CANONICAL_LEGAL_POLICIES)) {
      const existing = await prisma.legalPolicy.findUnique({
        where: { slug },
      });

      if (!existing) {
        await prisma.legalPolicy.create({
          data: {
            slug,
            title: policy.title,
            category: policy.category,
            version: policy.version,
            status: policy.status,
            summary: policy.summary,
            content: JSON.stringify(policy.sections),
            lastUpdated: new Date("2026-09-13T00:00:00.000Z"),
          },
        });
      }
    }
  } catch (err) {
    console.error("Error auto-seeding canonical legal policies:", err);
  }
}
