import type { Database } from './database.types'

export interface LIVE_DATA_COMBINED {
        'all_match_data': Database['public']['Tables']['Live Data']['Row'][];
        'all_pit_data': Database['public']['Tables']['Pit Scouting']['Row'][];
        'all_pick_list_data': Database['public']['Tables']['Pick List']['Row'][];
}