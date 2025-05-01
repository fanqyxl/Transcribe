import { AMPlaylistResponse, AMPlaylistsResponse, AMLibraryPlaylist } from "./types";
import { fetch } from "../epoxy";

export class AMManager {
  constructor(token: string, cookie: string) {
    this.token = token;
    this.cookie = cookie;
  }

  token: string;
  cookie: string;

  async getPlaylists(limit: number): Promise<AMLibraryPlaylist[]> {
      let url = `https://amp-api.music.apple.com/v1/me/library/playlists?limit=${limit}&platform=web`;
      console.log(url);
      let response = await fetch(url, {
          headers: {
              Authorization: `Bearer ${this.token}`,
              Cookie: this.cookie,
              origin: "https://beta.music.apple.com",
          },
      });
      console.log(response);
      let data = (await response.json()) as AMPlaylistsResponse;
      return data.data;
  }

  async getPlaylist(id: string): Promise<AMPlaylistResponse> {
      let url = `https://amp-api.music.apple.com/v1/me/library/playlists/${id}?art%5Blibrary-music-videos%3Aurl%5D=c%2Cf&art%5Burl%5D=f&extend=hasCollaboration%2CisCollaborativeHost&extend%5Blibrary-playlists%5D=tags&fields%5Bmusic-videos%5D=artistUrl%2Cartwork%2CdurationInMillis%2Curl&fields%5Bsongs%5D=artistUrl%2Cartwork%2CdurationInMillis%2Curl&format%5Bresources%5D=map&include=catalog%2Cartists%2Ctracks&include%5Blibrary-playlists%5D=catalog%2Ctracks%2Cplaylists&include%5Bplaylists%5D=curator&include%5Bsongs%5D=artists&l=en-CA&omit%5Bresource%5D=autos&platform=web&relate=catalog`;
      console.log(url);
      let response = await fetch(url, {
          headers: {
              Authorization: `Bearer ${this.token}`,
              Cookie: this.cookie,
              origin: "https://beta.music.apple.com",
          },
      });
      return (await response.json()) as AMPlaylistResponse;
  }
}
