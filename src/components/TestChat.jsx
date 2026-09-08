import { useEffect, useState } from 'react'

const API_URL = 'https://shivyogbackend-rizm.onrender.com'

export default function TestChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaskar! 👋 Testing chatbot ready आहे. काहीही विचारा.',
    },
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [online, setOnline] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/status`)
      .then((res) => {
        if (!res.ok) throw new Error('Backend offline')
        return res.json()
      })
      .then((data) => {
        console.log('Backend:', data)
        setOnline(true)
      })
      .catch((err) => {
        console.error('Backend error:', err)
        setOnline(false)
      })
  }, [])

  async function sendMessage() {
    const question = input.trim()

    if (!question || loading) return

    setInput('')

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: question,
      },
    ])

    setLoading(true)

    try {
      console.log('Sending to:', `${API_URL}/chat`)
      console.log('Question:', question)

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
        }),
      })

      console.log('Response status:', response.status)

      const data = await response.json()

      console.log('Backend response:', data)

      if (!response.ok) {
        throw new Error(
          data.detail || `Backend error ${response.status}`
        )
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.answer ||
            'Sorry, answer generate झाला नाही.',
        },
      ])

      setOnline(true)
    } catch (error) {
      console.error('Chat error:', error)

      setOnline(false)

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Error: ${
            error.message || 'Backend connect झाला नाही.'
          }`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f1f5f9',
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          margin: 'auto',
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 5px 25px rgba(0,0,0,0.1)',
        }}
      >
        {/* HEADER */}

        <div
          style={{
            padding: '20px',
            background: '#2563eb',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>
              🤖 Shivyog Test Chat
            </h2>

            <small>
              Direct Render Backend Test
            </small>
          </div>

          <div>
            {online ? '🟢 Online' : '🔴 Offline'}
          </div>
        </div>

        {/* MESSAGES */}

        <div
          style={{
            height: '500px',
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent:
                  message.role === 'user'
                    ? 'flex-end'
                    : 'flex-start',
                marginBottom: '15px',
              }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background:
                    message.role === 'user'
                      ? '#2563eb'
                      : '#e2e8f0',
                  color:
                    message.role === 'user'
                      ? 'white'
                      : '#0f172a',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                padding: '12px',
                color: '#64748b',
              }}
            >
              🤖 Thinking...
            </div>
          )}
        </div>

        {/* INPUT */}

        <div
          style={{
            padding: '15px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '10px',
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              outline: 'none',
              fontSize: '15px',
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '0 20px',
              border: 'none',
              borderRadius: '10px',
              background: '#2563eb',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {loading ? '...' : '➤'}
          </button>
        </div>
      </div>
    </div>
  )
}
