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
  {
    icon: '💡',
    text: 'LED bulb available ahe ka?',
  },
  {
    icon: '⚡',
    text: 'MCB ani RCCB available ahet ka?',
  },
  {
    icon: '🔌',
    text: 'House wiring material pahije',
  },
  {
    icon: '🔋',
    text: 'Inverter ani battery available ahe ka?',
  },
  {
    icon: '📺',
    text: 'TV remote available ahe ka?',
  },
  {
    icon: '📡',
    text: 'DTH service karta ka?',
  },
  {
    icon: '🏠',
    text: 'Home service available ahe ka?',
  },
  {
    icon: '🕘',
    text: 'Shop timing kay ahe?',
  },
]

/* =========================================================
   ANSWER FORMATTER
========================================================= */

function renderAnswer(text) {
  if (!text) return null

  const lines = String(text).split('\n')

  return lines.map((line, index) => {
    const parts = line.split(
      /(\*\*.*?\*\*|\[.*?\]\(.*?\))/  
    )

    return (
      <span key={index}>
        {parts.map((part, i) => {
          if (
            part.startsWith('**') &&
            part.endsWith('**')
          ) {
            return (
              <strong key={i}>
                {part.slice(2, -2)}
              </strong>
            )
          }

          const linkMatch = part.match(
            /^\[(.*?)\]\((.*?)\)$/
          )

          if (linkMatch) {
            return (
              <a
                key={i}
                href={linkMatch[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-semibold"
              >
                {linkMatch[1]}
              </a>
            )
          }

          return (
            <span key={i}>
              {part}
            </span>
          )
        })}

        {index < lines.length - 1 && <br />}
      </span>
    )
  })
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
        href={telLink(
          action.phone || PHONE_NUMBERS[0]
        )}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        📞 {action.label || 'Call Shop'}
      </a>
    )
  }

  if (type === 'whatsapp') {
    return (
      <a
        href={waLink(
          action.message ||
            WA_MESSAGES.general
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        🔗 {action.label || 'Open'}
      </a>
    )
  }

  return null
}

/* =========================================================
   PHONE NUMBER SPEECH
========================================================= */

const DIGITS = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
}

function numberToEnglishDigits(value) {
  const digits = String(value).replace(/\D/g, '')

  if (!digits) return value

  return digits
    .split('')
    .map((digit) => DIGITS[digit])
    .join(' ')
}

/* =========================================================
   CLEAN TEXT FOR SPEECH
========================================================= */

function prepareSpeechText(text) {
  let clean = String(text || '')

  clean = clean.replace(/\*\*/g, '')
  clean = clean.replace(/[#*_~]/g, '')
  clean = clean.replace(
    /\[(.*?)\]\(.*?\)/g,
    '$1'
  )
  clean = clean.replace(
    /https?:\/\/[^\s]+/gi,
    ''
  )
  clean = clean.replace(
    /(?<!\d)([6-9]\d{9})(?!\d)/g,
    (match) =>
      ` ${numberToEnglishDigits(match)} `
  )
  clean = clean.replace(
    /(?:\+91[\s-]?)?([6-9]\d{9})/g,
    (full, number) => {
      return ` nine one ${numberToEnglishDigits(
        number
      )} `
    }
  )
  clean = clean
    .replace(/₹/g, ' rupees ')
    .replace(/%/g, ' percent ')
    .replace(/&/g, ' and ')
    .replace(/\//g, ' slash ')
    .replace(/-/g, ' ')
  clean = clean
    .replace(/\.\.\./g, '... ')
    .replace(/:/g, ': ')
    .replace(/;/g, '; ')
    .replace(/\s+/g, ' ')
    .trim()

  return clean
}

/* =========================================================
   VOICE HELPERS
========================================================= */

function getVoiceLabel(voice) {
  if (!voice) return 'Default browser voice'
  return `${voice.name} · ${voice.lang}`
}

function voiceScore(voice) {
  if (!voice) return 0

  const lang =
    String(voice.lang || '').toLowerCase()

  const name =
    String(voice.name || '').toLowerCase()

  let score = 0

  if (lang === 'mr-in') score += 100
  if (lang.startsWith('mr')) score += 90
  if (lang === 'hi-in') score += 85
  if (lang.startsWith('hi')) score += 80
  if (lang === 'en-in') score += 75
  if (lang.startsWith('en-in')) score += 70
  if (name.includes('google')) score += 15
  if (name.includes('microsoft')) score += 15
  if (
    name.includes('compact') ||
    name.includes('espeak')
  ) {
    score -= 10
  }

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
      suggestions:
        INITIAL_SUGGESTIONS.slice(0, 5),
    },
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [speakingMessageId, setSpeakingMessageId] = useState(null)
  const [online, setOnline] = useState(false)

  const [voices, setVoices] = useState([])
  const [selectedVoiceName, setSelectedVoiceName] = useState(() => {
    try {
      return (
        localStorage.getItem(
          'shivyog_selected_voice'
        ) || ''
      )
    } catch {
      return ''
    }
  })

  const [fallbackVoiceName, setFallbackVoiceName] = useState(() => {
    try {
      return (
        localStorage.getItem(
          'shivyog_fallback_voice'
        ) || ''
      )
    } catch {
      return ''
    }
  })

  const recognitionRef = useRef(null)
  const voiceTranscriptRef = useRef('')
  const loadingRef = useRef(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  async function checkBackend() {
    try {
      const response = await fetch(
        `${API_URL}/status`,
        {
          method: 'GET',
          cache: 'no-store',
        }
      )

      if (!response.ok) {
        throw new Error(
          `Status ${response.status}`
        )
      }

      setOnline(true)
    } catch (error) {
      console.error(
        'Backend status error:',
        error
      )
      setOnline(false)
    }
  }

  function loadVoices() {
    if (
      !('speechSynthesis' in window)
    ) {
      return
    }

    const available =
      window.speechSynthesis.getVoices()

    if (!available.length) return

    const sorted = [...available].sort(
      (a, b) =>
        voiceScore(b) - voiceScore(a)
    )

    setVoices(sorted)

    setSelectedVoiceName((current) => {
      if (
        current &&
        available.some(
          (voice) =>
            voice.name === current
        )
      ) {
        return current
      }

      const best = sorted[0]

      if (!best) return ''

      try {
        localStorage.setItem(
          'shivyog_selected_voice',
          best.name
        )
      } catch {}

      return best.name
    })

    setFallbackVoiceName((current) => {
      if (
        current &&
        available.some(
          (voice) =>
            voice.name === current
        )
      ) {
        return current
      }

      const fallback =
        sorted.find(
          (voice) =>
            voice.name !==
            selectedVoiceName
        ) || sorted[1] || sorted[0]

      if (!fallback) return ''

      try {
        localStorage.setItem(
          'shivyog_fallback_voice',
          fallback.name
        )
      } catch {}

      return fallback.name
    })
  }

  useEffect(() => {
    checkBackend()
    loadVoices()

    if (
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.onvoiceschanged =
        loadVoices
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      return () => {
        if (
          'speechSynthesis' in
          window
        ) {
          window.speechSynthesis.onvoiceschanged =
            null
        }
      }
    }

    const recognition =
      new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'mr-IN'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)
      voiceTranscriptRef.current = ''
    }

    recognition.onresult = (
      event
    ) => {
      let transcript = ''

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0]
            .transcript
      }

      transcript =
        transcript.trim()

      if (transcript) {
        voiceTranscriptRef.current =
          transcript
        setInput(transcript)
      }
    }

    recognition.onerror = (
      event
    ) => {
      console.error(
        'Speech recognition error:',
        event.error
      )
      setListening(false)

      if (
        event.error ===
          'not-allowed' ||
        event.error ===
          'service-not-allowed'
      ) {
        alert(
          'Microphone permission allow करा आणि पुन्हा try करा.'
        )
      }
    }

    recognition.onend = () => {
      setListening(false)

      const finalTranscript =
        voiceTranscriptRef.current.trim()

      if (
        finalTranscript &&
        !loadingRef.current
      ) {
        setTimeout(() => {
          sendMessage(
            finalTranscript,
            true
          )
        }, 150)
      }

      voiceTranscriptRef.current =
        ''
    }

    recognitionRef.current =
      recognition

    return () => {
      try {
        recognition.stop()
      } catch {}

      if (
        'speechSynthesis' in window
      ) {
        window.speechSynthesis.cancel()
        window.speechSynthesis.onvoiceschanged =
          null
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: 'smooth',
      }
    )
  }, [messages, loading])

  useEffect(() => {
    try {
      if (selectedVoiceName) {
        localStorage.setItem(
          'shivyog_selected_voice',
          selectedVoiceName
        )
      }
    } catch {}
  }, [selectedVoiceName])

  useEffect(() => {
    try {
      if (fallbackVoiceName) {
        localStorage.setItem(
          'shivyog_fallback_voice',
          fallbackVoiceName
        )
      }
    } catch {}
  }, [fallbackVoiceName])

  function startVoice() {
    if (
      !recognitionRef.current
    ) {
      alert(
        'Voice input तुमच्या browser मध्ये supported नाही. Chrome वापरा.'
      )
      return
    }

    if (loading) return

    if (listening) {
      try {
        recognitionRef.current.stop()
      } catch {}
      return
    }

    if (
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      setSpeakingMessageId(null)
    }

    voiceTranscriptRef.current = ''
    setInput('')

    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error(
        'Voice start error:',
        error
      )
    }
  }

  function getSelectedVoice() {
    if (!voices.length) return null
    return (
      voices.find(
        (voice) =>
          voice.name ===
          selectedVoiceName
      ) || null
    )
  }

  function getFallbackVoice() {
    if (!voices.length) return null
    return (
      voices.find(
        (voice) =>
          voice.name ===
          fallbackVoiceName
      ) ||
      voices.find(
        (voice) =>
          voice.name !==
          selectedVoiceName
      ) ||
      voices[0] ||
      null
    )
  }

  function getBestVoiceForText(
    text
  ) {
    const selected =
      getSelectedVoice()
    const fallback =
      getFallbackVoice()

    if (!text) {
      return (
        selected ||
        fallback ||
        voices[0] ||
        null
      )
    }

    if (selected) {
      return selected
    }

    const lower =
      String(text).toLowerCase()

    const hasMarathi =
      /[\u0900-\u097F]/.test(text)

    if (hasMarathi) {
      const marathi =
        voices.find((voice) =>
          String(voice.lang)
            .toLowerCase()
            .startsWith('mr')
        )

      if (marathi) return marathi
    }

    if (
      /[a-z]/i.test(lower)
    ) {
      const englishIndia =
        voices.find(
          (voice) =>
            String(voice.lang)
              .toLowerCase() ===
            'en-in'
        )

      if (englishIndia) {
        return englishIndia
      }

      const english =
        voices.find((voice) =>
          String(voice.lang)
            .toLowerCase()
            .startsWith('en')
        )

      if (english) return english
    }

    return (
      fallback ||
      voices[0] ||
      null
    )
  }

  function speakAnswer(
    text,
    messageId = null
  ) {
    if (
      !('speechSynthesis' in window)
    ) {
      alert(
        'Your browser does not support text-to-speech.'
      )
      return
    }

    if (!text) return

    if (
      speaking &&
      speakingMessageId ===
        messageId
    ) {
      stopSpeaking()
      return
    }

    window.speechSynthesis.cancel()
    setSpeaking(false)
    setSpeakingMessageId(null)

    const cleanText =
      prepareSpeechText(text)

    if (!cleanText) return

    const primaryVoice =
      getBestVoiceForText(
        cleanText
      )

    const fallbackVoice =
      getFallbackVoice()

    const chunks =
      cleanText
        .split(
          /(?<=[.!?।])\s+/
        )
        .map((item) =>
          item.trim()
        )
        .filter(Boolean)

    const finalChunks =
      chunks.length
        ? chunks
        : [cleanText]

    let currentIndex = 0

    setSpeaking(true)
    setSpeakingMessageId(
      messageId
    )

    function speakNext() {
      if (
        currentIndex >=
        finalChunks.length
      ) {
        setSpeaking(false)
        setSpeakingMessageId(
          null
        )
        return
      }

      const chunk =
        finalChunks[currentIndex]

      currentIndex++

      const hasEnglish =
        /[a-z]/i.test(chunk)

      let voice =
        primaryVoice ||
        fallbackVoice

      if (hasEnglish) {
        const englishVoice =
          voices.find(
            (item) =>
              String(item.lang)
                .toLowerCase() ===
              'en-in'
          ) ||
          voices.find((item) =>
            String(item.lang)
              .toLowerCase()
              .startsWith('en')
          )

        if (
          englishVoice &&
          primaryVoice &&
          !String(
            primaryVoice.lang
          )
            .toLowerCase()
            .startsWith('en')
        ) {
          voice = englishVoice
        }
      }

      const utterance =
        new SpeechSynthesisUtterance(
          chunk
        )

      if (voice) {
        utterance.voice = voice
        utterance.lang =
          voice.lang
      } else {
        utterance.lang = 'mr-IN'
      }

      utterance.rate = 0.92
      utterance.pitch = 1.02
      utterance.volume = 1

      utterance.onstart = () => {
        setSpeaking(true)
        setSpeakingMessageId(
          messageId
        )
      }

      utterance.onend = () => {
        setTimeout(() => {
          speakNext()
        }, 90)
      }

      utterance.onerror = (
        error
      ) => {
        console.error(
          'Speech synthesis error:',
          error
        )

        if (
          fallbackVoice &&
          voice?.name !==
            fallbackVoice.name
        ) {
          const fallbackUtterance =
            new SpeechSynthesisUtterance(
              chunk
            )

          fallbackUtterance.voice =
            fallbackVoice
          fallbackUtterance.lang =
            fallbackVoice.lang
          fallbackUtterance.rate =
            0.92
          fallbackUtterance.pitch =
            1.02
          fallbackUtterance.volume = 1

          fallbackUtterance.onend =
            () => {
              setTimeout(
                speakNext,
                90
              )
            }

          fallbackUtterance.onerror =
            () => {
              setSpeaking(false)
              setSpeakingMessageId(
                null
              )
            }

          window.speechSynthesis.speak(
            fallbackUtterance
          )

          return
        }

        setSpeaking(false)
        setSpeakingMessageId(
          null
        )
      }

      window.speechSynthesis.speak(
        utterance
      )
    }

    speakNext()
  }

  function stopSpeaking() {
    if (
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.cancel()
    }

    setSpeaking(false)
    setSpeakingMessageId(null)
  }

  async function sendMessage(
    customText = '',
    fromVoice = false
  ) {
    const question = (
      customText || input
    ).trim()

    if (
      !question ||
      loadingRef.current
    ) {
      return
    }

    if (fromVoice) {
      setListening(false)
    }

    setInput('')

    const userMessage = {
      id:
        Date.now(),
      role: 'user',
      content: question,
      fromVoice: Boolean(
        fromVoice
      ),
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
    ])

    setLoading(true)
    loadingRef.current = true

    try {
      const response =
        await fetch(
          `${API_URL}/chat`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              question,
            }),
          }
        )

      if (!response.ok) {
        let errorMessage =
          `Backend error ${response.status}`

        try {
          const errorData =
            await response.json()

          if (
            errorData.detail
          ) {
            errorMessage =
              errorData.detail
          }
        } catch {}

        throw new Error(
          errorMessage
        )
      }

      const data =
        await response.json()

      const answer =
        data.answer ||
        'Sorry, mala answer generate karta ala nahi.'

      const botMessage = {
        id:
          Date.now() + 1,
        role: 'assistant',
        content: answer,
        sources:
          data.sources || [],
        distances:
          data.distances || [],
        actions:
          data.actions || [],
        suggestions:
          data.suggestions ||
          generateSuggestions(
            question
          ),
      }

      setMessages((prev) => [
        ...prev,
        botMessage,
      ])

      setOnline(true)

      if (fromVoice) {
        setTimeout(() => {
          speakAnswer(
            answer,
            botMessage.id
          )
        }, 250)
      }
    } catch (error) {
      console.error(
        'Chat error:',
        error
      )

      setOnline(false)

      setMessages((prev) => [
        ...prev,
        {
          id:
            Date.now() + 2,
          role: 'assistant',
          content:
            `⚠️ Backend connect होत नाहीये.

${error.message || 'FastAPI server check करा.'}

Backend:
${API_URL}`,
        },
      ])
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }

  function generateSuggestions(
    question
  ) {
    const q =
      question.toLowerCase()

    if (
      q.includes('led') ||
      q.includes('light') ||
      q.includes('bulb')
    ) {
      return [
        {
          icon: '💡',
          text:
            'LED bulb che sizes kontte ahet?',
        },
        {
          icon: '✨',
          text:
            'Decorative lights available ahet ka?',
        },
        {
          icon: '💰',
          text:
            'LED light cha price kay ahe?',
        },
      ]
    }

    if (
      q.includes('wire') ||
      q.includes('wiring')
    ) {
      return [
        {
          icon: '🔌',
          text:
            'House wiring material sang',
        },
        {
          icon: '⚡',
          text:
            'Wire size kasa select karaycha?',
        },
        {
          icon: '🛠',
          text:
            'Wiring service available ahe ka?',
        },
      ]
    }

    if (
      q.includes('fan')
    ) {
      return [
        {
          icon: '🌀',
          text:
            'Ceiling fan available ahe ka?',
        },
        {
          icon: '🌀',
          text:
            'Exhaust fan available ahe ka?',
        },
      ]
    }

    if (
      q.includes('inverter') ||
      q.includes('battery')
    ) {
      return [
        {
          icon: '🔋',
          text:
            'Inverter battery available ahe ka?',
        },
        {
          icon: '🛠',
          text:
            'Inverter support deta ka?',
        },
      ]
    }

    if (
      q.includes('dth') ||
      q.includes('dish') ||
      q.includes('remote')
    ) {
      return [
        {
          icon: '📡',
          text:
            'DTH accessories available ahet ka?',
        },
        {
          icon: '📺',
          text:
            'TV remote available ahe ka?',
        },
        {
          icon: '🛠',
          text:
            'DTH service karta ka?',
        },
      ]
    }

    if (
      q.includes('service') ||
      q.includes('repair') ||
      q.includes('home')
    ) {
      return [
        {
          icon: '🏠',
          text:
            'Home service available ahe ka?',
        },
        {
          icon: '🛠',
          text:
            'Electrical repairing karta ka?',
        },
        {
          icon: '📡',
          text:
            'DTH service karta ka?',
        },
      ]
    }

    if (
      q.includes('timing') ||
      q.includes('time') ||
      q.includes('open')
    ) {
      return [
        {
          icon: '🕘',
          text:
            'Shop timing kay ahe?',
        },
        {
          icon: '📍',
          text:
            'Shop location kay ahe?',
        },
      ]
    }

    return [
      {
        icon: '💡',
        text:
          'LED products sang',
      },
      {
        icon: '🔌',
        text:
          'Electrical material sang',
      },
      {
        icon: '🛠',
        text:
          'Services kontya ahet?',
      },
    ]
  }

  function clearChat() {
    if (
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.cancel()
    }

    if (
      recognitionRef.current
    ) {
      try {
        recognitionRef.current.stop()
      } catch {}
    }

    setSpeaking(false)
    setSpeakingMessageId(null)
    setListening(false)

    voiceTranscriptRef.current =
      ''

    setMessages([
      {
        id:
          Date.now(),
        role: 'assistant',
        content:
          'Namaskar! 👋 Punha suru करूया. Tumhala kay mahiti pahije?',
        suggestions:
          INITIAL_SUGGESTIONS.slice(
            0,
            5
          ),
      },
    ])
  }

  function handleKeyDown(e) {
    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    // 🔥 MAIN CONTAINER - NO OUTER SCROLL
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">

      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <Navbar />

      {/* =====================================================
          HEADER - FIXED TOP
      ===================================================== */}
      <div className="flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 animate-gradient-xy bg-[length:200%_200%]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl animate-pulse"></div>
                <div
                  className={`relative h-9 w-9 md:h-11 md:w-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-lg md:text-xl shadow-lg transition-all ${
                    speaking
                      ? 'scale-110 shadow-2xl animate-bounce'
                      : ''
                  }`}
                >
                  {speaking ? '🗣️' : '🤖'}
                </div>
              </div>

              <div>
                <h1 className="text-sm md:text-xl font-bold text-white drop-shadow-lg">
                  Shivyog AI Assistant
                </h1>
                <p className="text-[8px] md:text-[10px] text-white/80 font-medium">
                  ⚡ 24/7 Smart Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-semibold backdrop-blur ${
                  online
                    ? 'bg-green-500/30 text-white'
                    : 'bg-red-500/30 text-white'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    online
                      ? 'bg-green-300 animate-pulse'
                      : 'bg-red-300'
                  }`}
                />
                <span className="hidden xs:inline">{online ? 'Online' : 'Offline'}</span>
              </div>

              <button
                onClick={clearChat}
                className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-sm backdrop-blur hover:scale-110 active:scale-90"
                title="Clear chat"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CHAT AREA - FILLS REMAINING SPACE
      ===================================================== */}
      <div className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-2 md:px-4 py-2 md:py-3 overflow-hidden min-h-0">
        <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/50 overflow-hidden min-h-0">
          
          {/* =================================================
              MESSAGE AREA - ONLY THIS SCROLLS
          ================================================= */}
          <div className="flex-1 overflow-y-auto px-2 md:px-6 py-3 md:py-5 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent min-h-0">
            <div className="max-w-4xl mx-auto space-y-1">
              {messages.map(
                (message) => {
                  const isUser =
                    message.role === 'user'

                  const isVoiceUser =
                    isUser && message.fromVoice

                  const isSpeakingThis =
                    speaking && speakingMessageId === message.id

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-2 md:gap-3 mb-3 md:mb-5 ${
                        isUser ? 'justify-end' : 'justify-start'
                      } animate-fadeInUp`}
                    >
                      {/* BOT ICON */}
                      {!isUser && (
                        <div
                          className={`flex-shrink-0 h-7 w-7 md:h-8 md:w-8 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center transition-all shadow-md text-sm ${
                            isSpeakingThis
                              ? 'scale-110 shadow-lg ring-2 ring-indigo-300 animate-pulse'
                              : ''
                          }`}
                        >
                          {isSpeakingThis ? '🗣️' : '🤖'}
                        </div>
                      )}

                      {/* MESSAGE */}
                      <div
                        className={`max-w-[88%] md:max-w-[75%] ${
                          isUser ? 'order-first' : ''
                        }`}
                      >
                        {/* SPEAKER LABEL */}
                        <div
                          className={`text-[8px] md:text-[9px] font-semibold mb-0.5 ${
                            isUser
                              ? 'text-right text-indigo-500'
                              : 'text-left text-purple-400'
                          }`}
                        >
                          {isUser
                            ? isVoiceUser
                              ? '🎤 You · Voice'
                              : '👤 You'
                            : isSpeakingThis
                            ? '🗣️ Shivyog AI · Speaking'
                            : '🤖 Shivyog AI'}
                        </div>

                        {/* MESSAGE BUBBLE */}
                        <div
                          className={`px-3 py-2 md:px-4 md:py-2.5 rounded-2xl text-xs md:text-sm leading-6 md:leading-7 shadow-md transition-all ${
                            isUser
                              ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-br-md hover:shadow-lg'
                              : 'bg-white/70 backdrop-blur border border-indigo-100 text-slate-800 rounded-bl-md hover:shadow-lg'
                          }`}
                        >
                          {renderAnswer(message.content)}
                        </div>

                        {/* ACTION BUTTONS */}
                        {!isUser && message.actions?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {message.actions.map(
                              (action, index) => (
                                <DynamicAction key={index} action={action} />
                              )
                            )}
                          </div>
                        )}

                        {/* SOURCES */}
                        {!isUser && message.sources?.length > 0 && (
                          <div className="mt-1 flex items-center gap-1 text-[7px] md:text-[9px] text-purple-400">
                            <span>📚</span>
                            <span>{message.sources.length} sources</span>
                          </div>
                        )}

                        {/* LISTEN / STOP */}
                        {!isUser && (
                          <div className="mt-1">
                            <button
                              onClick={() =>
                                speakAnswer(message.content, message.id)
                              }
                              className={`group text-[9px] md:text-[10px] px-2 py-0.5 md:px-2.5 md:py-1 rounded-xl border transition-all duration-300 flex items-center gap-1 ${
                                isSpeakingThis
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-500 shadow-md'
                                  : 'border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-500 hover:text-indigo-600'
                              }`}
                            >
                              {isSpeakingThis ? (
                                <>
                                  <span>⏹</span>
                                  <span className="hidden xs:inline">Stop</span>
                                </>
                              ) : (
                                <>
                                  <span>🔊</span>
                                  <span className="hidden xs:inline">Listen</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {/* SUGGESTIONS */}
                        {!isUser && message.suggestions?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {message.suggestions.map(
                              (suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() =>
                                    sendMessage(suggestion.text)
                                  }
                                  disabled={loading}
                                  className="px-2 py-1 md:px-2.5 md:py-1.5 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-[9px] md:text-[10px] text-indigo-700 font-medium transition-all duration-300 disabled:opacity-50 hover:scale-105 active:scale-95 shadow-sm whitespace-nowrap"
                                >
                                  {suggestion.icon} {suggestion.text}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>

                      {/* USER ICON */}
                      {isUser && (
                        <div
                          className={`flex-shrink-0 h-7 w-7 md:h-8 md:w-8 rounded-xl text-white flex items-center justify-center shadow-md transition-all text-sm ${
                            isVoiceUser
                              ? 'bg-gradient-to-br from-rose-500 to-orange-500'
                              : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                          }`}
                          title={isVoiceUser ? 'Voice message' : 'Text message'}
                        >
                          {isVoiceUser ? '🎤' : '👤'}
                        </div>
                      )}
                    </div>
                  )
                }
              )}

              {/* TYPING */}
              {loading && (
                <div className="flex gap-2 md:gap-3 mb-3 md:mb-5 animate-fadeInUp">
                  <div className="flex-shrink-0 h-7 w-7 md:h-8 md:w-8 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center animate-pulse shadow-md text-sm">
                    🤖
                  </div>

                  <div>
                    <div className="text-[8px] md:text-[9px] text-purple-400 mb-0.5 font-medium">
                      🤖 Shivyog AI · Thinking
                    </div>

                    <div className="bg-white/70 backdrop-blur border border-indigo-100 px-3 py-2 md:px-4 md:py-3 rounded-2xl shadow-md">
                      <div className="flex gap-1.5">
                        <span className="h-1.5 w-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce" />
                        <span className="h-1.5 w-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* =================================================
              INPUT - FIXED BOTTOM
          ================================================= */}
          <div className="flex-shrink-0 border-t border-indigo-100 bg-white/80 backdrop-blur p-2 md:p-3">
            <div className="max-w-4xl mx-auto">
              {/* QUICK BUTTONS */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                <button
                  onClick={() => sendMessage('shop cha timing kay ahe?')}
                  disabled={loading}
                  className="px-2 py-1 md:px-2.5 md:py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 text-[8px] md:text-[10px] font-medium text-indigo-700 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 disabled:opacity-50 hover:scale-105 active:scale-95 shadow-sm whitespace-nowrap"
                >
                  🕘 Timing
                </button>

                <button
                  onClick={() => sendMessage('shop location kay ahe?')}
                  disabled={loading}
                  className="px-2 py-1 md:px-2.5 md:py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 text-[8px] md:text-[10px] font-medium text-indigo-700 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 disabled:opacity-50 hover:scale-105 active:scale-95 shadow-sm whitespace-nowrap"
                >
                  📍 Location
                </button>

                <button
                  onClick={() => sendMessage('available products sang')}
                  disabled={loading}
                  className="px-2 py-1 md:px-2.5 md:py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 text-[8px] md:text-[10px] font-medium text-indigo-700 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 disabled:opacity-50 hover:scale-105 active:scale-95 shadow-sm whitespace-nowrap"
                >
                  🛍 Products
                </button>

                <button
                  onClick={() => sendMessage('services kontya available ahet?')}
                  disabled={loading}
                  className="px-2 py-1 md:px-2.5 md:py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 text-[8px] md:text-[10px] font-medium text-indigo-700 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 disabled:opacity-50 hover:scale-105 active:scale-95 shadow-sm whitespace-nowrap"
                >
                  🛠 Services
                </button>
              </div>

              {/* INPUT BOX */}
              <div
                className={`flex items-end gap-1.5 bg-white border-2 rounded-2xl p-1 md:p-1.5 transition-all duration-300 ${
                  listening
                    ? 'border-rose-400 shadow-lg shadow-rose-100'
                    : 'border-indigo-200 focus-within:border-indigo-400 focus-within:shadow-lg focus-within:shadow-indigo-100'
                }`}
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder={
                    listening
                      ? '🎤 Bolat raha...'
                      : 'Ask anything...'
                  }
                  className="flex-1 bg-transparent outline-none resize-none px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm max-h-24 placeholder:text-slate-400 min-h-[36px]"
                />

                {/* VOICE INPUT */}
                <button
                  onClick={startVoice}
                  disabled={loading}
                  className={`relative h-8 w-8 md:h-10 md:w-10 rounded-xl flex items-center justify-center text-sm md:text-base transition-all duration-300 flex-shrink-0 ${
                    listening
                      ? 'bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-lg shadow-rose-200 scale-105'
                      : 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 hover:from-indigo-200 hover:to-purple-200 hover:scale-105 hover:shadow-md'
                  } disabled:opacity-40`}
                  title={listening ? 'Stop voice' : 'Speak to AI'}
                >
                  {listening ? (
                    <>
                      <span className="absolute inset-0 rounded-xl animate-ping bg-rose-400 opacity-30" />
                      <span className="relative">⏹</span>
                    </>
                  ) : (
                    '🎤'
                  )}
                </button>

                {/* SEND */}
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg text-sm md:text-base flex-shrink-0"
                  title="Send text"
                >
                  ➤
                </button>
              </div>

              {/* STATUS */}
              <div className="text-center text-[7px] md:text-[9px] text-slate-400 mt-1 font-medium min-h-[16px]">
                {listening ? (
                  <span className="text-rose-500 font-semibold animate-pulse">
                    🎤 Listening... बोलून थांबा — auto send
                  </span>
                ) : speaking ? (
                  <span className="text-indigo-500 font-semibold animate-pulse">
                    🗣️ Shivyog AI बोलत आहे...
                  </span>
                ) : (
                  <span className="text-slate-400">
                    ⏎ Enter · 🎤 Voice = Auto Send + Speak
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE CONTACT BAR - FIXED BOTTOM
      ===================================================== */}
      <div className="md:hidden flex-shrink-0 grid grid-cols-3 bg-white/90 backdrop-blur border-t border-indigo-100 shadow-xl">
        <a
          href={waLink(WA_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 text-center text-[10px] font-semibold text-green-600 hover:bg-green-50 transition-colors duration-300"
        >
          💬 WhatsApp
        </a>

        <a
          href={telLink(PHONE_NUMBERS[0])}
          className="py-2 text-center text-[10px] font-semibold text-blue-600 border-x border-indigo-100 hover:bg-indigo-50 transition-colors duration-300"
        >
          📞 Call
        </a>

        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 text-center text-[10px] font-semibold text-red-500 hover:bg-red-50 transition-colors duration-300"
        >
          🗺️ Directions
        </a>
      </div>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}
      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-xy {
          animation: gradient-xy 5s ease infinite;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }

        /* Scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #818cf8, #a78bfa);
          border-radius: 9999px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
        }

        /* Hide scrollbar on Firefox */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #a78bfa transparent;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Extra small screens */
        @media (max-width: 400px) {
          .xs\\:inline {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
