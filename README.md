Let's have a Try: https://clouddoc-manager-interface.onrender.com/
# CloudDocSaver — Cloud Document Manager 

CloudDocSaver Pro is a **free Full stack based cloud document manager** that allows users to securely **upload, manage, resize, convert, version, and download** their image/PDF documents. Supabase is used as the primary storage, and email notifications are sent on uploads/downloads.

## Features

### Core Features
- User Authentication (JWT + bcrypt + Email-based 2FA)
- Upload Images & PDFs only (JPG, PNG, GIF, PDF)
- Large Upload Support 
- Tag Documents  
- Favorites & Pin  
- Document Preview  
- Versioning  
- Resize/Compress  
- Download in Multiple Formats  
- Search, Bulk ZIP, Drag-and-drop  
- Responsive UI

### Extra Features
- Auto Tag Suggestions  
- Email Notifications  
- Analytics Dashboard  
- Feedback Page  

## Tech Stack
- **Frontend:** React, Tailwind, Framer Motion  
- **Backend:** Node.js, Express, Multer, Sharp  
- **Database:** MongoDB Atlas  
- **Storage:** Google Drive API  
- **Email:** Nodemailer  
- **Hosting:** Vercel/Netlify + Railway/Render  

## Installation

### Backend
```
cd backend
npm install
npm run dev
```

`.env` file:
```
PORT=8080
MONGO_URI=
JWT_ACCESS_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=
GOOGLE_DRIVE_FOLDER_ID=
```

### Frontend
```
cd frontend
npm install
npm run dev
```

## Usage
1. Register (email OTP)  
2. Upload files  
3. Tag, pin, favorite  
4. Resize & download  
5. Search  
6. Bulk ZIP  
7. Analytics  
8. Feedback  

