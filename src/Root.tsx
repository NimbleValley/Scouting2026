import { Outlet, useLoaderData } from "react-router-dom";
import { supabase } from '../supabase'
import type { LIVE_DATA_COMBINED, TeamStatistic, TeamValues } from '../types';
import NavBar from "./components/NavBar";
import { useEffect } from "react";
import { TBA_KEY, useRawDataStore } from "./data-store";
import type { Database } from "../database.types";

export default function Root() {
    const rawData: LIVE_DATA_COMBINED = useLoaderData();

    const rawDataStore = useRawDataStore();

    useEffect(() => {
        async function e() {
            rawDataStore.setRawDataCombined(rawData);
            rawDataStore.setDistrictEventKeys(await fetchEventsWI());
            console.log(rawDataStore.rawDataCombined);
        }
        e();
    }, [rawData])

    return (
        <div className="bg-[#ebe8d8] dark:bg-[#4C8695] w-fit h-screen min-h-screen w-full pt-14 pb-14 pr-7 overflow-x-auto">
            <NavBar />
            <div className="ml-7 bg-white flex-1 min-w-[calc(100vw-56px)] rounded-b-xl z-20 relative min-h-20 h-fit w-fit">
                <Outlet />
            </div>
        </div>
    );
}

export async function loader(): Promise<LIVE_DATA_COMBINED> {
    const { data: all_match_data } = await supabase.from('Live Data').select('*');
    const { data: all_pit_data } = await supabase.from('Pit Scouting').select('*');
    const { data: all_pick_list_data } = await supabase.from('Pick List').select('*');
    const { data: fetched_team_data } = await supabase.from('Fetched Team Data').select('*');

    

    return {
        'all_match_data': all_match_data ?? [],
        'all_pit_data': all_pit_data ?? [],
        'all_pick_list_data': all_pick_list_data ?? [],
        'team_rows': all_match_data ? compileTeamData(all_match_data) : {},
        'fetched_team_data': fetched_team_data ?? [],
    } as LIVE_DATA_COMBINED;
}

async function fetchEventsWI(): Promise<string[]> {
    let events = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026win/events`,
        { headers: { "X-TBA-Auth-Key": TBA_KEY } }
    );
    let parsedEvents = await events.json();
    return parsedEvents.map((item:any) => item['first_event_code']);
}

function compileTeamData(matchData: Database['public']['Tables']['Live Data']['Row'][]): Record<number, TeamValues> {
    var teams: number[] = [];
    matchData.forEach((item) => {
        if (!teams.includes(item.team_number)) {
            teams.push(item.team_number);
        }
    });
    let data: Record<number, TeamValues> = {};
    teams.forEach((team) => {
        let defaultTeamStatistic: TeamStatistic = {
            min: 0,
            max: 0,
            mean: 0,
            median: 0,
            q3: 0,
        };

        let tempTeamValues: TeamValues = {
            team_number: 0,
            auto_fuel: defaultTeamStatistic,
            auto_pass: defaultTeamStatistic,
            auto_points: defaultTeamStatistic,
            driver_rating: defaultTeamStatistic,
            endgame_points: defaultTeamStatistic,
            match_number: defaultTeamStatistic,
            tele_fuel: defaultTeamStatistic,
            tele_points: defaultTeamStatistic,
            total_gamepieces: defaultTeamStatistic,
            total_points: defaultTeamStatistic
        };
        let matches = matchData.filter((t) => t.team_number == team);
        if (matches.length < 1)
            return;

        tempTeamValues.team_number = team;
        Object.keys(matches[0]).forEach((key) => {
            const keyTyped = key as keyof TeamValues;
            // collect numeric values only
            const valuesInKey = matches.map((m) => (m as any)[key]).filter((v) => typeof v === 'number') as number[];
            const len = valuesInKey.length;
            if (len === 0) return; // nothing numeric to compute

            const getPercentile = (p: number) => {
                const index = p * (len - 1);
                const lower = Math.floor(index);
                const upper = Math.ceil(index);
                const weight = index - lower;
                const lowerVal = valuesInKey[lower];
                const upperVal = valuesInKey[upper];
                return lowerVal * (1 - weight) + upperVal * weight;
            };

            const sortedAsc = [...valuesInKey].sort((a, b) => a - b);
            const sortedDesc = [...valuesInKey].sort((a, b) => b - a);

            let tempTeamStats: TeamStatistic = {
                'min': sortedAsc[0],
                'max': sortedDesc[0],
                'mean': valuesInKey.reduce((accumulator, current) => accumulator + current, 0) / len,
                'median': getPercentile(0.5),
                'q3': getPercentile(0.75),
            }
            // skip assigning to team_number, this is useless
            if (keyTyped !== 'team_number') {
                (tempTeamValues as any)[keyTyped] = tempTeamStats;
            }
        });
        data[team] = (tempTeamValues);
    });
    console.log(data)
    return data;
}