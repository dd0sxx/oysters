export enum AppStage {
  disconnected = 0,
  connected = 1,
  notOnPreMintList = 2,
}

export type AppState = {
  stage: AppStage;
};
