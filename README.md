# Tushar Kumar Barman - High Performance Portfolio 🚀

A high-performance, dark-mode native portfolio built with raw HTML/CSS and a modern Node.js backend. This project incorporates interactive physics-based UI elements, real-time metrics tracking, and cloud-hosted assets seamlessly stitched together without heavy frontend frameworks.

---

## 🏗️ High-Level Design (HLD)

The architecture is explicitly designed to be ultra-lightweight on the client side while maintaining robust persistent tracking and file serving on the backend.

![High Level Design Architecture](hld.png)

### 1. The Presentation Layer (Frontend)
Located entirely inside `index.html`. 
*   **Vanilla Excellence:** Zero heavy frontend frameworks (no React/Vue). This ensures perfect Lighthouse performance scores and instantaneous TTFB (Time to First Byte).
*   **Interactive Physics:** Implements physics-simulated keyframe CSS animations (e.g., The pull-string physics logic and the Rock Lee 8-Gates interactive sprite).
*   **Typography:** Dynamically mapped to the modern `Geist` and `Geist Mono` CDN structure.

### 2. The Compute Node (Backend)
Located in `server.js` and hosted as a Web Service on Render.
*   **Architecture:** A native Node.js HTTP server.
*   **Decoupled State:** Validates API routes (`/api/visitors`, `/api/resume`) and safely mediates traffic to the Cloud Database safely behind CORS barriers without exposing direct API manipulation to the client.

### 3. Database & Object Storage (Supabase)
*   **Metrics:** A highly scalable PostgreSQL table responsible solely for iterating cross-session unique visitor counts.
*   **Asset Bucket:** A dedicated edge-cached Object Storage bucket hosting static binaries (like the user's PDF Resume), allowing hot-swapping of the document without pushing direct Git commits to the deployment pipeline.

---

## 🛠️ Local Development

### Prerequisites
*   Node.js (v18+)
*   A Supabase Project (with a `metrics` table & public bucket)

### Setup
1. Clone the repository: `git clone https://github.com/callmetushar123/Portfolio.git`
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory:
   ```env
   SUPABASE_URL=your_project_url
   SUPABASE_KEY=your_anon_key
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Navigate to `http://localhost:3000`

---

## ☁️ Deployment (Render)

This project contains Infrastructure as Code via `render.yaml`. 
To deploy, simply link this repository to your Render account via a **Blueprint Deployment**. Render will automatically detect the configuration, build the environment, and prompt you securely for your Supabase `.env` variables!
