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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition"
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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
      >
        🔗 {action.label || 'Open'}
      </a>
    )
  }

  return null
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
        'Namaskar! 👋 Mi Shivyog Electronics cha AI Assistant aahe. Products, prices, availability, services, wiring, inverter, DTH, shop timing किंवा location बद्दल काहीही विचारा.',
      suggestions:
        INITIAL_SUGGESTIONS.slice(0, 5),
    },
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const [online, setOnline] = useState(false)

  const recognitionRef = useRef(null)

  /*
    IMPORTANT:

    Voice transcript state मध्ये ठेवण्याऐवजी ref वापरतो.
    त्यामुळे recognition.onend मध्ये latest transcript
    मिळतो आणि mic stop होताच sendMessage होतो.
  */
  const voiceTranscriptRef = useRef('')

  const messagesEndRef = useRef(null)


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

    /*
      final + interim result
    */
    recognition.interimResults = true

    /*
      Marathi first.
      Browser Marathi + Hindi + English mixed
      speech recognition करू शकतो.
    */
    recognition.lang = 'mr-IN'

    recognition.onstart = () => {
      setListening(true)

      /*
        नवीन voice session सुरू
      */
      voiceTranscriptRef.current = ''
    }


    recognition.onresult = (event) => {
      let transcript = ''

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript
      }

      transcript = transcript.trim()

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

      /*
        no-speech / aborted असल्यास
        message send करू नये.
      */

      if (
        event.error === 'not-allowed' ||
        event.error === 'service-not-allowed'
      ) {
        alert(
          'Microphone permission allow करा आणि पुन्हा try करा.'
        )
      }
    }


    /*
      ⭐ MAIN FIX ⭐

      Mic/audio stop झाल्यावर automatic send.
    */
    recognition.onend = () => {
      setListening(false)

      const finalTranscript =
        voiceTranscriptRef.current.trim()

      if (
        finalTranscript &&
        !loading
      ) {
        /*
          थोडा delay:
          browser ला final transcript state
          settle होण्यासाठी.
        */
        setTimeout(() => {
          sendMessage(
            finalTranscript,
            true
          )
        }, 150)
      }

      voiceTranscriptRef.current = ''
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
     SCROLL
  ========================================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
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

    if (listening) {
      /*
        onend automatically execute होईल
        आणि transcript send होईल.
      */
      recognitionRef.current.stop()

      return
    }

    /*
      Previous text clear
    */
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


  /* =========================================================
     TEXT TO SPEECH
  ========================================================= */

  function speakAnswer(text) {
    if (
      !('speechSynthesis' in window)
    ) {
      return
    }

    window.speechSynthesis.cancel()

    const cleanText = String(text)
      .replace(/\*\*/g, '')
      .replace(/[#*_]/g, '')
      .replace(
        /\[(.*?)\]\(.*?\)/g,
        '$1'
      )

    const utterance =
      new SpeechSynthesisUtterance(
        cleanText
      )

    utterance.lang = 'mr-IN'
    utterance.rate = 0.95
    utterance.pitch = 1

    utterance.onstart = () => {
      setSpeaking(true)
    }

    utterance.onend = () => {
      setSpeaking(false)
    }

    utterance.onerror = () => {
      setSpeaking(false)
    }

    window.speechSynthesis.speak(
      utterance
    )
  }


  function stopSpeaking() {
    window.speechSynthesis.cancel()

    setSpeaking(false)
  }


  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  async function sendMessage(
    customText = '',
    fromVoice = false
  ) {
    const question =
      (
        customText ||
        input
      ).trim()

    if (
      !question ||
      loading
    ) {
      return
    }

    /*
      Voice send झाल्यावर input clear
    */
    setInput('')

    const userMessage = {
      id:
        Date.now(),
      role: 'user',
      content: question,
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
    ])

    setLoading(true)


    try {
      /*
        IMPORTANT:

        Browser:
        /api/chat

        Vite proxy:
        http://127.0.0.1:8000/chat
      */

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
        Voice वरून आलेला question असेल
        तर answer automatic बोलवायचा नाही.
        
        User ला Listen button मिळेल.
      */

    } catch (error) {
      console.error(
        'Chat error:',
        error
      )

      /*
        Status offline फक्त actual
        backend error असल्यास.
      */
      setOnline(false)

      setMessages((prev) => [
        ...prev,
        {
          id:
            Date.now() + 2,

          role: 'assistant',

          content:
                  `⚠️ सध्या AI Assistant Service उपलब्ध नाहीये.

                  कृपया तुमचा प्रश्न पुन्हा विचारा किंवा थोड्या वेळाने पुन्हा try करा. 🙏`,
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
    window.speechSynthesis?.cancel()

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {}
    }

    setSpeaking(false)
    setListening(false)

    voiceTranscriptRef.current = ''

    setMessages([
      {
        id:
          Date.now(),

        role: 'assistant',

        content:
          'Namaskar! 👋 Punha suru करूया. Tumhala kay mahiti pahije?',

        suggestions:
          INITIAL_SUGGESTIONS.slice(0, 5),
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
    <div className="h-[100dvh] w-full overflow-hidden bg-slate-100 flex flex-col">
      <Navbar />

      {/* =====================================================
          CHATBOT HEADER
      ===================================================== */}
      <section className="pt-16 md:pt-20 flex-1 min-h-0">
        <div className="h-full flex flex-col">
          <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-sky-500 text-white shrink-0">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 md:py-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-xl md:text-2xl shadow-lg">
                    🤖
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base md:text-2xl font-bold truncate">
                      Shivyog AI Assistant
                    </h2>
                    <p className="text-[10px] md:text-sm text-white/80 truncate">
                      Products • Services • Prices • Support
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] md:text-xs font-semibold ${
                      online
                        ? 'bg-green-400/20 text-white'
                        : 'bg-red-400/20 text-white'
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
                    className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
                    title="Clear chat"
                    aria-label="Clear chat"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              CHAT CARD
          ================================================= */}
          <div className="flex-1 min-h-0 max-w-6xl w-full mx-auto px-0 sm:px-3 md:px-5 md:py-3">
            <div className="h-full bg-white md:rounded-3xl md:shadow-xl md:border md:border-slate-200 overflow-hidden flex flex-col">

              {/* MESSAGE AREA — ONLY THIS AREA SCROLLS */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-4 md:px-8 py-4 md:py-6 [scrollbar-width:thin]">
                <div className="max-w-4xl mx-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 md:gap-3 mb-4 md:mb-6 ${
                        message.role === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 h-8 w-8 md:h-9 md:w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-sm md:text-base">
                          🤖
                        </div>
                      )}

                      <div
                        className={`max-w-[86%] sm:max-w-[80%] md:max-w-[75%] ${
                          message.role === 'user' ? 'order-first' : ''
                        }`}
                      >
                        <div
                          className={`px-3.5 py-2.5 md:px-4 md:py-3 rounded-2xl text-[13px] md:text-sm leading-6 md:leading-7 break-words ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-md shadow-sm'
                              : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-md shadow-sm'
                          }`}
                        >
                          {renderAnswer(message.content)}
                        </div>

                        {message.role === 'assistant' &&
                          message.actions?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {message.actions.map((action, index) => (
                                <DynamicAction key={index} action={action} />
                              ))}
                            </div>
                          )}

                        {message.role === 'assistant' &&
                          message.sources?.length > 0 && (
                            <div className="mt-2 text-[9px] md:text-[10px] text-slate-400">
                              📚 {message.sources.length} shop knowledge sources used
                            </div>
                          )}

                        {message.role === 'assistant' && (
                          <div className="mt-1.5">
                            <button
                              onClick={() =>
                                speaking
                                  ? stopSpeaking()
                                  : speakAnswer(message.content)
                              }
                              className="text-[10px] md:text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"
                            >
                              {speaking ? '⏹ Stop' : '🔊 Listen'}
                            </button>
                          </div>
                        )}

                        {message.role === 'assistant' &&
                          message.suggestions?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => sendMessage(suggestion.text)}
                                  disabled={loading}
                                  className="px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl border border-indigo-100 bg-indigo-50/70 hover:bg-indigo-100 text-[10px] md:text-xs text-indigo-700 font-medium transition disabled:opacity-50"
                                >
                                  {suggestion.icon} {suggestion.text}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>

                      {message.role === 'user' && (
                        <div className="flex-shrink-0 h-8 w-8 md:h-9 md:w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm">
                          👤
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-2 md:gap-3 mb-4 md:mb-6">
                      <div className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                        🤖
                      </div>

                      <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl shadow-sm">
                        <div className="flex gap-1.5">
                          <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />
                          <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* =================================================
                  INPUT AREA — FIXED INSIDE CHAT CARD
              ================================================= */}
              <div className="shrink-0 border-t border-slate-200 bg-white p-2.5 sm:p-3 md:p-5">
                <div className="max-w-4xl mx-auto">

                  {/* QUICK BUTTONS */}
                  <div className="flex gap-1.5 overflow-x-auto overscroll-contain mb-2.5 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <button
                      onClick={() => sendMessage('shop cha timing kay ahe?')}
                      disabled={loading}
                      className="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-50 border text-[10px] md:text-xs hover:bg-slate-100 disabled:opacity-50"
                    >
                      🕘 Timing
                    </button>

                    <button
                      onClick={() => sendMessage('shop location kay ahe?')}
                      disabled={loading}
                      className="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-50 border text-[10px] md:text-xs hover:bg-slate-100 disabled:opacity-50"
                    >
                      📍 Location
                    </button>

                    <button
                      onClick={() => sendMessage('available products sang')}
                      disabled={loading}
                      className="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-50 border text-[10px] md:text-xs hover:bg-slate-100 disabled:opacity-50"
                    >
                      🛍 Products
                    </button>

                    <button
                      onClick={() => sendMessage('services kontya available ahet?')}
                      disabled={loading}
                      className="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-50 border text-[10px] md:text-xs hover:bg-slate-100 disabled:opacity-50"
                    >
                      🛠 Services
                    </button>
                  </div>

                  {/* INPUT BOX */}
                  <div className="flex items-end gap-1.5 md:gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-1.5 md:p-2 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      placeholder="Ask about products, price, service..."
                      className="flex-1 min-w-0 bg-transparent outline-none resize-none px-2 md:px-3 py-2.5 text-[13px] md:text-sm max-h-24 md:max-h-32"
                    />

                    {/* VOICE */}
                    <button
                      onClick={startVoice}
                      disabled={loading}
                      className={`h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-xl flex items-center justify-center text-base md:text-lg transition ${
                        listening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-white border border-slate-200 hover:bg-indigo-50'
                      } disabled:opacity-40`}
                      title={listening ? 'Stop voice' : 'Voice input'}
                      aria-label={listening ? 'Stop voice' : 'Voice input'}
                    >
                      {listening ? '⏹' : '🎙️'}
                    </button>

                    {/* SEND */}
                    <button
                      onClick={() => sendMessage()}
                      disabled={loading || !input.trim()}
                      className="h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 transition"
                      title="Send"
                      aria-label="Send message"
                    >
                      ➤
                    </button>
                  </div>

                  <div className="text-center text-[9px] md:text-[10px] text-slate-400 mt-1.5">
                    Enter to send · 🎙️ बोलून थांबल्यावर message automatically send होईल
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MOBILE CONTACT BAR
      ===================================================== */}
      <div className="md:hidden shrink-0 z-40 grid grid-cols-3 bg-white border-t shadow-xl safe-area-pb">
        <a
          href={waLink(WA_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 text-center text-[10px] font-semibold text-green-600 active:bg-green-50"
        >
          💬 WhatsApp
        </a>

        <a
          href={telLink(PHONE_NUMBERS[0])}
          className="py-2.5 text-center text-[10px] font-semibold text-blue-600 border-x active:bg-blue-50"
        >
          📞 Call
        </a>

        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 text-center text-[10px] font-semibold text-red-500 active:bg-red-50"
        >
          🗺️ Directions
        </a>
      </div>
    </div>
  )
}
