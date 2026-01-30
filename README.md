# Radit-Raian.github.io
Welcome to my portfolio!
 <style>
        /* --- 1. CORE THEME & RESET --- */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        html, body {
            width: 100%; min-height: 100%;
            font-family: 'Roboto', 'Inter', sans-serif;
            color: #e5e7eb;
            background: #010409;
            scroll-behavior: smooth;
            overflow-x: hidden;
        }

        /* --- 2. BACKGROUND ENGINE LAYERS --- */
        #cosmos-engine {
            position: fixed; top: 0; left: 0;
            width: 100vw; height: 100vh;
            z-index: 0;
        }

        .aurora-wrap {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 1; opacity: 0.4; overflow: hidden;
        }
        .aurora-wave {
            position: absolute; width: 200%; height: 200%;
            background: radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.2) 0%, transparent 60%);
            filter: blur(80px); animation: auroraFlow 45s linear infinite;
        }
        @keyframes auroraFlow {
            0% { transform: translate(-15%, -15%) rotate(0deg); }
            100% { transform: translate(15%, 15%) rotate(360deg); }
        }

        /* --- 3. TOP NAVIGATION PANEL --- */
        header.top-panel {
            position: fixed; top: 0; width: 100%; height: 85px;
            background: rgba(1, 4, 9, 0.9);
            display: flex; justify-content: center; align-items: center;
            z-index: 1000; border-bottom: 1px solid rgba(147, 197, 253, 0.1);
            backdrop-filter: blur(20px);
        }

        .nav-list { display: flex; gap: 12px; list-style: none; }
        .nav-link {
            text-decoration: none; color: #94a3b8; font-size: 0.85rem;
            font-weight: 500; padding: 10px 22px; border-radius: 50px;
            border: 1.5px solid rgba(147, 197, 253, 0.2);
            background: rgba(15, 23, 42, 0.5);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-link:hover, .nav-link.active {
            color: #93c5fd; border-color: #93c5fd;
            background: rgba(147, 197, 253, 0.15);
            box-shadow: 0 0 20px rgba(147, 197, 253, 0.3);
            transform: translateY(-2px);
        }

        /* --- 4. HERO SECTION (GRID ARCHITECTURE) --- */
        main { position: relative; z-index: 10; }
        
        #hero { 
            min-height: 100vh; max-width: 1300px; margin: 0 auto;
            padding: 120px 2rem 50px; display: flex;
            align-items: center; justify-content: center;
        }

        .hero-grid {
            display: grid; grid-template-columns: 1.3fr 0.7fr;
            gap: 60px; align-items: center; width: 100%;
        }

        .hero-text-content { text-align: left; }

        .name-title {
            font-size: clamp(2.8rem, 6vw, 4.5rem);
            font-weight: 700; margin-bottom: 8px; color: #f8fafc;
            letter-spacing: -1.8px;
        }

        .subtitle {
            font-size: 1.4rem; color: #93c5fd; font-weight: 500;
            margin-bottom: 25px; text-shadow: 0 0 30px rgba(147, 197, 253, 0.3);
        }

        .social-links { display: flex; gap: 15px; margin-bottom: 30px; }
        .social-btn {
            width: 42px; height: 42px; border-radius: 50%;
            background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15);
            display: flex; align-items: center; justify-content: center;
            color: #ffffff; transition: all 0.3s ease;
        }
        .social-btn:hover {
            border-color: #93c5fd; background: rgba(147, 197, 253, 0.15);
            transform: translateY(-4px); color: #93c5fd;
        }
        .social-btn svg { width: 20px; height: 20px; fill: currentColor; }

        .bio-text {
            font-size: 1.05rem; line-height: 1.8; color: #b8c5d0;
            margin-bottom: 35px; text-align: justify; max-width: 750px;
        }

        .stats-group { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
        .stat-tag {
            padding: 10px 22px; border-radius: 50px;
            background: rgba(147, 197, 253, 0.03); border: 1.5px dashed rgba(147, 197, 253, 0.3);
            font-size: 0.8rem; font-weight: 500; color: #93c5fd;
        }

        /* Profile Image logic from reference */
        .hero-image-content { display: flex; justify-content: center; }
        .profile-wrapper { position: relative; width: 360px; height: 360px; }
        .profile-pic {
            width: 100%; height: 100%; border-radius: 50%; object-fit: cover;
            border: 4px solid rgba(147, 197, 253, 0.2);
            box-shadow: 0 0 0 12px rgba(147, 197, 253, 0.05), 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(147, 197, 253, 0.2);
        }

        /* --- 5. CONTENT SECTIONS --- */
        section { padding: 100px 2rem; max-width: 1200px; margin: 0 auto; opacity: 0; transform: translateY(40px); transition: all 0.8s ease-out; }
        section.active { opacity: 1; transform: translateY(0); }

        .section-header { text-align: center; margin-bottom: 60px; }
        .pill-header {
            font-size: 0.9rem; font-weight: 700; letter-spacing: 2px;
            color: #93c5fd; padding: 14px 45px; border-radius: 50px;
            border: 1.5px solid #93c5fd; background: rgba(147, 197, 253, 0.05);
            text-transform: uppercase;
        }

        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 35px; }
        .item {
            background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(15px);
            border: 1px solid rgba(147, 197, 253, 0.1); padding: 55px 40px;
            border-radius: 25px; text-align: center; transition: all 0.5s ease;
            text-decoration: none; color: inherit;
        }
        .item:hover { transform: translateY(-12px); border-color: #93c5fd; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .item h3 { font-size: 1.4rem; color: #93c5fd; margin-bottom: 10px; }

        footer { text-align: center; padding: 60px; border-top: 1px solid rgba(147, 197, 253, 0.1); color: #475569; }

        @media (max-width: 1024px) {
            .hero-grid { grid-template-columns: 1fr; text-align: center; }
            .hero-text-content { display: flex; flex-direction: column; align-items: center; }
            .hero-image-content { order: -1; }
            .profile-wrapper { width: 280px; height: 280px; }
            .bio-text { text-align: center; }
        }
    </style>

    header.top-panel {
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    height: 85px;
    background: rgba(1, 4, 9, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    border-bottom: 1px solid rgba(147,197,253,0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}

.nav-list {
    display: flex;
    gap: 24px;
}

.nav-link {
    color: #94a3b8;
    text-decoration: none;
    font-weight: 500;
    padding: 10px 22px;
    border-radius: 50px;
    transition: all 0.4s ease;
}

.nav-link.active,
.nav-link:hover {
    color: #93c5fd;
    background: rgba(147,197,253,0.15);
    box-shadow: 0 0 20px rgba(147,197,253,0.25);
}