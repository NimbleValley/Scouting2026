import { Link, useLoaderData } from "react-router-dom";
import { useRawDataStore } from "../data-store";
import { LogOut } from "lucide-react";

export async function teamPageLoader({ params }: { params: any }) {
    return { 'team': params.teamNumber };
}

const Team = () => {

    const { team } = useLoaderData();
    const rawData = useRawDataStore();

    if (!Object.keys(rawData.rawDataCombined.team_rows).includes(team)) {
        return <div className="flex-1 py-15 flex flex-col items-center bg-white gap-5 px-50 text-center rounded-b-lg">
            <h1 className='font-poppins text-4xl underline mb-5'>Team Not Found</h1>
            <h2 className='text-2xl font-rubik font-light w-full'>No data found for team {team}.</h2>
        </div>
    }

    const fetchedTeam = rawData.rawDataCombined.fetched_team_data.find((t) => t.team == team);

    return <div className="flex-1 py-5 flex flex-col items-center bg-white gap-5 px-5 text-center rounded-b-lg">
        <div className="p-5 w-full flex flex-row items-center justify-start gap-4">
            <div className=" w-full flex flex-row items-center justify-start gap-4">
                <Link to={'/teams'} className="rotate-[180deg] mr-5 hover:ring-2 p-2 rounded-md cursor-pointer transition hover:scale-103">
                    <LogOut></LogOut>
                </Link>
                <h1 className='font-poppins text-5xl'>Team {team}</h1>
                <h3 className='text-3xl font-rubik'>-</h3>
                <h3 className='text-3xl font-light font-rubik'>{rawData.rawDataCombined.fetched_team_data.find((t) => t.team == team)?.team_name ?? 'Unknown'}</h3>
            </div>
            <div className="w-full font-rubik flex flex-row items-center text-xl justify-end gap-4">
                <h1>Rank: {fetchedTeam?.opr == -1 ? '--' : fetchedTeam?.opr}</h1>
                <h1>OPR: {fetchedTeam?.opr == -1 ? '--' : fetchedTeam?.opr}</h1>
            </div>
        </div>
        <div className="w-full flex flex-row justify-between">
            {fetchedTeam?.ai_overview &&
                <div className="border-1 font-rubik font-light text-lg bg-[#ebe8d8]/67 border-gray-600 py-3 px-1 rounded-lg flex-1">{fetchedTeam.ai_overview}</div>
            }
            <div className="flex-1"></div>
        </div>
    </div>
}

export default Team;