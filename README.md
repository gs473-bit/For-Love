# For Love 💌

A private, cozy chat with an AI proxy of Gaurav. One continuous conversation,
saved to Lovable Cloud, scenery she can change, hearts when she sends.

## What's in here

```
supabase/migrations/20260707120000_love_chat.sql   tables + owner-only RLS
public/themes/*.jpg                                 9 scenery backgrounds (caption-free)
src/lib/persona.ts                                  the voice (built from real chats)
src/lib/ai-gateway.server.ts                        Lovable AI Gateway model
src/lib/supabase.client.ts / supabase.server.ts     auth clients (RLS-scoped server)
src/lib/chat.functions.ts                           getOrCreateConversation, loadMessages
src/routes/api/chat.ts                              streaming POST + persistence
src/routes/__root.tsx                               fonts, metadata, theme provider
src/routes/index.tsx                                session redirect
src/routes/auth.tsx                                 "Only for Love 💌" door
src/routes/_authenticated/route.tsx                 auth gate
src/routes/_authenticated/chat.tsx                  the chat surface
src/hooks/use-travel-theme.ts                       theme state + localStorage
src/components/travel-background.tsx                crossfading scenery + overlay
src/components/theme-switcher.tsx                   floating pill (top-right)
src/components/chat-window.tsx                      useChat + shimmer + composer
src/components/floating-hearts.tsx                  hearts on send (once)
src/styles.css                                      dusk palette, Fraunces + Inter
```

## Setup in Lovable

1. **Enable Lovable Cloud** on the project (provisions Supabase + `LOVABLE_API_KEY`).
2. **Run the migration** — paste `supabase/migrations/20260707120000_love_chat.sql`
   into a Cloud migration.
3. **Auth settings**: in Supabase Auth, turn **off** "Confirm email" (it's a
   two-person app; confirmation emails just add friction).
4. Upload `public/themes/*.jpg` as static assets (keep filenames — they double
   as the `themeContext` strings the persona reacts to).
5. Deploy. First visit → she signs up once ("Make my key") → her conversation
   is auto-created → everything persists across devices.

Running outside Lovable instead: set `VITE_SUPABASE_URL`,
`VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and swap
`ai-gateway.server.ts` for any AI SDK provider.

## After she signs up (recommended)

Lock the door: in Supabase Auth settings, disable new sign-ups. The app stays
sign-in only and truly becomes "only for Love".

## Design notes

- **Signature element:** the tethered-ships thread — two glowing dots joined by
  a slowly drifting dashed line, on the auth card and in the header. It's the
  Project Hail Mary metaphor drawn literally, and it doubles as the logo.
- Her messages sit in a warm rose bubble; his render as plain text on the
  scenery with a soft text-shadow — like the landscape itself is talking.
- Light mode: warm cream / muted rose / soft cocoa. Dark mode: deep midnight
  blue with warm peach. All in `oklch`, driven by `prefers-color-scheme`.
- Reduced motion is respected (tether drift, shimmer, and hearts all switch off).

## Voice notes (persona.ts)

Built from ~5,500 of Gaurav's actual messages, weighted toward what's real:
Hinglish bursts, `obv/okiee/yupp/hn/na??`, the caretaker reflex
("Khana khaya na??", "backpain??", "TC of urself"), the oats bit, the
"agreement" threat, Rocky/Teddy Bear/mam/Cutie Pie/Supergirl/sir. The
Hail-Mary/Teleparty lore is deliberately light seasoning — leaning on it hard
makes the bot sound like fanfic instead of him.

## One security note, said plainly

The plan mentioned using a name as the login and a nickname as the password.
Fine as the *email/password she remembers*, but anyone who knows you both could
guess it. Since sign-ups get disabled after her account exists, the blast
radius is small — but consider at least an inside-joke variation she'd know and
others wouldn't.
