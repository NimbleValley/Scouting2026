import { create } from 'zustand'
import type { LIVE_DATA_COMBINED } from '../types';

export const TBA_KEY = "sBluV8DKQA0hTvJ2ABC9U3VDZunUGUSehxuDPvtNC8SQ3Q5XHvQVt0nm3X7cvP7j";

// Define types for state & actions
interface RawDataState {
    rawDataCombined: LIVE_DATA_COMBINED,
    eventKey: string,
    districtEventKeys: string[],
    setRawDataCombined: (state: LIVE_DATA_COMBINED) => void,
    setDistrictEventKeys: (s: string[]) => void,
    setEventKey: (k: string) => void,
}

// Create store using the curried form of `create`
export const useRawDataStore = create<RawDataState>()((set, get) => ({
    rawDataCombined: {
        all_match_data: [],
        all_pit_data: [],
        all_pick_list_data: [],
        team_rows: [],
        fetched_team_data: [],
    },
    districtEventKeys: [],
    eventKey: localStorage.getItem('event-key') ?? '2026wiply',
    setRawDataCombined: (state: LIVE_DATA_COMBINED) => set((s) => ({ rawDataCombined: state })),
    setDistrictEventKeys: (state: string[]) => {
        set((s) => ({ districtEventKeys: state }));
    },
    setEventKey: (k: string) => {
        set((s) => ({ eventKey: '2026' + k.replace('2026', '') }));
        localStorage.setItem('event-key', get().eventKey);
    }
}));