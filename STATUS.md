# Neters4 — Arhitectura & Status Aplicatie

> **Ultima verificare:** 2026-05-16 (actualizat după redesign public 14-18 ani)
> **Verificat de:** Claude (auto-update la fiecare verificare)

---

## Stack Tehnologic

| Strat | Tehnologie | Versiune |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.6 |
| UI | React | 19.2.4 |
| Limbaj | TypeScript | 5 |
| Stilizare | Tailwind CSS + PostCSS | 4 |
| Autentificare | NextAuth | 5 (beta) |
| Baza de date | MySQL (mysql2/promise) | — |
| Parole | bcryptjs | — |
| Data fetching | SWR | 2.4.1 |
| Grafice | Chart.js + react-chartjs-2 | — |
| Icoane | Ionicons | — |
| AI Chat | OpenAI API (gpt-4o) | — |
| Linting | ESLint | 9 |

---

## Structura Folderelor

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # Handler NextAuth
│   │   │   └── register/route.ts        # Inregistrare utilizator
│   │   ├── transactions/
│   │   │   ├── route.ts                 # GET / POST tranzactii
│   │   │   └── [id]/route.ts            # DELETE tranzactie
│   │   ├── wishlist/
│   │   │   ├── route.ts                 # GET / POST wishlist
│   │   │   ├── [id]/route.ts            # DELETE item
│   │   │   └── batch-delete/route.ts   # DELETE multiple
│   │   ├── recurring/
│   │   │   ├── route.ts                 # GET / POST recurente
│   │   │   └── [id]/route.ts            # DELETE recurenta
│   │   ├── settings/route.ts            # GET / POST setari user
│   │   ├── account/route.ts             # DELETE cont (cascade)
│   │   ├── chat/route.ts                # POST chat AI
│   │   └── exchange-rates/route.ts     # GET cursuri valutare
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx                     # Dashboard principal
│   │   └── settings/page.tsx           # Pagina setari
│   ├── auth/page.tsx                    # Login / Register
│   ├── page.tsx                         # Landing page
│   ├── layout.tsx                       # Root layout + SessionProvider
│   └── globals.css
├── components/
│   ├── auth/AuthForm.tsx
│   ├── dashboard/
│   │   ├── WelcomeScreen.tsx
│   │   ├── NetWorthCard.tsx            # Avere neta + grafice
│   │   ├── TransactionsCard.tsx        # Lista tranzactii
│   │   ├── WishlistCard.tsx            # Obiective economii
│   │   ├── RecurringCard.tsx           # Plati recurente
│   │   └── ExchangeRatesCard.tsx       # Cursuri live EUR/USD/RON
│   ├── modals/
│   │   ├── AddTransactionModal.tsx
│   │   ├── AddWishlistModal.tsx
│   │   ├── AddRecurringModal.tsx
│   │   └── ConfirmDeleteModal.tsx
│   ├── chat/ChatDrawer.tsx             # Asistent AI financiar
│   ├── layout/Sidebar.tsx
│   ├── settings/SettingsForm.tsx
│   └── providers/SessionProvider.tsx
├── lib/
│   ├── auth.ts                          # Configurare NextAuth
│   ├── db.ts                            # Pool conexiuni MySQL (max 10)
│   ├── queries.ts                       # Functii query DB
│   ├── chartUtils.ts                    # Constructori date grafice
│   └── i18n.ts                          # Traduceri EN / RO
└── types/
    ├── index.ts                          # Interfete TypeScript
    └── ionicons.d.ts
```

---

## Rute Disponibile

### Publice
| Ruta | Descriere |
|------|-----------|
| `/` | Landing page cu demo si CTA login/register |
| `/auth?mode=login` | Formular autentificare |
| `/auth?mode=register` | Formular inregistrare |

### Protejate (necesita autentificare)
| Ruta | Descriere |
|------|-----------|
| `/dashboard` | Dashboard principal |
| `/dashboard/settings` | Setari cont (valuta, limba, stergere cont) |

---

## Baza de Date — Tabele MySQL

| Tabel | Campuri principale |
|-------|-------------------|
| `users` | id, username, email, password_hash |
| `transactions` | id, user_id, title, amount, transaction_date, type (income/expense), created_at |
| `wishlist` | id, user_id, item_name, price, created_at |
| `recurring_payments` | id, user_id, title, amount, due_date, frequency (monthly/weekly/yearly), status (active/paused/completed) |
| `settings` | user_id, setting_key, setting_value |
| `exchange_rates` | currency_pair, rate, last_updated |

---

## API Routes

| Metoda | Ruta | Functie |
|--------|------|---------|
| POST | `/api/auth/register` | Inregistrare + bcrypt hash |
| * | `/api/auth/[...nextauth]` | Handler NextAuth |
| GET/POST | `/api/transactions` | Lista / adaugare tranzactii |
| DELETE | `/api/transactions/[id]` | Stergere tranzactie |
| GET/POST | `/api/wishlist` | Lista / adaugare wishlist |
| POST | `/api/wishlist/batch-delete` | Stergere multipla wishlist |
| DELETE | `/api/wishlist/[id]` | Stergere item wishlist |
| GET/POST | `/api/recurring` | Lista / adaugare plati recurente |
| DELETE | `/api/recurring/[id]` | Stergere plata recurenta |
| GET/POST | `/api/settings` | Citire / salvare setari user |
| DELETE | `/api/account` | Stergere cont cu cascade |
| GET | `/api/exchange-rates` | Cursuri valutare (cache 12h, open.er-api.com) |
| POST | `/api/chat` | Chat AI cu OpenAI gpt-4o |

---

## Functionalitati Principale

- **Autentificare** — NextAuth cu Credentials (email + parola), JWT sessions, bcryptjs 12 runde salt
- **Tranzactii** — CRUD income/expense cu date, titlu, suma
- **Avere neta** — Calculata din tranzactii, afisata cu grafice zi/saptamana/luna
- **Wishlist** — Obiective de economii cu progress bar
- **Plati recurente** — Urmarire plati cu frecventa (lunar/saptamanal/anual) si status
- **Cursuri valutare** — EUR/RON si USD/RON live, cache 12h in DB
- **Chat AI** — Asistent financiar pe baza OpenAI gpt-4o
- **Internationalizare** — Romana si Engleza, preferinta per user in DB
- **Tema** — Dark mode, CSS variables, design responsive

---

## Securitate

- Toate query-urile filtreza dupa `user_id` (no cross-user data)
- Validare email prin regex la inregistrare
- Parola minima 6 caractere
- Stergere cont cu tranzactie SQL (cascade pe toate tabelele)
- Sanitizare mesaje chat inainte de trimitere la OpenAI

---

## Status Verificari

| Data | Ce s-a verificat | Observatii |
|------|-----------------|------------|
| 2026-05-16 | Explorare completa structura proiect | Prima verificare, toate fisierele prezente, stack coerent |
| 2026-05-16 | Redesign complet pentru public 14-18 ani | i18n rescris, AI prompt nou, categorii tranzactii (DB+API+UI), landing page, sidebar, WelcomeScreen, RecurringCard (total lunar), WishlistCard (gradient progress), ChatDrawer greeting, CSS polish (culori mai vibrante, secțiune features) |

---

*Acest fisier este actualizat automat de Claude la fiecare verificare a aplicatiei.*
