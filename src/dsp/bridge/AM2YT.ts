import { AMManager } from "../applemusic/manager";
import { AMLibrarySong } from "../applemusic/types";
import { AMLibraryPlaylist } from "../applemusic/types";
import { IYouTubeMusicAuthenticated } from "../yt/interfaces-primary";
import { TransferManager } from "./TransferManager";

import { fetch } from "../../epoxy";

export class AM2YT extends TransferManager {
  am: AMManager;
  yt: IYouTubeMusicAuthenticated;

  constructor(am: AMManager, yt: IYouTubeMusicAuthenticated) {
    super();
    this.am = am;
    this.yt = yt;
  }

  async transfer(from: AMLibraryPlaylist, progressCallback?: (found: number, total: number) => void) {
    const playlist = await this.am.getPlaylist(from.id);
    const container: { [id: string]: AMLibrarySong } = playlist.resources?.["library-songs"]!;
    const tracks: AMLibrarySong[] = Object.keys(container).map((key) => container[key]);
    if (tracks.length === 0) {
      throw new Error("No tracks to transfer");
    }

    let ids: string[] = [];

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      const album = track.attributes.albumName;
      const artist = track.attributes.artistName;
      const query = this.constructQuery(track.attributes.name, album, artist);

      console.log(`(${i + 1}/${tracks.length}) Adding "${query}"`);

      let res = await fetch(`https://www.youtube.com/results?hl=en&persist_app=1&search_query=${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`);

      let body = await res.text();
      let split = body.split("var ytInitialData = ")[1];
      let furtherSplit: any = split.split("};</script>")[0];
      furtherSplit = furtherSplit + "}";
      furtherSplit = JSON.parse(furtherSplit);

      let id = furtherSplit.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].videoRenderer.videoId;

      console.log(id);

      if (id !== undefined) {
        console.log(`Found YouTube video with id "${id}"! :3`);
        ids.push(id);
      } else {
        console.log(`No video found for "${query}"... :/`);
      }
      progressCallback?.(i + 1, tracks.length);

    }
    console.log("Found all songs! Creating playlist...");
    return await this.yt.createPlaylist(
      from.attributes.name,
      from.attributes.description?.standard,
      undefined,
      undefined,
      ids
    );
  }
}
