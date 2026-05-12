### DFD Level 0 (Context Diagram - Enhanced)
graph LR
    User["User"]
    System["CloudDoc-Manager System"]
    ExternalAI["External AI Service (Gemini)"]
    EmailSystem["Email Service (SMTP/Resend)"]
    
    User -- "Files (Binary), Metadata, AI Prompt, Editing Commands" --> System
    System -- "Processed Documents (PDF/Image), AI Responses, Share Links, Activity Logs" --> User
    
    System -- "Document Content / Prompts" --> ExternalAI
    ExternalAI -- "OCR Text / Summary / Chat Response" --> System
    
    System -- "Document Attachments" --> EmailSystem
    EmailSystem -- "Delivery Status" --> System

---

### DFD Level 1 (Advanced Functional Decomposition)
graph TD
    User["User"]
    
    subgraph "CloudDoc-Manager Backend Processes"
        P1["1.0 Security & Privacy (Auth, Vault, Expiry)"]
        P2["2.0 Ingestion & Versioning (Upload, Revisions)"]
        P3["3.0 Document Transformation (PDF/Image Edit)"]
        P4["4.0 Intelligent Analysis (OCR, AI Chat)"]
        P5["5.0 Distribution & Access (Sharing, Email)"]
        P6["6.0 Lifecycle & Compliance (Trash, Audit Logs)"]
    end
    
    subgraph "Data Storage (Cloud/Database)"
        DB_User["User Store (MongoDB)"]
        DB_Meta["Document Metadata & Versions (MongoDB)"]
        DB_Audit["Compliance Logs (MongoDB)"]
        S3_Bucket["Object Storage (Amazon S3 / Supabase)"]
    end

    %% Process 1: Security
    User -- "Login / Lock Vault" --> P1
    P1 -- "Verify Session" --> DB_User
    P1 -- "Update Privacy" --> DB_Meta

    %% Process 2: Ingestion
    User -- "Upload File / Restore Version" --> P2
    P2 -- "Store Metadata & History" --> DB_Meta
    P2 -- "Upload Binary" --> S3_Bucket
    
    %% Process 3: Transformation
    User -- "Merge/Split PDF, Crop/Resize/Watermark" --> P3
    P3 -- "Fetch Original" --> S3_Bucket
    P3 -- "Process (Sharp/PDF-Lib)" --> P3
    P3 -- "Store Result" --> S3_Bucket
    P3 -- "Update Log" --> DB_Audit

    %% Process 4: AI
    User -- "Ask Question / Summarize" --> P4
    P4 -- "Read Content" --> S3_Bucket
    P4 -- "Analyze" --> Gemini_API["Google Gemini API"]
    Gemini_API -- "Results" --> P4
    P4 -- "Update Metadata (Tags)" --> DB_Meta

    %% Process 5: Distribution
    User -- "Share Link / Email Doc" --> P5
    P5 -- "Link Token" --> DB_Meta
    P5 -- "Dispatch" --> SMTP["SMTP Server"]
    
    %% Process 6: Governance
    User -- "View Logs / Manage Trash" --> P6
    P6 -- "Manage Lifecycle" --> DB_Meta
    P6 -- "Query Logs" --> DB_Audit
    
    %% Implicit Logging
    P1 & P2 & P3 & P5 -- "Track Action" --> DB_Audit
