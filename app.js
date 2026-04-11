(function () {
  const versionLabel = document.getElementById("versionLabel");
  const installerLabel = document.getElementById("installerLabel");
  const publishedAtLabel = document.getElementById("publishedAtLabel");
  const downloadButton = document.getElementById("downloadButton");
  const downloadCta = document.getElementById("downloadCta");
  const downloadVersionLabel = document.getElementById("downloadVersionLabel");
  const publicRepoReleasesUrl = "https://github.com/gdp65468-del/Md-public/releases/latest";
  const latestReleaseApiUrl = "https://api.github.com/repos/gdp65468-del/Md-public/releases/latest";

  function applyDownload(payload) {
    const version = payload.version || "mais recente";
    const downloadUrl = payload.downloadUrl || publicRepoReleasesUrl;
    const publishedAt = payload.publishedAt ? new Date(payload.publishedAt) : null;

    versionLabel.textContent = version === "mais recente" ? version : `v${version}`;
    installerLabel.textContent = downloadUrl.split("/").pop() || "Pagina de downloads";
    publishedAtLabel.textContent = publishedAt && !Number.isNaN(publishedAt.getTime())
      ? publishedAt.toLocaleString("pt-BR")
      : "Site oficial";
    if (downloadVersionLabel) {
      downloadVersionLabel.textContent = version === "mais recente"
        ? "MidiaDeck para Windows"
        : `MidiaDeck v${version} para Windows`;
    }
    downloadButton.href = downloadUrl;
    downloadButton.textContent = version === "mais recente"
      ? "Abrir downloads"
      : `Baixar MidiaDeck v${version}`;
    downloadCta.href = downloadUrl;
    downloadCta.textContent = version === "mais recente"
      ? "Abrir downloads"
      : `Downloads v${version}`;
  }

  async function loadLatestReleaseFromGitHub() {
    const response = await fetch(latestReleaseApiUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("release publica indisponivel");
    }

    const release = await response.json();
    const installerAsset = Array.isArray(release.assets)
      ? release.assets.find((asset) => /\.exe$/i.test(asset.name || ""))
      : null;
    const version = (release.tag_name || "").replace(/^v/i, "");

    return {
      version: version || "mais recente",
      downloadUrl: installerAsset?.browser_download_url || release.html_url || publicRepoReleasesUrl,
      publishedAt: release.published_at || release.created_at || null
    };
  }

  async function loadVersion() {
    try {
      const response = await fetch("./version.json?ts=" + Date.now(), { cache: "no-store" });
      if (!response.ok) {
        throw new Error("version.json indisponivel");
      }

      const payload = await response.json();
      applyDownload(payload);
    } catch (error) {
      try {
        applyDownload(await loadLatestReleaseFromGitHub());
      } catch (fallbackError) {
        applyDownload({
          version: "mais recente",
          downloadUrl: publicRepoReleasesUrl,
          publishedAt: null
        });
        console.warn("Falha ao consultar GitHub Releases", fallbackError);
      }
      console.warn("Falha ao ler version.json", error);
    }
  }

  loadVersion();
}());
