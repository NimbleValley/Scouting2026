import type { LIVE_DATA_COMBINED } from "../../types";
import { useEffect, useState } from "react";
import { useRawDataStore } from "../data-store";
import { ArrowUpDown, ArrowDown, ArrowUp, Settings, X } from "lucide-react";
import type { Database } from "../../database.types";

interface RawDataOrder {
  key: keyof Database['public']['Tables']['Live Data']['Row'];
  label: string;
}

const RAW_DATA_ORDER: RawDataOrder[] = [
  { key: 'team_number', label: "Team" },
  { key: "match_number", label: "Match" },
  { key: "match_type", label: "Match Type" },
  { key: "driver_station", label: "Station" },
  { key: "driver_rating", label: "Driver Rating" },
  { key: "tioi_rating", label: "TIOI Rating" },
  { key: "throughput_speed", label: "Throughput Speed" },
  { key: "tele_points", label: "Tele Points" },
  { key: "tele_fuel_scored", label: "Tele Fuel Scored" },
  { key: "tele_fuel_impacted", label: "Tele Fuel Impacted" },
  { key: "endgame_points", label: "Endgame Points" },
  { key: "defense_strength", label: "Defense Strength" },
  { key: "auto_climb", label: "Auto Climb" },
  { key: "auto_start_position", label: "Auto Start Position" },
  { key: "climb_type", label: "Climb Type" },
  { key: "auto_climb_position", label: "Auto Climb Position" },
  { key: "auto_sos", label: "Auto SOS" },
  { key: "auto_issues", label: "Auto Issues" },
  { key: "auto_fuel_taken_NZ", label: "Auto Fuel Taken NZ" },
  { key: "auto_outpost", label: "Auto Outpost" },
  { key: "auto_depot", label: "Auto Depot" },
  { key: "tele_fuel_passed", label: "Tele Fuel Passed" },
  { key: "tele_fuel_dozed", label: "Tele Fuel Dozed" },
  { key: "incurred_penalties", label: "Incurred Penalties" },
  { key: "played_defense", label: "Played Defense" },
  { key: "defend_bump_trench", label: "Defend Bump Trench" },
  { key: "defend_NZ", label: "Defend NZ" },
  { key: "defend_AZ", label: "Defend AZ" },
  { key: "lost_comms", label: "Lost Comms" },
  { key: "disabled", label: "Disabled" },
  { key: "comments", label: "Comments" },
  { key: "strategies", label: "Strategies" },
];

const TEXT_VIEW_KEYS = new Set<string>(["comments", "strategies", "auto_issues"]);

export const Table = () => {
  const rawData = useRawDataStore();

  useEffect(() => {
    console.warn(rawData);
  }, [rawData]);

  const [sortConfig, setSortConfig] = useState<{ column: string | null; direction: 'asc' | 'desc' | null }>({
    column: null,
    direction: null,
  });

  const [configOpen, setConfigOpen] = useState(false);

  const tableType = "Raw";

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.column !== columnKey) {
      return <ArrowUpDown size={14} className="inline ml-1 text-gray-600" />;
    }
    if (sortConfig.direction === 'desc') {
      return <ArrowDown size={14} className="inline ml-1 text-orange-600" />;
    }
    return <ArrowUp size={14} className="inline ml-1 text-orange-600" />;
  };

  const allMatchData = rawData.rawDataCombined.all_match_data;
  const hasData = allMatchData.length >= 1;

  const [teamFilter, setTeamFilter] = useState<string>('');

  // Compute visible columns once, not per-cell
  var visibleColumns = hasData
    ? RAW_DATA_ORDER.filter((col) => Object.keys(allMatchData[0]).includes(col.key))
    : [];

  /*
useEffect(() => {
  visibleColumns = hasData
    ? RAW_DATA_ORDER.filter((col) => Object.keys(allMatchData[0]).includes(col.key)).filter((val) => teamFilter.length < 1 || val.)
    : [];
}, [teamFilter]);
*/

  const renderCell = (item: typeof allMatchData[number], col: RawDataOrder) => {
    const value = item[col.key];

    if (TEXT_VIEW_KEYS.has(col.key)) {
      return (
        <button className="px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-md hover:bg-orange-600 transition shadow-sm">
          View
        </button>
      );
    }

    if (typeof value === "boolean") {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
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
        {String(value) !== 'null' ? String(value) : "---"}
      </span>
    );
  };

  return (
    <div className="relative h-full">
      <div className={`${configOpen ? 'sticky top-14 z-25 shadow-sm' : ''} h-10 bg-[#FFFFFF] sticky top-0 transition flex flex-row w-fit rounded-b-lg items-center pl-10 pr-5`}>
        <label htmlFor="data-table-type">Table type:</label>
        <select id="data-table-type" className="ml-4 bg-gray-50 px-3 min-w-25 py-1 rounded-md border-1 border-gray-500 hover:border-gray-800 transition cursor-pointer active:ring-2">
          <option>Raw</option>
        </select>
        <label htmlFor="data-table-number-filter" className="ml-10">Team filter:</label>
        <input onChange={(e) => setTeamFilter(e.target.value)} type={'number'} id="data-table-number-filter" className="ml-4 bg-gray-50 px-3 w-25 py-1 rounded-md border-1 border-gray-500 hover:border-gray-800 transition cursor-pointer active:ring-2">
        </input>
        {configOpen && (
          <X onClick={() => setConfigOpen(false)} className="ml-3 cursor-pointer hover:scale-105" size={32} />
        )}
      </div>

      <button
        onClick={() => setConfigOpen(prev => !prev)}
        className="z-45 fixed top-14 flex flex-col items-center justify-center right-0 pr-4 pl-2 h-10 rounded-bl-lg shadow-sm transition-all duration-250 cursor-pointer hover:pr-6 bg-white"
      >
        {configOpen ? <X size={32} /> : <Settings size={32} />}
      </button>

      {hasData ? (
        <table className={`border-collapse relative w-full text-sm md:text-base ml-0 ${tableType === "Raw" ? "shadow-sm rounded-b-xl" : "border border-gray-300"}`}>
          <thead className="sticky top-14 h-10 transition-top duration-250">
            <tr className={tableType === "Raw" ? "bg-orange-100 h-10" : "bg-gray-200 shadow-lg"}>
              {visibleColumns.map((item) => (
                <th
                  key={item.key}
                  onClick={() => { }}
                  className={`${tableType === "Raw"
                    ? "px-3 py-2 font-semibold text-gray-900 h-10"
                    : "border-t-1 px-3 py-2"
                    } text-center whitespace-nowrap cursor-pointer select-none hover:bg-orange-200 transition duration-250 ${sortConfig.column === item.key ? (tableType === "Raw" ? 'bg-orange-300' : 'bg-orange-400') : ''
                    }`}
                >
                  <div className="flex items-center justify-center gap-1 ">
                    {item.label}
                    {tableType === "Raw" ? (
                      getSortIcon(item.key)
                    ) : (
                      sortConfig.column === item.key && (
                        <span className="text-xs font-bold text-orange-600">
                          {sortConfig.direction === "desc" ? "▼" : sortConfig.direction === "asc" ? "▲" : ""}
                        </span>
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {allMatchData.filter((val) => teamFilter.length < 1 || val.team_number.toString().includes(teamFilter)).map((item, i) => (
              <tr
                key={item.id}
                className={
                  i % 3 !== 0
                    ? "bg-white hover:bg-gray-50 transition-colors"
                    : "bg-gray-50 hover:bg-gray-100 transition-colors"
                }
              >
                {visibleColumns.map((col, t) => (
                  <td key={t} className="border-y border-gray-200 px-3 py-2 text-center">
                    {renderCell(item, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h2 className="px-20 py-20 text-xl">No data found.</h2>
      )}
    </div>
  );
};