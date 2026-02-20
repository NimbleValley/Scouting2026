import type { LIVE_DATA_COMBINED } from "../../types";
import { useEffect } from "react";
import { useRawDataStore } from "../data-store";

const RAW_DATA_ORDER = [
  { key: "team_number", label: "Team" },
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
  { key: "strategies", label: "Strategies" }
];

export const Table = () => {
  const rawData = useRawDataStore();

  useEffect(() => {
    console.warn(rawData);
  }, [rawData]);

  return (
    rawData.rawDataCombined.all_match_data.length >= 1 ? (
      <div className="flex flex-col">

        {/* HEADER */}
        <div className="flex flex-row">
          {RAW_DATA_ORDER.filter((val) => Object.keys(rawData.rawDataCombined.all_match_data[0]).includes(val.key)).map((item, i) => {
            return <h1 className="border-1 " key={i}>{item.label}</h1>
          })}
        </div>

        <div className='px-20 py-20' > {rawData.rawDataCombined.all_match_data.length}</div>
      </div>
    ) : (
      <h2 className='px-20 py-20 text-xl'>No data found.</h2>
    )
  );
}
