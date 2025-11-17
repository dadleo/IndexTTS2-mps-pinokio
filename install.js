module.exports = {
  install: async () => {
    // 1. Setup Environment and Clone Repository
    // Pinokio typically handles Python installation/selection automatically.
    
    // Clone the core repository
    await cli.run({
      message: "Cloning IndexTTS2 core repository...",
      method: "git",
      params: "clone https://github.com/dadleo/index-tts-mps",
    });

    // 2. Install Dependencies
    // Change directory into the cloned repo to access requirements.txt
    await cli.cd("index-tts-mps");

    // Install all generic dependencies from requirements.txt
    await cli.run({
      message: "Installing Python dependencies (including generic PyTorch)...",
      method: "pip",
      params: "install -r requirements.txt",
    });
    
    // 3. CRITICAL FIX: Force Reinstall PyTorch for MPS Acceleration
    // We use --force-reinstall and the official CPU index (which serves Mac wheels)
    // to ensure the specific PyTorch binary required for MPS is installed.
    await cli.run({
      message: "Force installing MPS-compatible PyTorch/TorchAudio/TorchVision...",
      method: "pip",
      params: "install torch torchaudio torchvision --force-reinstall --extra-index-url https://download.pytorch.org/whl/cpu",
    });

    // Installation successful
    await cli.cd(".."); // Move back to the app root if necessary, though run() handles path typically
  },
  
  run: async () => {
    // Change directory into the application folder to run the web UI
    await cli.cd("index-tts-mps");
    
    // Run the web UI
    await cli.run({
      message: "Starting IndexTTS2 WebUI...",
      method: "python",
      params: "webui.py --port 7860",
      daemon: true
    });
  }
};
