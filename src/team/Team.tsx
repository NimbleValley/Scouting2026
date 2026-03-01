import { useLoaderData } from "react-router-dom";
import { useRawDataStore } from "../data-store";

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

    return <div>
        <h1>TEAM: {team}</h1>
    </div>
}

export default Team;