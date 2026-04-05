import { Link, useLoaderData } from "react-router-dom";
import { useRawDataStore } from "../data-store";
import type { TeamValues } from "../../types";

const Teams = () => {

    const rawData = useRawDataStore();
    const fetched = rawData.rawDataCombined.fetched_team_data;

    return <div className="w-full pt-5 flex-1 flex-col justify-center">
        <h2 className='text-center text-2xl font-rubik font-light w-full mb-5'>Click on a team to select:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[7%] px-[5%] gap-y-2 pb-5">
            {
                Object.entries(rawData.rawDataCombined.team_rows).map((item, i) => {
                    let f = fetched.find((f) => f.team == parseInt(item[0]));
                    console.log(f);
                    return <Link to={'/team/' + item[0]} key={i} 
                        className={`bg-[#ebe8d8]/67 shadow-sm rounded-lg border-1 border-gray-600 flex flex-col lg:flex-row items-center justify-around px-2 py-1 lg:gap-3 cursor-pointer hover:ring-2 hover:shadow-md transition`}>
                        <h1 className="font-poppins font-light text-2xl select-none">{item[0]}</h1>
                        <h2 style={{ backgroundColor: `${f?.primary_hex ?? '#ebe8d8'}67`, textShadow: `0px 0px 3px ${f?.secondary_hex ?? '#000000'}85`  }} className='px-2  rounded-lg text-shadow-lg text-shadow-black/5 text-center text-xl font-rubik font-light select-none'>{f?.team_name.split(' ').map((s) => s.length > 11 ? s.substring(0, 10) + '... ' : s + ' ') ?? 'Unknown'}</h2>

                    </Link>
                })
            }
        </div>
    </div>
}

export default Teams;