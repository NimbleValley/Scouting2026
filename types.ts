import type { Database } from './database.types';

export interface TeamValues {
        auto_fuel_taken_NZ: TeamStatistic;
        auto_sos: TeamStatistic;
        defense_strength: TeamStatistic | null;
        driver_rating: TeamStatistic;
        endgame_points: TeamStatistic;
        how_defendable: TeamStatistic | null;
        team_number: number;
        tele_fuel_dozed: TeamStatistic;
        tele_fuel_impacted: TeamStatistic;
        tele_fuel_passed: TeamStatistic;
        tele_fuel_scored: TeamStatistic;
        tele_points: TeamStatistic;
        throughput_speed: TeamStatistic;
        tioi_rating: TeamStatistic;
}

export interface TeamValuesWithFetched {
        auto_fuel_taken_NZ: TeamStatistic;
        auto_sos: TeamStatistic;
        defense_strength: TeamStatistic | null;
        driver_rating: TeamStatistic;
        endgame_points: TeamStatistic;
        how_defendable: TeamStatistic | null;
        team_number: number;
        tele_fuel_dozed: TeamStatistic;
        tele_fuel_impacted: TeamStatistic;
        tele_fuel_passed: TeamStatistic;
        tele_fuel_scored: TeamStatistic;
        tele_points: TeamStatistic;
        throughput_speed: TeamStatistic;
        tioi_rating: TeamStatistic;
        opr: TeamStatistic;
        epa: TeamStatistic;
        auto_fuel: TeamStatistic;
}

export interface TeamStatistic {
        min: number;
        max: number;
        mean: number;
        median: number;
        q3: number;
}

export interface StatisticPercentile {
        max: {
                '10': number
                '25': number
                '75': number
                '90': number
        },
        q3: {
                '10': number
                '25': number
                '75': number
                '90': number
        },
        median: {
                '10': number
                '25': number
                '75': number
                '90': number
        },
        mean: {
                '10': number
                '25': number
                '75': number
                '90': number
        },
        min: {
                '10': number
                '25': number
                '75': number
                '90': number
        },
};

export interface LIVE_DATA_COMBINED {
        'all_match_data': Database['public']['Tables']['Live Data']['Row'][];
        'all_pit_data': Database['public']['Tables']['Pit Scouting']['Row'][];
        'all_pick_list_data': Database['public']['Tables']['Pick List']['Row'][];
        'pit_scout_data': Database['public']['Tables']['Pit Scouting']['Row'][];
        'team_rows': Record<number, TeamValues>;
        'team_rows_with_fetched': Record<number, TeamValuesWithFetched>;
        'team_columns_sorted': Record<string, TeamColumnSorted>[];
        'team_percentile_thresholds': Record<string, StatisticPercentile>[];
        'fetched_team_data': Database['public']['Tables']['Fetched Team Data']['Row'][];
}

export interface TeamColumnSorted {
        'min': number[],
        'max': number[],
        'median': number[],
        'mean': number[],
        'q3': number[],
}