import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'
import axios from 'axios'

type User = {
  id: string
  name: string
  email: string
  roles?: string[]
}

type Credentials = {
  email: string
  password: string
}

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const persisted = typeof window !== 'undefined' ? localStorage.getItem('auth') : null
const initialState: AuthState = persisted
  ? JSON.parse(persisted)
  : {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    }

// Exemplo simples: ajuste a URL e resposta conforme sua API
export const login = createAsyncThunk('auth/login', async (creds: Credentials, { rejectWithValue }) => {
  try {
    const res = await fetch(authConfig.loginEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds)
    })
    if (!res.ok) {
      const err = await res.text()

      return rejectWithValue(err || 'Login failed')
    }
    const data = await res.json() // esperar { user, token }

    return data
  } catch (e: any) {
    return rejectWithValue(e.message || 'Network error')
  }
})

export const register = createAsyncThunk(
  'auth/register',
  async (payload: { email: string; password: string; username?: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(authConfig.registerEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.text()

        return rejectWithValue(err || 'Registration failed')
      }

      const data = await res.json() // expecting { accessToken, userData }

      // Treat backend validation errors as rejection
      if (data && (data.error || data.errors)) {
        return rejectWithValue(data.error ?? data.errors)
      }

      return data
    } catch (e: any) {
      return rejectWithValue(e.message || 'Network error')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null

      // persist simple
      localStorage.setItem(
        'auth',
        JSON.stringify({ user: state.user, token: state.token, isAuthenticated: true, loading: false, error: null })
      )

      // ensure axios includes Authorization for subsequent requests
      if (state.token) {
        const bearer = state.token.startsWith('Bearer ') ? state.token : `Bearer ${state.token}`
        axios.defaults.headers.common['Authorization'] = bearer
      }
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      localStorage.removeItem('auth')
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        const { userData, accessToken } = action.payload
        state.user = userData
        state.token = accessToken
        state.isAuthenticated = true
        state.loading = false
        state.error = null

        // Persist in both the legacy keys used by guards and in a single compact snapshot
        if (typeof window !== 'undefined') {
          // Keys used by AuthGuard/GuestGuard
          if (accessToken) localStorage.setItem('accessToken', accessToken)
          if (userData) localStorage.setItem('userData', JSON.stringify(userData))

          // ensure axios includes Authorization for subsequent requests
          if (accessToken) {
            const bearer = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`
            axios.defaults.headers.common['Authorization'] = bearer
          }

          // Project slice snapshot (optional)
          localStorage.setItem(
            'auth',
            JSON.stringify({
              user: userData,
              token: accessToken,
              isAuthenticated: true,
              loading: false,
              error: null
            })
          )
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || action.error.message || 'Login failed'
      })
      .addCase(register.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload as any

        // If backend returned token + user, set them and persist
        if (payload?.accessToken) {
          state.token = payload.accessToken
          state.user = payload.userData ?? state.user
          state.isAuthenticated = true
          state.error = null

          if (typeof window !== 'undefined') {
            localStorage.setItem(
              'auth',
              JSON.stringify({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: false,
                error: null
              })
            )
          }
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as any) || action.error.message || 'Registration failed'
      })
  }
})

export default authSlice.reducer
