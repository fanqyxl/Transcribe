import { IYouTubeMusicAuthenticated } from "../yt/interfaces-primary";
import { AMManager } from "../../dsp/applemusic/manager";

class YT2AM {
  yt: IYouTubeMusicAuthenticated;
  am: AMManager;

  constructor(yt: IYouTubeMusicAuthenticated, am: AMManager) {
    this.yt = yt;
    this.am = am;
  }
}
