export enum ReactorStage {
  CORE = 'CORE',
  HEAT_EXCHANGE = 'HEAT_EXCHANGE',
  TURBINE = 'TURBINE',
  COOLING = 'COOLING'
}

export interface StageInfo {
  id: ReactorStage;
  title: string;
  description: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
