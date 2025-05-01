import { epoxyVersion } from "./epoxy";

export let settings = $store(
	{
		wispServer: "wss://anura.pro/",
		epoxyVersion: "",
		ytCookie: "",
		amToken: "",
		amCookie: "",
	},
	{ ident: "settings", backing: "localstorage", autosave: "auto" },
);

export default settings;
