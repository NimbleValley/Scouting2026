import { Outlet, useLoaderData } from "react-router-dom";
import { supabase } from '../supabase'
import type { LIVE_DATA_COMBINED } from '../types';
import NavBar from "./components/NavBar";
import { useEffect } from "react";
import { useRawDataStore } from "./data-store";

export default function Root() {
    const rawData: LIVE_DATA_COMBINED = useLoaderData();

    const rawDataStore = useRawDataStore();

    useEffect(() => {
        rawDataStore.setRawDataCombined(rawData);
        console.log(rawDataStore.rawDataCombined)
    }, [rawData])

    return (
        <div className="bg-[#ebe8d8] dark:bg-[#4C8695] w-full h-full min-h-screen max-w-screen pt-13">
            <NavBar />
            <div className="mx-7 bg-white flex-1 rounded-xl">
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
        'all_pick_list_data': all_pick_list_data ?? []
    } as LIVE_DATA_COMBINED;
}