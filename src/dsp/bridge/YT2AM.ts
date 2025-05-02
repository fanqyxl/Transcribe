import { IYouTubeMusicAuthenticated } from "../yt/interfaces-primary";
import { AMManager } from "../../dsp/applemusic/manager";
import { IPlaylistDetail } from "../yt/interfaces-supplementary";
import { AMLibraryPlaylist, AMLibraryPlaylistCreationResponse } from "../applemusic/types";

export class YT2AM {
  yt: IYouTubeMusicAuthenticated;
  am: AMManager;

  constructor(yt: IYouTubeMusicAuthenticated, am: AMManager) {
    this.yt = yt;
    this.am = am;
  }

  async transfer(yt: IPlaylistDetail, progressCallback?: (found: number, total: number) => void): Promise<AMLibraryPlaylistCreationResponse> {
    var playlist = await this.yt.getPlaylist(
      yt.id!
    );
    if (!playlist.tracks || playlist.tracks.length === 0) {
      throw new Error("No tracks to transfer");
    }
    const ids: string[] = [];
    for (let i = 0; i < playlist.tracks.length; i++) {
      const track = playlist.tracks[i];
      const query = track.title + " by " + (track.artists?.map(artist => artist.name).join(", ") || track.album?.artist?.name || "");
      console.log(`(${i + 1}/${playlist.tracks.length}) Adding "${query}"`);
      const result = await this.am.searchSongs(query, 5);
      console.log(result);
      const song = result.results?.song?.data[0];
      if (song !== undefined) {
        console.log(`Found song with id "${song?.id}!"`);
        ids.push(song.id);
      } else {
        console.log(`No song found for "${query}"`);
      }
      progressCallback?.(i + 1, playlist.tracks.length);
    }
    console.log("Found all songs! Creating playlist...");
    return await this.am.createPlaylist((playlist.name || "Untitled YouTube Music Playlist"), playlist.description, ids);
  }
}
