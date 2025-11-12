import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SettingsState = {
  darkMode: boolean
  themeColor: string
  navCollapsed: boolean
}

const initialState: SettingsState = {
  darkMode: false,
  themeColor: 'primary',
  navCollapsed: false
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<Partial<SettingsState>>) {
      return { ...state, ...action.payload }
    },
    toggleDark(state) {
      state.darkMode = !state.darkMode
    },
    toggleNav(state) {
      state.navCollapsed = !state.navCollapsed
    }
  }
})

export const { setSettings, toggleDark, toggleNav } = settingsSlice.actions
export default settingsSlice.reducer
