import { Link, useLoaderData } from "react-router-dom";
import { useRawDataStore } from "../data-store";
import { LogOut } from "lucide-react";
import type { TeamColumnSorted, TeamStatistic, TeamValues } from "../../types";

export async function teamPageLoader({ params }: { params: any }) {
    return { 'team': params.teamNumber };
}

const Team = () => {

    const bannerDataOrder: (keyof TeamValues)[] = ['tele_fuel_scored', 'driver_rating', 'endgame_points', 'tele_fuel_impacted'];

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
        <div className="p-5 w-full flex flex-col md:flex-row items-center justify-start gap-4">
            <div className=" w-full flex flex-col md:flex-row items-center justify-start gap-4">
                <Link to={'/teams'} className="rotate-[180deg] mr-5 hover:ring-2 p-2 rounded-md cursor-pointer transition hover:scale-103">
                    <LogOut></LogOut>
                </Link>
                <h1 className='font-poppins text-5xl'>Team {team}</h1>
                <h3 className='text-3xl hidden md:block font-rubik'>-</h3>
                <h3 className='text-3xl font-light font-rubik'>{rawData.rawDataCombined.fetched_team_data.find((t) => t.team == team)?.team_name ?? 'Unknown'}</h3>
            </div>
            <div className="w-full font-rubik flex flex-row items-center text-xl justify-center md:justify-end gap-4">
                <h1>Rank: {rawData.eventData?.rankings.rankings.find((item) => item.team_key == 'frc' + team)?.rank ?? '-'}</h1>
                <h1>OPR: {rawData.eventData?.opr.oprs['frc' + String(team)]?.toFixed(1) ?? '-'}</h1>
                <h1>EPA: {rawData.rawDataCombined.fetched_team_data.find((t) => t.team == team)?.epa ?? '-'}</h1>
            </div>
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between gap-7">
            {fetchedTeam?.ai_overview &&
                <div className="transition duration-250 hover:border-black border-1 font-rubik font-light text-lg bg-[#ebe8d8]/67 border-gray-600 py-3 px-1 rounded-lg flex-1">{fetchedTeam.ai_overview}</div>
            }
            <div className="flex-1 grid grid-cols-2 md:flex md:flex-row justify-between gap-2">
                {
                    bannerDataOrder.map((key, i) => {
                        return <div key={i} className="width-fit bg-gray-100 border-1 border-gray-600 rounded-lg shadow-sm flex-1 flex flex-col gap-[2px] items-center justify-center transition duration-250 hover:-translate-y-[3px]">
                            <h3 className="text-md font-rubik font-light">{underscoreToNormal(key)}</h3>
                            <h3 className="text-3xl">{(rawData.rawDataCombined.team_rows[team][key] as TeamStatistic).q3 ?? '-'}</h3>
                            <h3 className="font-thin">{getRanking((rawData.rawDataCombined.team_rows[team][key] as TeamStatistic).q3, rawData.rawDataCombined.team_columns_sorted, key, 'q3')} / {Object.keys(rawData.rawDataCombined.team_rows).length}</h3>
                        </div>;
                    })
                }
            </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full md:mt-5">

            <div className="flex flex-col items-start justify-space-between border-r-1 px-5 gap-3">
                <h1 className='font-poppins text-5xl font-light ml-2'>Auto</h1>
                <div className="max-h-40 overflow-y-auto w-full flex flex-col bg-[#F1EFE5] rounded-md gap-2">
                    {
                        rawData.rawDataCombined.all_match_data.filter((t) => t.team_number == team && t.auto_issues && t.match_type == 'match').map((r, i) => {
                            return <div key={i} className="flex flex-col items-start gap-1 m-2">
                                <h1 className="font-poppins text-2xl font-light">Match {r.match_number}</h1>
                                <h2 className="font-rubik font-light text-left">{r.auto_issues}</h2>
                            </div>;
                        })
                    }
                </div>
            </div>

            <div className="flex flex-col items-start justify-space-between border-r-1 px-5 gap-3">
                <h1 className='font-poppins text-5xl font-light ml-2'>Strategy</h1>
                <div className="max-h-40 overflow-y-auto w-full flex flex-col bg-[#F1EFE5] rounded-md gap-2">
                    {
                        rawData.rawDataCombined.all_match_data.filter((t) => t.team_number == team && t.strategies.length > 5 && t.match_type == 'match').map((r, i) => {
                            return <div key={i} className="flex flex-col items-start gap-1 m-2">
                                <h1 className="font-poppins text-2xl font-light">Match {r.match_number}</h1>
                                <h2 className="font-rubik font-light text-left">{r.strategies}</h2>
                            </div>;
                        })
                    }
                </div>
            </div>

            <div className="flex flex-col items-start justify-space-between px-5 gap-3">
                <h1 className='font-poppins text-5xl font-light ml-2'>Comments</h1>
                <div className="max-h-40 overflow-y-auto w-full flex flex-col bg-[#F1EFE5]  rounded-md gap-2">
                    {
                        rawData.rawDataCombined.all_match_data.filter((t) => t.team_number == team && t.match_type == 'match').map((r, i) => {
                            return <div key={i} className="flex flex-col items-start gap-1 m-2">
                                <h1 className="font-poppins text-2xl font-light">Match {r.match_number}</h1>
                                <h2 className="font-rubik font-light text-left">{r.comments}</h2>
                            </div>;
                        })
                    }
                </div>
            </div>

        </div>
    </div>
}

function underscoreToNormal(str: string): string {
    return str
        .replaceAll('_', ' ') // Replaces all underscores with spaces
        .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalizes each word
}

function getRanking(value: number, columns: Record<string, TeamColumnSorted>[], key: string, statType: 'min' | 'max' | 'median' | 'mean' | 'q3'): number {
    if (!columns)
        return -1;

    const found = columns.find((k) => Object.keys(k)[0] == key);
    if (!found) return -1;

    const col = (found as any)[key] as TeamColumnSorted | undefined;
    if (!col) return -1;

    const values = col[statType] ?? [];
    if (!Array.isArray(values)) return -1;

    if (typeof value !== 'number') return -1;

    return values.filter((v) => typeof v === 'number' && value < v).length + 1;
}

export default Team;