import type { Database } from './database.types'

export interface TeamValues {
        team_number: number
        auto_fuel: TeamStatistic
        auto_pass: TeamStatistic
        auto_points: TeamStatistic
        driver_rating: TeamStatistic
        endgame_points: TeamStatistic
        match_number: TeamStatistic
        tele_fuel: TeamStatistic
        tele_points: TeamStatistic
        total_gamepieces: TeamStatistic
        total_points: TeamStatistic
}

export interface TeamStatistic {
        min: number;
        max: number;
        mean: number;
        median: number;
        q3: number;
}

export interface LIVE_DATA_COMBINED {
        'all_match_data': Database['public']['Tables']['Live Data']['Row'][];
        'all_pit_data': Database['public']['Tables']['Pit Scouting']['Row'][];
        'all_pick_list_data': Database['public']['Tables']['Pick List']['Row'][];
        'team_rows': Record<number, TeamValues>;
        'fetched_team_data': Database['public']['Tables']['Fetched Team Data']['Row'][];
}