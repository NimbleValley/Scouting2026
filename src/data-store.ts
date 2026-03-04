import { create } from 'zustand'
import type { LIVE_DATA_COMBINED, StatisticPercentile } from '../types';

export const TBA_KEY = "sBluV8DKQA0hTvJ2ABC9U3VDZunUGUSehxuDPvtNC8SQ3Q5XHvQVt0nm3X7cvP7j";

// Define types for state & actions
interface RawDataState {
    rawDataCombined: LIVE_DATA_COMBINED,
    eventKey: string,
    eventData: EventData | null,
    districtEventKeys: string[],
    setRawDataCombined: (state: LIVE_DATA_COMBINED) => void,
    setDistrictEventKeys: (s: string[]) => void,
    setEventKey: (k: string) => void,
    setEventData: (k: EventData | null) => void,
}

// Create store using the curried form of `create`
export const useRawDataStore = create<RawDataState>()((set, get) => ({
    rawDataCombined: {
        all_match_data: [],
        all_pit_data: [],
        all_pick_list_data: [],
        pit_scout_data: [],
        team_rows: [],
        fetched_team_data: [],
        team_percentile_thresholds: [],
        team_columns_sorted: [],
        team_rows_with_fetched: [],
    },
    eventData: null,
    districtEventKeys: [],
    eventKey: localStorage.getItem('event-key') ?? '2026wiply',
    setRawDataCombined: (state: LIVE_DATA_COMBINED) => set((s) => ({ rawDataCombined: state })),
    setDistrictEventKeys: (state: string[]) => {
        set((s) => ({ districtEventKeys: state }));
    },
    setEventKey: async (k: string) => {
        set((s) => ({ eventKey: '2026' + k.replaceAll('2026', '') }));
        localStorage.setItem('event-key', get().eventKey);
        set({ 'eventData': await fetchEventData(get().eventKey) });
    },
    setEventData: (a: EventData | null) => {
        set({ 'eventData': a });
    },
}));

interface OPRData {
    'ccwms': Record<string, number>[],
    'dprs': Record<string, number>[],
    'oprs': Record<string, number>[],
}

export interface MatchesData {
  matches: {
    actual_time: number;

    alliances: {
      blue: {
        dq_team_keys: string[];
        score: number;
        surrogate_team_keys: string[];
        team_keys: string[];
      };
      red: {
        dq_team_keys: string[];
        score: number;
        surrogate_team_keys: string[];
        team_keys: string[];
      };
    };

    comp_level: string;
    event_key: string;
    key: string;
    match_number: number;

    post_result_time: number;
    predicted_time: number;
    time: number;

    set_number: number;

    score_breakdown: {
      blue: Record<string, any>;
      red: Record<string, any>;
    };

    videos: {
      key: string;
      type: string;
    }[];

    winning_alliance: "red" | "blue" | "";
  }[];
}

interface RankingsData {
    'extra_stats_info': any[],
    'rankings': {
        'dq': number,
        'extra_stats': number[],
        'matches_played': number,
        'rank': number, 
        'record': {
            'lossed': number,
            'ties': number,
            'wins': number
        },
        'sort_orders': number[],
        'team_key': 'string',
    }[]
}

export interface EventData {
    'rankings': RankingsData,
    'opr': OPRData,
    'matches': MatchesData,
}

export async function fetchEventData(eventKey: string): Promise<EventData | null> {
    if (!eventKey) return null;
    eventKey = '2026week0'
    try {
        const [rankingsRes, oprsRes, matchesRes] = await Promise.all([
            fetch(
                `https://www.thebluealliance.com/api/v3/event/${eventKey}/rankings`,
                { headers: { "X-TBA-Auth-Key": TBA_KEY } }
            ),
            fetch(
                `https://www.thebluealliance.com/api/v3/event/${eventKey}/oprs`,
                { headers: { "X-TBA-Auth-Key": TBA_KEY } }
            ),
            fetch(
                `https://www.thebluealliance.com/api/v3/event/${eventKey}/matches`,
                { headers: { "X-TBA-Auth-Key": TBA_KEY } }
            ),
        ]);

        const rankings = await rankingsRes.json();
        const oprData = await oprsRes.json();
        const matches = await matchesRes.json();

        console.log({
            'opr': oprData,
            'rankings': rankings,
            'matches': matches,
        })

        return {
            'opr': oprData,
            'rankings': rankings,
            'matches': matches,
        }
    } catch (err) {
        console.error("TBA fetch error", err);
        return null;
    }
}
