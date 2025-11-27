# 🍽️ Restaurant Avatar Demo

Single-table demo of live AI avatar assistant using HeyGen + Gemini.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

3. **Test credentials:**
   ```bash
   npm test
   ```

4. **Run demo:**
   ```bash
   npm start
   ```

5. **Open browser:** 
   ```
   http://localhost:3000
   ```

## 🔑 Required API Keys

1. **HeyGen** - https://app.heygen.com/settings/api (~$29/month)
2. **Gemini** - https://aistudio.google.com/app/apikey (FREE)

## 📋 What You'll See

- Live avatar video with lip-sync
- Natural AI conversation
- Real-time responses
- Simple order flow

## ✅ Success Criteria

- Avatar appears within 3 seconds
- Lips sync with speech perfectly
- Response time < 2 seconds
- Natural conversation flow

## 📊 System Requirements

- Node.js 18+
- Modern browser (Chrome recommended)
- Stable internet (2+ Mbps)

## 🆘 Troubleshooting

**Avatar not appearing:**
- Check HeyGen API key in .env
- Verify browser console for errors
- Try Chrome instead of other browsers

**No audio:**
- Check browser permissions
- Unmute video element
- Verify HeyGen session is active

**Slow responses:**
- Check internet speed
- Verify Gemini API quota
- Review network tab in browser

## 📈 Next Steps

Once this works:
1. Add LiveKit for multi-tablet support
2. Integrate Supabase for orders
3. Connect n8n for kitchen workflow
4. Deploy to production
5. Scale to 40+ tables

## 📞 Support

Check logs in Activity Log panel for real-time debugging.
