# Testing Instructions for Reviewers - YouTube Subtitle Translator

## Overview

This document provides step-by-step testing instructions for reviewers to verify all features of the YouTube Bilingual Subtitle Translator extension. The extension translates YouTube subtitles in real-time using AI providers and displays bilingual subtitles.

**Current Version:** 1.5.3  
**Supported Browsers:** Chrome, Edge (Chromium-based)  
**Supported Languages:** 10 interface languages

---

## Prerequisites for Testing

### Required Items

1. **API Key from an AI Provider** (choose one):
   - OpenAI API key (recommended for testing: https://platform.openai.com/api-keys)
   - Google Gemini API key
   - Anthropic Claude API key
   - DeepSeek API key
   - Azure OpenAI credentials
   - Any OpenAI-compatible API endpoint

2. **Test Video**:
   - Any YouTube video with native subtitles/captions enabled
   - Recommended test video: https://www.youtube.com/watch?v=jNQXAC9IVRw (has English subtitles)

### Installation

1. Load the unpacked extension in your browser
2. Pin the extension icon to the toolbar for easy access

---

## Core Feature Testing

### Test 1: Initial Setup and Configuration

**Purpose:** Verify basic setup and API configuration

**Steps:**
1. Click the extension icon to open the popup
2. Select an AI provider from the dropdown menu (e.g., "OpenAI")
3. Observe that the "Model Name" field auto-fills with the appropriate model (e.g., "gpt-4o-mini")
4. Enter your API key in the "API Key" field
5. Select a target translation language (e.g., "Chinese (Simplified)")
6. Click "Test Connection" button
7. Wait for the test result

**Expected Results:**
- ✅ Provider dropdown shows: OpenAI, Azure OpenAI, Anthropic (Claude), Google Gemini, DeepSeek, Custom
- ✅ Model name auto-fills when provider is selected
- ✅ Test connection shows success message with green checkmark
- ✅ Settings can be saved successfully

**Note:** If test fails, verify API key is valid and has credits/quota available.

---

### Test 2: Real-time Subtitle Translation

**Purpose:** Verify core translation functionality

**Steps:**
1. Ensure extension is configured (Test 1 completed)
2. Open a YouTube video with subtitles: https://www.youtube.com/watch?v=jNQXAC9IVRw
3. Enable subtitles on the video (click CC button)
4. Play the video
5. Observe the subtitle overlay appearing below the original subtitles

**Expected Results:**
- ✅ Translated subtitles appear in a colored overlay box
- ✅ Both original and translated text are visible simultaneously
- ✅ Translations update in sync with the video
- ✅ No flickering or rapid changes in translated text (smart debouncing active)

---

### Test 3: Smart Debouncing Technology

**Purpose:** Verify flickering elimination on word-by-word subtitles

**Steps:**
1. Find a news video or live stream with word-by-word captions
2. Play the video and observe subtitle behavior
3. Watch for at least 30 seconds

**Expected Results:**
- ✅ Translations appear smoothly without flickering
- ✅ Complete sentences translate immediately when sentence-ending punctuation appears (. ! ? 。！？)
- ✅ Partial sentences wait briefly before translating (500ms delay)
- ✅ Maximum wait time is 2000ms even for incomplete sentences

---

### Test 4: Subtitle Customization

**Purpose:** Verify customization options work correctly

**Steps:**
1. Open the extension popup
2. Change "Text Color" to red (#FF0000)
3. Change "Font Size" to 24px
4. Change "Background Color" to yellow (#FFFF00)
5. Click "Save Settings"
6. Play a YouTube video with subtitles

**Expected Results:**
- ✅ Subtitle text appears in red
- ✅ Font size is noticeably larger (24px)
- ✅ Background color is yellow
- ✅ Settings persist after closing and reopening the popup

---

### Test 5: Draggable Subtitle Positioning

**Purpose:** Verify subtitle overlay can be repositioned

**Steps:**
1. Play a YouTube video with subtitles enabled
2. Wait for translated subtitle overlay to appear
3. Click and drag the subtitle overlay to different positions on the screen
4. Try positioning it in all four corners
5. Navigate to a different video

**Expected Results:**
- ✅ Subtitle overlay can be dragged smoothly
- ✅ Position updates in real-time while dragging
- ✅ Overlay stays within video player boundaries
- ✅ Position resets when navigating to a new video

---

### Test 6: Multilingual Interface

**Purpose:** Verify interface language switching

**Steps:**
1. Change browser language to Chinese (Simplified): chrome://settings/languages
2. Restart browser
3. Open the extension popup
4. Observe all UI text

**Expected Results:**
- ✅ All UI text appears in Chinese
- ✅ Buttons, labels, and messages are properly translated
- ✅ No untranslated English text visible

**Supported Languages to Test:**
- English (en)
- Simplified Chinese (zh_CN)
- Traditional Chinese (zh_TW)
- Japanese (ja)
- Korean (ko)
- Dutch (nl)
- French (fr)
- German (de)
- Spanish (es)
- Ukrainian (uk)

---

### Test 7: Multiple AI Provider Support

**Purpose:** Verify different AI providers work correctly

**Steps:**
1. Test with OpenAI:
   - Select "OpenAI" from provider dropdown
   - Verify model auto-fills to "gpt-4o-mini"
   - Test connection and translate a video

2. Test with Google Gemini (if you have API key):
   - Select "Google Gemini"
   - Verify model auto-fills to "gemini-1.5-flash"
   - Test connection and translate a video

3. Test with Custom endpoint:
   - Select "Custom"
   - Enter a custom API endpoint
   - Enter custom model name
   - Test connection

**Expected Results:**
- ✅ Each provider has appropriate default model
- ✅ API endpoint auto-fills for known providers
- ✅ Custom provider allows manual endpoint entry
- ✅ Translations work with different providers

---

### Test 8: Automatic State Management

**Purpose:** Verify automatic reset and cleanup

**Steps:**
1. Play a video with subtitles and wait for translations to appear
2. Navigate to a different YouTube video
3. Observe subtitle overlay behavior
4. Toggle subtitles off and on using YouTube's CC button
5. Observe subtitle overlay behavior

**Expected Results:**
- ✅ Subtitle overlay clears when navigating to new video
- ✅ Overlay reappears automatically when new video has subtitles
- ✅ Overlay disappears when subtitles are disabled
- ✅ Overlay reappears when subtitles are re-enabled
- ✅ No duplicate overlays appear

---

### Test 9: Settings Persistence

**Purpose:** Verify settings sync across browser sessions

**Steps:**
1. Configure all settings (API key, provider, language, colors)
2. Click "Save Settings"
3. Close the browser completely
4. Reopen the browser
5. Open the extension popup

**Expected Results:**
- ✅ All settings are preserved
- ✅ API key is still present (stored securely)
- ✅ Provider selection is remembered
- ✅ Customization settings (colors, font size) are preserved

---

## Privacy and Security Testing

### Test 10: Local Storage Verification

**Purpose:** Verify no data is sent to external servers

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Configure the extension with an API key
4. Play a YouTube video with subtitles
5. Monitor network requests

**Expected Results:**
- ✅ API calls only go to the selected AI provider (e.g., api.openai.com)
- ✅ No requests to unknown third-party servers
- ✅ No analytics or tracking requests
- ✅ API key is never transmitted except to the AI provider

---

### Test 11: Data Storage Inspection

**Purpose:** Verify data is stored locally only

**Steps:**
1. Open browser DevTools (F12)
2. Go to Application > Storage > Extension Storage
3. Inspect stored data

**Expected Results:**
- ✅ Only configuration data is stored (API key, settings)
- ✅ No browsing history stored
- ✅ No video URLs stored
- ✅ No subtitle content stored permanently

---

## Edge Cases and Error Handling

### Test 12: Invalid API Key

**Purpose:** Verify proper error handling

**Steps:**
1. Enter an invalid API key
2. Click "Test Connection"
3. Try to translate a video

**Expected Results:**
- ✅ Test connection shows clear error message
- ✅ Error message is user-friendly and actionable
- ✅ Extension doesn't crash

---

### Test 13: Videos Without Subtitles

**Purpose:** Verify graceful handling of videos without subtitles

**Steps:**
1. Open a YouTube video without subtitles
2. Observe extension behavior

**Expected Results:**
- ✅ No subtitle overlay appears
- ✅ No error messages shown to user
- ✅ Extension remains functional

---

### Test 14: Network Interruption

**Purpose:** Verify behavior during network issues

**Steps:**
1. Start playing a video with subtitles
2. Disconnect internet briefly
3. Reconnect internet

**Expected Results:**
- ✅ Extension handles network errors gracefully
- ✅ Translations resume when connection is restored
- ✅ No crash or permanent failure

---

## Performance Testing

### Test 15: Memory Usage

**Purpose:** Verify extension doesn't cause memory leaks

**Steps:**
1. Open browser Task Manager (Shift+Esc in Chrome)
2. Play multiple videos with subtitles for 10+ minutes
3. Navigate between videos multiple times
4. Monitor extension's memory usage

**Expected Results:**
- ✅ Memory usage remains stable
- ✅ No continuous memory growth
- ✅ Memory is released when videos are closed

---

### Test 16: CPU Usage

**Purpose:** Verify extension doesn't cause excessive CPU usage

**Steps:**
1. Open browser Task Manager
2. Play a video with subtitles
3. Monitor CPU usage

**Expected Results:**
- ✅ CPU usage is minimal (< 5% on average)
- ✅ No CPU spikes during normal operation
- ✅ Smart debouncing reduces unnecessary API calls

---

## Compatibility Testing

### Test 17: Different YouTube Layouts

**Purpose:** Verify compatibility with various YouTube interfaces

**Steps:**
1. Test on regular YouTube video page
2. Test on YouTube embedded player
3. Test on YouTube mobile view (if applicable)
4. Test with YouTube Theater mode
5. Test with YouTube Fullscreen mode

**Expected Results:**
- ✅ Subtitles work on all layouts
- ✅ Overlay positioning adapts to different modes
- ✅ No UI conflicts with YouTube interface

---

## Summary Checklist

Use this checklist to ensure all critical features have been tested:

- [ ] Initial setup and configuration (Test 1)
- [ ] Real-time subtitle translation (Test 2)
- [ ] Smart debouncing (Test 3)
- [ ] Subtitle customization (Test 4)
- [ ] Draggable positioning (Test 5)
- [ ] Multilingual interface (Test 6)
- [ ] Multiple AI providers (Test 7)
- [ ] Automatic state management (Test 8)
- [ ] Settings persistence (Test 9)
- [ ] Privacy verification (Test 10, 11)
- [ ] Error handling (Test 12, 13, 14)
- [ ] Performance (Test 15, 16)
- [ ] Compatibility (Test 17)

---

## Known Limitations

1. **API Costs:** Users are responsible for API costs from their chosen provider
2. **Subtitle Availability:** Extension requires videos to have native subtitles/captions
3. **Translation Quality:** Depends on the selected AI model and provider
4. **Language Support:** Translation target languages depend on AI provider capabilities

---

## Support Information

For issues or questions during testing:
- **Documentation:** https://yt-subtitle-translator.magang.net/
- **Privacy Policy:** https://yt-subtitle-translator.magang.net/privacy.html
- **Changelog:** https://yt-subtitle-translator.magang.net/changelog.html

---

## Reviewer Notes

**Important Points to Verify:**

1. ✅ **No Data Collection:** Extension does not collect any personal data
2. ✅ **Local Storage Only:** All data stored locally in browser
3. ✅ **Direct API Calls:** API calls go directly to user's chosen provider
4. ✅ **No External Dependencies:** No third-party analytics or tracking
5. ✅ **Open Source:** Code is transparent and auditable

**Security Considerations:**

- API keys are stored using Chrome's secure storage API
- No API keys are transmitted to any server except the user's chosen AI provider
- No browsing history or video URLs are stored or transmitted
- Extension only accesses YouTube pages (as declared in manifest permissions)

Thank you for reviewing this extension!
