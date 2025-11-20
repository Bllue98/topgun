import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from './slices/settingsSlice'
import raritiesReducer from './slices/raritiesSlice'

// import talentsReducer from './slices/talentsSlice'
import authReducer from './slices/authSlice' // <-- adicione

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    rarities: raritiesReducer,

    // talents: talentsReducer,
    auth: authReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
