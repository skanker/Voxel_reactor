import { ReactorStage, StageInfo } from './types';

export const STAGES: StageInfo[] = [
  {
    id: ReactorStage.CORE,
    title: "1. The Reactor Core",
    description: "This is the heart of the plant. Uranium fuel rods undergo nuclear fission. When a neutron hits a uranium atom, it splits, releasing heat and more neutrons. Control rods (made of boron or cadmium) absorb neutrons to regulate the reaction speed.",
    cameraPosition: [5, 5, 5],
    cameraTarget: [0, 0, 0]
  },
  {
    id: ReactorStage.HEAT_EXCHANGE,
    title: "2. Heat Exchange & Steam",
    description: "The immense heat from the fission reaction heats the primary water loop (which is kept under high pressure to prevent boiling). This heat is transferred to a secondary water loop, which instantly turns into high-pressure steam.",
    cameraPosition: [2, 4, 0],
    cameraTarget: [0, 2, 0]
  },
  {
    id: ReactorStage.TURBINE,
    title: "3. The Turbine & Generator",
    description: "The high-pressure steam rushes through pipes to spin the massive turbine blades. The spinning turbine is connected to an electric generator. As the generator spins, magnets rotating inside wire coils produce electricity.",
    cameraPosition: [-8, 3, 0],
    cameraTarget: [-5, 1, 0]
  },
  {
    id: ReactorStage.COOLING,
    title: "4. Cooling System",
    description: "After passing through the turbine, the steam must be cooled back into water to be reused. The cooling tower releases excess heat into the atmosphere as water vapor, while the condensed water is pumped back to the heat exchanger.",
    cameraPosition: [-12, 6, -5],
    cameraTarget: [-8, 0, 0]
  }
];
