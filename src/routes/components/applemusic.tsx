import { Dialog, Button, Card } from "m3-dreamland";
import { AMManager } from "../../applemusic/manager";
import { AMLibraryPlaylist, AMPlaylistResponse } from "../../applemusic/types";

export const AMPlaylistDialog: Component<
  { playlist: AMLibraryPlaylist; open: boolean; am: AMManager; }, { playlistInternal: AMPlaylistResponse | undefined; }
> = function () {
  useChange([this.open], async () => {
    if (this.open === true) {
      this.playlistInternal = await this.am.getPlaylist(
        this.playlist.id
      );
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
              {use(this.playlistInternal, (p) => Object.keys(
                p?.resources["library-songs"] || []
              ).map((key) => (
                <li>
                  {p?.resources["library-songs"]![key]
                    .attributes.name}
                </li>
              ))
              )}
            </ul>
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
  { playlist: AMLibraryPlaylist; am: AMManager; }, { open: boolean; }
> = function () {
  this.open = false;
  return (
    <div class="playlist-card" on:click={() => (this.open = true)}>
      <Card type="elevated">
        <h2>{this.playlist.attributes.name}</h2>
        <p>
          {this.playlist.attributes.description?.standard ??
            "No description"}
        </p>
      </Card>
      <AMPlaylistDialog
        open
        bind:open={use(this.open)}
        playlist={this.playlist}
        am={this.am}
        bind:am={use(this.am)} />
    </div>
  );
};
