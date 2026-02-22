# 💕 Our Love Story - Anniversary Website

A beautiful, romantic anniversary website with dreamy animations, floating hearts, and a love letter.

## 🌹 Features

- ✨ **Splash Screen** - "I made something for you... tap to open"
- 🌙 **Hero Section** - Starry night sky with shimmering title
- ⏱️ **Live Counter** - Days, hours, minutes & seconds together
- 📸 **Memories Timeline** - Beautiful cards to add your stories & photos
- 💌 **Love Letter** - Handwritten-style romantic letter
- 🎵 **Background Music** - Soft romantic melody (Web Audio API)
- 💗 **Floating Hearts** - Animated hearts rising across the screen
- ✨ **Sparkle Trail** - Mouse cursor sparkle effect

## 📁 Project Structure

```
love-site/
├── index.html              # Main page (links all modules)
├── css/
│   ├── base.css            # Variables, reset, common styles
│   ├── splash.css          # Splash screen styles
│   ├── hero.css            # Hero section
│   ├── counter.css         # Days counter section
│   ├── memories.css        # Memories timeline
│   ├── letter.css          # Love letter section
│   ├── effects.css         # Floating hearts, sparkles, music btn
│   └── footer.css          # Footer styles
├── js/
│   ├── config.js           # ⚙️ EDIT THIS - your date & names
│   ├── counter.js          # Counter logic
│   ├── effects.js          # Splash, hearts, sparkles
│   ├── music.js            # Background music
│   └── animations.js       # Scroll reveal animations
└── README.md
```

## 🔀 Branch Structure

| Branch | What to edit |
|--------|-------------|
| `main` | Complete working site |
| `section/hero` | Hero section (title, subtitle, background) |
| `section/counter` | Days together counter |
| `section/memories` | Photo gallery & timeline cards |
| `section/love-letter` | Love letter content & styling |
| `section/music-effects` | Music, floating hearts, sparkles |
| `section/footer` | Footer message & styling |

## ⚙️ How to Personalize

1. Edit `js/config.js` → Set your **anniversary date**
2. Edit memory cards in `index.html` → Add your **real stories**
3. Replace `📸` placeholders with `<img src="your-photo.jpg">` tags
4. Edit the love letter text in `index.html`

## 🚀 Deploy to GitHub Pages

```bash
git remote add origin https://github.com/YOUR_USERNAME/love-site.git
git push -u origin main
# Push all branches
git push origin --all
```

Then go to **Settings → Pages → Source: main branch** → Save!

Your site will be live at: `https://YOUR_USERNAME.github.io/love-site/`

---
*Made with 💕*
