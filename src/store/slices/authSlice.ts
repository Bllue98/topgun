import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import authConfig from 'src/configs/auth'

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
    const res = await fetch('/api/auth/login', {
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
  async (payload: { email: string; password: string; username?: string }, thunkAPI) => {
    try {
      const response = await axios.post(authConfig.registerEndpoint, payload)
      const data = response.data

      // The fake backend returns 200 even for validation errors (payload.error).
      // Treat a response that contains an `error` key as a rejection so callers (pages) can handle/display it.
      if (data && (data.error || data.errors)) {
        return thunkAPI.rejectWithValue(data.error ?? data.errors)
      }

      // return whatever the endpoint returns (e.g. { accessToken })
      return data
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data ?? { message: err.message })
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
        const { user, token } = action.payload
        state.user = user
        state.token = token
        state.isAuthenticated = true
        state.loading = false
        state.error = null
        localStorage.setItem(
          'auth',
          JSON.stringify({ user, token, isAuthenticated: true, loading: false, error: null })
        )
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || action.error.message || 'Login failed'
      })
      .addCase(register.pending, state => {
        state.loading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false

        // If the backend returns an accessToken on registration, persist it in state so it can be used
        // (the fake-db returns { accessToken } on success). We don't have user data here – the app
        // can call the `me` endpoint after registration/login to fetch user info.
        const payload = action.payload as any
        if (payload?.accessToken) {
          state.token = payload.accessToken

          // persist minimal auth info
          if (typeof window !== 'undefined') {
            localStorage.setItem(
              'auth',
              JSON.stringify({
                user: state.user,
                token: state.token,
                isAuthenticated: false,
                loading: false,
                error: null
              })
            )
          }
        }
      })
      .addCase(register.rejected, state => {
        state.loading = false

        // optionally store errors in state
      })
  }
})

export default authSlice.reducer
