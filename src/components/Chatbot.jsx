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
        className="
          flex items-center gap-2
          px-4 py-2
          rounded-xl
          bg-blue-600
          text-white
          text-sm
          font-semibold
          hover:bg-blue-700
          active:scale-95
          transition
        "
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
        className="
          flex items-center gap-2
          px-4 py-2
          rounded-xl
          bg-green-500
          text-white
          text-sm
          font-semibold
          hover:bg-green-600
          active:scale-95
          transition
        "
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
        className="
          flex items-center gap-2
          px-4 py-2
          rounded-xl
          bg-red-500
          text-white
          text-sm
          font-semibold
          hover:bg-red-600
          active:scale-95
          transition
        "
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
        className="
          flex items-center gap-2
          px-4 py-2
          rounded-xl
          bg-indigo-600
          text-white
          text-sm
          font-semibold
          hover:bg-indigo-700
          active:scale-95
          transition
        "
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

  // Bold markdown
  result = result.replace(
    /\*\*(.*?)\*\*/g,
    '$1'
  )

  // Markdown links
  result = result.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '$1'
  )

  // Remove URLs
  result = result.replace(
    /https?:\/\/\S+/gi,
    ''
  )

  /*
    Phone numbers:
    9876543210
    +91 9876543210
    +91-9876543210
  */

  result = result.replace(
    /(?:\+91[\s-]?)?[6-9]\d{9}/g,
    (match) => {
      const digits = match.replace(/\D/g, '')

      const cleanDigits =
        digits.length === 12 &&
        digits.startsWith('91')
          ? digits.slice(2)
          : digits

      return numberToEnglishDigits(
        cleanDigits
      )
    }
  )

  result = result.replace(/₹/g, ' rupees ')
  result = result.replace(/%/g, ' percent ')
  result = result.replace(/&/g, ' and ')
  result = result.replace(/\//g, ' slash ')

  result = result.replace(
    /[#*_`|]/g,
    ' '
  )

  result = result.replace(
    /\s+/g,
    ' '
  )

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
  const lang =
    (voice.lang || '').toLowerCase()

  const name =
    (voice.name || '').toLowerCase()

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
      suggestions:
        INITIAL_SUGGESTIONS.slice(0, 5),
    },
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const [listening, setListening] =
    useState(false)

  const [speaking, setSpeaking] =
    useState(false)

  const [
    speakingMessageId,
    setSpeakingMessageId,
  ] = useState(null)

  const [online, setOnline] =
    useState(false)

  const [voices, setVoices] =
    useState([])

  const [
    selectedVoiceName,
    setSelectedVoiceName,
  ] = useState('')

  const [
    fallbackVoiceName,
    setFallbackVoiceName,
  ] = useState('')

  const recognitionRef =
    useRef(null)

  const voiceTranscriptRef =
    useRef('')

  const loadingRef =
    useRef(false)

  const messagesEndRef =
    useRef(null)

  /* =========================================================
     KEEP LOADING REF UPDATED
  ========================================================= */

  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  /* =========================================================
     CHECK BACKEND
  ========================================================= */

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

  /* =========================================================
     VOICE INITIALIZATION
  ========================================================= */

  useEffect(() => {
    checkBackend()

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      return
    }

    const recognition =
      new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = true

    // Marathi + Indian mixed speech
    recognition.lang = 'mr-IN'

    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)

      voiceTranscriptRef.current =
        ''
    }

    recognition.onresult = (event) => {
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

    recognition.onerror = (event) => {
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

    /*
      IMPORTANT:

      Voice बोलून थांबल्यावर:
      transcript → sendMessage(..., true)

      true = voice input
    */

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

      window.speechSynthesis?.cancel()
    }
  }, [])

  /* =========================================================
     LOAD SPEECH SYNTHESIS VOICES
  ========================================================= */

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      return
    }

    function loadVoices() {
      const available =
        window.speechSynthesis.getVoices()

      if (!available.length) return

      const sorted = [
        ...available,
      ].sort(
        (a, b) =>
          voiceScore(b) -
          voiceScore(a)
      )

      setVoices(sorted)

      const savedPrimary =
        localStorage.getItem(
          'shivyog_primary_voice'
        )

      const savedFallback =
        localStorage.getItem(
          'shivyog_fallback_voice'
        )

      const primaryExists =
        sorted.some(
          (voice) =>
            voice.name ===
            savedPrimary
        )

      const fallbackExists =
        sorted.some(
          (voice) =>
            voice.name ===
            savedFallback
        )

      setSelectedVoiceName(
        primaryExists
          ? savedPrimary
          : sorted[0]?.name || ''
      )

      setFallbackVoiceName(
        fallbackExists
          ? savedFallback
          : sorted[1]?.name ||
              sorted[0]?.name ||
              ''
      )
    }

    loadVoices()

    window.speechSynthesis.addEventListener(
      'voiceschanged',
      loadVoices
    )

    return () => {
      window.speechSynthesis.removeEventListener(
        'voiceschanged',
        loadVoices
      )
    }
  }, [])

  /* =========================================================
     INNER CHAT AUTO SCROLL
  ========================================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: 'smooth',
        block: 'end',
      }
    )
  }, [messages, loading])

  /* =========================================================
     START / STOP VOICE
  ========================================================= */

  function startVoice() {
    if (!recognitionRef.current) {
      alert(
        'Voice input तुमच्या browser मध्ये supported नाही. Chrome वापरा.'
      )

      return
    }

    // Stop currently speaking answer
    stopSpeaking()

    if (listening) {
      recognitionRef.current.stop()
      return
    }

    voiceTranscriptRef.current =
      ''

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

  /* =========================================================
     GET SELECTED VOICES
  ========================================================= */

  function getSelectedVoice() {
    return (
      voices.find(
        (voice) =>
          voice.name ===
          selectedVoiceName
      ) || null
    )
  }

  function getFallbackVoice() {
    return (
      voices.find(
        (voice) =>
          voice.name ===
          fallbackVoiceName
      ) || null
    )
  }

  /* =========================================================
     SPEAK ANSWER
  ========================================================= */

  function speakAnswer(
    text,
    messageId = null
  ) {
    if (
      !('speechSynthesis' in window)
    ) {
      return
    }

    const cleanText =
      prepareSpeechText(text)

    if (!cleanText) return

    window.speechSynthesis.cancel()

    setSpeaking(true)
    setSpeakingMessageId(
      messageId
    )

    /*
      Sentence-by-sentence speech
      makes speech more natural.
    */

    const chunks =
      cleanText.match(
        /[^.!?]+[.!?]+|[^.!?]+$/g
      ) || [cleanText]

    const primaryVoice =
      getSelectedVoice()

    const fallbackVoice =
      getFallbackVoice()

    let currentIndex = 0

    function speakNext() {
      if (
        currentIndex >=
        chunks.length
      ) {
        setSpeaking(false)
        setSpeakingMessageId(null)
        return
      }

      const chunk =
        chunks[currentIndex].trim()

      if (!chunk) {
        currentIndex++
        speakNext()
        return
      }

      const utterance =
        new SpeechSynthesisUtterance(
          chunk
        )

      let voiceToUse =
        primaryVoice

      /*
        English text / phone numbers:
        prefer Indian English voice
      */

      const containsEnglish =
        /[a-zA-Z]/.test(chunk)

      if (
        containsEnglish &&
        primaryVoice &&
        !primaryVoice.lang
          .toLowerCase()
          .startsWith('en')
      ) {
        const englishIndianVoice =
          voices.find(
            (voice) =>
              voice.lang
                .toLowerCase()
                .startsWith(
                  'en-in'
                )
          )

        const englishVoice =
          englishIndianVoice ||
          voices.find(
            (voice) =>
              voice.lang
                .toLowerCase()
                .startsWith('en')
          )

        if (englishVoice) {
          voiceToUse =
            englishVoice
        }
      }

      utterance.voice =
        voiceToUse ||
        fallbackVoice ||
        null

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
        currentIndex++

        setTimeout(() => {
          speakNext()
        }, 90)
      }

      utterance.onerror = () => {
        /*
          Fallback voice
        */

        if (
          fallbackVoice &&
          utterance.voice?.name !==
            fallbackVoice.name
        ) {
          const retry =
            new SpeechSynthesisUtterance(
              chunk
            )

          retry.voice =
            fallbackVoice

          retry.rate = 0.92
          retry.pitch = 1.02
          retry.volume = 1

          retry.onend = () => {
            currentIndex++

            setTimeout(() => {
              speakNext()
            }, 90)
          }

          retry.onerror = () => {
            currentIndex++
            speakNext()
          }

          window.speechSynthesis.speak(
            retry
          )
        } else {
          currentIndex++
          speakNext()
        }
      }

      window.speechSynthesis.speak(
        utterance
      )
    }

    speakNext()
  }

  /* =========================================================
     STOP SPEAKING
  ========================================================= */

  function stopSpeaking() {
    if (
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.cancel()
    }

    setSpeaking(false)
    setSpeakingMessageId(null)
  }

  /* =========================================================
     CHANGE VOICE
  ========================================================= */

  function handlePrimaryVoiceChange(
    event
  ) {
    const value =
      event.target.value

    setSelectedVoiceName(value)

    localStorage.setItem(
      'shivyog_primary_voice',
      value
    )
  }

  function handleFallbackVoiceChange(
    event
  ) {
    const value =
      event.target.value

    setFallbackVoiceName(value)

    localStorage.setItem(
      'shivyog_fallback_voice',
      value
    )
  }

  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  async function sendMessage(
    customText = '',
    fromVoice = false
  ) {
    const question = (
      customText || input
    ).trim()

    if (
      !question ||
      loading
    ) {
      return
    }

    /*
      Stop previous answer speech
    */

    stopSpeaking()

    setInput('')

    const userMessage = {
      id:
        `user-${Date.now()}`,

      role: 'user',

      content: question,

      /*
        Important:
        identify voice/text user
      */

      fromVoice:
        Boolean(fromVoice),
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
    ])

    setLoading(true)

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

          if (errorData.detail) {
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
          `bot-${Date.now()}`,

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

      /*
        ⭐ IMPORTANT FUNCTIONALITY ⭐

        TEXT INPUT:
        fromVoice = false
        → NO AUTO SPEECH

        VOICE INPUT:
        fromVoice = true
        → AUTO SPEECH
      */

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
            `error-${Date.now()}`,

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
    }
  }

  /* =========================================================
     DYNAMIC SUGGESTIONS
  ========================================================= */

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

  /* =========================================================
     CLEAR CHAT
  ========================================================= */

  function clearChat() {
    stopSpeaking()

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {}
    }

    setSpeaking(false)
    setListening(false)

    voiceTranscriptRef.current =
      ''

    setInput('')

    setMessages([
      {
        id:
          `welcome-${Date.now()}`,

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

  /* =========================================================
     ENTER KEY
  ========================================================= */

  function handleKeyDown(e) {
    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      e.preventDefault()

      sendMessage()
    }
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    /*
      ⭐ FULL SCREEN MOVIE STYLE

      Outer scroll = OFF
      Inner messages scroll = ON
    */

    <div
      className="
        fixed
        inset-0
        h-[100dvh]
        w-full
        overflow-hidden
        bg-slate-50
        flex
        flex-col
      "
    >

      {/* =====================================================
          EXISTING SHOP NAVBAR
      ===================================================== */}

      <div className="flex-shrink-0 z-50">
        <Navbar />
      </div>


      {/* =====================================================
          CHATBOT MAIN
      ===================================================== */}

      <section
        className="
          flex-1
          min-h-0
          overflow-hidden
          flex
          flex-col
          pt-16
          md:pt-20
        "
      >

        {/* =================================================
            CHATBOT HEADER
        ================================================= */}

        <div
          className="
            flex-shrink-0
            bg-gradient-to-r
            from-indigo-700
            via-blue-600
            to-sky-500
            text-white
          "
        >

          <div
            className="
              max-w-6xl
              mx-auto
              px-3
              md:px-4
              py-3
              md:py-5
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >

              {/* LEFT */}

              <div
                className="
                  flex
                  items-center
                  gap-2.5
                  min-w-0
                "
              >

                <div
                  className="
                    h-10
                    w-10
                    md:h-12
                    md:w-12
                    flex-shrink-0
                    rounded-2xl
                    bg-white/15
                    backdrop-blur
                    flex
                    items-center
                    justify-center
                    text-xl
                    md:text-2xl
                    shadow-lg
                  "
                >
                  🤖
                </div>

                <div className="min-w-0">

                  <h1
                    className="
                      text-base
                      md:text-2xl
                      font-bold
                      truncate
                    "
                  >
                    Shivyog AI Assistant
                  </h1>

                  <p
                    className="
                      text-[10px]
                      md:text-sm
                      text-white/80
                    "
                  >
                    Products · Services · Support
                  </p>

                </div>

              </div>


              {/* RIGHT */}

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  md:gap-2
                  flex-shrink-0
                "
              >

                {/* VOICE SELECT DESKTOP */}

                {voices.length > 0 && (
                  <div
                    className="
                      hidden
                      lg:flex
                      items-center
                      gap-2
                    "
                  >

                    <select
                      value={
                        selectedVoiceName
                      }
                      onChange={
                        handlePrimaryVoiceChange
                      }
                      className="
                        max-w-[180px]
                        rounded-lg
                        bg-white
                        text-slate-700
                        px-2
                        py-1.5
                        text-xs
                        outline-none
                      "
                    >
                      {voices.map(
                        (voice) => (
                          <option
                            key={
                              `main-${voice.name}-${voice.lang}`
                            }
                            value={
                              voice.name
                            }
                          >
                            Main:{' '}
                            {getVoiceLabel(
                              voice
                            )}
                          </option>
                        )
                      )}
                    </select>

                    <select
                      value={
                        fallbackVoiceName
                      }
                      onChange={
                        handleFallbackVoiceChange
                      }
                      className="
                        max-w-[180px]
                        rounded-lg
                        bg-white
                        text-slate-700
                        px-2
                        py-1.5
                        text-xs
                        outline-none
                      "
                    >
                      {voices.map(
                        (voice) => (
                          <option
                            key={
                              `fallback-${voice.name}-${voice.lang}`
                            }
                            value={
                              voice.name
                            }
                          >
                            Fallback:{' '}
                            {getVoiceLabel(
                              voice
                            )}
                          </option>
                        )
                      )}
                    </select>

                  </div>
                )}


                {/* ONLINE */}

                <div
                  className={`
                    flex
                    items-center
                    gap-1.5
                    px-2
                    md:px-3
                    py-1.5
                    md:py-2
                    rounded-full
                    text-[10px]
                    md:text-xs
                    font-semibold
                    ${
                      online
                        ? 'bg-green-400/20'
                        : 'bg-red-400/20'
                    }
                  `}
                >

                  <span
                    className={`
                      h-2
                      w-2
                      rounded-full
                      ${
                        online
                          ? 'bg-green-300'
                          : 'bg-red-300'
                      }
                    `}
                  />

                  <span className="hidden sm:inline">
                    {online
                      ? 'AI Online'
                      : 'Offline'}
                  </span>

                </div>


                {/* CLEAR */}

                <button
                  onClick={
                    clearChat
                  }
                  className="
                    h-9
                    w-9
                    md:h-10
                    md:w-10
                    rounded-xl
                    bg-white/10
                    hover:bg-white/20
                    active:scale-90
                    transition
                  "
                  title="Clear chat"
                >
                  🗑️
                </button>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            CHAT AREA
        ================================================= */}

        <div
          className="
            flex-1
            min-h-0
            overflow-hidden
            max-w-6xl
            w-full
            mx-auto
            px-0
            md:px-5
            py-0
            md:py-4
          "
        >

          <div
            className="
              h-full
              bg-white
              md:rounded-3xl
              md:shadow-xl
              md:border
              md:border-slate-200
              overflow-hidden
              flex
              flex-col
            "
          >

            {/* =============================================
                MESSAGE AREA
                ONLY THIS SCROLLS
            ============================================= */}

            <div
              className="
                flex-1
                min-h-0
                overflow-y-auto
                overflow-x-hidden
                overscroll-contain
                scroll-smooth
                px-3
                sm:px-4
                md:px-8
                py-4
                md:py-6
              "
            >

              <div
                className="
                  max-w-4xl
                  mx-auto
                "
              >

                {messages.map(
                  (message) => {

                    const isUser =
                      message.role ===
                      'user'

                    const isSpeaking =
                      speakingMessageId ===
                      message.id

                    return (
                      <div
                        key={
                          message.id
                        }
                        className={`
                          flex
                          gap-2
                          md:gap-3
                          mb-4
                          md:mb-6
                          ${
                            isUser
                              ? 'justify-end'
                              : 'justify-start'
                          }
                        `}
                      >

                        {/* BOT ICON */}

                        {!isUser && (
                          <div
                            className="
                              flex-shrink-0
                              h-8
                              w-8
                              md:h-9
                              md:w-9
                              rounded-xl
                              bg-indigo-50
                              flex
                              items-center
                              justify-center
                              text-sm
                            "
                          >
                            {isSpeaking
                              ? '🗣️'
                              : '🤖'}
                          </div>
                        )}


                        {/* MESSAGE */}

                        <div
                          className={`
                            max-w-[88%]
                            md:max-w-[75%]
                            min-w-0
                            ${
                              isUser
                                ? 'order-first'
                                : ''
                            }
                          `}
                        >

                          {/* LABEL */}

                          <div
                            className="
                              mb-1
                              px-1
                              text-[9px]
                              md:text-[10px]
                              text-slate-400
                              font-semibold
                            "
                          >
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
                            className={`
                              px-3
                              md:px-4
                              py-2.5
                              md:py-3
                              rounded-2xl
                              text-sm
                              leading-7
                              break-words
                              ${
                                isUser
                                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-md'
                                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-md'
                              }
                            `}
                          >
                            {renderAnswer(
                              message.content
                            )}
                          </div>


                          {/* ACTION BUTTONS */}

                          {!isUser &&
                            message.actions
                              ?.length >
                              0 && (
                              <div
                                className="
                                  flex
                                  flex-wrap
                                  gap-2
                                  mt-3
                                "
                              >
                                {message.actions.map(
                                  (
                                    action,
                                    index
                                  ) => (
                                    <DynamicAction
                                      key={
                                        index
                                      }
                                      action={
                                        action
                                      }
                                    />
                                  )
                                )}
                              </div>
                            )}


                          {/* SOURCES */}

                          {!isUser &&
                            message.sources
                              ?.length >
                              0 && (
                              <div
                                className="
                                  mt-2
                                  text-[10px]
                                  text-slate-400
                                "
                              >
                                📚{' '}
                                {
                                  message
                                    .sources
                                    .length
                                }{' '}
                                shop knowledge
                                sources used
                              </div>
                            )}


                          {/* LISTEN */}

                          {!isUser && (
                            <div
                              className="
                                mt-2
                              "
                            >

                              <button
                                onClick={() =>
                                  isSpeaking
                                    ? stopSpeaking()
                                    : speakAnswer(
                                        message.content,
                                        message.id
                                      )
                                }
                                className="
                                  text-xs
                                  px-3
                                  py-1.5
                                  rounded-lg
                                  border
                                  border-slate-200
                                  hover:bg-slate-50
                                  active:scale-95
                                  text-slate-500
                                  transition
                                "
                              >
                                {isSpeaking
                                  ? '⏹ Stop'
                                  : '🔊 Listen'}
                              </button>

                            </div>
                          )}


                          {/* SUGGESTIONS */}

                          {!isUser &&
                            message
                              .suggestions
                              ?.length >
                              0 && (
                              <div
                                className="
                                  flex
                                  flex-wrap
                                  gap-2
                                  mt-3
                                "
                              >

                                {message.suggestions.map(
                                  (
                                    suggestion,
                                    index
                                  ) => (
                                    <button
                                      key={
                                        index
                                      }
                                      onClick={() =>
                                        sendMessage(
                                          suggestion.text,
                                          false
                                        )
                                      }
                                      disabled={
                                        loading
                                      }
                                      className="
                                        px-3
                                        py-2
                                        rounded-xl
                                        border
                                        border-indigo-100
                                        bg-indigo-50/60
                                        hover:bg-indigo-100
                                        active:scale-95
                                        text-xs
                                        text-indigo-700
                                        font-medium
                                        transition
                                        disabled:opacity-50
                                      "
                                    >
                                      {
                                        suggestion.icon
                                      }{' '}
                                      {
                                        suggestion.text
                                      }
                                    </button>
                                  )
                                )}

                              </div>
                            )}

                        </div>


                        {/* USER ICON */}

                        {isUser && (
                          <div
                            className={`
                              flex-shrink-0
                              h-8
                              w-8
                              md:h-9
                              md:w-9
                              rounded-xl
                              text-white
                              flex
                              items-center
                              justify-center
                              text-sm
                              ${
                                message.fromVoice
                                  ? 'bg-violet-600'
                                  : 'bg-indigo-600'
                              }
                            `}
                          >
                            {message.fromVoice
                              ? '🎤'
                              : '👤'}
                          </div>
                        )}

                      </div>
                    )
                  }
                )}


                {/* =================================================
                    TYPING
                ================================================= */}

                {loading && (
                  <div
                    className="
                      flex
                      gap-3
                      mb-5
                    "
                  >

                    <div
                      className="
                        h-8
                        w-8
                        md:h-9
                        md:w-9
                        rounded-xl
                        bg-indigo-50
                        flex
                        items-center
                        justify-center
                      "
                    >
                      🤖
                    </div>

                    <div
                      className="
                        bg-slate-50
                        border
                        border-slate-200
                        px-5
                        py-4
                        rounded-2xl
                      "
                    >

                      <div className="flex gap-1.5">

                        <span
                          className="
                            h-2
                            w-2
                            bg-slate-400
                            rounded-full
                            animate-bounce
                          "
                        />

                        <span
                          className="
                            h-2
                            w-2
                            bg-slate-400
                            rounded-full
                            animate-bounce
                          "
                          style={{
                            animationDelay:
                              '150ms',
                          }}
                        />

                        <span
                          className="
                            h-2
                            w-2
                            bg-slate-400
                            rounded-full
                            animate-bounce
                          "
                          style={{
                            animationDelay:
                              '300ms',
                          }}
                        />

                      </div>

                    </div>

                  </div>
                )}


                <div
                  ref={
                    messagesEndRef
                  }
                />

              </div>

            </div>


            {/* =================================================
                INPUT
            ================================================= */}

            <div
              className="
                flex-shrink-0
                border-t
                border-slate-200
                bg-white
                p-2.5
                md:p-5
              "
            >

              <div
                className="
                  max-w-4xl
                  mx-auto
                "
              >

                {/* QUICK BUTTONS */}

                <div
                  className="
                    flex
                    gap-2
                    mb-2.5
                    overflow-x-auto
                    pb-1
                    scrollbar-hide
                  "
                >

                  <button
                    onClick={() =>
                      sendMessage(
                        'shop cha timing kay ahe?'
                      )
                    }
                    disabled={loading}
                    className="
                      flex-shrink-0
                      px-3
                      py-2
                      rounded-xl
                      bg-slate-50
                      border
                      text-xs
                      hover:bg-slate-100
                      active:scale-95
                      disabled:opacity-50
                    "
                  >
                    🕘 Timing
                  </button>


                  <button
                    onClick={() =>
                      sendMessage(
                        'shop location kay ahe?'
                      )
                    }
                    disabled={loading}
                    className="
                      flex-shrink-0
                      px-3
                      py-2
                      rounded-xl
                      bg-slate-50
                      border
                      text-xs
                      hover:bg-slate-100
                      active:scale-95
                      disabled:opacity-50
                    "
                  >
                    📍 Location
                  </button>


                  <button
                    onClick={() =>
                      sendMessage(
                        'available products sang'
                      )
                    }
                    disabled={loading}
                    className="
                      flex-shrink-0
                      px-3
                      py-2
                      rounded-xl
                      bg-slate-50
                      border
                      text-xs
                      hover:bg-slate-100
                      active:scale-95
                      disabled:opacity-50
                    "
                  >
                    🛍 Products
                  </button>


                  <button
                    onClick={() =>
                      sendMessage(
                        'services kontya available ahet?'
                      )
                    }
                    disabled={loading}
                    className="
                      flex-shrink-0
                      px-3
                      py-2
                      rounded-xl
                      bg-slate-50
                      border
                      text-xs
                      hover:bg-slate-100
                      active:scale-95
                      disabled:opacity-50
                    "
                  >
                    🛠 Services
                  </button>

                </div>


                {/* LISTENING */}

                {listening && (
                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      mb-2
                      text-xs
                      font-semibold
                      text-violet-600
                    "
                  >

                    <span
                      className="
                        h-2
                        w-2
                        rounded-full
                        bg-violet-500
                        animate-pulse
                      "
                    />

                    Listening... Speak now

                  </div>
                )}


                {/* INPUT BOX */}

                <div
                  className="
                    flex
                    items-end
                    gap-1.5
                    md:gap-2
                    bg-slate-50
                    border
                    border-slate-300
                    rounded-2xl
                    p-1.5
                    md:p-2
                    focus-within:border-indigo-500
                    focus-within:ring-4
                    focus-within:ring-indigo-100
                  "
                >

                  <textarea
                    value={input}
                    onChange={(e) =>
                      setInput(
                        e.target.value
                      )
                    }
                    onKeyDown={
                      handleKeyDown
                    }
                    rows={1}
                    disabled={loading}
                    placeholder={
                      listening
                        ? 'Listening...'
                        : 'Ask anything... LED bulb, wiring, price, service...'
                    }
                    className="
                      flex-1
                      min-w-0
                      bg-transparent
                      outline-none
                      resize-none
                      px-2
                      md:px-3
                      py-2.5
                      md:py-3
                      text-sm
                      max-h-32
                      disabled:opacity-50
                    "
                  />


                  {/* VOICE */}

                  <button
                    onClick={
                      startVoice
                    }
                    disabled={loading}
                    className={`
                      flex-shrink-0
                      h-11
                      w-11
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      text-lg
                      transition
                      active:scale-90
                      ${
                        listening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-white border border-slate-200 hover:bg-indigo-50'
                      }
                      disabled:opacity-40
                    `}
                    title={
                      listening
                        ? 'Stop voice'
                        : 'Voice input'
                    }
                  >
                    {listening
                      ? '⏹'
                      : '🎤'}
                  </button>


                  {/* SEND */}

                  <button
                    onClick={() =>
                      sendMessage()
                    }
                    disabled={
                      loading ||
                      !input.trim()
                    }
                    className="
                      flex-shrink-0
                      h-11
                      w-11
                      rounded-xl
                      bg-gradient-to-r
                      from-indigo-600
                      to-blue-600
                      text-white
                      flex
                      items-center
                      justify-center
                      disabled:opacity-40
                      hover:scale-105
                      active:scale-90
                      transition
                    "
                    title="Send"
                  >
                    ➤
                  </button>

                </div>


                <div
                  className="
                    text-center
                    text-[9px]
                    md:text-[10px]
                    text-slate-400
                    mt-1.5
                  "
                >
                  Enter to send · Shift + Enter for new line · 🎤 voice बोलून थांबल्यावर automatically send होईल
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MOBILE CONTACT BAR
      ===================================================== */}

      <div
        className="
          md:hidden
          flex-shrink-0
          z-40
          grid
          grid-cols-3
          bg-white
          border-t
          shadow-xl
        "
      >

        <a
          href={waLink(
            WA_MESSAGES.general
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="
            py-2.5
            text-center
            text-xs
            font-semibold
            text-green-600
            active:bg-green-50
          "
        >
          💬 WhatsApp
        </a>


        <a
          href={telLink(
            PHONE_NUMBERS[0]
          )}
          className="
            py-2.5
            text-center
            text-xs
            font-semibold
            text-blue-600
            border-x
            active:bg-blue-50
          "
        >
          📞 Call
        </a>


        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="
            py-2.5
            text-center
            text-xs
            font-semibold
            text-red-500
            active:bg-red-50
          "
        >
          🗺️ Directions
        </a>

      </div>


      {/* =====================================================
          GLOBAL MOBILE SCROLL FIX
      ===================================================== */}

      <style>{`
        html,
        body,
        #root {
          max-width: 100%;
        }

        html,
        body {
          overscroll-behavior: none;
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }

        /* Hide horizontal scrollbar */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Chat scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          border-radius: 999px;
        }

        /* Mobile */
        @media (max-width: 767px) {
          textarea {
            font-size: 16px !important;
          }

          body {
            overflow: hidden !important;
          }
        }
      `}</style>

    </div>
  )
}
