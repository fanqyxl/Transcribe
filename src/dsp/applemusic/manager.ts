import {
    AMPlaylistResponse,
    AMPlaylistsResponse,
    AMLibraryPlaylist,
    AMSearchResponse,
    AMTrackReferenceForPlaylistAddition,
    AMLibraryPlaylistCreationResponse,
    AMLibraryPlaylistCreationAttributes,
    AMLibraryPlaylistCreationRequest,
} from "./types";
import { fetch } from "../../epoxy";

export class AMManager {
    constructor(token: string, cookie: string) {
        this.token = token.startsWith("Bearer ") ? token.substring(7) : token;
        this.cookie = cookie;
    }

    token: string;
    cookie: string;

    baseUrl: string = "https://amp-api.music.apple.com/v1/me/library/playlists";

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
        let baseUrl = `https://amp-api.music.apple.com/v1/me/library/playlists/${id}`;
        let params = {
            "art[library-music-videos:url]": "c,f",
            "art[url]": "f",
            extend: "hasCollaboration,isCollaborativeHost",
            "extend[library-playlists]": "tags",
            "fields[music-videos]": "artistUrl,artwork,durationInMillis,url",
            "fields[songs]": "artistUrl,artwork,durationInMillis,url",
            "format[resources]": "map",
            include: "catalog,artists,tracks",
            "include[library-playlists]": "catalog,tracks,playlists",
            "include[playlists]": "curator",
            "include[songs]": "artists",
            l: "en-CA",
            "omit[resource]": "autos",
            platform: "web",
            relate: "catalog",
        };

        const queryString = Object.entries(params)
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
            )
            .join("&");

        let url = `${baseUrl}?${queryString}`;
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

    async searchSongs(query: string, limit: number): Promise<AMSearchResponse> {
        let baseUrl =
            "https://amp-api-edge.music.apple.com/v1/catalog/ca/search";
        let params = {
            "art[music-videos:url]": "c",
            "art[url]": "f",
            extend: "artistUrl",
            "fields[albums]":
                "artistName,artistUrl,artwork,contentRating,editorialArtwork,editorialNotes,name,playParams,releaseDate,url,trackCount",
            "fields[artists]": "url,name,artwork",
            "format[resources]": "map",
            "include[albums]": "artists",
            "include[songs]": "artists",
            l: "en-CA",
            limit: limit,
            "omit[resource]": "autos",
            platform: "web",
            "relate[albums]": "artists",
            "relate[songs]": "albums",
            term: query,
            types: "songs",
            with: "lyricHighlights,lyrics,serverBubbles,subtitles",
        };

        const queryString = Object.entries(params)
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
            )
            .join("&");

        let url = `${baseUrl}?${queryString}`;
        console.log(url);
        let response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.token}`,
                Cookie: this.cookie,
                origin: "https://beta.music.apple.com",
            },
        });
        return (await response.json()) as AMSearchResponse;
    }

    async createPlaylist(
        name: string,
        description?: string,
        songIds?: string[],
    ) {
        let refs: AMTrackReferenceForPlaylistAddition[] = (songIds || []).map(
            (id) =>
                ({
                    id,
                    type: "songs",
                }) as AMTrackReferenceForPlaylistAddition,
        );

        let attrs = {
            name: name,
            description: description || "",
            isPublic: false,
        } as AMLibraryPlaylistCreationAttributes

      let request = {
        attributes: attrs,
        relationships: {
          tracks: {
            data: refs,
          },
        },
      } as AMLibraryPlaylistCreationRequest;

        let response = await fetch(
            "https://amp-api.music.apple.com/v1/me/library/playlists",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    Cookie: this.cookie,
                    origin: "https://beta.music.apple.com",
                },
                body: JSON.stringify(request),
            },
        );

        return (await response.json()) as AMLibraryPlaylistCreationResponse;
    }
}
