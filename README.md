# [Project Title]
The African Pen

The African Pen is a data-efficient, smart-syncing exam preparation engine built to help students across Africa master high-stakes exams. While we pilot our platform with a high-barrier language engine (French oral and written logic), the underlying framework is entirely content-agnostic and built to seamlessly scale across any subject or syllabus, from junior secondary to final-year JAMB and WAEC.

## Team Members
- Igboeche Johnfavour Ikenna
- Joy Anurika Ozurumba
- 

---

## 🚀 Live Demo

*   **Live Application:** [https://wema-hackaholics7-0-hackathon-uyo-p-pearl.vercel.app/]
*   **Backend API:** [Link to your live backend API endpoint URL, if separate]
*   **Recorded Demo:** [https://www.loom.com/share/2b54411e7b104c0290144769969db3ec].


---

## 🎯 The Problem

*Which "How Might We..." question from the challenge brief are you tackling? Show the format by providing an example below.*

> **Example:** How might we help busy people organize their daily tasks more effectively?

### The Context
Traditional youth banking initiatives struggle with two main hurdles:
1. **The Utility Gap:** Young people rarely have an organic, daily reason to open or use a bank account[cite: 4].
2. **High Acquisition Costs:** Banks spend heavily on physical outreach to onboard student accounts, only for those accounts to sit dormant with zero deposits[cite: 4].

The African Pen solves this by tying academic effort directly to financial reward, transforming study habits into active banking relationships.

---

## ✨ Our Solution

**The African Pen** is a gamified exam prep platform that turns the solitary grind of studying into a lively, competitive sport. 

### How it Works
* **Gamified Daily Practice:** Students log in daily to practice syllabus-specific micro-lessons and compete in *Le Blitz*, a high-pressure, head-to-head timed quiz arena.
* **Smart Syncing Technology:** Designed for the African internet reality, the platform uses a local caching architecture. It syncs lightweight text strings rather than draining family mobile data balances on heavy videos.
* **Incentivized Account Opening:** To make financial utility an organic necessity, we host sponsored cohorts where top-performing students win cash prizes[cite: 4].
* **Frictionless Wema Integration:** When a student wins a prize, they can open a Tier-1 Wema savings account right inside our application using Wema’s sandbox APIs[cite: 4]. Their winnings are instantly transferred into their new account, converting high-school students into active, funded Wema Bank customers on day one[cite: 4].



---

## 🛠️ Tech Stack

Our platform is built with a lightweight, highly responsive, and data-friendly architecture.

* **Frontend:** React, Zustand (state management), Tailwind CSS, Lucide React
* **Backend:** Python Flask
* **Database:** SQLite (configured with Write-Ahead Logging for concurrent multi-cohort performance)
* **APIs / Integrations:** Simulated Wema Bank Sandbox APIs (Tier-1 Account Creation & Instant Transfer rails)[cite: 4]

---

## ⚙️ How to Set Up and Run Locally (Optional)

*Briefly explain the steps to get your project running on a local machine.*

**Example:**

1.  Clone the repository:
    ```bash
    git clone [https://github.com/Wema-Hackaholics-Hackathon/wema-hackaholics7-0-hackathon-uyo-project-the-african-pen.git]
    ```
2.  Navigate to the project directory:
    ```bash
    cd the-african-pen
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env.local` file and add the necessary environment variables:
    ```
    DATABASE_URL=...
    API_KEY=...
    ```
5.  Run the development server:
    ```bash
    npm run dev
    ```
