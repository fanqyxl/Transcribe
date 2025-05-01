import AlbumParser from "../parsers/album-parser";
import ArtistParser from "../parsers/artist-parser";
import PlaylistParser from "../parsers/playlist-parser";
import TrackParser from "../parsers/track-parser";
import YouTubeMusicContext from "../context";
import { fetch } from "../../epoxy";

export default class YouTubeMusicBase {
    hostname: string = "music.youtube.com";
    basePath: string = "/youtubei/v1/";
    queryString: string = "?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30";
    origin: string = "https://music.youtube.com";
    albumParser: AlbumParser;
    artistParser: ArtistParser;
    playlistParser: PlaylistParser;
    trackParser: TrackParser;

    constructor() {
        this.albumParser = new AlbumParser();
        this.artistParser = new ArtistParser();
        this.playlistParser = new PlaylistParser();
        this.trackParser = new TrackParser();
    }

    protected generateHeaders(): Record<string, string> {
        return {
            "X-Origin": this.origin
        };
    }

    protected async sendRequest(path: string, data?: any, additionalQueryString?: string): Promise<any> {
        let requestBody: string | undefined = undefined;
        if (data) {
            data = {
                ...YouTubeMusicContext,
                ...data
            };
            requestBody = JSON.stringify(data);
        }
        const queryString = additionalQueryString ? `${this.queryString}&${additionalQueryString}` : this.queryString;
        const url = `https://${this.hostname}${this.basePath}${path}${queryString}`;
        console.log(url);
        const response = await this.sendFetchRequest(url, requestBody);

        if (response.status === 200) {
            const body = await response.json();
            if (body) {
              console.log(body);
                return body;
            }
        }
        throw new Error(`Could not send the specified request to ${path}. Status code: ${response.status}`);
    }

    protected async sendFetchRequest(url: string, data?: string): Promise<Response> {
        const headers: Record<string, string> = this.generateHeaders();

        if (data) {
            headers["Content-Type"] = "application/json";
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

        try {
            const response = await fetch(url, {
                method: "POST",
                headers,
                body: data,
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    protected playlistIdTrim(playlistId: string): string {
        if (playlistId && playlistId.toUpperCase().startsWith("VL")) {
            return playlistId.substring(2);
        }
        return playlistId;
    }

    protected playlistIdPad(playlistId: string): string {
        if (playlistId && !playlistId.toUpperCase().startsWith("VL")) {
            return "VL" + playlistId;
        }
        return playlistId;
    }
}
