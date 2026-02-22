import { Outlet, useLoaderData } from "react-router-dom";
import { supabase } from '../supabase'
import type { LIVE_DATA_COMBINED, TeamValues } from '../types';
import NavBar from "./components/NavBar";
import { useEffect } from "react";
import { useRawDataStore } from "./data-store";
import type { Database } from "../database.types";

export default function Root() {
    const rawData: LIVE_DATA_COMBINED = useLoaderData();

    const rawDataStore = useRawDataStore();

    useEffect(() => {
        rawDataStore.setRawDataCombined(rawData);
        console.log(rawDataStore.rawDataCombined)
    }, [rawData])

    return (
        <div className="bg-[#ebe8d8] dark:bg-[#4C8695] w-full h-full min-h-screen w-full pt-14 pb-14">
            <NavBar />
            <div className="mx-7 bg-white flex-1 rounded-b-xl z-20 relative min-h-20 h-fit w-fit">
                <Outlet />
            </div>
        </div>
    );
}

export async function loader(): Promise<LIVE_DATA_COMBINED> {
    const { data: all_match_data } = await supabase.from('Live Data').select('*');
    console.log(all_match_data)
    const { data: all_pit_data } = await supabase.from('Pit Scouting').select('*');
    const { data: all_pick_list_data } = await supabase.from('Pick List').select('*');

    return {
        'all_match_data': all_match_data ?? [],
        'all_pit_data': all_pit_data ?? [],
        'all_pick_list_data': all_pick_list_data ?? [],
        'team_rows': compileTeamData(all_match_data ?? []),
    } as LIVE_DATA_COMBINED;
}

function compileTeamData(matchData: Database['public']['Tables']['Live Data']['Row'][]): TeamValues[] {
    var teams: number[] = [];
    matchData.forEach((item) => {
        if (!teams.includes(item.team_number)) {
            teams.push(item.team_number);
        }
    });
    return [];
}