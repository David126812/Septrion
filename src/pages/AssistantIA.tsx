import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, Send, ChevronRight, MessageCircle, FolderOpen, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import BottomNav from '@/components/layout/BottomNav'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  matchedDossiers?: { id: string; name: string; status: string }[]
  suggestedActions?: { type: string; label: string; target: string; description?: string }[]
}

const INITIAL_SUGGESTIONS = [
  'Où en est l\'ascenseur ?',
  'Quels dossiers sont bloqués ?',
  'Résume la situation',
]

const AssistantIA = () => {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const isIdle = messages.length === 0

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 100)
  }, [])

  const sendQuestion = useCallback(async (question: string) => {
    if (!question.trim() || !profile?.copro_id) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: question.trim(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    scrollToBottom()

    try {
      const { data, error } = await supabase.functions.invoke('assistant-query', {
        body: { question: question.trim(), copro_id: profile.copro_id },
      })

      if (error || !data?.success) throw new Error()

      const result = data.data
      const responseText = result.response || 'Je n\'ai pas pu trouver de réponse.'

      // Typing delay proportional to response length
      const typingDelay = Math.min(1800, Math.max(700, responseText.length * 6))

      await new Promise((resolve) => setTimeout(resolve, typingDelay))

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: responseText,
        matchedDossiers: result.matched_dossiers || [],
        suggestedActions: result.suggested_actions || [],
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, assistantMsg])
      scrollToBottom()
    } catch {
      setIsTyping(false)
      const errorMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: 'Désolé, je n\'ai pas pu répondre. Réessayez dans un instant.',
      }
      setMessages((prev) => [...prev, errorMsg])
      scrollToBottom()
    }
  }, [profile?.copro_id, scrollToBottom])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendQuestion(input)
  }

  // Voice recording (Whisper)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })

        // Send to Whisper API
        try {
          const formData = new FormData()
          formData.append('file', audioBlob, 'recording.webm')
          formData.append('model', 'whisper-1')
          formData.append('language', 'fr')

          const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: { Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY || ''}` },
            body: formData,
          })

          if (res.ok) {
            const data = await res.json()
            if (data.text) sendQuestion(data.text)
          }
        } catch {
          // Whisper failed — silent fail, user can type instead
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch {
      // Microphone not available
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const reverseIdx = [...messages].reverse().findIndex((m) => m.role === 'assistant')
  const lastAssistantIdx = reverseIdx === -1 ? -1 : messages.length - 1 - reverseIdx

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">CS</span>
        </div>
        <div>
          <p className="text-sm font-semibold">Assistant Septrion</p>
          <p className="text-[10px] text-muted-foreground">Posez vos questions sur la copro</p>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 pb-40">
        {isIdle && !isTyping ? (
          /* Idle state — big mic button */
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={cn(
                'w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200',
                isRecording
                  ? 'bg-primary scale-110 shadow-[0_0_40px_rgba(37,99,235,0.4)]'
                  : 'bg-primary/10 border-2 border-primary/20 active:scale-95'
              )}
            >
              <Mic className={cn(
                'size-10',
                isRecording ? 'text-white animate-pulse' : 'text-primary'
              )} />
            </button>
            <p className="text-sm font-semibold mt-4">
              {isRecording ? 'Je vous écoute…' : 'Appuyez pour parler'}
            </p>
            <p className="text-xs text-muted-foreground mt-1 text-center max-w-[250px]">
              {isRecording ? 'Relâchez pour envoyer' : 'Ou tapez votre question ci-dessous'}
            </p>

            {/* Initial suggestion chips */}
            <div className="mt-8 w-full max-w-sm space-y-2">
              {INITIAL_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendQuestion(suggestion)}
                  className="w-full p-3 rounded-xl border border-border flex items-center justify-between text-sm font-medium transition-colors active:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="size-4 text-primary shrink-0" />
                    <span>{suggestion}</span>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Conversation state */
          <div className="space-y-4 max-w-lg mx-auto">
            {messages.map((msg, idx) => (
              <div key={msg.id}>
                {msg.role === 'user' ? (
                  /* User bubble */
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%] text-sm">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  /* Assistant bubble */
                  <div className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-[9px] font-bold">CS</span>
                    </div>
                    <div className="bg-secondary border border-border px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[80%]">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{msg.text}</p>

                      {/* Contextual actions — only on last assistant message */}
                      {idx === lastAssistantIdx && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.suggestedActions.map((action, actionIdx) => (
                            <button
                              key={actionIdx}
                              onClick={() => {
                                if (action.type === 'view_dossier') {
                                  navigate(`/dossiers/${action.target}`)
                                } else if (action.type === 'create_signalement') {
                                  navigate('/signaler-incident')
                                }
                              }}
                              className="w-full p-2.5 rounded-xl border border-border flex items-center gap-3 text-left transition-colors active:bg-muted"
                            >
                              {action.type === 'view_dossier' ? (
                                <FolderOpen className="size-4 text-blue-500 shrink-0" />
                              ) : (
                                <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium">{action.label}</p>
                                {action.description && (
                                  <p className="text-[10px] text-muted-foreground">{action.description}</p>
                                )}
                              </div>
                              <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-[9px] font-bold">CS</span>
                </div>
                <div className="bg-secondary border border-border px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input bar — sticky bottom (above BottomNav) */}
      {!isIdle && (
        <div className="fixed bottom-16 left-0 right-0 z-20 bg-background border-t border-border px-4 py-3 safe-area-bottom">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-lg mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              className="flex-1 h-10"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 shrink-0"
              disabled={!input.trim() || isTyping}
            >
              <Send className="size-4" />
            </Button>
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={cn(
                'h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all',
                isRecording
                  ? 'bg-primary text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <Mic className={cn('size-4', isRecording && 'animate-pulse')} />
            </button>
          </form>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

export default AssistantIA
