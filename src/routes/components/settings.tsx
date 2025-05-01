import settings from "../../store";
import {Dialog, TextField, Button} from "m3-dreamland"

const SettingsDialog: Component<{ open: boolean }, {}> = function () {
    return (
        <div>
            <Dialog
                headline="Settings"
                open
                bind:open={use(this.open)}
                closeOnClick={false}
            >
                <div class="body">
                    <div>
                        <TextField
                            name="Wisp Server"
                            bind:value={use(settings.wispServer)}
                            extraOptions={{ placeholder: "wss://anura.pro" }}
                        />
                    </div>
                    <h3>YouTube Music</h3>
                    <div>
                        <TextField
                            name="Cookie"
                            bind:value={use(settings.ytCookie)}
                            extraOptions={{
                                type: "password",
                                placeholder:
                                    "VISITOR_INFO1_LIVE= VISITOR_PRIVACY_METADATA= YSC= __Secure-ROLLOUT_TOKEN= SID=",
                            }}
                        />
                    </div>

                    <h3>Apple Music</h3>
                    <div>
                        <TextField
                            name="Token"
                            bind:value={use(settings.amToken)}
                            extraOptions={{
                                type: "password",
                                placeholder: "y0uRtOk3nHEr3",
                            }}
                        />
                        <TextField
                            name="Cookie"
                            bind:value={use(settings.amCookie)}
                            extraOptions={{
                                type: "password",
                                placeholder:
                                    "geo=CA; s_cc=true; dssf=1; at_check=true; dssid2=",
                            }}
                        />
                    </div>
                </div>
                <div class="buttons">
                    <Button
                        type="filled"
                        on:click={async () => {
                            this.open = false;
                        }}
                    >
                        Save
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default SettingsDialog;
