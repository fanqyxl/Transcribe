// import * as http from "http";
import { IPlaylistDetail, ITrackDetail } from "./interfaces-supplementary";

export interface IIncomingMessage extends Record<string, string | undefined> {
    body?: string;
}

export interface IInternalPlaylistDetail extends IPlaylistDetail {
    continuationToken?: string;
}

export interface IInternalTracksDetail {
    continuationToken?: string;
    tracks?: ITrackDetail[];
}
