import {
    Button,
    CircularProgressIndeterminate,
    TextField,
} from "m3-dreamland";
import settings from "../store";
import YouTubeMusic, {
    IPlaylistDetail,
    IYouTubeMusicAuthenticated,
} from "../yt/exports";
import { fetch } from "../epoxy";
import {
    AMPlaylistsResponse,
    AMLibraryPlaylist,
} from "../applemusic/types";

import SettingsDialog from "./components/settings";
import YouTubeMusicAuthenticated from "../yt/service/youtube-music-authenticated";
import { AMManager } from "../applemusic/manager";
import { AMPlaylistCard } from "./components/applemusic";
import { YTPlaylistCard } from "./components/youtubemusic";

const Home: Component<
    {},
    {
        ytm: YouTubeMusic;
        ytAuthed: IYouTubeMusicAuthenticated;
        ytPlaylists: IPlaylistDetail[];
        ytFlag: boolean;

        am: AMManager;
        amPlaylists: AMLibraryPlaylist[];
        amLoadedPlaylistCount: number;
        amFlag: boolean;

        settingsOpen: boolean;
    }
> = function () {
    this.ytm = new YouTubeMusic();
    this.ytPlaylists = [];
    this.ytFlag = false;

    this.amPlaylists = [];
    this.amLoadedPlaylistCount = 25;
    this.amFlag = false;
    this.css = `
      .playlists {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        padding-inline: 16px;
        width: 100%;
        max-width: 100%;
      }
  `;

    return (
        <div>
            <div>
                <Button
                    type="filled"
                    on:click={async () => {
                        this.ytFlag = true;
                        this.ytAuthed = await this.ytm.authenticate(
                            settings.ytCookie,
                        );
                        this.ytPlaylists =
                            await this.ytAuthed.getLibraryPlaylists();
                    }}
                >
                    Get YT Playlists
                </Button>

                <Button
                    type="filled"
                    on:click={async () => {
                        this.am = new AMManager(settings.amToken, settings.amCookie);
                        this.amFlag = true;
                        this.amPlaylists = await this.am.getPlaylists(
                            this.amLoadedPlaylistCount
                        );
                        console.log(this.amPlaylists);
                    }}
                >
                    Get AM Playlists
                </Button>

                <Button
                    type="filled"
                    on:click={async () => {
                        this.settingsOpen = true;
                    }}
                >
                    Settings
                </Button>
            </div>

            <SettingsDialog open bind:open={use(this.settingsOpen)} />

            {$if(
                use(this.ytFlag),
                <div>
                    <h2>YouTube Playlists</h2>
                    {$if(
                        use(
                            this.ytPlaylists,
                            (playlists) => playlists.length > 0,
                        ),
                        <div class="playlists">
                            {use(this.ytPlaylists, (playlists) =>
                                playlists.map((playlist) => (
                                    <YTPlaylistCard
                                        playlist={playlist}
                                        auth={this.ytAuthed}
                                    />
                                )),
                            )}
                        </div>,
                        <CircularProgressIndeterminate />,
                    )}
                </div>,
            )}
            {$if(
                use(this.amFlag),
                <div>
                    <h2>Apple Music Playlists</h2>
                    {$if(
                        use(
                            this.amPlaylists,
                            (playlists) => playlists.length > 0,
                        ),
                        <div>
                            <div class="playlists">
                                {use(this.amPlaylists, (playlists) =>
                                    playlists.map((playlist) => (
                                        <div>
                                            <AMPlaylistCard
                                                playlist={playlist}
                                                am={this.am}
                                                bind:am={use(this.am)}
                                            />
                                        </div>
                                    )),
                                )}
                            </div>
                            <Button
                                type="filled"
                                on:click={async () => {
                                    this.amLoadedPlaylistCount += 10;
                                    this.amPlaylists =
                                        await this.am.getPlaylists(
                                            this.amLoadedPlaylistCount,
                                        );
                                }}
                            >
                                Load more
                            </Button>
                        </div>,
                        <CircularProgressIndeterminate />,
                    )}
                </div>,
            )}
        </div>
    );
};

export default Home;
