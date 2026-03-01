import { Link, useLoaderData } from "react-router-dom";
import { useRawDataStore } from "../data-store";
import { supabase } from "../../supabase";
import type { Database } from "../../database.types";

const UpdateFetched = () => {

    const rawData = useRawDataStore();

    const updateData = async () => {
        //if (prompt('Password?') != 'chomp')
        //return;

        //alert('Udating data...');

        const teams = Object.keys(rawData.rawDataCombined.team_rows);

        var newData: Database['public']['Tables']['Fetched Team Data']['Insert'][] = [];

        for (const team of teams) {

            const colorResponse = await fetch('https://api.frc-colors.com/v1/team/' + team);
            const colorData = await colorResponse.json();
            console.log(colorData);

            newData.push({
                'team': parseInt(team),
                'primary_hex': colorData.primaryHex,
                'secondary_hex': colorData.secondaryHex,
            });
        };

        console.log(newData);

        if (newData.length > 1)
            await supabase.from('Fetched Team Data').upsert(newData);
    }

    return <div className="w-full pt-5 flex flex-1 flex-col justify-center items-center pb-10">
        <h2 className='text-center text-3xl font-rubik font-light w-full mb-5'>Update Fetched Data</h2>
        <button onClick={updateData} className="bg-[#ebe8d8]/67 text-xl px-5 py-2 w-fit shadow-sm rounded-lg border-1 border-gray-600 flex flex-row items-center justify-center py-1 gap-3 cursor-pointer hover:ring-2 hover:shadow-md hover:scale-101 transition">
            Update Data
        </button>
    </div>
}

export default UpdateFetched;