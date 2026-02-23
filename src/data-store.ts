import { create } from 'zustand'
import type { LIVE_DATA_COMBINED } from '../types';

// Define types for state & actions
interface RawDataState {
    rawDataCombined: LIVE_DATA_COMBINED,
    setRawDataCombined: (state: LIVE_DATA_COMBINED) => void
}

// Create store using the curried form of `create`
export const useRawDataStore = create<RawDataState>()((set, get) => ({
    rawDataCombined: {
        all_match_data: [],
        all_pit_data: [],
        all_pick_list_data: [],
        team_rows: []
    },
    setRawDataCombined: (state: LIVE_DATA_COMBINED) => set((s) => ({ rawDataCombined: state }))
}));