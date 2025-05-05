import { AMManager } from "../applemusic/manager";
import { AMLibraryPlaylist } from "../applemusic/types";
import { IYouTubeMusicAuthenticated } from "../yt/interfaces-primary";
import { TransferManager } from "./TransferManager";

export class AM2YT extends TransferManager {
  am: AMManager;
  yt: IYouTubeMusicAuthenticated;

  constructor(am: AMManager, yt: IYouTubeMusicAuthenticated) {
    super();
    this.am = am;
    this.yt = yt;
  }

  async transfer(from: AMLibraryPlaylist, progressCallback: (found: number, total: number) => void) {
    const playlist = await this.am.getPlaylist(from.id);
    const tracks = playlist.resources?.["library-songs"]||[];
    if (tracks.length === 0) {
      throw new Error("No tracks to transfer");
    }

  }
}
