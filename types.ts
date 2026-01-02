
export interface ApologyData {
  reason?: string;
  recipient?: string;
  poem?: string;
}

export enum AppState {
  INTRO = 'INTRO',
  MESSAGE = 'MESSAGE',
  FORGIVEN = 'FORGIVEN'
}
