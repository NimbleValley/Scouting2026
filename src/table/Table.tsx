import type { LIVE_DATA_COMBINED, StatisticPercentile, TeamStatistic, TeamValues, TeamValuesWithFetched } from "../../types";
import { useEffect, useState } from "react";
import { useRawDataStore } from "../data-store";
import { ArrowUpDown, ArrowDown, ArrowUp, Settings, X, HighlighterIcon } from "lucide-react";
import type { Database } from "../../database.types";
import { Link } from "react-router-dom";

export interface RawDataOrder {
  key: keyof Database['public']['Tables']['Live Data']['Row'];
  label: string;
}

interface TeamDataOrder {
  key: keyof TeamValuesWithFetched;
  label: string;
}

export const RAW_DATA_ORDER: RawDataOrder[] = [
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

export const TEAM_DATA_ORDER: TeamDataOrder[] = [
  { key: 'team_number', label: 'Team Number' },

  { key: 'opr', label: 'OPR' },
  { key: 'epa', label: 'EPA' },

  { key: 'auto_fuel', label: 'Auto Fuel' },
  { key: 'auto_fuel_taken_NZ', label: 'Auto Fuel NZ' },
  { key: 'auto_sos', label: 'Auto SOS' },

  { key: 'tele_fuel_scored', label: 'Tele Fuel Scored' },
  { key: 'tele_fuel_impacted', label: 'Tele Fuel Impacted' },
  { key: 'tele_fuel_passed', label: 'Tele Fuel Passed' },
  { key: 'tele_fuel_dozed', label: 'Tele Fuel Dozed' },
  { key: 'tele_points', label: 'Tele Points' },

  { key: 'endgame_points', label: 'Endgame Points' },

  { key: 'throughput_speed', label: 'Throughput Speed' },
  { key: 'driver_rating', label: 'Driver Skill' },
  { key: 'tioi_rating', label: 'TIOI Rating' },
  { key: 'defense_strength', label: 'Defense Strength' },
  { key: 'how_defendable', label: 'Defendability' },
];

export const TEXT_VIEW_KEYS = new Set<string>(["comments", "strategies", "auto_issues"]);

export const Table = () => {
  const rawData = useRawDataStore();

  useEffect(() => {
    //console.log(rawData);
  }, [rawData]);

  const [sortConfig, setSortConfig] = useState<{ column: string | null; direction: 'asc' | 'desc' | null }>({
    column: null,
    direction: null,
  });

  const [configOpen, setConfigOpen] = useState(false);

  const [tableType, setTableType] = useState<'Raw' | 'Team'>("Team");
  const [statType, setStatType] = useState<'min' | 'max' | 'mean' | 'median' | 'q3'>('q3');

  useEffect(() => {

  }, [tableType]);

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

  const rawMatchData = rawData.rawDataCombined.all_match_data;
  const teamMatchData = rawData.rawDataCombined.team_rows;
  const teamMatchDataWithFetched = rawData.rawDataCombined.team_rows_with_fetched;
  const hasData = rawMatchData.length >= 1;

  const [teamFilter, setTeamFilter] = useState<string>('');

  const [percentileHighlight, setPercentileHighlight] = useState(true);

  // Sort helper
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

  function applyTeamSorting(
    rows: Record<number, any>,
    config: { column: string | null; direction: 'asc' | 'desc' | null },
    valueType: 'min' | 'max' | 'median' | 'mean' | 'q3'
  ): any[] {
    // Convert object to array of values
    const dataArray = Object.values(rows);

    if (!config.column || !config.direction) return dataArray;

    return [...dataArray].sort((a, b) => {
      const statA = a[config.column!];
      const statB = b[config.column!];

      // Extract values: if it's an object, get the specific statType; otherwise, use the raw value
      let valA = (statA && typeof statA === 'object') ? statA[valueType] : (statA ?? 0);
      let valB = (statB && typeof statB === 'object') ? statB[valueType] : (statB ?? 0);

      // Numeric Sort
      if (typeof valA === "number" && typeof valB === "number") {
        return config.direction === "asc" ? valA - valB : valB - valA;
      }

      // String Sort Fallback
      return config.direction === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }

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
        <span className="font-medium text-gray-900">
          {item.match_type === 'match' ? item.match_number : item.match_type === 'practice' ? "Practice" : 'Pre'}
        </span>
      );
    }

    return (
      <span className="text-gray-900">
        {(value && String(value) !== 'null') ? (typeof value == 'number' ? String(Math.round(value * 10) / 10) : value) : "---"}
      </span>
    );
  };

  const renderTeamCell = (item: typeof teamMatchData[number], col: TeamDataOrder, statType: 'min' | 'max' | 'mean' | 'median' | 'q3') => {
    const value = item[col.key];

    const isNumber = typeof value == 'number';
    let percentileColor = (!value || isNumber || !percentileHighlight) ? '' : getTeamPercentileColor(value, col, statType, rawData.rawDataCombined.team_percentile_thresholds);

    if (col.key == 'team_number') {
      return (
        <Link to={'/team/' + value} className={`text-gray-900 rounded-md px-5 py-[2px] hover:font-bold cursor-pointer`} style={{ backgroundColor: percentileColor }}>
          {isNumber ? String(value) : (value ? Math.round(value[statType] * 10) / 10 : '-')}
        </Link>
      );
    }

    return (
      <span className={`text-gray-900 rounded-md px-5 py-[2px] `} style={{ backgroundColor: percentileColor }}>
        {isNumber ? String(value) : (value ? Math.round(value[statType] * 10) / 10 : '-')}
      </span>
    );
  };

  function getTeamPercentileColor(value: TeamStatistic, col: TeamDataOrder, statType: 'min' | 'max' | 'mean' | 'median' | 'q3', percentiles: Record<string, StatisticPercentile>[]): string {

    const found = percentiles?.find((p) => Object.keys(p)[0] === col.key);
    const specificColumn = found ? (found[col.key]?.[statType] ?? []) : [];
    if (!specificColumn || (Array.isArray(specificColumn) && specificColumn.length <= 0))
      return '';


    if (value[statType] <= specificColumn['10']) {
      return '#ec090983'; // red-300
    }

    if (value[statType] <= specificColumn['25']) {
      return '#eeccb5ff'; // red-100
    }

    if (value[statType] >= specificColumn['90']) {
      return '#93c5fd87'; // blue-300
    }

    if (value[statType] >= specificColumn['75']) {
      return '#86efac87'; // green-300
    }

    return '';
  }

  return (
    <div className="relative h-full">
      <div className={`${configOpen ? 'sticky z-25 shadow-sm' : ''} h-10 bg-[#FFFFFF] sticky top-0 lg:left-0 transition flex flex-row lg:flex-row w-fit rounded-b-lg items-center pl-10 pr-5`}>
        <label htmlFor="data-table-type">Table type:</label>
        <select onChange={(e) => setTableType(e.target.value as 'Raw' | 'Team')} id="data-table-type" className="ml-4 bg-gray-50 px-3 min-w-25 py-1 rounded-md border-1 border-gray-500 hover:border-gray-800 transition cursor-pointer active:ring-2">
          <option value={'Raw'}>Raw</option>
          <option value={'Team'} selected>Team</option>
        </select>

        {tableType == 'Raw' &&
          <><label htmlFor="data-table-number-filter" className="ml-10">Team filter:</label><input onChange={(e) => setTeamFilter(e.target.value)} type={'number'} id="data-table-number-filter" className="ml-4 bg-gray-50 px-3 w-25 py-1 rounded-md border-1 border-gray-500 hover:border-gray-800 transition cursor-pointer active:ring-2">
          </input></>
        }

        {tableType == 'Team' &&
          <><label htmlFor="stat-table-type" className="ml-10">Statistic:</label>
            <select value={statType} onChange={(e) => setStatType(e.target.value as 'min' | 'max' | 'mean' | 'median' | 'q3')} id="stat-table-type" className="ml-4 bg-gray-50 px-3 min-w-25 py-1 rounded-md border-1 border-gray-500 hover:border-gray-800 transition cursor-pointer active:ring-2">
              <option value={'max'}>Max</option>
              <option value={'q3'}>Q3</option>
              <option value={'median'}>Median</option>
              <option value={'mean'}>Mean</option>
              <option value={'min'}>Min</option>
            </select>
            <button onClick={() => setPercentileHighlight((prev) => !prev)} className="ml-10 hover:ring-2 transition cursor-pointer p-1 rounded-md">
              <HighlighterIcon />
            </button>
          </>
        }

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
        <div className="rounded-b-xl border-x border-b border-gray-200">
          <table className={`border-collapse relative w-full text-sm md:text-base ml-0 shadow-sm`}>
            <thead className="sticky top-0 h-10 transition-top duration-250">
              <tr className={"bg-orange-100 h-10"}>
                {(tableType == 'Raw' ? RAW_DATA_ORDER : TEAM_DATA_ORDER).map((item) => (
                  <th
                    key={item.key}
                    onClick={() => { handleSort(item.key) }}
                    className={`px-3 py-2 font-semibold text-gray-900 h-10 bg-orange-100 text-center whitespace-nowrap cursor-pointer select-none hover:bg-orange-200 transition duration-250 ${sortConfig.column === item.key ? ('bg-orange-300') : ''
                      }`}
                  >
                    <div className="flex items-center justify-center gap-1 ">
                      {item.label}{
                        getSortIcon(item.key)
                      }
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tableType === 'Raw'
                ? applyRawSorting(rawMatchData, sortConfig)
                  .filter((val) => teamFilter.length < 1 || val.team_number.toString().includes(teamFilter))
                  .map((item, i) => (
                    <tr key={item.id} className={i % 3 !== 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}>
                      {RAW_DATA_ORDER.map((col, t) => (
                        <td key={t} className="border-y border-gray-200 px-3 py-2 text-center">
                          {renderRawCell(item, col as RawDataOrder)}
                        </td>
                      ))}
                    </tr>
                  ))
                : applyTeamSorting(teamMatchDataWithFetched, sortConfig as any, statType)
                  .map((item, i) => (
                    <tr key={item.team_number} className={i % 3 !== 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}>
                      {TEAM_DATA_ORDER.map((col, t) => (
                        <td key={t} className="border-y border-gray-200 px-3 py-2 text-center">
                          {/* We pass 'item' directly now because it's the data object, not a key */}
                          {renderTeamCell(item, col as TeamDataOrder, statType)}
                        </td>
                      ))}
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      ) : (
        <h2 className="px-20 py-20 text-xl">No data found.</h2>
      )}
    </div>
  );
};