import { Dialog, Button, Card } from "m3-dreamland";
import { IYouTubeMusicAuthenticated } from "../../dsp/yt/interfaces-primary";
import { IPlaylistDetail } from "../../dsp/yt/interfaces-supplementary";
import { YT2AM } from "../../dsp/bridge/YT2AM";
import { AMManager } from "../../dsp/applemusic/manager";

export const YTPlaylistDialog: Component<
  {
    playlist: IPlaylistDetail;
    open: boolean;
    auth: IYouTubeMusicAuthenticated;
  }, { playlistInternal: IPlaylistDetail | undefined; }
> = function () {
  useChange([this.open], async () => {
    if (this.open === true) {
      this.playlistInternal = await this.auth.getPlaylist(
        this.playlist.id!
      );
    }
  });

  return (
    <div>
      <Dialog
        headline={this.playlist.name!}
        open={this.open}
        closeOnClick={false}
      >
        <div>
          {$if(
            use(this.playlistInternal, (p) => p !== undefined),
            <ul>
              {use(this.playlistInternal, (p) => (p?.tracks || []).map((track) => (
                <li>{track.title}</li>
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

export const YTPlaylistCard: Component<
  { playlist: IPlaylistDetail; auth: IYouTubeMusicAuthenticated; am: AMManager }, { open: boolean; }
> = function () {
  this.open = false;
  return (
    <div class="playlist-card">
      <Card type="filled">
        <h2>{this.playlist.name}</h2>
        <p>{this.playlist.count} tracks</p>
        <Button type="filled" on:click={() => {
          const transfer = new YT2AM(this.auth, this.am);
          transfer.transfer(this.playlist);
        }}>
          Transfer
        </Button>
      </Card>
      <YTPlaylistDialog
        open
        bind:open={use(this.open)}
        playlist={this.playlist}
        auth={this.auth} />
    </div>
  );
};
