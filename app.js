(function () {
  const versionLabel = document.getElementById("versionLabel");
  const installerLabel = document.getElementById("installerLabel");
  const publishedAtLabel = document.getElementById("publishedAtLabel");
  const downloadButton = document.getElementById("downloadButton");
  const downloadCta = document.getElementById("downloadCta");

  async function loadVersion() {
    try {
      const response = await fetch("./version.json?ts=" + Date.now(), { cache: "no-store" });
      if (!response.ok) {
        throw new Error("version.json indisponivel");
      }

      const payload = await response.json();
      const version = payload.version || "1.0.0";
      const downloadUrl = payload.downloadUrl || "#download";
      const publishedAt = payload.publishedAt ? new Date(payload.publishedAt) : null;

      versionLabel.textContent = `v${version}`;
      installerLabel.textContent = downloadUrl.split("/").pop() || "MidiaDeck-Setup.exe";
      publishedAtLabel.textContent = publishedAt && !Number.isNaN(publishedAt.getTime())
        ? publishedAt.toLocaleString("pt-BR")
        : "Nao informado";
      downloadButton.href = downloadUrl;
      downloadButton.textContent = `Baixar v${version}`;
      downloadCta.href = downloadUrl;
      downloadCta.textContent = `Baixar v${version}`;
    } catch (error) {
      versionLabel.textContent = "versao publica";
      installerLabel.textContent = "Instalador do site";
      publishedAtLabel.textContent = "Atualize o version.json";
      downloadButton.href = "https://www.youtube.com/watch?v=XHr6xEjg9ZA";
      downloadButton.textContent = "Ver video";
      downloadCta.href = "https://www.youtube.com/watch?v=XHr6xEjg9ZA";
      downloadCta.textContent = "Ver video de instalacao";
      console.warn("Falha ao ler version.json", error);
    }
  }

  loadVersion();
}());
