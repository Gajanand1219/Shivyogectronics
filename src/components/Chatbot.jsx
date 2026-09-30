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
   ANSWER FORMATTER — Rich Structured Output
   Supports:
     ## Heading          → H2
     ### Sub-heading     → H3
     **bold**            → bold
     - item              → bullet list
     1. item             → numbered list
     | col | col |       → table
     ₹1,200              → price highlight
     [Link](url)         → styled link
   ========================================================= */

function parseAnswer(raw) {
  if (!raw || typeof raw !== 'string') return []

  const text = raw.replace(/\r\n/g, '\n').trim()
  const lines = text.split('\n')

  const blocks = []
  let listBuffer = []
  let tableBuffer = []

  const flushList = () => {
    if (!listBuffer.length) return
    blocks.push({ type: 'list', items: [...listBuffer] })
    listBuffer = []
  }

  const flushTable = () => {
    if (!tableBuffer.length) return
    blocks.push({ type: 'table', rows: [...tableBuffer] })
    tableBuffer = []
  }

  const isTableRow = (line) => /^\s*\|.*\|\s*$/.test(line)
  const isTableSep = (line) => /^\s*\|[\s\-:|]+\|\s*$/.test(line)

  const parseTableRow = (line) =>
    line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())

  lines.forEach((rawLine) => {
    const line = rawLine.trim()

    /* blank */
    if (!line) {
      flushList()
      flushTable()
      return
    }

    /* table */
    if (isTableRow(line)) {
      if (isTableSep(line)) return
      flushList()
      tableBuffer.push(parseTableRow(line))
      return
    }

    /* headings */
    if (/^###\s+/.test(line)) {
      flushList(); flushTable()
      blocks.push({ type: 'h4', text: line.replace(/^###\s+/, '') })
      return
    }
    if (/^##\s+/.test(line)) {
      flushList(); flushTable()
      blocks.push({ type: 'h3', text: line.replace(/^##\s+/, '') })
      return
    }
    if (/^#\s+/.test(line)) {
      flushList(); flushTable()
      blocks.push({ type: 'h3', text: line.replace(/^#\s+/, '') })
      return
    }

    /* bold only line → subheading */
    const boldOnly = line.match(/^\*\*(.+?)\*\*:?$/)
    if (boldOnly) {
      flushList(); flushTable()
      blocks.push({ type: 'h4', text: boldOnly[1] })
      return
    }

    /* list item */
    const bullet = line.match(/^[\-\*•]\s+(.+)$/)
    const num = line.match(/^(\d+)[\.\)]\s+(.+)$/)
    if (bullet || num) {
      flushTable()
      if (num) {
        listBuffer.push({ ordered: true, num: num[1], text: num[2] })
      } else {
        listBuffer.push({ ordered: false, text: bullet[1] })
      }
      return
    }

    /* paragraph */
    flushList(); flushTable()
    blocks.push({ type: 'p', text: line })
  })

  flushList(); flushTable()
  return blocks
}

/* =========================================================
   INLINE RENDERER — bold, links, prices
   ========================================================= */

function renderInline(text) {
  if (!text) return null

  const parts = String(text).split(
    /(\*\*[^*]+\*\*|\[.*?\]\(.*?\)|₹[\d,]+(?:\.\d+)?)/g
  )

  return parts.map((part, i) => {
    /* bold */
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong key={i} className="text-slate-900 font-bold">
          {part.slice(2, -2)}
        </strong>
      )
    }

    /* link */
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/)
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[13px] hover:bg-indigo-100 transition"
        >
          🔗 {linkMatch[1]}
        </a>
      )
    }

    /* price */
    if (/^₹[\d,]+(?:\.\d+)?$/.test(part)) {
      return (
        <span
          key={i}
          className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[13px]"
        >
          {part}
        </span>
      )
    }

    return <span key={i}>{part}</span>
  })
}

/* =========================================================
   ANSWER BLOCK RENDERER
   ========================================================= */

function AnswerBlock({ blocks }) {
  if (!blocks || !blocks.length) return null

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        /* H3 */
        if (block.type === 'h3') {
          return (
            <h3
              key={i}
              className="text-[15px] md:text-base font-bold text-indigo-700 mt-4 first:mt-0 mb-2 pb-1.5 border-b-2 border-indigo-100"
            >
              {renderInline(block.text)}
            </h3>
          )
        }

        /* H4 */
        if (block.type === 'h4') {
          return (
            <h4
              key={i}
              className="flex items-center gap-2 text-[13px] md:text-sm font-bold text-slate-800 mt-3 first:mt-0"
            >
              <span className="inline-block w-1 h-4 bg-indigo-600 rounded-full" />
              {renderInline(block.text)}
            </h4>
          )
        }

        /* list */
        if (block.type === 'list') {
          return (
            <ul key={i} className="space-y-1.5 pl-1">
              {block.items.map((item, j) => {
                if (item.ordered) {
                  return (
                    <li key={j} className="flex items-start gap-2">
                      <span className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                        {item.num}
                      </span>
                      <span className="text-slate-700 text-[13px] leading-6">
                        {renderInline(item.text)}
                      </span>
                    </li>
                  )
                }
                return (
                  <li key={j} className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="text-slate-700 text-[13px] leading-6">
                      {renderInline(item.text)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )
        }

        /* table */
        if (block.type === 'table') {
          const [head, ...rows] = block.rows
          return (
            <div
              key={i}
              className="my-3 overflow-x-auto rounded-xl border border-slate-200"
            >
              <table className="w-full border-collapse text-[12.5px] min-w-[400px]">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-blue-50">
                    {head.map((cell, j) => (
                      <th
                        key={j}
                        className="px-3 py-2.5 text-left font-bold text-indigo-700 uppercase text-[10.5px] tracking-wide border-b border-slate-200"
                      >
                        {renderInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, r) => (
                    <tr
                      key={r}
                      className="even:bg-slate-50/60 hover:bg-indigo-50/40 transition"
                    >
                      {row.map((cell, c) => (
                        <td
                          key={c}
                          className="px-3 py-2.5 text-slate-700 border-b border-slate-100 last:border-0"
                        >
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        /* paragraph */
        return (
          <p
            key={i}
            className="text-slate-700 text-[13px] leading-6"
          >
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

  const base =
    'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-white text-xs md:text-sm font-semibold shadow-md active:scale-95 transition-all'

  if (type === 'call') {
    return (
      <a
        href={telLink(action.phone || PHONE_NUMBERS[0])}
        className={`${base} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800`}
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
        className={`${base} bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700`}
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
        className={`${base} bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700`}
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
        className={`${base} bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700`}
      >
        🔗 {action.label || 'Open'}
      </a>
    )
  }
  return null
}

/* =========================================================
   SPEECH TEXT CLEANER
   ========================================================= */

function numberToEnglishDigits(value = '') {
  const w = {
    0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four',
    5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine',
  }
  return value.split('').map((d) => w[d] || d).join(' ')
}

function prepareSpeechText(text = '') {
  let r = String(text)
  r = r.replace(/\*\*(.*?)\*\*/g, '$1')
  r = r.replace(/\[(.*?)\]\((.*?)\)/g, '$1')
  r = r.replace(/https?:\/\/\S+/gi, '')
  r = r.replace(/(?:\+91[\s-]?)?[6-9]\d{9}/g, (m) => {
    const d = m.replace(/\D/g, '')
    const clean = d.length === 12 && d.startsWith('91') ? d.slice(2) : d
    return numberToEnglishDigits(clean)
  })
  r = r.replace(/₹/g, ' rupees ')
  r = r.replace(/%/g, ' percent ')
  r = r.replace(/&/g, ' and ')
  r = r.replace(/\//g, ' slash ')
  r = r.replace(/[#*_`|]/g, ' ')
  r = r.replace(/\s+/g, ' ')
  return r.trim()
}

/* =========================================================
   VOICE HELPERS
   ========================================================= */

function getVoiceLabel(v) {
  return v ? `${v.name} (${v.lang})` : ''
}

function voiceScore(voice) {
  const lang = (voice.lang || '').toLowerCase()
  const name = (voice.name || '').toLowerCase()
  let s = 0
  if (lang === 'mr-in') s += 100
  if (lang.startsWith('mr')) s += 90
  if (lang === 'hi-in') s += 80
  if (lang.startsWith('hi')) s += 70
  if (lang === 'en-in') s += 65
  if (lang.startsWith('en')) s += 50
  if (name.includes('google')) s += 15
  if (name.includes('microsoft')) s += 10
  return s
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
        'Namaskar! 👋 Mi Shivyog Electrical cha AI Assistant aahe.\n\n**Products, prices, availability, services** किंवा **shop timing / location** बद्दल काहीही विचारा.',
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

  useEffect(() => { loadingRef.current = loading }, [loading])

  /* check backend */
  async function checkBackend() {
    try {
      const r = await fetch(`${API_URL}/status`, { cache: 'no-store' })
      if (!r.ok) throw new Error('Status ' + r.status)
      setOnline(true)
    } catch (e) {
      console.error('Backend status:', e)
      setOnline(false)
    }
  }

  /* voice init */
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
      console.error('Speech error:', event.error)
      setListening(false)
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert('Microphone permission allow करा आणि पुन्हा try करा.')
      }
    }

    recognition.onend = () => {
      setListening(false)
      const finalTranscript = voiceTranscriptRef.current.trim()
      if (finalTranscript && !loadingRef.current) {
        setTimeout(() => sendMessage(finalTranscript, true), 150)
      }
      voiceTranscriptRef.current = ''
    }

    recognitionRef.current = recognition

    return () => {
      try { recognition.stop() } catch {}
      window.speechSynthesis?.cancel()
    }
  }, [])

  /* voices */
  useEffect(() => {
    if (!('speechSynthesis' in window)) return

    function loadVoices() {
      const available = window.speechSynthesis.getVoices()
      if (!available.length) return

      const sorted = [...available].sort((a, b) => voiceScore(b) - voiceScore(a))
      setVoices(sorted)

      const savedP = localStorage.getItem('shivyog_primary_voice')
      const savedF = localStorage.getItem('shivyog_fallback_voice')
      const pExists = sorted.some((v) => v.name === savedP)
      const fExists = sorted.some((v) => v.name === savedF)

      setSelectedVoiceName(pExists ? savedP : sorted[0]?.name || '')
      setFallbackVoiceName(
        fExists ? savedF : sorted[1]?.name || sorted[0]?.name || ''
      )
    }

    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  /* autoscroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  /* voice start/stop */
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
    try { recognitionRef.current.start() } catch (e) { console.error(e) }
  }

  function getSelectedVoice() {
    return voices.find((v) => v.name === selectedVoiceName) || null
  }
  function getFallbackVoice() {
    return voices.find((v) => v.name === fallbackVoiceName) || null
  }

  /* speak */
  function speakAnswer(text, messageId = null) {
    if (!('speechSynthesis' in window)) return

    const cleanText = prepareSpeechText(text)
    if (!cleanText) return

    window.speechSynthesis.cancel()
    setSpeaking(true)
    setSpeakingMessageId(messageId)

    const chunks = cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanText]
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
        const enIN = voices.find((v) => v.lang.toLowerCase().startsWith('en-in'))
        const enAny = voices.find((v) => v.lang.toLowerCase().startsWith('en'))
        if (enIN || enAny) voiceToUse = enIN || enAny
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
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeaking(false)
    setSpeakingMessageId(null)
  }

  function handlePrimaryVoiceChange(e) {
    const value = e.target.value
    setSelectedVoiceName(value)
    localStorage.setItem('shivyog_primary_voice', value)
  }
  function handleFallbackVoiceChange(e) {
    const value = e.target.value
    setFallbackVoiceName(value)
    localStorage.setItem('shivyog_fallback_voice', value)
  }

  /* send */
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
          const errData = await response.json()
          if (errData.detail) errorMessage = errData.detail
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
        setTimeout(() => speakAnswer(answer, botMessage.id), 250)
      }
    } catch (error) {
      console.error('Chat error:', error)
      setOnline(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Backend connect होत नाहीये.\n\n${error.message || 'FastAPI server check करा.'}\n\nBackend: ${API_URL}`,
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
      try { recognitionRef.current.stop() } catch {}
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
          'Namaskar! 👋 Punha suru करूया.\n\n**Tumhala kay mahiti pahije?**',
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
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-slate-50 flex flex-col">
      {/* NAVBAR */}
      <div className="flex-shrink-0 z-50">
        <Navbar />
      </div>

      {/* MAIN */}
      <section className="flex-1 min-h-0 overflow-hidden flex flex-col pt-16 md:pt-20">
        {/* HEADER */}
        <div className="flex-shrink-0 bg-gradient-to-r from-indigo-700 via-blue-600 to-sky-500 text-white">
          <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-5">
            <div className="flex items-center justify-between gap-3">
              {/* LEFT */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-xl md:text-2xl shadow-lg">
                  🤖
                </div>
                <div className="min-w-0">
                  <h1 className="text-base md:text-2xl font-bold truncate">
                    Shivyog AI Assistant
                  </h1>
                  <p className="text-[10px] md:text-sm text-white/80">
                    Products · Services · Support
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                {voices.length > 0 && (
                  <div className="hidden lg:flex items-center gap-2">
                    <select
                      value={selectedVoiceName}
                      onChange={handlePrimaryVoiceChange}
                      className="max-w-[180px] rounded-lg bg-white text-slate-700 px-2 py-1.5 text-xs outline-none"
                    >
                      {voices.map((v) => (
                        <option key={`m-${v.name}-${v.lang}`} value={v.name}>
                          Main: {getVoiceLabel(v)}
                        </option>
                      ))}
                    </select>
                    <select
                      value={fallbackVoiceName}
                      onChange={handleFallbackVoiceChange}
                      className="max-w-[180px] rounded-lg bg-white text-slate-700 px-2 py-1.5 text-xs outline-none"
                    >
                      {voices.map((v) => (
                        <option key={`f-${v.name}-${v.lang}`} value={v.name}>
                          Fallback: {getVoiceLabel(v)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div
                  className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-semibold ${
                    online ? 'bg-green-400/20' : 'bg-red-400/20'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      online ? 'bg-green-300' : 'bg-red-300'
                    }`}
                  />
                  <span className="hidden sm:inline">
                    {online ? 'AI Online' : 'Offline'}
                  </span>
                </div>

                <button
                  onClick={clearChat}
                  className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 transition"
                  title="Clear chat"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 min-h-0 overflow-hidden max-w-6xl w-full mx-auto px-0 md:px-5 py-0 md:py-4">
          <div className="h-full bg-white md:rounded-3xl md:shadow-xl md:border md:border-slate-200 overflow-hidden flex flex-col">
            {/* MESSAGES */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth px-3 sm:px-4 md:px-8 py-4 md:py-6">
              <div className="max-w-4xl mx-auto">
                {messages.map((message) => {
                  const isUser = message.role === 'user'
                  const isSpeaking = speakingMessageId === message.id
                  const blocks = !isUser ? parseAnswer(message.content) : null

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-2 md:gap-3 mb-4 md:mb-6 ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {!isUser && (
                        <div className="flex-shrink-0 h-8 w-8 md:h-9 md:w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-sm">
                          {isSpeaking ? '🗣️' : '🤖'}
                        </div>
                      )}

                      <div
                        className={`max-w-[88%] md:max-w-[78%] min-w-0 ${
                          isUser ? 'order-first' : ''
                        }`}
                      >
                        <div className="mb-1 px-1 text-[9px] md:text-[10px] text-slate-400 font-semibold">
                          {isUser
                            ? message.fromVoice
                              ? '🎤 You · Voice'
                              : '👤 You · Text'
                            : isSpeaking
                            ? '🗣️ AI · Speaking'
                            : '🤖 Shivyog AI'}
                        </div>

                        {/* BUBBLE */}
                        <div
                          className={`px-3.5 md:px-5 py-3 md:py-3.5 rounded-2xl break-words ${
                            isUser
                              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-md shadow-md'
                              : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-md'
                          }`}
                        >
                          {isUser ? (
                            <p className="text-[13.5px] leading-6 whitespace-pre-wrap">
                              {message.content}
                            </p>
                          ) : (
                            <AnswerBlock blocks={blocks} />
                          )}
                        </div>

                        {/* ACTIONS */}
                        {!isUser && message.actions?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.actions.map((action, i) => (
                              <DynamicAction key={i} action={action} />
                            ))}
                          </div>
                        )}

                        {/* SOURCES */}
                        {!isUser && message.sources?.length > 0 && (
                          <div className="mt-2 text-[10px] text-slate-400">
                            📚 {message.sources.length} shop knowledge sources used
                          </div>
                        )}

                        {/* LISTEN BUTTON */}
                        {!isUser && (
                          <div className="mt-2">
                            <button
                              onClick={() =>
                                isSpeaking
                                  ? stopSpeaking()
                                  : speakAnswer(message.content, message.id)
                              }
                              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 active:scale-95 text-slate-500 transition"
                            >
                              {isSpeaking ? '⏹ Stop' : '🔊 Listen'}
                            </button>
                          </div>
                        )}

                        {/* SUGGESTIONS */}
                        {!isUser && message.suggestions?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.suggestions.map((s, i) => (
                              <button
                                key={i}
                                onClick={() => sendMessage(s.text, false)}
                                disabled={loading}
                                className="px-3 py-2 rounded-xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100 active:scale-95 text-xs text-indigo-700 font-medium transition disabled:opacity-50"
                              >
                                {s.icon} {s.text}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div
                          className={`flex-shrink-0 h-8 w-8 md:h-9 md:w-9 rounded-xl text-white flex items-center justify-center text-sm ${
                            message.fromVoice ? 'bg-violet-600' : 'bg-indigo-600'
                          }`}
                        >
                          {message.fromVoice ? '🎤' : '👤'}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* TYPING */}
                {loading && (
                  <div className="flex gap-3 mb-5">
                    <div className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                      🤖
                    </div>
                    <div className="bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />
                        <span
                          className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* INPUT */}
            <div className="flex-shrink-0 border-t border-slate-200 bg-white p-2.5 md:p-5">
              <div className="max-w-4xl mx-auto">
                {/* QUICK BUTTONS */}
                <div className="flex gap-2 mb-2.5 overflow-x-auto pb-1 scrollbar-hide">
                  <button
                    onClick={() => sendMessage('shop cha timing kay ahe?')}
                    disabled={loading}
                    className="flex-shrink-0 px-3 py-2 rounded-xl bg-slate-50 border text-xs hover:bg-slate-100 active:scale-95 disabled:opacity-50"
                  >
                    🕘 Timing
                  </button>
                  <button
                    onClick={() => sendMessage('shop location kay ahe?')}
                    disabled={loading}
                    className="flex-shrink-0 px-3 py-2 rounded-xl bg-slate-50 border text-xs hover:bg-slate-100 active:scale-95 disabled:opacity-50"
                  >
                    📍 Location
                  </button>
                  <button
                    onClick={() => sendMessage('available products sang')}
                    disabled={loading}
                    className="flex-shrink-0 px-3 py-2 rounded-xl bg-slate-50 border text-xs hover:bg-slate-100 active:scale-95 disabled:opacity-50"
                  >
                    🛍 Products
                  </button>
                  <button
                    onClick={() => sendMessage('services kontya available ahet?')}
                    disabled={loading}
                    className="flex-shrink-0 px-3 py-2 rounded-xl bg-slate-50 border text-xs hover:bg-slate-100 active:scale-95 disabled:opacity-50"
                  >
                    🛠 Services
                  </button>
                </div>

                {/* LISTENING */}
                {listening && (
                  <div className="flex items-center justify-center gap-2 mb-2 text-xs font-semibold text-violet-600">
                    <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                    Listening... Speak now
                  </div>
                )}

                {/* INPUT BOX */}
                <div className="flex items-end gap-1.5 md:gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-1.5 md:p-2 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
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
                    className="flex-1 min-w-0 bg-transparent outline-none resize-none px-2 md:px-3 py-2.5 md:py-3 text-sm max-h-32 disabled:opacity-50"
                  />

                  <button
                    onClick={startVoice}
                    disabled={loading}
                    className={`flex-shrink-0 h-11 w-11 rounded-xl flex items-center justify-center text-lg transition active:scale-90 ${
                      listening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-white border border-slate-200 hover:bg-indigo-50'
                    } disabled:opacity-40`}
                    title={listening ? 'Stop voice' : 'Voice input'}
                  >
                    {listening ? '⏹' : '🎤'}
                  </button>

                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    className="flex-shrink-0 h-11 w-11 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 active:scale-90 transition"
                    title="Send"
                  >
                    ➤
                  </button>
                </div>

                <div className="text-center text-[9px] md:text-[10px] text-slate-400 mt-1.5">
                  Enter to send · Shift + Enter for new line · 🎤 voice बोलून थांबल्यावर automatically send होईल
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE CONTACT BAR */}
      <div className="md:hidden flex-shrink-0 z-40 grid grid-cols-3 bg-white border-t shadow-xl">
        <a
          href={waLink(WA_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 text-center text-xs font-semibold text-green-600 active:bg-green-50"
        >
          💬 WhatsApp
        </a>
        <a
          href={telLink(PHONE_NUMBERS[0])}
          className="py-2.5 text-center text-xs font-semibold text-blue-600 border-x active:bg-blue-50"
        >
          📞 Call
        </a>
        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 text-center text-xs font-semibold text-red-500 active:bg-red-50"
        >
          🗺️ Directions
        </a>
      </div>

      {/* GLOBAL SCROLL FIX */}
      <style>{`
        html, body, #root { max-width: 100%; }
        html, body { overscroll-behavior: none; }
        * { -webkit-tap-highlight-color: transparent; }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(100,116,139,0.3); }

        @media (max-width: 767px) {
          textarea { font-size: 16px !important; }
          body { overflow: hidden !important; }
        }
      `}</style>
    </div>
  )
}
