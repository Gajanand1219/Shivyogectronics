import { useEffect, useRef, useState } from 'react'

import Navbar from './Navbar'

import {
  PHONE_NUMBERS,
  telLink,
  waLink,
  WA_MESSAGES,
  MAPS_LINK,
} from '../utils/contact'

const API_URL =
  'https://shivyogbackend-rizm.onrender.com'

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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition shadow-sm"
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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition shadow-sm"
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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
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

/*
  Phone number:
  9876543210
  =>
  nine eight seven six five four three two one zero
*/

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

  // Markdown
  clean = clean.replace(/\*\*/g, '')
  clean = clean.replace(/[#*_~]/g, '')

  // Markdown links
  clean = clean.replace(
    /\[(.*?)\]\(.*?\)/g,
    '$1'
  )

  // URLs
  clean = clean.replace(
    /https?:\/\/[^\s]+/gi,
    ''
  )

  /*
    Indian mobile numbers.
    10 digits starting with 6-9.
  */
  clean = clean.replace(
    /(?<!\d)([6-9]\d{9})(?!\d)/g,
    (match) =>
      ` ${numberToEnglishDigits(match)} `
  )

  /*
    +91 phone number
  */
  clean = clean.replace(
    /(?:\+91[\s-]?)?([6-9]\d{9})/g,
    (full, number) => {
      return ` nine one ${numberToEnglishDigits(
        number
      )} `
    }
  )

  /*
    Common symbols.
  */
  clean = clean
    .replace(/₹/g, ' rupees ')
    .replace(/%/g, ' percent ')
    .replace(/&/g, ' and ')
    .replace(/\//g, ' slash ')
    .replace(/-/g, ' ')

  /*
    Better pauses.
  */
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

  // Strong preference for Indian voices
  if (lang === 'mr-in') score += 100
  if (lang.startsWith('mr')) score += 90

  if (lang === 'hi-in') score += 85
  if (lang.startsWith('hi')) score += 80

  if (lang === 'en-in') score += 75
  if (lang.startsWith('en-in')) score += 70

  // Useful Google / Microsoft voices
  if (name.includes('google')) score += 15
  if (name.includes('microsoft')) score += 15

  // Avoid some robotic-looking defaults where possible
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

  const [loading, setLoading] =
    useState(false)

  const [listening, setListening] =
    useState(false)

  const [speaking, setSpeaking] =
    useState(false)

  const [speakingMessageId, setSpeakingMessageId] =
    useState(null)

  const [online, setOnline] =
    useState(false)

  /* =======================================================
     VOICES
  ======================================================= */

  const [voices, setVoices] = useState([])

  const [selectedVoiceName, setSelectedVoiceName] =
    useState(() => {
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

  const [fallbackVoiceName, setFallbackVoiceName] =
    useState(() => {
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

  /* =======================================================
     REFS
  ======================================================= */

  const recognitionRef =
    useRef(null)

  const voiceTranscriptRef =
    useRef('')

  const loadingRef =
    useRef(false)

  const messagesEndRef =
    useRef(null)

  /* =======================================================
     KEEP LOADING REF UPDATED
  ======================================================= */

  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  /* =======================================================
     CHECK BACKEND
  ======================================================= */

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

  /* =======================================================
     LOAD BROWSER VOICES
  ======================================================= */

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

    /*
      First time:
      automatically choose best Indian voice.
    */
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

    /*
      Fallback voice
    */
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

      /*
        Find a different voice from
        primary voice if possible.
      */
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

  /* =======================================================
     VOICE INITIALIZATION
  ======================================================= */

  useEffect(() => {
    checkBackend()

    /*
      Load voices.
    */
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

    /*
      One voice session at a time.
    */
    recognition.continuous = false

    /*
      Interim + final results.
    */
    recognition.interimResults = true

    /*
      Marathi recognition.
    */
    recognition.lang = 'mr-IN'

    /*
      Better confidence.
    */
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)

      voiceTranscriptRef.current =
        ''
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

    /*
      IMPORTANT:
      Voice stops =>
      automatically send.
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

      if (
        'speechSynthesis' in window
      ) {
        window.speechSynthesis.cancel()
        window.speechSynthesis.onvoiceschanged =
          null
      }
    }
  }, [])

  /* =======================================================
     SCROLL
  ======================================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: 'smooth',
      }
    )
  }, [messages, loading])

  /* =======================================================
     SAVE VOICE SETTINGS
  ======================================================= */

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

  /* =======================================================
     START / STOP VOICE INPUT
  ======================================================= */

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

    /*
      Stop current bot speech
      before listening.
    */
    if (
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      setSpeakingMessageId(null)
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

  /* =======================================================
     GET SELECTED / FALLBACK VOICE
  ======================================================= */

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

  /* =======================================================
     SELECT BEST VOICE FOR LANGUAGE
  ======================================================= */

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

    /*
      User manually selected voice
      should remain the main voice.
    */
    if (selected) {
      return selected
    }

    /*
      Automatic fallback.
    */
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

    /*
      English / numbers.
    */
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

  /* =======================================================
     SMART TEXT TO SPEECH
  ======================================================= */

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

    /*
      If same message is speaking:
      STOP.
    */
    if (
      speaking &&
      speakingMessageId ===
        messageId
    ) {
      stopSpeaking()
      return
    }

    /*
      Stop any previous speech.
    */
    window.speechSynthesis.cancel()

    setSpeaking(false)
    setSpeakingMessageId(null)

    const cleanText =
      prepareSpeechText(text)

    if (!cleanText) return

    /*
      Main selected voice.
    */
    const primaryVoice =
      getBestVoiceForText(
        cleanText
      )

    const fallbackVoice =
      getFallbackVoice()

    /*
      Split answer into natural chunks.
      This makes long answers feel
      less robotic.
    */
    const chunks =
      cleanText
        .split(
          /(?<=[.!?।])\s+/
        )
        .map((item) =>
          item.trim()
        )
        .filter(Boolean)

    /*
      If sentence splitting fails,
      speak whole answer.
    */
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

      /*
        Phone numbers and English
        words are spoken naturally
        using English-capable voice
        when fallback is better.
      */
      const hasEnglish =
        /[a-z]/i.test(chunk)

      let voice =
        primaryVoice ||
        fallbackVoice

      /*
        If selected voice is Marathi
        but chunk contains mainly
        English, fallback to English
        voice only when available.
        
        Phone numbers are already
        converted to English words.
      */
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

        /*
          Use English voice only if
          selected voice is not English.
        */
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

      /*
        Human-like settings.
      */
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
        /*
          Small natural pause
          between sentences.
        */
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

        /*
          Try fallback voice.
        */
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

  /* =======================================================
     STOP SPEAKING
  ======================================================= */

  function stopSpeaking() {
    if (
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.cancel()
    }

    setSpeaking(false)
    setSpeakingMessageId(null)
  }

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

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

    /*
      If voice request:
      stop recognition state.
    */
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

      /*
        ====================================================
        ⭐ IMPORTANT BEHAVIOUR ⭐

        TEXT USER:
        No automatic voice.

        VOICE USER:
        Automatically speak bot answer.
        ====================================================
      */

      if (fromVoice) {
        /*
          Wait until React renders
          the bot message.
        */
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

  /* =======================================================
     DYNAMIC SUGGESTIONS
  ======================================================= */

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

  /* =======================================================
     CLEAR CHAT
  ======================================================= */

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

  /* =======================================================
     ENTER KEY
  ======================================================= */

  function handleKeyDown(e) {
    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      e.preventDefault()

      sendMessage()
    }
  }

  /* =======================================================
     VOICE SELECTOR
  ======================================================= */

  function VoiceSettings() {
    return (
      <div className="mt-3 p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* PRIMARY VOICE */}

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1">
              🎤 Main Voice
            </label>

            <select
              value={selectedVoiceName}
              onChange={(e) =>
                setSelectedVoiceName(
                  e.target.value
                )
              }
              className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-3 py-2 text-xs outline-none"
            >
              {voices.length === 0 && (
                <option
                  value=""
                  className="text-slate-900"
                >
                  Loading voices...
                </option>
              )}

              {voices.map(
                (voice) => (
                  <option
                    key={`${voice.name}-${voice.lang}`}
                    value={voice.name}
                    className="text-slate-900"
                  >
                    {getVoiceLabel(
                      voice
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          {/* FALLBACK */}

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1">
              🔄 Fallback Voice
            </label>

            <select
              value={fallbackVoiceName}
              onChange={(e) =>
                setFallbackVoiceName(
                  e.target.value
                )
              }
              className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-3 py-2 text-xs outline-none"
            >
              {voices.length === 0 && (
                <option
                  value=""
                  className="text-slate-900"
                >
                  Loading voices...
                </option>
              )}

              {voices.map(
                (voice) => (
                  <option
                    key={`fallback-${voice.name}-${voice.lang}`}
                    value={voice.name}
                    className="text-slate-900"
                  >
                    {getVoiceLabel(
                      voice
                    )}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-white/60">
          Main voice manually select करा. Voice unavailable असल्यास fallback voice वापरला जाईल.
        </div>
      </div>
    )
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 pb-14 md:pb-0">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="pt-20">

        <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-sky-500 text-white">

          <div className="max-w-6xl mx-auto px-4 py-7">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div
                  className={`h-12 w-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl shadow-lg transition-all ${
                    speaking
                      ? 'scale-110 shadow-2xl animate-pulse'
                      : ''
                  }`}
                >
                  {speaking
                    ? '🗣️'
                    : '🤖'}
                </div>

                <div>
                  <h1 className="text-xl md:text-2xl font-bold">
                    Shivyog AI Assistant
                  </h1>

  
                </div>

              </div>

              <div className="flex items-center gap-2">

                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold ${
                    online
                      ? 'bg-green-400/20 text-white'
                      : 'bg-red-400/20 text-white'
                  }`}
                >

                  <span
                    className={`h-2 w-2 rounded-full ${
                      online
                        ? 'bg-green-300 animate-pulse'
                        : 'bg-red-300'
                    }`}
                  />

                  {online
                    ? 'AI Online'
                    : 'Offline'}
                </div>

                <button
                  onClick={clearChat}
                  className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 transition"
                  title="Clear chat"
                >
                  🗑️
                </button>

              </div>

            </div>

            {/* =================================================
                VOICE SETTINGS
            ================================================= */}

            {/* <VoiceSettings /> */}

          </div>

        </div>

        {/* =================================================
            CHAT AREA
        ================================================= */}

        <div className="max-w-6xl mx-auto px-3 md:px-5 py-5">

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

            {/* =================================================
                MESSAGE AREA
            ================================================= */}

            <div className="h-[calc(100vh-430px)] min-h-[500px] overflow-y-auto px-4 md:px-8 py-6">

              <div className="max-w-4xl mx-auto">

                {messages.map(
                  (message) => {

                    const isUser =
                      message.role ===
                      'user'

                    const isVoiceUser =
                      isUser &&
                      message.fromVoice

                    const isSpeakingThis =
                      speaking &&
                      speakingMessageId ===
                        message.id

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 mb-6 ${
                          isUser
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >

                        {/* =================================================
                            BOT ICON
                        ================================================= */}

                        {!isUser && (
                          <div
                            className={`flex-shrink-0 h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center transition-all ${
                              isSpeakingThis
                                ? 'scale-110 shadow-lg ring-2 ring-indigo-200 animate-pulse'
                                : ''
                            }`}
                          >
                            {isSpeakingThis
                              ? '🗣️'
                              : '🤖'}
                          </div>
                        )}

                        {/* =================================================
                            MESSAGE
                        ================================================= */}

                        <div
                          className={`max-w-[88%] md:max-w-[75%] ${
                            isUser
                              ? 'order-first'
                              : ''
                          }`}
                        >

                          {/* SPEAKER LABEL */}

                          <div
                            className={`text-[10px] font-semibold mb-1 ${
                              isUser
                                ? 'text-right text-indigo-500'
                                : 'text-left text-slate-400'
                            }`}
                          >
                            {isUser
                              ? isVoiceUser
                                ? '🎤 You · Voice'
                                : '👤 You · Text'
                              : isSpeakingThis
                              ? '🗣️ Shivyog AI · Speaking'
                              : '🤖 Shivyog AI'}
                          </div>

                          {/* MESSAGE BUBBLE */}

                          <div
                            className={`px-4 py-3 rounded-2xl text-sm leading-7 ${
                              isUser
                                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-md shadow-md'
                                : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-md'
                            }`}
                          >
                            {renderAnswer(
                              message.content
                            )}
                          </div>

                          {/* =================================================
                              ACTION BUTTONS
                          ================================================= */}

                          {!isUser &&
                            message.actions
                              ?.length >
                              0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
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

                          {/* =================================================
                              SOURCES
                          ================================================= */}

                          {!isUser &&
                            message.sources
                              ?.length >
                              0 && (
                              <div className="mt-2 text-[10px] text-slate-400">
                                📚{' '}
                                {
                                  message
                                    .sources
                                    .length
                                }{' '}
                                shop knowledge sources used
                              </div>
                            )}

                          {/* =================================================
                              LISTEN / STOP
                          ================================================= */}

                          {!isUser && (
                            <div className="mt-2">

                              <button
                                onClick={() =>
                                  speakAnswer(
                                    message.content,
                                    message.id
                                  )
                                }
                                className={`group text-xs px-3 py-1.5 rounded-xl border transition-all ${
                                  isSpeakingThis
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                    : 'border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-slate-500'
                                }`}
                              >
                                {isSpeakingThis ? (
                                  <>
                                    ⏹ Stop
                                  </>
                                ) : (
                                  <>
                                    🔊 Listen
                                  </>
                                )}
                              </button>

                            </div>
                          )}

                          {/* =================================================
                              SUGGESTIONS
                          ================================================= */}

                          {!isUser &&
                            message.suggestions
                              ?.length >
                              0 && (
                              <div className="flex flex-wrap gap-2 mt-3">

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
                                          suggestion.text
                                        )
                                      }
                                      disabled={
                                        loading
                                      }
                                      className="px-3 py-2 rounded-xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100 text-xs text-indigo-700 font-medium transition disabled:opacity-50"
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

                        {/* =================================================
                            USER ICON
                        ================================================= */}

                        {isUser && (
                          <div
                            className={`flex-shrink-0 h-9 w-9 rounded-xl text-white flex items-center justify-center shadow-md transition-all ${
                              isVoiceUser
                                ? 'bg-gradient-to-br from-rose-500 to-orange-500'
                                : 'bg-gradient-to-br from-indigo-600 to-blue-600'
                            }`}
                            title={
                              isVoiceUser
                                ? 'Voice message'
                                : 'Text message'
                            }
                          >
                            {isVoiceUser
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
                  <div className="flex gap-3 mb-6">

                    <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center animate-pulse">
                      🤖
                    </div>

                    <div>

                      <div className="text-[10px] text-slate-400 mb-1">
                        🤖 Shivyog AI · Thinking
                      </div>

                      <div className="bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl">

                        <div className="flex gap-1.5">

                          <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />

                          <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />

                          <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />

                        </div>

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

            <div className="border-t border-slate-200 bg-white p-3 md:p-5">

              <div className="max-w-4xl mx-auto">

                {/* QUICK BUTTONS */}

                <div className="flex flex-wrap gap-2 mb-3">

                  <button
                    onClick={() =>
                      sendMessage(
                        'shop cha timing kay ahe?'
                      )
                    }
                    disabled={
                      loading
                    }
                    className="px-3 py-2 rounded-xl bg-slate-50 border text-xs hover:bg-slate-100 disabled:opacity-50"
                  >
                    🕘 Timing
                  </button>

                  <button
                    onClick={() =>
                      sendMessage(
                        'shop location kay ahe?'
                      )
                    }
                    disabled={
                      loading
                    }
                    className="px-3 py-2 rounded-xl bg-slate-50 border text-xs hover:bg-slate-100 disabled:opacity-50"
                  >
                    📍 Location
                  </button>

                  <button
                    onClick={() =>
                      sendMessage(
                        'available products sang'
                      )
                    }
                    disabled={
                      loading
                    }
                    className="px-3 py-2 rounded-xl bg-slate-50 border text-xs hover:bg-slate-100 disabled:opacity-50"
                  >
                    🛍 Products
                  </button>

                  <button
                    onClick={() =>
                      sendMessage(
                        'services kontya available ahet?'
                      )
                    }
                    disabled={
                      loading
                    }
                    className="px-3 py-2 rounded-xl bg-slate-50 border text-xs hover:bg-slate-100 disabled:opacity-50"
                  >
                    🛠 Services
                  </button>

                </div>

                {/* =================================================
                    INPUT BOX
                ================================================= */}

                <div
                  className={`flex items-end gap-2 bg-slate-50 border rounded-2xl p-2 transition-all ${
                    listening
                      ? 'border-rose-400 ring-4 ring-rose-100'
                      : 'border-slate-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100'
                  }`}
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
                    placeholder={
                      listening
                        ? '🎤 Bolat raha...'
                        : 'Ask anything... LED bulb, wiring, price, service...'
                    }
                    className="flex-1 bg-transparent outline-none resize-none px-3 py-3 text-sm max-h-32"
                  />

                  {/* =================================================
                      VOICE INPUT
                  ================================================= */}

                  <button
                    onClick={
                      startVoice
                    }
                    disabled={
                      loading
                    }
                    className={`relative h-11 w-11 rounded-xl flex items-center justify-center text-lg transition-all ${
                      listening
                        ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg scale-105'
                        : 'bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:scale-105'
                    } disabled:opacity-40`}
                    title={
                      listening
                        ? 'Stop voice'
                        : 'Speak to AI'
                    }
                  >
                    {listening ? (
                      <>
                        <span className="absolute inset-0 rounded-xl animate-ping bg-rose-400 opacity-20" />
                        <span className="relative">
                          ⏹
                        </span>
                      </>
                    ) : (
                      '🎤'
                    )}
                  </button>

                  {/* =================================================
                      SEND
                  ================================================= */}

                  <button
                    onClick={() =>
                      sendMessage()
                    }
                    disabled={
                      loading ||
                      !input.trim()
                    }
                    className="h-11 w-11 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 transition shadow-md"
                    title="Send text"
                  >
                    ➤
                  </button>

                </div>

                {/* =================================================
                    STATUS
                ================================================= */}

                <div className="text-center text-[10px] text-slate-400 mt-2">

                  {listening ? (
                    <span className="text-rose-500 font-medium">
                      🎤 Listening... बोलून थांबा — message automatically send होईल आणि AI answer बोलेल.
                    </span>
                  ) : speaking ? (
                    <span className="text-indigo-500 font-medium">
                      🗣️ Shivyog AI बोलत आहे...
                    </span>
                  ) : (
                    <>
                      Enter to send · Shift + Enter for new line · 🎤 Voice = Auto Send + Auto Speak
                    </>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MOBILE CONTACT BAR
      ===================================================== */}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 bg-white border-t shadow-xl">

        <a
          href={waLink(
            WA_MESSAGES.general
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 text-center text-xs font-semibold text-green-600"
        >
          💬 WhatsApp
        </a>

        <a
          href={telLink(
            PHONE_NUMBERS[0]
          )}
          className="py-3 text-center text-xs font-semibold text-blue-600 border-x"
        >
          📞 Call
        </a>

        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 text-center text-xs font-semibold text-red-500"
        >
          🗺️ Directions
        </a>

      </div>

    </div>
  )
}
