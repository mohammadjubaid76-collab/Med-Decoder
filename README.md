# Med-Decoder – Vernacular Lab Report Simplifier
> **"अब मेडिकल रिपोर्ट पढ़ना होगा आसान!"**  
> *Empowering patients across India to understand complex medical reports in simple Hindi, Marathi, and English.*

---

## 🏥 Overview

**Med-Decoder** is a modern, professional, AI-powered healthcare SaaS platform built to bridge India's health literacy barrier. While over 80% of families in India communicate in regional languages, clinical pathology reports are routinely issued in dense technical medical English. 

Med-Decoder enables patients and caregivers to upload laboratory reports (CBC, Lipid Profile, Liver Function, Kidney Function, Diabetes Panel) and doctor prescriptions, automatically providing:
1. **Plain-Language Vernacular Explanations**: Seamless toggling between **English**, **हिंदी (Hindi)**, and **मराठी (Marathi)**.
2. **Clinical Range Visualizations**: Color-coded status indicators (Normal green, High red, Low orange, Borderline yellow) with relative spectrum charts.
3. **Three Questions to Ask Your Doctor**: Pre-calculated, medically grounded questions to bring to the physician's appointment.
4. **Prescription Handwriting Decoder**: Optical analysis of handwritten doctor slips with confidence scoring, schedule clarification, and safety flags ("Verify with pharmacist").
5. **Strict Safety & Health Literacy Guardrails**: Prominent educational disclaimers with zero self-treatment hallucination.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with custom medical design system (#123B66 Navy Blue, #2563EB Medical Blue, #14B8A6 Teal)
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans & JetBrains Mono (tabular numerals)

---

## 🚀 Installation & Local Execution

### Prerequisites
- Node.js (version 18+ or 20+ recommended)
- npm or yarn

### Steps

1. **Clone the repository and enter the directory**:
   ```bash
   cd med-decoder
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Typecheck & Lint**:
   ```bash
   npm run lint
   ```

---

## 📂 Project Architecture

```
/
├── index.html                   # HTML entry point with Plus Jakarta Sans & JetBrains Mono
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies & scripts
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
├── src/
│   ├── main.tsx                 # Root render entry
│   ├── App.tsx                  # BrowserRouter, route definitions, AppProvider
│   ├── index.css                # Global styles and font definitions
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces (LabReport, Prescription, Status, VernacularText)
│   ├── translations/
│   │   └── index.ts             # Multilingual dictionary for English, Hindi, and Marathi
│   ├── services/
│   │   └── api.ts               # Backend API integration service with mock fallbacks
│   ├── data/
│   │   ├── sampleReports.ts     # Realistic CBC, Lipid, and Diabetic Panel datasets
│   │   └── samplePrescriptions.ts # Realistic prescription extracts with confidence scores
│   ├── context/
│   │   └── AppContext.tsx       # Global state for language, reports, prescriptions, and toasts
│   ├── layouts/
│   │   ├── PublicLayout.tsx     # Landing & public pages shell (Navbar + Footer)
│   │   └── DashboardLayout.tsx  # SaaS workspace shell (Sidebar + Breadcrumb Header)
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx       # Top Bar Contract header
│   │   │   ├── Sidebar.tsx      # Collapsible responsive dashboard sidebar
│   │   │   ├── Footer.tsx       # Healthcare SaaS footer
│   │   │   ├── LanguageSelector.tsx # Segmented language switch (EN/HI/MR)
│   │   │   ├── StatusBadge.tsx  # Accessible normal/high/low/borderline badges
│   │   │   ├── MedicalDisclaimer.tsx # Standardized educational disclaimer
│   │   │   └── Toast.tsx        # Notification toast manager
│   │   ├── dashboard/
│   │   │   ├── DashboardCard.tsx # KPI stat card with tabular numerals
│   │   │   └── RecentReportsTable.tsx # Historical reports list with action buttons
│   │   ├── report/
│   │   │   ├── UploadBox.tsx    # Drag-and-drop file uploader with preview & progress
│   │   │   ├── ReportSummary.tsx # Clinical report overview card
│   │   │   ├── TestResultTable.tsx # Parameter table with spectrum range bar
│   │   │   └── DoctorQuestions.tsx # 3 Doctor questions with copy feature
│   │   └── prescription/
│   │       ├── PrescriptionUploadBox.tsx # Rx camera upload & sample loader
│   │       └── PrescriptionCard.tsx # Handwriting clarity score & pharmacist flags
│   └── pages/
│       ├── LandingPage.tsx      # Public landing with hero visual & test preloads
│       ├── DashboardPage.tsx    # SaaS overview with KPI statistics
│       ├── UploadReportPage.tsx # Report upload interface
│       ├── ReportAnalysisPage.tsx # Detailed analysis results & print export
│       ├── PrescriptionDecoderPage.tsx # Doctor handwriting decoder
│       ├── MyReportsPage.tsx    # Archive and search for past reports
│       ├── HowItWorksPage.tsx   # 4-stage clinical explanation pipeline
│       ├── AboutPage.tsx        # Vernacular mission & clinical safety
│       ├── SettingsPage.tsx     # User language & demographic profile
│       └── HelpSupportPage.tsx  # FAQ and patient emergency notice
```

---

## 🔌 Backend API Integration Contract

All frontend API calls are centralized in `/src/services/api.ts`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/reports/upload` | Uploads PDF or image document to storage |
| `POST` | `/api/reports/decode` | Runs OCR, normalizes ranges, and generates vernacular translation |
| `POST` | `/api/prescriptions/decode` | Transcribes doctor handwriting and flags ambiguous items |
| `GET` | `/api/reports` | Retrieves user's decoded lab report history |
| `GET` | `/api/reports/:id` | Fetches a specific report by ID |

*Environment Variable*: Set `VITE_API_BASE_URL` in `.env` to connect to your live backend endpoint. When running without a backend, the built-in clinical demo engine provides instantaneous testing with realistic simulated data.

---

## ⚖️ Safety & Medical Disclaimer

> **Med-Decoder is an educational health-literacy tool.** It does not provide medical diagnosis, treatment recommendations, or dosage instructions. Always consult a qualified healthcare professional before taking any clinical action.
