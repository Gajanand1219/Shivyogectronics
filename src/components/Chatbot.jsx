import { useEffect, useRef, useState } from 'react'

import Navbar from './Navbar'

import {
  PHONE_NUMBERS,
  telLink,
  waLink,
  WA_MESSAGES,
  MAPS_LINK,
} from '../utils/contact'

const API_URL = 'https://shivyogbackend-rizm.onrender.com'

const INITIAL_SUGGESTIONS = [
  { icon: '💡', text: 'LED bulb available ahe ka?' },
  { icon: '⚡', text: 'MCB ani RCCB available ahet ka?' },
  { icon: '🔌', text: 'House wiring material pahije' },
  { icon: '🔋', text: 'Inverter ani battery available ahe ka?' },
  { icon: '📺', text: 'TV remote available ahe ka?' },
  { icon: '📡', text: 'DTH service karta ka?' },
  { icon: '🏠', text: 'Home service available ahe ka?' },
  { icon: '🕘', text: 'Shop timing kay ahe?' },
]

/* =========================================================
   ANSWER FORMATTER — Clean structured rendering
   Handles:
   - **Heading** → colored heading block
   - ### Heading
   - ## Heading
   - - / * / • item → bullet list
   - 1. / 2) item → numbered list
   - [text](url) → link with icon
   - Plain text → paragraph
========================================================= */

function parseAnswer(raw) {
  if (!raw || typeof raw !== 'string') return null

  const text = String(raw).replace(/\r\n/g, '\n').trim()
  const lines = text.split('\n')

  const blocks = []
  let listBuffer = []
  let numberedBuffer = []

  const flushList = () => {
    if (listBuffer.length === 0) return
    blocks.push({ type: 'list', items: [...listBuffer] })
    listBuffer = []
  }

  const flushNumbered = () => {
    if (numberedBuffer.length === 0) return
    blocks.push({ type: 'numbered', items: [...numberedBuffer] })
    numberedBuffer = []
  }

  const flushAll = () => {
    flushList()
    flushNumbered()
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trim()

    /* -------- EMPTY -------- */
    if (!line) {
      flushAll()
      return
    }

    /* -------- BULLET LIST -------- */
    const bulletMatch = line.match(/^[\-\*•]\s+(.+)$/)
    if (bulletMatch) {
      flushNumbered()
      listBuffer.push(bulletMatch[1])
      return
    }

    /* -------- NUMBERED LIST -------- */
    const numMatch = line.match(/^(\d+)[\.\)]\s+(.+)$/)
    if (numMatch) {
      flushList()
      numberedBuffer.push({
        num: numMatch[1],
        text: numMatch[2],
      })
      return
    }

    /* -------- HEADINGS -------- */
    if (/^###\s+/.test(line)) {
      flushAll()
      blocks.push({
        type: 'h4',
        text: line.replace(/^###\s+/, ''),
      })
      return
    }

    if (/^##\s+/.test(line)) {
      flushAll()
      blocks.push({
        type: 'h3',
        text: line.replace(/^##\s+/, ''),
      })
      return
    }

    if (/^#\s+/.test(line)) {
      flushAll()
      blocks.push({
        type: 'h3',
        text: line.replace(/^#\s+/, ''),
      })
      return
    }

    /* -------- **Heading** (whole line) -------- */
    const boldOnly = line.match(/^\*\*(.+?)\*\*$/)
    if (boldOnly) {
      flushAll()
      blocks.push({
        type: 'h4',
        text: boldOnly[1],
      })
      return
    }

    /* -------- Line ending in ":" with bold → heading -------- */
    const boldColon = line.match(/^\*\*(.+?)\*\*:?\s*$/)
    if (boldColon) {
      flushAll()
      blocks.push({
        type: 'h4',
        text: boldColon[1].replace(/:$/, ''),
      })
      return
    }

    /* -------- Short line ending in ":" → heading -------- */
    if (
      line.length < 80 &&
      /:$/.test(line) &&
      !/\*\*/.test(line)
    ) {
      flushAll()
      blocks.push({
        type: 'h4',
        text: line.replace(/:$/, ''),
      })
      return
    }

    /* -------- PARAGRAPH -------- */
    flushAll()
    blocks.push({
      type: 'p',
      text: line,
    })
  })

  flushAll()

  return blocks
}

/* =========================================================
   INLINE FORMATTER — handles **bold** and [link](url)
========================================================= */

function renderInline(text) {
  if (!text) return null

  const parts = String(text).split(
    /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/
  )

  return parts.map((part, i) => {
    /* -------- BOLD -------- */
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong key={i} className="cb-strong">
          {part.slice(2, -2)}
        </strong>
      )
    }

    /* -------- LINK -------- */
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      const [, label, href] = linkMatch

      const isPhone = href.startsWith('tel:')
      const isWhatsApp = /wa\.me|whatsapp/i.test(href)
      const isMap = /maps|goo\.gl\/maps/i.test(href)
      const isEmail = href.startsWith('mailto:')

      let icon = '🔗'
      let cls = 'cb-link'
      if (isPhone) {
        icon = '📞'
        cls = 'cb-link cb-link--phone'
      } else if (isWhatsApp) {
        icon = '💬'
        cls = 'cb-link cb-link--whatsapp'
      } else if (isMap) {
        icon = '🗺️'
        cls = 'cb-link cb-link--map'
      } else if (isEmail) {
        icon = '✉️'
        cls = 'cb-link cb-link--mail'
      }

      return (
        <a
          key={i}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={cls}
        >
          <span className="cb-link__icon">{icon}</span>
          <span className="cb-link__text">{label}</span>
        </a>
      )
    }

    /* -------- PLAIN TEXT -------- */
    return <span key={i}>{part}</span>
  })
}

/* =========================================================
   ANSWER BLOCK RENDERER
========================================================= */

function AnswerBlock({ blocks }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <div className="cb-answer">
      {blocks.map((block, i) => {
        if (block.type === 'h3') {
          return (
            <h3 key={i} className="cb-h3">
              <span className="cb-h3__bar" />
              {renderInline(block.text)}
            </h3>
          )
        }

        if (block.type === 'h4') {
          return (
            <h4 key={i} className="cb-h4">
              <span className="cb-h4__icon">◆</span>
              {renderInline(block.text)}
            </h4>
          )
        }

        if (block.type === 'list') {
          return (
            <ul key={i} className="cb-ul">
              {block.items.map((item, j) => (
                <li key={j} className="cb-li">
                  <span className="cb-li__dot" />
                  <span className="cb-li__text">{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          )
        }

        if (block.type === 'numbered') {
          return (
            <ol key={i} className="cb-ol">
              {block.items.map((item, j) => (
                <li key={j} className="cb-oli">
                  <span className="cb-oli__num">{item.num}</span>
                  <span className="cb-oli__text">{renderInline(item.text)}</span>
                </li>
              ))}
            </ol>
          )
        }

        return (
          <p key={i} className="cb-p">
            {renderInline(block.text)}
          </p>
        )
      })}
    </div>
  )
}

/* =========================================================
   DYNAMIC ACTION BUTTON
========================================================= */

function DynamicAction({ action }) {
  if (!action) return null
  const type = action.type

  if (type === 'call') {
    return (
      <a
        href={telLink(action.phone || PHONE_NUMBERS[0])}
        className="cb-action cb-action--call"
      >
        📞 {action.label || 'Call Shop'}
      </a>
    )
  }

  if (type === 'whatsapp') {
    return (
      <a
        href={waLink(action.message || WA_MESSAGES.general)}
        target="_blank"
        rel="noopener noreferrer"
        className="cb-action cb-action--wa"
      >
        💬 {action.label || 'WhatsApp'}
      </a>
    )
  }

  if (type === 'map') {
    return (
      <a
        href={action.url || MAPS_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="cb-action cb-action--map"
      >
        🗺️ {action.label || 'Directions'}
      </a>
    )
  }

  if (type === 'link' && action.url) {
    return (
      <a
        href={action.url}
        target="_blank"
        rel="noopener noreferrer"
        className="cb-action cb-action--link"
      >
        🔗 {action.label || 'Open'}
      </a>
    )
  }

  return null
}

/* =========================================================
   PHONE NUMBER → ENGLISH DIGITS
========================================================= */

function numberToEnglishDigits(value = '') {
  const digitWords = {
    0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four',
    5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine',
  }

  return value
    .split('')
    .map((digit) => digitWords[digit] || digit)
    .join(' ')
}

/* =========================================================
   SPEECH TEXT CLEANER
========================================================= */

function prepareSpeechText(text = '') {
  let result = String(text)

  result = result.replace(/\*\*(.*?)\*\*/g, '$1')
  result = result.replace(/\[(.*?)\]\((.*?)\)/g, '$1')
  result = result.replace(/https?:\/\/\S+/gi, '')
  result = result.replace(/(?:\+91[\s-]?)?[6-9]\d{9}/g, (match) => {
    const digits = match.replace(/\D/g, '')
    const cleanDigits =
      digits.length === 12 && digits.startsWith('91')
        ? digits.slice(2)
        : digits
    return numberToEnglishDigits(cleanDigits)
  })
  result = result.replace(/₹/g, ' rupees ')
  result = result.replace(/%/g, ' percent ')
  result = result.replace(/&/g, ' and ')
  result = result.replace(/\//g, ' slash ')
  result = result.replace(/[#*_`|]/g, ' ')
  result = result.replace(/\s+/g, ' ')
  return result.trim()
}

/* =========================================================
   VOICE HELPERS
========================================================= */

function getVoiceLabel(voice) {
  if (!voice) return ''
  return `${voice.name} (${voice.lang})`
}

function voiceScore(voice) {
  const lang = (voice.lang || '').toLowerCase()
  const name = (voice.name || '').toLowerCase()
  let score = 0
  if (lang === 'mr-in') score += 100
  if (lang.startsWith('mr')) score += 90
  if (lang === 'hi-in') score += 80
  if (lang.startsWith('hi')) score += 70
  if (lang === 'en-in') score += 65
  if (lang.startsWith('en')) score += 50
  if (name.includes('google')) score += 15
  if (name.includes('microsoft')) score += 10
  return score
}

/* =========================================================
   MAIN CHATBOT
========================================================= */

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Namaskar! 👋 Mi Shivyog Electrical cha AI Assistant aahe. Products, prices, availability, services, wiring, inverter, DTH, shop timing किंवा location बद्दल काहीही विचारा.',
      suggestions: INITIAL_SUGGESTIONS.slice(0, 5),
    },
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [speakingMessageId, setSpeakingMessageId] = useState(null)
  const [online, setOnline] = useState(false)
  const [voices, setVoices] = useState([])
  const [selectedVoiceName, setSelectedVoiceName] = useState('')
  const [fallbackVoiceName, setFallbackVoiceName] = useState('')

  const recognitionRef = useRef(null)
  const voiceTranscriptRef = useRef('')
  const loadingRef = useRef(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  async function checkBackend() {
    try {
      const response = await fetch(`${API_URL}/status`, {
        method: 'GET',
        cache: 'no-store',
      })
      if (!response.ok) throw new Error(`Status ${response.status}`)
      setOnline(true)
    } catch (error) {
      console.error('Backend status error:', error)
      setOnline(false)
    }
  }

  useEffect(() => {
    checkBackend()

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'mr-IN'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)
      voiceTranscriptRef.current = ''
    }

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      transcript = transcript.trim()
      if (transcript) {
        voiceTranscriptRef.current = transcript
        setInput(transcript)
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setListening(false)
      if (
        event.error === 'not-allowed' ||
        event.error === 'service-not-allowed'
      ) {
        alert('Microphone permission allow करा आणि पुन्हा try करा.')
      }
    }

    recognition.onend = () => {
      setListening(false)
      const finalTranscript = voiceTranscriptRef.current.trim()
      if (finalTranscript && !loadingRef.current) {
        setTimeout(() => {
          sendMessage(finalTranscript, true)
        }, 150)
      }
      voiceTranscriptRef.current = ''
    }

    recognitionRef.current = recognition

    return () => {
      try {
        recognition.stop()
      } catch {}
      window.speechSynthesis?.cancel()
    }
  }, [])

  useEffect(() => {
    if (!('speechSynthesis' in window)) return

    function loadVoices() {
      const available = window.speechSynthesis.getVoices()
      if (!available.length) return

      const sorted = [...available].sort(
        (a, b) => voiceScore(b) - voiceScore(a)
      )
      setVoices(sorted)

      const savedPrimary = localStorage.getItem('shivyog_primary_voice')
      const savedFallback = localStorage.getItem('shivyog_fallback_voice')
      const primaryExists = sorted.some((v) => v.name === savedPrimary)
      const fallbackExists = sorted.some((v) => v.name === savedFallback)

      setSelectedVoiceName(
        primaryExists ? savedPrimary : sorted[0]?.name || ''
      )
      setFallbackVoiceName(
        fallbackExists ? savedFallback : sorted[1]?.name || sorted[0]?.name || ''
      )
    }

    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, loading])

  function startVoice() {
    if (!recognitionRef.current) {
      alert('Voice input तुमच्या browser मध्ये supported नाही. Chrome वापरा.')
      return
    }

    stopSpeaking()

    if (listening) {
      recognitionRef.current.stop()
      return
    }

    voiceTranscriptRef.current = ''
    setInput('')

    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('Voice start error:', error)
    }
  }

  function getSelectedVoice() {
    return voices.find((v) => v.name === selectedVoiceName) || null
  }

  function getFallbackVoice() {
    return voices.find((v) => v.name === fallbackVoiceName) || null
  }

  function speakAnswer(text, messageId = null) {
    if (!('speechSynthesis' in window)) return

    const cleanText = prepareSpeechText(text)
    if (!cleanText) return

    window.speechSynthesis.cancel()
    setSpeaking(true)
    setSpeakingMessageId(messageId)

    const chunks =
      cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanText]

    const primaryVoice = getSelectedVoice()
    const fallbackVoice = getFallbackVoice()

    let currentIndex = 0

    function speakNext() {
      if (currentIndex >= chunks.length) {
        setSpeaking(false)
        setSpeakingMessageId(null)
        return
      }

      const chunk = chunks[currentIndex].trim()
      if (!chunk) {
        currentIndex++
        speakNext()
        return
      }

      const utterance = new SpeechSynthesisUtterance(chunk)
      let voiceToUse = primaryVoice

      const containsEnglish = /[a-zA-Z]/.test(chunk)
      if (
        containsEnglish &&
        primaryVoice &&
        !primaryVoice.lang.toLowerCase().startsWith('en')
      ) {
        const englishIndianVoice = voices.find((v) =>
          v.lang.toLowerCase().startsWith('en-in')
        )
        const englishVoice =
          englishIndianVoice ||
          voices.find((v) => v.lang.toLowerCase().startsWith('en'))
        if (englishVoice) voiceToUse = englishVoice
      }

      utterance.voice = voiceToUse || fallbackVoice || null
      utterance.rate = 0.92
      utterance.pitch = 1.02
      utterance.volume = 1

      utterance.onstart = () => {
        setSpeaking(true)
        setSpeakingMessageId(messageId)
      }

      utterance.onend = () => {
        currentIndex++
        setTimeout(speakNext, 90)
      }

      utterance.onerror = () => {
        if (fallbackVoice && utterance.voice?.name !== fallbackVoice.name) {
          const retry = new SpeechSynthesisUtterance(chunk)
          retry.voice = fallbackVoice
          retry.rate = 0.92
          retry.pitch = 1.02
          retry.volume = 1
          retry.onend = () => {
            currentIndex++
            setTimeout(speakNext, 90)
          }
          retry.onerror = () => {
            currentIndex++
            speakNext()
          }
          window.speechSynthesis.speak(retry)
        } else {
          currentIndex++
          speakNext()
        }
      }

      window.speechSynthesis.speak(utterance)
    }

    speakNext()
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setSpeaking(false)
    setSpeakingMessageId(null)
  }

  function handlePrimaryVoiceChange(event) {
    const value = event.target.value
    setSelectedVoiceName(value)
    localStorage.setItem('shivyog_primary_voice', value)
  }

  function handleFallbackVoiceChange(event) {
    const value = event.target.value
    setFallbackVoiceName(value)
    localStorage.setItem('shivyog_fallback_voice', value)
  }

  async function sendMessage(customText = '', fromVoice = false) {
    const question = (customText || input).trim()
    if (!question || loading) return

    stopSpeaking()
    setInput('')

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      fromVoice: Boolean(fromVoice),
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      if (!response.ok) {
        let errorMessage = `Backend error ${response.status}`
        try {
          const errorData = await response.json()
          if (errorData.detail) errorMessage = errorData.detail
        } catch {}
        throw new Error(errorMessage)
      }

      const data = await response.json()
      const answer =
        data.answer || 'Sorry, mala answer generate karta ala nahi.'

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: answer,
        sources: data.sources || [],
        distances: data.distances || [],
        actions: data.actions || [],
        suggestions: data.suggestions || generateSuggestions(question),
      }

      setMessages((prev) => [...prev, botMessage])
      setOnline(true)

      if (fromVoice) {
        setTimeout(() => {
          speakAnswer(answer, botMessage.id)
        }, 250)
      }
    } catch (error) {
      console.error('Chat error:', error)
      setOnline(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Backend connect होत नाहीये.\n\n${error.message || 'FastAPI server check करा.'}\n\nBackend:\n${API_URL}`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function generateSuggestions(question) {
    const q = question.toLowerCase()

    if (q.includes('led') || q.includes('light') || q.includes('bulb')) {
      return [
        { icon: '💡', text: 'LED bulb che sizes kontte ahet?' },
        { icon: '✨', text: 'Decorative lights available ahet ka?' },
        { icon: '💰', text: 'LED light cha price kay ahe?' },
      ]
    }

    if (q.includes('wire') || q.includes('wiring')) {
      return [
        { icon: '🔌', text: 'House wiring material sang' },
        { icon: '⚡', text: 'Wire size kasa select karaycha?' },
        { icon: '🛠', text: 'Wiring service available ahe ka?' },
      ]
    }

    if (q.includes('fan')) {
      return [
        { icon: '🌀', text: 'Ceiling fan available ahe ka?' },
        { icon: '🌀', text: 'Exhaust fan available ahe ka?' },
      ]
    }

    if (q.includes('inverter') || q.includes('battery')) {
      return [
        { icon: '🔋', text: 'Inverter battery available ahe ka?' },
        { icon: '🛠', text: 'Inverter support deta ka?' },
      ]
    }

    if (q.includes('dth') || q.includes('dish') || q.includes('remote')) {
      return [
        { icon: '📡', text: 'DTH accessories available ahet ka?' },
        { icon: '📺', text: 'TV remote available ahe ka?' },
        { icon: '🛠', text: 'DTH service karta ka?' },
      ]
    }

    if (q.includes('service') || q.includes('repair') || q.includes('home')) {
      return [
        { icon: '🏠', text: 'Home service available ahe ka?' },
        { icon: '🛠', text: 'Electrical repairing karta ka?' },
        { icon: '📡', text: 'DTH service karta ka?' },
      ]
    }

    if (q.includes('timing') || q.includes('time') || q.includes('open')) {
      return [
        { icon: '🕘', text: 'Shop timing kay ahe?' },
        { icon: '📍', text: 'Shop location kay ahe?' },
      ]
    }

    return [
      { icon: '💡', text: 'LED products sang' },
      { icon: '🔌', text: 'Electrical material sang' },
      { icon: '🛠', text: 'Services kontya ahet?' },
    ]
  }

  function clearChat() {
    stopSpeaking()
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {}
    }
    setSpeaking(false)
    setListening(false)
    voiceTranscriptRef.current = ''
    setInput('')
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          'Namaskar! 👋 Punha suru करूया. Tumhala kay mahiti pahije?',
        suggestions: INITIAL_SUGGESTIONS.slice(0, 5),
      },
    ])
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="cb-root">
      {/* NAVBAR */}
      <div className="cb-navbar-wrap">
        <Navbar />
      </div>

      {/* MAIN */}
      <section className="cb-main">
        {/* HEADER */}
        <div className="cb-header">
          <div className="cb-header__inner">
            <div className="cb-header__left">
              <div className="cb-header__icon">🤖</div>
              <div className="cb-header__info">
                <h1>Shivyog AI Assistant</h1>
                <p>Products · Services · Support</p>
              </div>
            </div>

            <div className="cb-header__right">
              {voices.length > 0 && (
                <div className="cb-voices">
                  <select
                    value={selectedVoiceName}
                    onChange={handlePrimaryVoiceChange}
                    className="cb-voice-select"
                  >
                    {voices.map((voice) => (
                      <option
                        key={`main-${voice.name}-${voice.lang}`}
                        value={voice.name}
                      >
                        Main: {getVoiceLabel(voice)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={fallbackVoiceName}
                    onChange={handleFallbackVoiceChange}
                    className="cb-voice-select"
                  >
                    {voices.map((voice) => (
                      <option
                        key={`fallback-${voice.name}-${voice.lang}`}
                        value={voice.name}
                      >
                        Fallback: {getVoiceLabel(voice)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div
                className={`cb-status ${
                  online ? 'cb-status--online' : 'cb-status--offline'
                }`}
              >
                <span className="cb-status__dot" />
                <span className="cb-status__text">
                  {online ? 'AI Online' : 'Offline'}
                </span>
              </div>

              <button
                onClick={clearChat}
                className="cb-clear"
                title="Clear chat"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="cb-chat-wrap">
          <div className="cb-chat-card">
            <div className="cb-messages">
              <div className="cb-messages__inner">
                {messages.map((message) => {
                  const isUser = message.role === 'user'
                  const isSpeaking = speakingMessageId === message.id
                  const blocks = !isUser ? parseAnswer(message.content) : null

                  return (
                    <div
                      key={message.id}
                      className={`cb-row ${isUser ? 'cb-row--user' : ''}`}
                    >
                      {!isUser && (
                        <div className="cb-avatar">
                          {isSpeaking ? '🗣️' : '🤖'}
                        </div>
                      )}

                      <div
                        className={`cb-msg-wrap ${
                          isUser ? 'cb-msg-wrap--user' : ''
                        }`}
                      >
                        <div className="cb-msg-label">
                          {isUser
                            ? message.fromVoice
                              ? '🎤 You · Voice'
                              : '👤 You · Text'
                            : isSpeaking
                            ? '🗣️ AI · Speaking'
                            : '🤖 Shivyog AI'}
                        </div>

                        <div
                          className={`cb-bubble ${
                            isUser ? 'cb-bubble--user' : 'cb-bubble--bot'
                          }`}
                        >
                          {isUser ? (
                            <p className="cb-p">{message.content}</p>
                          ) : (
                            <AnswerBlock blocks={blocks} />
                          )}
                        </div>

                        {/* ACTIONS */}
                        {!isUser && message.actions?.length > 0 && (
                          <div className="cb-actions">
                            {message.actions.map((action, index) => (
                              <DynamicAction key={index} action={action} />
                            ))}
                          </div>
                        )}

                        {/* SOURCES */}
                        {!isUser && message.sources?.length > 0 && (
                          <div className="cb-sources">
                            📚 {message.sources.length} shop knowledge sources used
                          </div>
                        )}

                        {/* LISTEN */}
                        {!isUser && (
                          <div className="cb-listen-wrap">
                            <button
                              onClick={() =>
                                isSpeaking
                                  ? stopSpeaking()
                                  : speakAnswer(message.content, message.id)
                              }
                              className="cb-listen"
                            >
                              {isSpeaking ? '⏹ Stop' : '🔊 Listen'}
                            </button>
                          </div>
                        )}

                        {/* SUGGESTIONS */}
                        {!isUser && message.suggestions?.length > 0 && (
                          <div className="cb-suggestions">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  sendMessage(suggestion.text, false)
                                }
                                disabled={loading}
                                className="cb-suggestion"
                              >
                                <span className="cb-suggestion__icon">
                                  {suggestion.icon}
                                </span>
                                <span className="cb-suggestion__text">
                                  {suggestion.text}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div
                          className={`cb-avatar cb-avatar--user ${
                            message.fromVoice ? 'cb-avatar--voice' : ''
                          }`}
                        >
                          {message.fromVoice ? '🎤' : '👤'}
                        </div>
                      )}
                    </div>
                  )
                })}

                {loading && (
                  <div className="cb-row">
                    <div className="cb-avatar">🤖</div>
                    <div className="cb-bubble cb-bubble--bot cb-typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* INPUT */}
            <div className="cb-input-area">
              <div className="cb-input-inner">
                <div className="cb-quick">
                  <button
                    onClick={() => sendMessage('shop cha timing kay ahe?')}
                    disabled={loading}
                    className="cb-quick__btn"
                  >
                    🕘 Timing
                  </button>
                  <button
                    onClick={() => sendMessage('shop location kay ahe?')}
                    disabled={loading}
                    className="cb-quick__btn"
                  >
                    📍 Location
                  </button>
                  <button
                    onClick={() => sendMessage('available products sang')}
                    disabled={loading}
                    className="cb-quick__btn"
                  >
                    🛍 Products
                  </button>
                  <button
                    onClick={() => sendMessage('services kontya available ahet?')}
                    disabled={loading}
                    className="cb-quick__btn"
                  >
                    🛠 Services
                  </button>
                </div>

                {listening && (
                  <div className="cb-listening">
                    <span className="cb-listening__dot" />
                    Listening... Speak now
                  </div>
                )}

                <div className="cb-input-box">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={loading}
                    placeholder={
                      listening
                        ? 'Listening...'
                        : 'Ask anything... LED bulb, wiring, price, service...'
                    }
                    className="cb-textarea"
                  />

                  <button
                    onClick={startVoice}
                    disabled={loading}
                    className={`cb-voice ${listening ? 'cb-voice--on' : ''}`}
                    title={listening ? 'Stop voice' : 'Voice input'}
                  >
                    {listening ? '⏹' : '🎤'}
                  </button>

                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    className="cb-send"
                    title="Send"
                  >
                    ➤
                  </button>
                </div>

                <div className="cb-input-hint">
                  Enter to send · Shift + Enter for new line · 🎤 voice
                  बोलून थांबल्यावर automatically send होईल
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE CONTACT BAR */}
      <div className="cb-mobile-bar">
        <a
          href={waLink(WA_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="cb-mobile-bar__link cb-mobile-bar__link--wa"
        >
          💬 WhatsApp
        </a>
        <a
          href={telLink(PHONE_NUMBERS[0])}
          className="cb-mobile-bar__link cb-mobile-bar__link--call"
        >
          📞 Call
        </a>
        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="cb-mobile-bar__link cb-mobile-bar__link--map"
        >
          🗺️ Directions
        </a>
      </div>

      {/* =========================================================
          INLINE STYLES
      ========================================================= */}
      <style>{`
        /* ---------------------------------------------------
           ROOT
        --------------------------------------------------- */
        .cb-root {
          position: fixed;
          inset: 0;
          height: 100dvh;
          width: 100%;
          overflow: hidden;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          font-family: Arial, Helvetica, sans-serif;
        }

        .cb-root * { box-sizing: border-box; }

        .cb-navbar-wrap {
          flex-shrink: 0;
          z-index: 50;
        }

        /* ---------------------------------------------------
           MAIN
        --------------------------------------------------- */
        .cb-main {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding-top: 4rem;
        }

        @media (min-width: 768px) {
          .cb-main { padding-top: 5rem; }
        }

        /* ---------------------------------------------------
           HEADER
        --------------------------------------------------- */
        .cb-header {
          flex-shrink: 0;
          background: linear-gradient(90deg, #4338ca, #2563eb, #0ea5e9);
          color: #ffffff;
        }

        .cb-header__inner {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0.75rem 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        @media (min-width: 768px) {
          .cb-header__inner {
            padding: 1.25rem 1rem;
          }
        }

        .cb-header__left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          min-width: 0;
        }

        .cb-header__icon {
          height: 2.5rem;
          width: 2.5rem;
          flex-shrink: 0;
          border-radius: 1rem;
          background: rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
        }

        @media (min-width: 768px) {
          .cb-header__icon {
            height: 3rem;
            width: 3rem;
            font-size: 1.5rem;
          }
        }

        .cb-header__info { min-width: 0; }

        .cb-header__info h1 {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (min-width: 768px) {
          .cb-header__info h1 { font-size: 1.4rem; }
        }

        .cb-header__info p {
          margin: 0.15rem 0 0;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.78);
        }

        @media (min-width: 768px) {
          .cb-header__info p { font-size: 0.8rem; }
        }

        .cb-header__right {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-shrink: 0;
        }

        /* ---------------------------------------------------
           VOICE SELECTS
        --------------------------------------------------- */
        .cb-voices {
          display: none;
          align-items: center;
          gap: 0.5rem;
        }

        @media (min-width: 1024px) {
          .cb-voices { display: flex; }
        }

        .cb-voice-select {
          max-width: 180px;
          padding: 0.35rem 0.5rem;
          background: #ffffff;
          color: #334155;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.7rem;
          outline: none;
          font-family: inherit;
        }

        /* ---------------------------------------------------
           STATUS
        --------------------------------------------------- */
        .cb-status {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.55rem;
          border-radius: 999px;
          font-size: 0.65rem;
          font-weight: 600;
        }

        @media (min-width: 768px) {
          .cb-status {
            padding: 0.5rem 0.75rem;
            font-size: 0.7rem;
          }
        }

        .cb-status--online { background: rgba(74, 222, 128, 0.25); }
        .cb-status--offline { background: rgba(248, 113, 113, 0.25); }

        .cb-status__dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
        }

        .cb-status--online .cb-status__dot { background: #86efac; }
        .cb-status--offline .cb-status__dot { background: #fca5a5; }

        .cb-status__text {
          display: none;
        }

        @media (min-width: 640px) {
          .cb-status__text { display: inline; }
        }

        /* ---------------------------------------------------
           CLEAR BUTTON
        --------------------------------------------------- */
        .cb-clear {
          height: 2.25rem;
          width: 2.25rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.12);
          border: none;
          color: #ffffff;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cb-clear:hover { background: rgba(255,255,255,0.22); }
        .cb-clear:active { transform: scale(0.9); }

        @media (min-width: 768px) {
          .cb-clear {
            height: 2.5rem;
            width: 2.5rem;
          }
        }

        /* ---------------------------------------------------
           CHAT WRAP
        --------------------------------------------------- */
        .cb-chat-wrap {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          max-width: 72rem;
          width: 100%;
          margin: 0 auto;
          padding: 0;
        }

        @media (min-width: 768px) {
          .cb-chat-wrap {
            padding: 1rem 1.25rem;
          }
        }

        .cb-chat-card {
          height: 100%;
          background: #ffffff;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 768px) {
          .cb-chat-card {
            border-radius: 1.5rem;
            box-shadow: 0 15px 40px rgba(20, 70, 45, 0.08);
            border: 1px solid #e2e8f0;
          }
        }

        /* ---------------------------------------------------
           MESSAGES
        --------------------------------------------------- */
        .cb-messages {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
          scroll-behavior: smooth;
          padding: 1rem 0.75rem;
        }

        @media (min-width: 640px) {
          .cb-messages { padding: 1rem 1rem; }
        }

        @media (min-width: 768px) {
          .cb-messages { padding: 1.5rem 2rem; }
        }

        .cb-messages__inner {
          max-width: 56rem;
          margin: 0 auto;
        }

        .cb-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        @media (min-width: 768px) {
          .cb-row {
            gap: 0.75rem;
            margin-bottom: 1.5rem;
          }
        }

        .cb-row--user {
          justify-content: flex-end;
        }

        .cb-avatar {
          flex-shrink: 0;
          height: 2rem;
          width: 2rem;
          border-radius: 0.75rem;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
        }

        @media (min-width: 768px) {
          .cb-avatar {
            height: 2.25rem;
            width: 2.25rem;
          }
        }

        .cb-avatar--user {
          background: #4338ca;
          color: #ffffff;
        }

        .cb-avatar--voice {
          background: #7c3aed;
        }

        .cb-msg-wrap {
          max-width: 88%;
          min-width: 0;
        }

        @media (min-width: 768px) {
          .cb-msg-wrap { max-width: 78%; }
        }

        .cb-msg-wrap--user {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .cb-msg-label {
          margin-bottom: 0.25rem;
          padding: 0 0.25rem;
          color: #94a3b8;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        @media (min-width: 768px) {
          .cb-msg-label { font-size: 0.65rem; }
        }

        /* ---------------------------------------------------
           BUBBLE
        --------------------------------------------------- */
        .cb-bubble {
          padding: 0.7rem 0.9rem;
          border-radius: 1rem;
          font-size: 0.85rem;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        @media (min-width: 768px) {
          .cb-bubble {
            padding: 0.85rem 1.1rem;
            font-size: 0.9rem;
          }
        }

        .cb-bubble--user {
          background: linear-gradient(90deg, #4338ca, #2563eb);
          color: #ffffff;
          border-bottom-right-radius: 0.25rem;
        }

        .cb-bubble--bot {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          border-bottom-left-radius: 0.25rem;
        }

        /* ---------------------------------------------------
           ANSWER BLOCKS
        --------------------------------------------------- */
        .cb-answer {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        /* H3 */
        .cb-h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.6rem 0 0.3rem;
          color: #1e3a8a;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.1px;
        }

        .cb-h3:first-child { margin-top: 0; }

        .cb-h3__bar {
          display: inline-block;
          width: 4px;
          height: 16px;
          border-radius: 2px;
          background: #4338ca;
        }

        /* H4 */
        .cb-h4 {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          margin: 0.5rem 0 0.25rem;
          padding: 0.35rem 0.6rem;
          background: linear-gradient(90deg, #eef2ff, transparent);
          border-left: 3px solid #4338ca;
          border-radius: 0 6px 6px 0;
          color: #1e3a8a;
          font-size: 0.9rem;
          font-weight: 800;
        }

        .cb-h4:first-child { margin-top: 0; }

        .cb-h4__icon {
          color: #4338ca;
          font-size: 0.7rem;
        }

        /* Paragraph */
        .cb-p {
          margin: 0;
          color: #334155;
          font-size: 0.9rem;
          line-height: 1.7;
        }

        /* Bullet list */
        .cb-ul {
          list-style: none;
          margin: 0.3rem 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .cb-li {
          display: flex;
          align-items: flex-start;
          gap: 0.55rem;
          color: #334155;
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .cb-li__dot {
          flex-shrink: 0;
          width: 7px;
          height: 7px;
          margin-top: 0.5rem;
          border-radius: 50%;
          background: #4338ca;
          box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.12);
        }

        .cb-li__text { flex: 1; min-width: 0; }

        /* Numbered list */
        .cb-ol {
          list-style: none;
          margin: 0.3rem 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .cb-oli {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          color: #334155;
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .cb-oli__num {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #4338ca;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          margin-top: 0.1rem;
        }

        .cb-oli__text { flex: 1; min-width: 0; }

        /* Bold inside answer */
        .cb-strong {
          color: #1e3a8a;
          font-weight: 800;
        }

        /* ---------------------------------------------------
           LINKS
        --------------------------------------------------- */
        .cb-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.15rem 0.5rem;
          margin: 0 0.1rem;
          border-radius: 6px;
          background: #eef2ff;
          color: #4338ca;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
          border: 1px solid #c7d2fe;
          transition: all 0.2s ease;
        }

        .cb-link:hover {
          background: #4338ca;
          color: #ffffff;
          border-color: #4338ca;
        }

        .cb-link__icon { font-size: 0.85rem; }

        .cb-link--phone { background: #ecfdf5; color: #047857; border-color: #a7f3d0; }
        .cb-link--phone:hover { background: #047857; color: #ffffff; }

        .cb-link--whatsapp { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
        .cb-link--whatsapp:hover { background: #15803d; color: #ffffff; }

        .cb-link--map { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }
        .cb-link--map:hover { background: #b91c1c; color: #ffffff; }

        .cb-link--mail { background: #fdf4ff; color: #a21caf; border-color: #f5d0fe; }
        .cb-link--mail:hover { background: #a21caf; color: #ffffff; }

        /* ---------------------------------------------------
           ACTIONS (Dynamic buttons)
        --------------------------------------------------- */
        .cb-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .cb-action {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.9rem;
          border-radius: 0.75rem;
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .cb-action:hover { transform: translateY(-1px); }
        .cb-action:active { transform: scale(0.96); }

        .cb-action--call { background: #2563eb; }
        .cb-action--call:hover { background: #1d4ed8; }

        .cb-action--wa { background: #22c55e; }
        .cb-action--wa:hover { background: #16a34a; }

        .cb-action--map { background: #ef4444; }
        .cb-action--map:hover { background: #dc2626; }

        .cb-action--link { background: #6366f1; }
        .cb-action--link:hover { background: #4f46e5; }

        /* ---------------------------------------------------
           SOURCES
        --------------------------------------------------- */
        .cb-sources {
          margin-top: 0.5rem;
          font-size: 0.7rem;
          color: #94a3b8;
        }

        /* ---------------------------------------------------
           LISTEN BUTTON
        --------------------------------------------------- */
        .cb-listen-wrap { margin-top: 0.5rem; }

        .cb-listen {
          padding: 0.35rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          background: #ffffff;
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .cb-listen:hover { background: #f8fafc; }
        .cb-listen:active { transform: scale(0.95); }

        /* ---------------------------------------------------
           SUGGESTIONS
        --------------------------------------------------- */
        .cb-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.75rem;
        }

        .cb-suggestion {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.75rem;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          border-radius: 0.75rem;
          color: #4338ca;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .cb-suggestion:hover {
          background: #e0e7ff;
          transform: translateY(-1px);
        }

        .cb-suggestion:active { transform: scale(0.96); }

        .cb-suggestion:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cb-suggestion__icon { font-size: 0.85rem; }
        .cb-suggestion__text { white-space: nowrap; }

        @media (max-width: 640px) {
          .cb-suggestion__text {
            white-space: normal;
            text-align: left;
          }
        }

        /* ---------------------------------------------------
           TYPING
        --------------------------------------------------- */
        .cb-typing {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.8rem 1.1rem;
        }

        .cb-typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #94a3b8;
          animation: cbBounce 1.2s infinite;
        }

        .cb-typing span:nth-child(2) { animation-delay: 0.15s; }
        .cb-typing span:nth-child(3) { animation-delay: 0.3s; }

        @keyframes cbBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        /* ---------------------------------------------------
           INPUT AREA
        --------------------------------------------------- */
        .cb-input-area {
          flex-shrink: 0;
          border-top: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 0.6rem 0.7rem;
        }

        @media (min-width: 768px) {
          .cb-input-area { padding: 1.25rem; }
        }

        .cb-input-inner {
          max-width: 56rem;
          margin: 0 auto;
        }

        /* ---------------------------------------------------
           QUICK BUTTONS
        --------------------------------------------------- */
        .cb-quick {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 0.6rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
          scrollbar-width: none;
        }

        .cb-quick::-webkit-scrollbar { display: none; }

        .cb-quick__btn {
          flex-shrink: 0;
          padding: 0.5rem 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          color: #334155;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .cb-quick__btn:hover { background: #f1f5f9; }
        .cb-quick__btn:active { transform: scale(0.95); }
        .cb-quick__btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ---------------------------------------------------
           LISTENING
        --------------------------------------------------- */
        .cb-listening {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          margin-bottom: 0.5rem;
          color: #7c3aed;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .cb-listening__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #7c3aed;
          animation: cbPulse 1.2s infinite;
        }

        @keyframes cbPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        /* ---------------------------------------------------
           INPUT BOX
        --------------------------------------------------- */
        .cb-input-box {
          display: flex;
          align-items: flex-end;
          gap: 0.4rem;
          padding: 0.4rem;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 1rem;
          transition: all 0.2s ease;
        }

        .cb-input-box:focus-within {
          border-color: #4338ca;
          box-shadow: 0 0 0 4px rgba(67, 56, 202, 0.12);
        }

        .cb-textarea {
          flex: 1;
          min-width: 0;
          padding: 0.7rem 0.6rem;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          color: #1e293b;
          font-family: inherit;
          font-size: 0.88rem;
          line-height: 1.5;
          max-height: 8rem;
        }

        .cb-textarea:disabled { opacity: 0.5; }

        /* ---------------------------------------------------
           VOICE BUTTON
        --------------------------------------------------- */
        .cb-voice {
          flex-shrink: 0;
          height: 2.75rem;
          width: 2.75rem;
          border-radius: 0.75rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cb-voice:hover:not(:disabled) { background: #eef2ff; }
        .cb-voice:active { transform: scale(0.9); }

        .cb-voice--on {
          background: #ef4444;
          border-color: #ef4444;
          color: #ffffff;
          animation: cbPulse 1.2s infinite;
        }

        .cb-voice:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ---------------------------------------------------
           SEND BUTTON
        --------------------------------------------------- */
        .cb-send {
          flex-shrink: 0;
          height: 2.75rem;
          width: 2.75rem;
          border-radius: 0.75rem;
          background: linear-gradient(90deg, #4338ca, #2563eb);
          color: #ffffff;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cb-send:hover:not(:disabled) { transform: scale(1.05); }
        .cb-send:active:not(:disabled) { transform: scale(0.9); }
        .cb-send:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ---------------------------------------------------
           INPUT HINT
        --------------------------------------------------- */
        .cb-input-hint {
          margin-top: 0.4rem;
          text-align: center;
          color: #94a3b8;
          font-size: 0.65rem;
        }

        @media (min-width: 768px) {
          .cb-input-hint { font-size: 0.7rem; }
        }

        /* ---------------------------------------------------
           MOBILE CONTACT BAR
        --------------------------------------------------- */
        .cb-mobile-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          flex-shrink: 0;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          box-shadow: 0 -4px 20px rgba(20, 70, 45, 0.06);
          z-index: 40;
        }

        @media (min-width: 768px) {
          .cb-mobile-bar { display: none; }
        }

        .cb-mobile-bar__link {
          padding: 0.7rem 0;
          text-align: center;
          font-size: 0.72rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s ease;
        }

        .cb-mobile-bar__link--wa { color: #16a34a; }
        .cb-mobile-bar__link--wa:active { background: #f0fdf4; }

        .cb-mobile-bar__link--call {
          color: #2563eb;
          border-left: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
        }
        .cb-mobile-bar__link--call:active { background: #eff6ff; }

        .cb-mobile-bar__link--map { color: #ef4444; }
        .cb-mobile-bar__link--map:active { background: #fef2f2; }

        /* ---------------------------------------------------
           GLOBAL SCROLL FIX
        --------------------------------------------------- */
        html, body, #root { max-width: 100%; }
        html, body { overscroll-behavior: none; }
        * { -webkit-tap-highlight-color: transparent; }

        .cb-messages::-webkit-scrollbar { width: 6px; }
        .cb-messages::-webkit-scrollbar-track { background: transparent; }
        .cb-messages::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }

        @media (max-width: 767px) {
          textarea { font-size: 16px !important; }
          body { overflow: hidden !important; }
        }
      `}</style>
    </div>
  )
}
