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

import { fetch } from "../../epoxy"; // Needed for proxying traffic, because we all hate CORS.

/**
 * Reverse-engineered Apple Music API manager.
 * Provides methods to interact with Apple Music user library and catalog.
 */
export class AMManager {
    /**
     * Apple Music user token. (without "Bearer " prefix)
     */
    token: string;

    /**
     * Apple Music session cookie from the web app.
     */
    cookie: string;

    /**
     * Base URL for the Apple Music API.
     */
    apiBase: string = "https://amp-api.music.apple.com";

    /**
     * Constructs an AMManager instance.
     * @param token Apple Music user token.
     * @param cookie Apple Music session cookie from the web app.
     */
    constructor(token: string, cookie: string) {
        this.token = token.startsWith("Bearer ") ? token.substring(7) : token;
        this.cookie = cookie;
    }

    /**
     * Retrieves a list of playlists in the user's library.
     * @param limit Maximum number of playlists to retrieve.
     * @returns Promise resolving to an array of AMLibraryPlaylist objects.
     */
    async getPlaylists(limit: number): Promise<AMLibraryPlaylist[]> {
        let url = `${this.apiBase}/v1/me/library/playlists?limit=${limit}&platform=web`;
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

    /**
     * Retrieves the contents of a specific playlist from the user's library.
     * @param id The ID of the playlist to retrieve.
     * @returns Promise resolving to an AMPlaylistResponse object containing playlist details.
     */
    async getPlaylist(id: string): Promise<AMPlaylistResponse> {
        let baseUrl = `${this.apiBase}/v1/me/library/playlists/${id}`;
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

    /**
     * Searches for songs in the Apple Music catalog.
     * @param query The search query string.
     * @param limit Maximum number of results to return.
     * @returns Promise resolving to an AMSearchResponse object containing search results.
     */
    async searchSongs(query: string, limit: number): Promise<AMSearchResponse> {
        let baseUrl =
            `${this.apiBase}/v1/catalog/ca/search`;

        // TODO: Figure out what all this shit does
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

    /**
     * Creates a new playlist in the user's library.
     * @param name The name of the new playlist.
     * @param description (Optional) Description for the playlist.
     * @param songIds (Optional) Array of song IDs to add to the playlist.
     * @returns Promise resolving to an AMLibraryPlaylistCreationResponse object containing the created playlist info.
     */
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
            `${this.apiBase}/v1/me/library/playlists`,
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
