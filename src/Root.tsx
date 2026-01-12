import { Outlet, useLoaderData } from "react-router-dom";
import { supabase } from '../supabase'
import type {LIVE_DATA_COMBINED} from '../types';
import NavBar from "./components/NavBar";

export default function Root() {
    const { all_match_data }:LIVE_DATA_COMBINED = useLoaderData();
    console.log(all_match_data);

    return (
        <div className="bg-gradient-to-br from-[#EAA909CC] to-[#78DDABCC] w-full h-full min-h-screen min-w-screen">
            <NavBar/>
            <Outlet />
        </div>
    );
}

export async function loader(): Promise<LIVE_DATA_COMBINED> {
    const { data: all_match_data } = await supabase.from('Live Data').select('*');
    const { data: all_pit_data } = await supabase.from('Pit Scouting').select('*');
    const { data: all_pick_list_data } = await supabase.from('Pick List').select('*');

    return {
        'all_match_data': all_match_data ?? [],
        'all_pit_data': all_pit_data ?? [],
        'all_pick_list_data': all_pick_list_data ?? []
    } as LIVE_DATA_COMBINED;
}