import { createSlice, nanoid, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { RootState } from '../index'

import samples from 'src/data/talents/rarities'

export type RarityItem = {
  id: string
  name: string
  color: string
  weight: number
}

type RaritiesState = {
  items: RarityItem[]
  loading: boolean
  error: string | null
}

const mapSamplesToItems = (): RarityItem[] =>
  samples.map(s => ({
    id: s.id ?? nanoid(),
    name: s.tier.charAt(0).toUpperCase() + s.tier.slice(1),
    color: s.color ?? '#A0A0A0',
    weight: typeof s.weight === 'number' ? s.weight : 1
  }))

const initialState: RaritiesState = {
  items: mapSamplesToItems(),
  loading: false,
  error: null
}

// API CONFIG
import raritiesConfig from 'src/configs/rarities'

// Helpers de mapeamento entre backend e UI
interface BackendRarity {
  id: string
  tier?: string
  name?: string
  color?: string
  weight?: number
  dropWeight?: number
  hexColor?: string
  [key: string]: any
}

const backendToItem = (r: BackendRarity): RarityItem => {
  const tierSource = (r.tier || r.name || 'common').toString().toLowerCase()
  const tierCap = tierSource.charAt(0).toUpperCase() + tierSource.slice(1)
  const weightVal = typeof r.weight === 'number' ? r.weight : typeof r.dropWeight === 'number' ? r.dropWeight : 1
  const colorVal = r.color || r.hexColor || '#A0A0A0'

  return {
    id: r.id,
    name: tierCap,
    color: colorVal,
    weight: weightVal
  }
}

// THUNKS
export const fetchRarities = createAsyncThunk('rarities/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(raritiesConfig.listEndpoint)

    const raw = res.data

    let list: any[] = []

    if (Array.isArray(raw)) {
      list = raw
    } else if (Array.isArray(raw?.data)) {
      list = raw.data
    } else if (Array.isArray(raw?.results)) {
      list = raw.results
    } else if (Array.isArray(raw?.items)) {
      list = raw.items
    } else if (raw && (raw.tier || raw.name)) {
      // single object
      list = [raw]
    }

    const mapped = list.filter(r => r && r.id).map(r => backendToItem(r as BackendRarity))

    return mapped
  } catch (e: any) {
    return rejectWithValue(e.response?.data?.message || e.message || 'Failed to fetch rarities')
  }
})

export const createRarity = createAsyncThunk(
  'rarities/create',
  async (data: { tier: string; color?: string; weight?: number }, { rejectWithValue }) => {
    try {
      const res = await axios.post(raritiesConfig.createEndpoint, data)

      const payload = res.data?.data || res.data

      return backendToItem(payload as BackendRarity)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || e.message || 'Failed to create rarity')
    }
  }
)

export const updateRarityRemote = createAsyncThunk(
  'rarities/update',
  async (payload: { id: string; changes: { tier?: string; color?: string; weight?: number } }, { rejectWithValue }) => {
    try {
      const res = await axios.put(raritiesConfig.updateEndpoint(payload.id), payload.changes)

      const payloadRes = res.data?.data || res.data

      return backendToItem(payloadRes as BackendRarity)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || e.message || 'Failed to update rarity')
    }
  }
)

export const deleteRarityRemote = createAsyncThunk('rarities/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(raritiesConfig.deleteEndpoint(id))

    return id
  } catch (e: any) {
    return rejectWithValue(e.response?.data?.message || e.message || 'Failed to delete rarity')
  }
})

const ensureUniqueName = (items: RarityItem[], name: string, excludeId?: string) => {
  const lower = name.trim().toLowerCase()

  return !items.some(r => r.name.trim().toLowerCase() === lower && r.id !== excludeId)
}

const raritiesSlice = createSlice({
  name: 'rarities',
  initialState,
  reducers: {
    setRarities(state, action: PayloadAction<RarityItem[]>) {
      state.items = action.payload
    },
    resetToDefaults(state) {
      state.items = mapSamplesToItems()
    },
    addRarity: {
      reducer(state, action: PayloadAction<RarityItem>) {
        const exists = state.items.find(r => r.id === action.payload.id)
        const uniqueName = ensureUniqueName(state.items, action.payload.name)
        if (!exists && uniqueName) {
          state.items.push(action.payload)

          // Sort by weight desc by default (heavier first)
          state.items.sort((a, b) => b.weight - a.weight)
        }
      },
      prepare(payload: { name: string; color: string; weight: number; id?: string }) {
        return {
          payload: {
            id: payload.id ?? nanoid(),
            name: payload.name.trim(),
            color: payload.color,
            weight: Number(payload.weight)
          } as RarityItem
        }
      }
    },
    updateRarity(state, action: PayloadAction<{ id: string; changes: Partial<Omit<RarityItem, 'id'>> }>) {
      const { id, changes } = action.payload
      const idx = state.items.findIndex(r => r.id === id)
      if (idx === -1) return
      if (changes.name && !ensureUniqueName(state.items, changes.name, id)) return
      state.items[idx] = { ...state.items[idx], ...changes }
      if (changes.weight !== undefined) {
        state.items[idx].weight = Number(changes.weight)
        state.items.sort((a, b) => b.weight - a.weight)
      }
    },
    removeRarity(state, action: PayloadAction<string>) {
      state.items = state.items.filter(r => r.id !== action.payload)
    },
    reorderRarities(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      const { fromIndex, toIndex } = action.payload
      if (
        fromIndex < 0 ||
        fromIndex >= state.items.length ||
        toIndex < 0 ||
        toIndex >= state.items.length ||
        fromIndex === toIndex
      )
        return
      const [moved] = state.items.splice(fromIndex, 1)
      state.items.splice(toIndex, 0, moved)
    }
  },
  extraReducers: builder => {
    // FETCH
    builder
      .addCase(fetchRarities.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRarities.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchRarities.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || action.error.message || 'Erro ao carregar raridades'
      })

    // CREATE
    builder
      .addCase(createRarity.pending, state => {
        state.error = null
      })
      .addCase(createRarity.fulfilled, (state, action) => {
        const exists = state.items.find(r => r.id === action.payload.id)
        if (!exists) {
          state.items.push(action.payload)
          state.items.sort((a, b) => b.weight - a.weight)
        }
      })
      .addCase(createRarity.rejected, (state, action) => {
        state.error = (action.payload as string) || action.error.message || 'Erro ao criar raridade'
      })

    // UPDATE
    builder
      .addCase(updateRarityRemote.fulfilled, (state, action) => {
        const idx = state.items.findIndex(r => r.id === action.payload.id)
        if (idx !== -1) {
          state.items[idx] = action.payload
          state.items.sort((a, b) => b.weight - a.weight)
        }
      })
      .addCase(updateRarityRemote.rejected, (state, action) => {
        state.error = (action.payload as string) || action.error.message || 'Erro ao atualizar raridade'
      })

    // DELETE
    builder
      .addCase(deleteRarityRemote.fulfilled, (state, action) => {
        state.items = state.items.filter(r => r.id !== action.payload)
      })
      .addCase(deleteRarityRemote.rejected, (state, action) => {
        state.error = (action.payload as string) || action.error.message || 'Erro ao remover raridade'
      })
  }
})

export const { setRarities, resetToDefaults, addRarity, updateRarity, removeRarity, reorderRarities } =
  raritiesSlice.actions

// Selectors
export const selectRarities = (state: RootState) => state.rarities.items
export const selectRarityById = (id: string) => (state: RootState) => state.rarities.items.find(r => r.id === id)
export const selectRarityByName = (name: string) => (state: RootState) =>
  state.rarities.items.find(r => r.name.trim().toLowerCase() === name.trim().toLowerCase())

export default raritiesSlice.reducer
