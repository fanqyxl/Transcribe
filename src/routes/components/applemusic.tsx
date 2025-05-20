import { Dialog, Button, Card } from "m3-dreamland";
import { AMManager } from "../../dsp/applemusic/manager";
import {
    AMLibraryPlaylist,
    AMPlaylistResponse,
} from "../../dsp/applemusic/types";
import { IYouTubeMusicAuthenticated } from "../../dsp/yt/interfaces-primary";
import { AM2YT } from "../../dsp/bridge/AM2YT";

export const AMPlaylistDialog: Component<
    { playlist: AMLibraryPlaylist; open: boolean; am: AMManager },
    { playlistInternal: AMPlaylistResponse | undefined }
> = function () {
    useChange([this.open], async () => {
        if (this.open === true) {
            this.playlistInternal = await this.am.getPlaylist(this.playlist.id);
        }
    });

    return (
        <div>
            <Dialog
                open
                bind:open={use(this.open)}
                headline={this.playlist.attributes.name}
                closeOnClick={false}
            >
                <div>
                    {$if(
                        use(this.playlistInternal, (p) => p !== undefined),
                        <ul>
                            {use(this.playlistInternal, (p) =>
                                Object.keys(
                                    p?.resources?.["library-songs"] || [],
                                ).map((key) => (
                                    <li>
                                        {
                                            p?.resources?.["library-songs"]![
                                                key
                                            ].attributes.name
                                        }
                                    </li>
                                )),
                            )}
                        </ul>,
                    )}
                </div>
                <div>
                    <Button type="filled" on:click={() => (this.open = false)}>
                        Close
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export const AMPlaylistCard: Component<
    {
        playlist: AMLibraryPlaylist;
        am: AMManager;
        yt: IYouTubeMusicAuthenticated;
    },
    { open: boolean; url: string }
> = function () {
    this.open = false;
    this.url = (this.playlist.attributes.artwork?.url || "")
        .replace("{w}", "1024")
        .replace("{h}", "1024");

    this.css = `
    img {
      border-radius: 1.25rem;
    }
    `;
    return (
        <div class="playlist-card" /*on:click={() => (this.open = true)}*/>
            <Card type="filled">
                <img src={this.url} alt="Playlist cover" />
                <h2>{this.playlist.attributes.name}</h2>
                <p>
                    {this.playlist.attributes.description?.standard ??
                        "No description"}
                </p>
                <Button
                    type="filled"
                    on:click={async () => {
                        const transfer = new AM2YT(this.am, this.yt);
                        await transfer.transfer(this.playlist);
                    }}
                >
                    To YouTube Music
                </Button>
            </Card>
            {/* <AMPlaylistDialog
                open
                bind:open={use(this.open)}
                playlist={this.playlist}
                am={this.am}
                bind:am={use(this.am)}
            /> */}
        </div>
    );
};
