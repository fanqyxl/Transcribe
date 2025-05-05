import { IYouTubeMusicAuthenticated } from "../yt/interfaces-primary";
import { AMManager } from "../../dsp/applemusic/manager";
import { IPlaylistDetail } from "../yt/interfaces-supplementary";
import { AMLibraryPlaylist, AMLibraryPlaylistCreationResponse } from "../applemusic/types";
import { TransferManager } from "./TransferManager";

export class YT2AM extends TransferManager {
  yt: IYouTubeMusicAuthenticated;
  am: AMManager;

  constructor(yt: IYouTubeMusicAuthenticated, am: AMManager) {
    super();
    this.yt = yt;
    this.am = am;
  }

  async transfer(from: IPlaylistDetail, progressCallback?: (found: number, total: number) => void): Promise<AMLibraryPlaylistCreationResponse> {
    var playlist = await this.yt.getPlaylist(
      from.id!
    );
    if (!playlist.tracks || playlist.tracks.length === 0) {
      throw new Error("No tracks to transfer");
    }
    const ids: string[] = [];
    for (let i = 0; i < playlist.tracks.length; i++) {
      const track = playlist.tracks[i];

      const album = track.album?.name;
      const artist = track.artists?.map(artist => artist.name).join(", ");
      let query = track.title;
      if (!query) {
        throw new Error(`No title or id for track ${track.id}`);
      }
      if (album) {
        query += ` from ${album}`;
      }
      if (artist) {
        query += ` by ${artist}`;
      }
      if (album && artist) {
        query += ` from ${album} by ${artist}`;
      }

      console.log(`(${i + 1}/${playlist.tracks.length}) Adding "${query}"`);
      const result = await this.am.searchSongs(query, 5);
      console.log(result);
      const song = result.results?.song?.data[0];
      if (song !== undefined) {
        console.log(`Found song with id "${song?.id}"! :3`);
        ids.push(song.id);
      } else {
        console.log(`No song found for "${query}"... :/`);
      }
      progressCallback?.(i + 1, playlist.tracks.length);
    }
    console.log("Found all songs! Creating playlist...");
    return await this.am.createPlaylist((playlist.name || "Untitled YouTube Music Playlist"), playlist.description, ids);
  }
}
