import { Link, useLoaderData } from "react-router-dom";
import { useRawDataStore } from "../data-store";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpDown, Check, LoaderPinwheel, LogOut, TowerControl, X } from "lucide-react";
import type { TeamColumnSorted, TeamStatistic, TeamValues } from "../../types";
import { RAW_DATA_ORDER, TEAM_DATA_ORDER, TEXT_VIEW_KEYS, type RawDataOrder } from "../table/Table";
import { useEffect, useState } from "react";

export async function teamPageLoader({ params }: { params: any }) {
    return { 'team': params.teamNumber };
}

const Team = () => {

    const bannerDataOrder: (keyof TeamValues)[] = ['tele_fuel_scored', 'driver_rating', 'auto_sos', 'tele_fuel_impacted', 'throughput_speed', 'tioi_rating'];

    const { team } = useLoaderData();
    const rawData = useRawDataStore();

    const rawMatchData = rawData.rawDataCombined.all_match_data;
    const hasData = rawMatchData.length >= 1;

    function applyRawSorting<T extends Record<string, any>>(rows: T[], config: typeof sortConfig): T[] {
        if (!config.column || !config.direction) return rows;

        return [...rows].sort((a, b) => {
            let valA = a[config.column ?? 0] ?? 0;
            let valB = b[config.column ?? 0] ?? 0;

            // Force numeric sort for teamNumber and matchNumber
            if (config.column === "team_number" || config.column === "match_number") {
                valA = Number(valA);
                valB = Number(valB);
            }

            if (typeof valA === "number" && typeof valB === "number" && !isNaN(valA) && !isNaN(valB)) {
                return config.direction === "asc" ? valA - valB : valB - valA;
            }

            // Fallback for strings
            return config.direction === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        });
    }

    const [sortConfig, setSortConfig] = useState<{ column: string | null; direction: 'asc' | 'desc' | null }>({
        column: null,
        direction: null,
    });

    const getSortIcon = (columnKey: string) => {
        if (sortConfig.column !== columnKey) {
            return <ArrowUpDown size={14} className="inline ml-1 text-gray-600" />;
        }
        if (sortConfig.direction === 'desc') {
            return <ArrowDown size={14} className="inline ml-1 text-black" />;
        }
        return <ArrowUp size={14} className="inline ml-1 text-black" />;
    };

    const handleSort = (column: string) => {
        setSortConfig((prev) => {
            if (prev.column === column) {
                if (prev.direction === 'desc') return { column, direction: 'asc' };
                if (prev.direction === 'asc') return { column: null, direction: null }; // reset
                return { column, direction: 'desc' };
            }
            return { column, direction: 'desc' };
        });
    };

    const renderRawCell = (item: typeof rawMatchData[number], col: RawDataOrder) => {
        const value = item[col.key];

        if (TEXT_VIEW_KEYS.has(col.key)) {
            return (
                <button className="px-3 py-1 bg-orange-100 text-black hover:ring-2 ring-gray-700 text-sm font-medium rounded-md hover:bg-orange-300 cursor-pointer transition duration-250">
                    View
                </button>
            );
        }

        if (typeof value === "boolean") {
            return (
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${value ? "bg-green-200" : "bg-red-200"}`}>
                    {value ? "Yes" : "No"}
                </span>
            );
        }

        if (col.key === 'match_number') {
            return (
                <span className="font-medium text-gray-800">
                    {item.match_type === 'match' ? item.match_number : item.match_type === 'practice' ? "Practice" : 'Pre'}
                </span>
            );
        }

        return (
            <span className="text-gray-700">
                {(value && String(value) !== 'null') ? (typeof value == 'number' ? String(Math.round(value * 10) / 10) : value) : "---"}
            </span>
        );
    };

    const fetchedTeam = rawData.rawDataCombined.fetched_team_data.find((t) => t.team == team);
    const pitTeam = rawData.rawDataCombined.pit_scout_data.find((p) => p.team_number == team);

    const [teamImages, setTeamImages] = useState<string[]>([]);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        const key = Number(team);
        if (rawData.teamImages && rawData.teamImages[key]) {
            setTeamImages(rawData.teamImages[key]);
            console.log(rawData.teamImages[key]);
        } else {
            setTeamImages([]);
        }
    }, [rawData.teamImages, team]);

    if (!Object.keys(rawData.rawDataCombined.team_rows).includes(team)) {
        return <div className="flex-1 py-15 flex flex-col items-center bg-white gap-5 px-50 text-center rounded-b-lg">
            <h1 className='font-poppins text-4xl underline mb-5'>Team Not Found</h1>
            <h2 className='text-2xl font-rubik font-light w-full'>No data found for team {team}.</h2>
        </div>
    }

    return <div className="flex-1 py-5 flex flex-col items-center bg-white gap-8 px-5 text-center rounded-b-lg">
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
            <div className="flex flex-col flex-1 gap-2 items-center">
                {
                    teamImages.length > 0 &&
                    <div className="flex flex-row gap-2 items-center">
                        {teamImages.length > 1 &&
                            <ArrowLeft onClick={() => setImageIndex((prev) => prev - 1 >= 0 ? prev - 1 : teamImages.length - 1)} size={28} className="hover:scale-107 cursor-pointer" />
                        }
                        <img className="max-h-40 rounded-xl object-contain" src={teamImages[imageIndex]}></img>
                        {teamImages.length > 1 &&
                            <ArrowRight onClick={() => setImageIndex((prev) => prev + 1 >= teamImages.length ? 0 : prev+ 1)} size={28} className="hover:scale-107 cursor-pointer" />
                        }
                    </div>
                }
                {fetchedTeam?.ai_overview &&
                    <div className="transition flex flex-row items-center duration-250 hover:border-black border-1 font-rubik font-light text-lg bg-[#ebe8d8]/67 border-gray-600 py-3 px-1 rounded-lg flex-1"><p>{fetchedTeam.ai_overview}</p></div>
                }
            </div>
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-between gap-2">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full md:mt-2 bg-orange-100 py-4 rounded-lg">

            <div className="flex flex-col items-start justify-space-between border-r-1 px-5 gap-3">
                <h1 className='font-poppins md:text-3xl lg:text-5xl font-light ml-2'>Auto</h1>
                <div className="max-h-40 overflow-y-auto w-full flex flex-col rounded-md gap-2">
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
                <h1 className='font-poppins md:text-3xl lg:text-5xl font-light ml-2'>Strategy</h1>
                <div className="max-h-40 overflow-y-auto w-full flex flex-col rounded-md gap-2">
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
                <h1 className='font-poppins md:text-3xl lg:text-5xl font-light ml-2'>Comments</h1>
                <div className="max-h-40 overflow-y-auto w-full flex flex-col rounded-md gap-2">
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

        <div className="flex flex-col items-start justify-space-between px-5 gap-3 w-full my-5">
            <div className="flex flex-row items-center justify-between w-full gap-5">
                <h1 className='font-poppins md:text-3xl lg:text-5xl font-light ml-2'>Pit Scouting</h1>
                <div className="flex-1 h-[1px] bg-black w-full"></div>
            </div>
            <div className=" overflow-y-auto w-full flex flex-col bg-[#F1EFE5] min-h-12 p-2 justify-center rounded-md gap-2">
                {
                    pitTeam ?
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-2">
                            <div className="flex flex-col items-center gap-1 m-2">
                                <h1 className="font-poppins text-2xl font-light underline">Autonomous</h1>
                                <h2 className="font-rubik font-light text-lg text-left">{pitTeam.auto_description}</h2>
                            </div>
                            <div className="flex flex-col items-center gap-1 m-2">
                                <h1 className="font-poppins text-2xl font-light underline">Driver Experience</h1>
                                <h2 className="font-rubik font-light text-lg text-left">{pitTeam.driver_experience}</h2>
                            </div>
                            <div className="flex flex-col items-center gap-1 m-2">
                                <h1 className="font-poppins text-2xl font-light underline">Hopper Size</h1>
                                <h2 className="font-rubik font-light text-2xl text-left">{pitTeam.hopper_size} Fuel</h2>
                            </div>
                            <div className="flex flex-col items-center gap-1 m-2">
                                <h1 className="font-poppins text-2xl font-light underline">Pit Comments</h1>
                                <h2 className="font-rubik font-light text-lg text-left">{pitTeam.comments}</h2>
                            </div>
                            <div className="flex flex-row justify-center items-center gap-1 m-2">
                                <h1 className="font-poppins text-3xl font-light">Trench</h1>
                                {pitTeam.trench ? <Check color="#61eb1c" size={44} /> : <X color="#eb1c1c" size={44} />}
                            </div>
                            <div className="flex flex-row justify-center items-center gap-1 m-2">
                                <h1 className="font-poppins text-3xl font-light">Bump</h1>
                                {pitTeam.bump ? <Check color="#61eb1c" size={44} /> : <X color="#eb1c1c" size={44} />}
                            </div>
                            <div className="flex flex-row justify-center items-center gap-1 m-2">
                                <h1 className="font-poppins text-3xl font-light">{pitTeam.shooter_type}</h1>
                                <LoaderPinwheel color="#ebbe1c" size={40} />
                            </div>
                            <div className="flex flex-row justify-center items-center gap-1 m-2">
                                <h1 className="font-poppins text-3xl font-light">{pitTeam.climb_type}</h1>
                                <TowerControl size={40} />
                            </div>
                        </div> :
                        <h1 className="font-rubik font-light text-left">No pit scout data found for team {team}.</h1>
                }
            </div>
        </div>

        {hasData ? (
            /* Changed max-w-200 to w-full and overflow-x-scroll to overflow-x-auto */
            <div className="w-full overflow-y-scroll max-h-75 rounded-b-xl border-x border-b border-gray-200 max-w-[calc(100vw-150px)]">
                <table className="border-collapse relative w-full text-sm md:text-base ml-0 shadow-sm">
                    <thead className="sticky top-0 h-10 z-10"> {/* Added z-10 to keep header above scrolling cells */}
                        <tr className="bg-orange-100 h-10">
                            {RAW_DATA_ORDER.map((item) => (
                                <th
                                    key={item.key}
                                    onClick={() => handleSort(item.key)}
                                    className={`px-3 py-2 font-semibold text-gray-900 h-10 bg-orange-100 text-center whitespace-nowrap cursor-pointer select-none hover:bg-orange-200 transition duration-250 ${sortConfig.column === item.key ? 'bg-orange-300' : ''
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        {item.label}
                                        {getSortIcon(item.key)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {applyRawSorting(rawMatchData.filter(m => String(m.team_number) === String(team)), sortConfig)
                            .map((item, i) => (
                                <tr
                                    key={item.id}
                                    className={i % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}
                                >
                                    {RAW_DATA_ORDER.map((col, t) => (
                                        <td key={t} className="border-y border-gray-200 px-3 py-2 text-center whitespace-nowrap">
                                            {renderRawCell(item, col as RawDataOrder)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <h2 className="px-20 py-20 text-xl">No data found.</h2>
        )}
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