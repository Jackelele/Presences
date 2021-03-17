const presence = new Presence({ clientId: "821762747544895540" }),
  timestamp = Math.floor(Date.now() / 1000),
  newStats = async () => (data = await (await window.fetch("https://stats.boltfm.net/")).json());

let data: { 
  listeners: { 
    unique: number; 
  }; 
  now_playing: { 
    artist: string; 
    text: string; 
    title: string; 
  }; live: { 
    is_live: boolean; 
    streamer_name: string; 
  }; 
};

setInterval(newStats, 10000);
newStats();

presence.on("UpdateData", async () => {
  const settings = {
      details: (await presence.getSetting("details"))
        .replace("%listeners%", data.listeners?.unique ?? "Listeners"),
      state: (await presence.getSetting("state"))
        .replace("%artist%", data.now_playing?.artist || "Artist")
        .replace("%songText%", data.now_playing.text || "Song")
        .replace("%title%", data.now_playing?.title || "Title"),
      timestamp: await presence.getSetting("timestamp")
    },
    presenceData: PresenceData = {
      largeImageKey: "logo",
      details: settings.details,
      state: settings.state,
      smallImageText: `${data.live.is_live ? data.live.streamer_name : "AutoDJ"} is live!`,
      buttons: [
        {
          label: "Tune in",
          url: "https://live.itsbounce.net"
        }
      ]
    };

  if (settings.timestamp) presenceData.startTimestamp = timestamp;
  if (data.live.is_live) presenceData.smallImageKey = "live";
  else delete presenceData.smallImageText;

  presence.setActivity(presenceData);
});
