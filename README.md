# Stem Beauty — Creative Homepage UI & 3D Bubble Animation

> Technical Assessment: Creative Full-Stack Developer (MERN & Next.js)  
> Reference Website: [stembeauty.com](https://stembeauty.com)

A high-fidelity, pixel-accurate recreation of the **Stem Beauty** homepage, featuring authentic luxury editorial UI design, smooth kinetic typography, Lenis smooth scrolling, full-stack MongoDB/Express API capabilities, and a multi-layered **3D WebGL / Canvas Bubble Animation System** (Marching Cubes metaball physics, custom Fresnel refraction shaders, interactive mouse repulsion, and click-to-pop ambient particle dynamics).

---

## 🌟 Key Features & Highlights

### 1. High-Precision Homepage Recreation
- **Authentic Typography & Visual Styling**: Loaded with Stem Beauty's official `Degular Demo` (Regular, Thin, Medium) and `Metropolis` (Regular, Medium, Semi-Bold, Thin-Italic) typefaces, reproducing the editorial minimalism, neutral warm palette (`#EDE8E1`, `#D08C81`, `#141414`), and subtle border treatments.
- **Cinematic Video Hero**: Autoplaying background video with parallax scrub (`hero-video.mp4`) and responsive typography.
- **Interactive Collection Grid**: 4 featured products (*Hydra-Foam Cleanser*, *Reset Serum*, *Lash and Eye Conditioner*, *Hydra-Nutrition Essence*) with dual-image hover cross-fade zoom and instant cart integration.
- **Slide-Out Cart Drawer**: Full reactive cart context featuring free shipping threshold bar, quantity adjustments, item removal, and checkout actions.
- **Mobile Responsive Architecture**: Fluid breakpoint handling across mobile, tablet, and ultra-wide displays with an animated hamburger drawer navigation.

### 2. Multi-Layered Bubble Animation System

#### A. WebGL MarchingCubes Bubble Canvas 1 (Philosophy Section)
- **Metaball Fluid Coalescence**: 9 satellite droplets orbit and smoothly coalesce into one large iridescent bubble as the user scrolls into view.
- **Custom Fresnel & HDRI Refraction Shader**: Exact GLSL shader reproducing reflection, double-sided refraction (`refractDir = refract(-v, n, 0.74)`), specular glints, soft box-masked rim highlights, and thin-film color gradients using authentic Stem Beauty cubemap textures (`px.png`, `nx.png`, `py.png`, `ny.png`, `pz.png`, `nz.png`).
- **Interactive Pointer Fluid Influence**: Mouse position adds dynamic force and surface tension ripples across the MarchingCubes geometry.
- **Synchronized SVG Annotations**: Animated SVG polylines and pulsed node badges highlight *Supporting*, *Recover*, and *Maintain* skin health principles.

#### B. WebGL MarchingCubes Sticky Bubble Canvas 2 (4 Essential Steps)
- **Sticky Scroll Projection**: The bubble tracks viewport scroll progress through the 4 sequential ritual steps (*Cleanse*, *Repair*, *Nourish*, *Shield*).
- **Smooth Trajectory Curves**: Moves along custom 3D coordinate trajectories with rotational tilt, sine wave velocity displacement, and fluid scatter.
- **Internal Product Image Projections**: Quads mapped with circular soft-mask shaders cross-fade between product renders (`1.png`, `2.png`, `3.png`, `4.png`, `products-img.png`) within the refractive bubble interior.
- **Ritual Completion Reveal**: Expands upon completion of step 4 into the 150dvh `.steps__expand` scroll zone, displaying all 4 products together within the giant bubble and revealing the authentic floating **"SHOP"** call-to-action button.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | **Next.js 14** (App Router, Server & Client Components) |
| **UI Library** | **React 18** (TypeScript, Hooks, Context API) |
| **Styling & Layout** | **Tailwind CSS**, Custom CSS Transitions, Responsive Grid & Flexbox |
| **3D & Canvas Graphics** | **Three.js**, **MarchingCubes** (Isosurface Polygonizer), Custom GLSL Shaders |
| **Animation & Physics** | **GSAP (GreenSock)**, **ScrollTrigger**, **Lenis** (Inertial Smooth Scrolling) |
| **Backend & APIs** | **Next.js Route Handlers** (`/api/newsletter`, `/api/products`), **Express.js** (`server/server.js`) |
| **Database** | **MongoDB** (Mongoose ORM with automatic resilient in-memory fallback) |
| **Icons & Media** | **Lucide React**, WebP/JPEG/PNG textures, MP4 video |

---

## 📂 Project Structure

```text
├── public/
│   └── assets/                     # Cubemaps, product textures, webfonts, SVGs & video
│       ├── px.png, nx.png, ...      # Three.js 6-sided HDRI cubemap textures
│       ├── 1.png, 2.png, ...        # Step ritual internal bubble textures
│       ├── hero-video.mp4           # Cinematic editorial hero video
│       ├── DegularDemo-*.woff2      # Authentic webfonts
│       └── Metropolis-*.woff2       # Authentic body webfonts
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── newsletter/route.ts  # POST subscription handler with MongoDB
│   │   │   └── products/route.ts    # GET product catalog API
│   │   ├── globals.css              # Font faces, link animations, utilities
│   │   ├── layout.tsx               # Root layout, LenisProvider, CartProvider, Metadata
│   │   └── page.tsx                 # Composed Homepage sections
│   ├── components/
│   │   ├── bubbles/
│   │   │   ├── bubbleShaders.ts             # Custom GLSL vertex & fragment shaders
│   │   │   ├── createMarchingBubble.ts      # Three.js MarchingCubes WebGL engine
│   │   │   ├── PhilosophyBubbleCanvas.tsx   # Canvas 1: Coalescing metaballs + annotations
│   │   │   └── StepsStickyBubbleCanvas.tsx  # Canvas 2: Sticky 4-step ritual journey
│   │   ├── cart/
│   │   │   └── CartDrawer.tsx               # Slide-over cart drawer with threshold bar
│   │   ├── collection/
│   │   │   └── CollectionSection.tsx        # 4 product cards with dual-image hover
│   │   ├── footer/
│   │   │   └── Footer.tsx                   # Footer with real API newsletter form
│   │   ├── header/
│   │   │   ├── Header.tsx                   # Sticky nav, animated links, cart counter
│   │   │   └── MobileMenu.tsx               # Slide-over mobile drawer
│   │   ├── hero/
│   │   │   └── HeroSection.tsx              # Fullscreen video with parallax scrub
│   │   ├── philosophy/
│   │   │   └── PhilosophySection.tsx        # "Our products are designed as Skin Fitness Tools"
│   │   ├── skin-fitness/
│   │   │   └── SkinFitnessSection.tsx       # Parallax editorial banner
│   │   ├── steps/
│   │   │   └── StepsSection.tsx             # 4 essential steps sticky scroll section
│   │   └── ui/
│   │       └── LenisProvider.tsx            # Smooth inertial scroll provider
│   ├── context/
│   │   └── CartContext.tsx                  # Global cart state & persistence
│   ├── lib/
│   │   ├── mongodb.ts                       # Cached MongoDB connection with fallback
│   │   └── utils.ts                         # Tailwind clsx/twMerge utilities
│   └── models/
│       ├── Product.ts                       # Product types & initial data
│       └── Subscriber.ts                    # Mongoose subscriber model
├── server/
│   └── server.js                            # Standalone Express.js MERN server
├── .env.example                             # Environment variable template
├── next.config.mjs                          # Next.js configuration
├── tailwind.config.ts                       # Tailwind theme extensions
└── tsconfig.json                            # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **yarn** or **pnpm**
- *(Optional)* A running **MongoDB** instance (local or MongoDB Atlas). If omitted, the application runs seamlessly using a resilient in-memory fallback.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Akash09783/Interview-Assignment-1.git
   cd Interview-Assignment-1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *(Defaults are pre-configured to work out of the box).*

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **(Optional) Run Standalone Express Server**:
   ```bash
   npm run server
   ```
   Launches the Express backend on `http://localhost:5000`.

6. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🧪 Verification & Testing
- **Visual Accuracy**: Verified against `stembeauty.com` typography, colors, padding, and layout hierarchy.
- **WebGL Performance**: MarchingCubes operates at up to 100 FPS with responsive polycount scaling (`112` desktop / `68` mobile) and automatic IntersectionObserver pausing when off-screen.
- **Scroll Synchronization**: Verified step tracking across desktop, tablet, and mobile views with Lenis smooth scroll and GSAP ScrollTrigger.
- **Reduced Motion**: Verified that setting `prefers-reduced-motion: reduce` gently pauses ambient floating drift and provides accessible transitions.

---

## 📦 Deployment Instructions

### Deploy to Vercel (Recommended)
1. Push code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete Stem Beauty homepage with 3D bubble animation"
   git push origin master
   ```
2. Import the repository into [Vercel](https://vercel.com).
3. Under Environment Variables, add `MONGODB_URI` (optional, for persistent MongoDB).
4. Click **Deploy**. Vercel will automatically build the Next.js App Router app and generate your live deployment URL.

---

## 📄 License & Attribution
- Built for technical evaluation purposes.
- Reference Design & Trademarks: **Stem Beauty** ([stembeauty.com](https://stembeauty.com)).

