# AI Personal Finance Dashboard

A privacy-focused personal finance dashboard built with Next.js, TypeScript, and AI-powered insights. All your data stays in your browser - no cloud storage, no tracking, complete privacy.

## ✨ Features

- **🔒 100% Privacy-Focused**: All data stored locally in your browser
- **🤖 AI-Powered Insights**: Optional Hugging Face API integration for intelligent analysis
- **🎤 Voice Input**: Add transactions using voice commands
- **💬 Natural Language Queries**: Ask questions about your finances
- **📊 Beautiful Charts**: Visualize your spending with interactive charts
- **🎯 Goal Tracking**: Set and track savings goals with AI suggestions
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🎨 Smooth Animations**: Polished UI with Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone git@github.com:ruhulaminparvez/ai-finance-dashboard.git
cd ai-finance-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

### Adding Transactions

1. Go to the Dashboard
2. Fill in the transaction form:
   - Select Income or Expense
   - Choose a category
   - Enter amount
   - Select date
   - Add optional note
3. Click "Add Transaction"

### Voice Input

You can add transactions using voice commands:

- "Add expense 500 taka food today"
- "Income 5000 salary"
- "Expense 200 transport yesterday"

The app will automatically parse:
- Transaction type (income/expense)
- Amount
- Category
- Date (today/yesterday)
- Notes

### AI Insights

1. Go to the **AI Insights** page
2. Optionally add your Hugging Face API key for enhanced AI analysis
3. View automatic insights about your spending patterns
4. Ask natural language questions like:
   - "How much did I spend on food in August?"
   - "What's my total income this month?"

### Goals

1. Go to the **Goals** page
2. Click "New Goal"
3. Set target amount and deadline
4. Track progress and get AI suggestions for monthly savings needed

### Settings

- **Export Data**: Download all your data as JSON
- **Import Data**: Restore from a backup file
- **Clear Data**: Permanently delete all data (use with caution!)

## 🔧 Configuration

### Optional: Hugging Face API

For enhanced AI insights, you can add your Hugging Face API key:

1. Get a free API key from [Hugging Face](https://huggingface.co/settings/tokens)
2. Go to Settings → AI Configuration
3. Enter your API key
4. The key is stored locally and only used for AI requests

**Note**: The app works perfectly without an API key using local pattern detection.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: Zustand
- **Date Handling**: Day.js
- **AI**: Hugging Face Inference API (optional)

## 📁 Project Structure

```
src/
 ├─ app/
 │   ├─ page.tsx               // Dashboard
 │   ├─ insights/page.tsx      // AI insights
 │   ├─ goals/page.tsx         // Savings goals
 │   └─ settings/page.tsx      // Settings
 ├─ components/
 │   ├─ charts/                // Chart components
 │   ├─ forms/                 // Form components
 │   ├─ ai/                    // AI components
 │   └─ ui/                    // UI components
 ├─ store/
 │   └─ financeStore.ts        // Zustand store
 ├─ lib/
 │   ├─ ai.ts                  // AI utilities
 │   ├─ analytics.ts           // Analytics functions
 │   └─ storage.ts             // Local storage
 └─ types/
     └─ finance.ts             // TypeScript types
```

## 🔒 Privacy

- **No Cloud Storage**: All data stored in browser localStorage
- **No Tracking**: Zero analytics or tracking scripts
- **No Server**: Runs entirely client-side
- **Optional AI**: AI features work locally; API key only used for enhanced insights
- **Export/Import**: Full control over your data

## 🎯 Features in Detail

### Natural Language Queries

Ask questions in plain English:
- "How much did I spend on food?"
- "What's my income this month?"
- "Show me expenses in August"

### Pattern Detection

Automatic detection of:
- High spending categories
- Overspending warnings
- Low savings rate alerts
- Month-over-month comparisons

### Goal Suggestions

AI calculates:
- Monthly savings needed to reach goals
- Progress tracking
- Deadline reminders

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

This is a personal finance tool. Always verify important financial decisions with a professional advisor. The AI insights are suggestions, not financial advice.

---

Built with ❤️ for privacy-conscious users
