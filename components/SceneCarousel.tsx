"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ComponentType,
} from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { TreasureMap } from "./TreasureMap";
import { StorefrontParade } from "./StorefrontParade";
import { BotanicalConservatory } from "./BotanicalConservatory";
import { ApothecaryShelf } from "./ApothecaryShelf";
import { PinballMachine } from "./PinballMachine";
import { MapleScene } from "./MapleScene";
import { MapleEvaporator } from "./MapleEvaporator";
import { SugaringShack } from "./SugaringShack";
import { HighwayMileageSign } from "./HighwayMileageSign";
import { DinerMenu } from "./DinerMenu";
import { CountryGeneralStore } from "./CountryGeneralStore";
import { GasStationPump } from "./GasStationPump";
import { WebTonic } from "./WebTonic";
import { CashRegister } from "./CashRegister";
import { NeonSign } from "./NeonSign";
import { RetroTV } from "./RetroTV";
import { Barograph } from "./Barograph";
import { PostageStamps } from "./PostageStamps";
import { FilmStripBand } from "./FilmStripBand";
import { MagicLantern } from "./MagicLantern";
import { LakeScene } from "./LakeScene";
import { FishingPierScene } from "./FishingPierScene";
import { LobsterBoat } from "./LobsterBoat";
import { OysterBed } from "./OysterBed";
import { ClamBake } from "./ClamBake";
import { CranberryBog } from "./CranberryBog";
import { WhalingShip } from "./WhalingShip";
import { ShipLaunch } from "./ShipLaunch";
import { NorEaster } from "./NorEaster";
import { SteamboatScene } from "./SteamboatScene";
import { RecordCrate } from "./RecordCrate";
import { MusicBox } from "./MusicBox";
import { Typewriter } from "./Typewriter";
import { ShrewsburyPostcard } from "./ShrewsburyPostcard";
import { ShrewsburyGazette } from "./ShrewsburyGazette";
import { RoadAtlas } from "./RoadAtlas";
import { CartographerDesk } from "./CartographerDesk";
import { NauticalCompass } from "./NauticalCompass";
import { TownMeetingHall } from "./TownMeetingHall";
import { ElectionDay } from "./ElectionDay";
import { SolariBoard } from "./SolariBoard";
import { TrainDepot } from "./TrainDepot";
import { Route9Scene } from "./Route9Scene";
import { CoveredBridge } from "./CoveredBridge";
import { IronBridge } from "./IronBridge";
import { AutumnForestPath } from "./AutumnForestPath";
import { WinterSleigh } from "./WinterSleigh";
import { TobogganRun } from "./TobogganRun";
import { IceHarvestScene } from "./IceHarvestScene";
import { IceFishing } from "./IceFishing";
import { SpringThaw } from "./SpringThaw";
import { BarnQuilt } from "./BarnQuilt";
import { GristMillScene } from "./GristMillScene";
import { SawmillScene } from "./SawmillScene";
import { RopewalkScene } from "./RopewalkScene";
import { CheesePress } from "./CheesePress";
import { CountingHouse } from "./CountingHouse";
import { HattersShop } from "./HattersShop";
import { GlassblowerShop } from "./GlassblowerShop";
import { CooperShop } from "./CooperShop";
import { WeaverLoom } from "./WeaverLoom";
import { PrintshopCase } from "./PrintshopCase";
import { DyeWorks } from "./DyeWorks";
import { CiderMill } from "./CiderMill";
import { SilversmithShop } from "./SilversmithShop";
import { CandleWorks } from "./CandleWorks";
import { TanneryShop } from "./TanneryShop";
import { MillPond } from "./MillPond";
import { PrintshopBroadside } from "./PrintshopBroadside";
import { CiderPressScene } from "./CiderPressScene";
import { OrchardScene } from "./OrchardScene";
import { ApplePicking } from "./ApplePicking";
import { CountryChurch } from "./CountryChurch";
import { ShrewsburyClockTower } from "./ShrewsburyClockTower";
import { NightSky } from "./NightSky";
import { AerialBalloon } from "./AerialBalloon";
import { CelestialOrrery } from "./CelestialOrrery";
import { Lighthouse } from "./Lighthouse";
import { HarvestFair } from "./HarvestFair";
import { CountyFair } from "./CountyFair";
import { SummerPicnic } from "./SummerPicnic";
import { ShrewsburyCommon } from "./ShrewsburyCommon";
import { TownBandstand } from "./TownBandstand";
import { IceCreamSocial } from "./IceCreamSocial";
import { WorkbenchTools } from "./WorkbenchTools";
import { QuiltingBee } from "./QuiltingBee";
import { FiddleContest } from "./FiddleContest";
import { WoolMill } from "./WoolMill";
import { BlacksmithForge } from "./BlacksmithForge";
import { TinsmithShop } from "./TinsmithShop";
import { PotteryKiln } from "./PotteryKiln";
import { StonewallBuilding } from "./StonewallBuilding";
import { VintageSeedPacket } from "./VintageSeedPacket";
import { MatchbookCollection } from "./MatchbookCollection";
import { CorkBoard } from "./CorkBoard";
import { TavernSign } from "./TavernSign";
import { TavernInterior } from "./TavernInterior";
import { BeeSkep } from "./BeeSkep";
import { MotelSign } from "./MotelSign";
import { FortuneTeller } from "./FortuneTeller";
import { Telegrapher } from "./Telegrapher";
import { PocketWatchScene } from "./PocketWatchScene";
import { SealPress } from "./SealPress";

type SceneEntry = { name: string; Scene: ComponentType };

const SCENES: SceneEntry[] = [
  { name: "Treasure Map", Scene: TreasureMap },
  { name: "Storefront Parade", Scene: StorefrontParade },
  { name: "Botanical Conservatory", Scene: BotanicalConservatory },
  { name: "Apothecary Shelf", Scene: ApothecaryShelf },
  { name: "Pinball Machine", Scene: PinballMachine },
  { name: "Maple Grove", Scene: MapleScene },
  { name: "Sugar Evaporator", Scene: MapleEvaporator },
  { name: "Sugaring Shack", Scene: SugaringShack },
  { name: "Highway Mileage Sign", Scene: HighwayMileageSign },
  { name: "Diner Menu", Scene: DinerMenu },
  { name: "Country General Store", Scene: CountryGeneralStore },
  { name: "Gas Station Pump", Scene: GasStationPump },
  { name: "Web Tonic", Scene: WebTonic },
  { name: "Cash Register", Scene: CashRegister },
  { name: "Neon Sign", Scene: NeonSign },
  { name: "Retro Television", Scene: RetroTV },
  { name: "Barograph", Scene: Barograph },
  { name: "Postage Stamps", Scene: PostageStamps },
  { name: "Film Strip", Scene: FilmStripBand },
  { name: "Magic Lantern", Scene: MagicLantern },
  { name: "Lake Quinsigamond", Scene: LakeScene },
  { name: "Fishing Pier", Scene: FishingPierScene },
  { name: "Lobster Boat", Scene: LobsterBoat },
  { name: "Oyster Bed", Scene: OysterBed },
  { name: "Clam Bake", Scene: ClamBake },
  { name: "Cranberry Bog", Scene: CranberryBog },
  { name: "Whaling Ship", Scene: WhalingShip },
  { name: "Ship Launch", Scene: ShipLaunch },
  { name: "Nor'easter Storm", Scene: NorEaster },
  { name: "Steamboat", Scene: SteamboatScene },
  { name: "Record Crate", Scene: RecordCrate },
  { name: "Music Box", Scene: MusicBox },
  { name: "Typewriter", Scene: Typewriter },
  { name: "Shrewsbury Postcard", Scene: ShrewsburyPostcard },
  { name: "Shrewsbury Gazette", Scene: ShrewsburyGazette },
  { name: "Road Atlas", Scene: RoadAtlas },
  { name: "Cartographer's Desk", Scene: CartographerDesk },
  { name: "Nautical Compass", Scene: NauticalCompass },
  { name: "Town Meeting Hall", Scene: TownMeetingHall },
  { name: "Election Day", Scene: ElectionDay },
  { name: "Solari Board", Scene: SolariBoard },
  { name: "Train Depot", Scene: TrainDepot },
  { name: "Route 9", Scene: Route9Scene },
  { name: "Covered Bridge", Scene: CoveredBridge },
  { name: "Iron Bridge", Scene: IronBridge },
  { name: "Autumn Forest Path", Scene: AutumnForestPath },
  { name: "Winter Sleigh", Scene: WinterSleigh },
  { name: "Toboggan Run", Scene: TobogganRun },
  { name: "Ice Harvest", Scene: IceHarvestScene },
  { name: "Ice Fishing", Scene: IceFishing },
  { name: "Spring Thaw", Scene: SpringThaw },
  { name: "Barn Quilt", Scene: BarnQuilt },
  { name: "Grist Mill", Scene: GristMillScene },
  { name: "Sawmill", Scene: SawmillScene },
  { name: "Ropewalk", Scene: RopewalkScene },
  { name: "Cheese Press", Scene: CheesePress },
  { name: "Counting House", Scene: CountingHouse },
  { name: "Hatter's Shop", Scene: HattersShop },
  { name: "Glassblower's Shop", Scene: GlassblowerShop },
  { name: "Cooper's Shop", Scene: CooperShop },
  { name: "Weaver's Loom", Scene: WeaverLoom },
  { name: "Printshop Type Case", Scene: PrintshopCase },
  { name: "Dye Works", Scene: DyeWorks },
  { name: "Cider Mill", Scene: CiderMill },
  { name: "Silversmith's Shop", Scene: SilversmithShop },
  { name: "Candle Works", Scene: CandleWorks },
  { name: "Tannery Shop", Scene: TanneryShop },
  { name: "Mill Pond", Scene: MillPond },
  { name: "Printshop Broadside", Scene: PrintshopBroadside },
  { name: "Cider Press", Scene: CiderPressScene },
  { name: "Apple Orchard", Scene: OrchardScene },
  { name: "Apple Picking", Scene: ApplePicking },
  { name: "Country Church", Scene: CountryChurch },
  { name: "Shrewsbury Clock Tower", Scene: ShrewsburyClockTower },
  { name: "Night Sky", Scene: NightSky },
  { name: "Aerial Balloon", Scene: AerialBalloon },
  { name: "Celestial Orrery", Scene: CelestialOrrery },
  { name: "Lighthouse", Scene: Lighthouse },
  { name: "Harvest Fair", Scene: HarvestFair },
  { name: "County Fair", Scene: CountyFair },
  { name: "Summer Picnic", Scene: SummerPicnic },
  { name: "Shrewsbury Common", Scene: ShrewsburyCommon },
  { name: "Town Bandstand", Scene: TownBandstand },
  { name: "Ice Cream Social", Scene: IceCreamSocial },
  { name: "Workbench Tools", Scene: WorkbenchTools },
  { name: "Quilting Bee", Scene: QuiltingBee },
  { name: "Fiddle Contest", Scene: FiddleContest },
  { name: "Wool Mill", Scene: WoolMill },
  { name: "Blacksmith's Forge", Scene: BlacksmithForge },
  { name: "Tinsmith's Shop", Scene: TinsmithShop },
  { name: "Pottery Kiln", Scene: PotteryKiln },
  { name: "Stonewall Building", Scene: StonewallBuilding },
  { name: "Vintage Seed Packet", Scene: VintageSeedPacket },
  { name: "Matchbook Collection", Scene: MatchbookCollection },
  { name: "Cork Board", Scene: CorkBoard },
  { name: "Tavern Sign", Scene: TavernSign },
  { name: "Tavern Interior", Scene: TavernInterior },
  { name: "Bee Skep", Scene: BeeSkep },
  { name: "Motel Sign", Scene: MotelSign },
  { name: "Fortune Teller", Scene: FortuneTeller },
  { name: "Telegrapher", Scene: Telegrapher },
  { name: "Pocket Watch", Scene: PocketWatchScene },
  { name: "Seal Press", Scene: SealPress },
];

const INTERVAL_MS = 6000;
const TOTAL = SCENES.length;

const BTN_BASE: React.CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  border: "1px solid rgba(212,104,42,0.24)",
  background: "rgba(212,104,42,0.07)",
  color: "rgba(243,233,213,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
  transition: "background 0.15s, border-color 0.15s, color 0.15s",
};

function hoverIn(e: React.MouseEvent<HTMLButtonElement>) {
  const el = e.currentTarget;
  el.style.background = "rgba(212,104,42,0.22)";
  el.style.borderColor = "rgba(212,104,42,0.55)";
  el.style.color = "rgba(243,233,213,0.95)";
}
function hoverOut(e: React.MouseEvent<HTMLButtonElement>) {
  const el = e.currentTarget;
  el.style.background = "rgba(212,104,42,0.07)";
  el.style.borderColor = "rgba(212,104,42,0.24)";
  el.style.color = "rgba(243,233,213,0.6)";
}

export function SceneCarousel() {
  const [displayIdx, setDisplayIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const busyRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  const navigate = useCallback((next: number) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setFading(true);
    setTimeout(() => {
      setDisplayIdx(next);
      setFading(false);
      busyRef.current = false;
    }, 260);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      navigate((displayIdx + 1) % TOTAL);
    }, INTERVAL_MS);
    return () => clearTimeout(t);
  }, [displayIdx, paused, navigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      if (e.key === "ArrowLeft") navigate((displayIdx - 1 + TOTAL) % TOTAL);
      if (e.key === "ArrowRight") navigate((displayIdx + 1) % TOTAL);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [displayIdx, navigate]);

  const prev = useCallback(
    () => navigate((displayIdx - 1 + TOTAL) % TOTAL),
    [displayIdx, navigate]
  );
  const next = useCallback(
    () => navigate((displayIdx + 1) % TOTAL),
    [displayIdx, navigate]
  );

  const entry = SCENES[displayIdx];
  const name = entry?.name ?? "";
  const Scene = entry?.Scene ?? null;

  return (
    <section
      ref={sectionRef}
      id="scene-gallery"
      aria-label="Route 9 — Shrewsbury illustrated scenes gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        background: "#0A0603",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div
        style={{
          padding: "56px 24px 32px",
          textAlign: "center",
          background:
            "linear-gradient(180deg, rgba(10,6,3,1) 0%, rgba(10,6,3,0) 100%)",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "0.22em",
            color: "rgba(212,104,42,0.55)",
            textTransform: "uppercase",
            fontFamily: "var(--font-display)",
            marginBottom: "10px",
          }}
        >
          Route 9 &middot; Shrewsbury &middot; Central Massachusetts
        </p>
        <h2
          style={{
            fontSize: "clamp(22px, 4vw, 36px)",
            fontWeight: 700,
            color: "#F3E9D5",
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          The neighborhood, illustrated
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "rgba(243,233,213,0.42)",
            marginTop: "10px",
            maxWidth: "440px",
            marginInline: "auto",
            lineHeight: 1.6,
          }}
        >
          Over a hundred hand-drawn scenes of life along Route 9 — from maple
          sugaring to the town common.
        </p>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "2px",
          background: "rgba(212,104,42,0.10)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          key={`pb-${displayIdx}`}
          style={{
            height: "100%",
            background:
              "linear-gradient(90deg, rgba(212,104,42,0.7), rgba(240,160,80,0.9))",
            animation: paused
              ? "none"
              : `carousel-progress ${INTERVAL_MS}ms linear forwards`,
          }}
        />
      </div>

      {/* Scene display */}
      <div
        style={{
          opacity: fading ? 0 : 1,
          transform: fading
            ? "scale(0.987) translateY(5px)"
            : "scale(1) translateY(0)",
          transition: "opacity 0.26s ease, transform 0.26s ease",
          willChange: "opacity, transform",
        }}
      >
        {Scene && <Scene />}
      </div>

      {/* Control bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "14px 20px",
          gap: "12px",
          borderTop: "1px solid rgba(212,104,42,0.10)",
          background: "rgba(6,4,2,0.88)",
          backdropFilter: "blur(8px)",
        }}
      >
        <button
          onClick={prev}
          aria-label="Previous scene"
          style={BTN_BASE}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          <ChevronLeft size={15} strokeWidth={2.2} />
        </button>

        <div
          style={{
            flex: 1,
            textAlign: "center",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: "8.5px",
              letterSpacing: "0.18em",
              color: "rgba(212,104,42,0.48)",
              textTransform: "uppercase",
              fontFamily: "var(--font-display)",
              marginBottom: "2px",
            }}
          >
            Now Showing
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#F3E9D5",
              fontFamily: "var(--font-display)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              letterSpacing: "-0.01em",
            }}
          >
            {name}
          </div>
        </div>

        <div
          aria-live="polite"
          aria-label={`Scene ${displayIdx + 1} of ${TOTAL}`}
          style={{
            fontSize: "10px",
            color: "rgba(243,233,213,0.28)",
            letterSpacing: "0.05em",
            flexShrink: 0,
            minWidth: "42px",
            textAlign: "right",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {displayIdx + 1} / {TOTAL}
        </div>

        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
          style={BTN_BASE}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          {paused ? (
            <Play size={13} strokeWidth={2.2} />
          ) : (
            <Pause size={13} strokeWidth={2.2} />
          )}
        </button>

        <button
          onClick={next}
          aria-label="Next scene"
          style={BTN_BASE}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          <ChevronRight size={15} strokeWidth={2.2} />
        </button>
      </div>

      {/* Keyboard hint */}
      <div
        aria-hidden
        style={{
          textAlign: "center",
          padding: "6px 0 12px",
          fontSize: "9px",
          color: "rgba(243,233,213,0.18)",
          letterSpacing: "0.08em",
          background: "rgba(6,4,2,0.88)",
        }}
      >
        ← → arrow keys to navigate
      </div>
    </section>
  );
}
