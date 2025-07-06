import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  console.log('AuthProvider - Current state:', { loading, user: user?.email, hasSession: !!session })

  useEffect(() => {
    console.log('AuthProvider - Initializing auth...')
    
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider - Getting session...')
        // 現在のセッションを取得
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
        }
        
        console.log('AuthProvider - Session result:', { session: !!session, user: session?.user?.email })
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        console.log('AuthProvider - Setting loading to false')
        setLoading(false)
      }
    }

    initializeAuth()

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === 'SIGNED_IN') {
        toast({
          title: "ログインしました",
          description: "TOFUラボ週刊情報誌へようこそ！",
        })
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "ログアウトしました",
          description: "またのご利用をお待ちしております。",
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [toast])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast({
        title: "ログインエラー",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      toast({
        title: "サインアップエラー",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }

    toast({
      title: "サインアップ完了",
      description: "確認メールをご確認ください。",
    })
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "ログアウトエラー",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}