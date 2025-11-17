module.exports = {
  install: async (cli) => {
    // 1. Declare the cloning and basic dependency installation (Pinokio handles pathing implicitly here)
    // This high-level call should prevent the immediate hang experienced with manual 'git clone' shell calls.
    await cli.install({
      name: "IndexTTS2 Core",
      source: "https://github.com/dadleo/index-tts-mps",
      params: [
        {
          method: "pip",
          // Install all dependencies inside the cloned directory (index-tts-mps)
          params: "install -r requirements.txt", 
          // Note: Pinokio often handles the implicit 'cd' into the cloned directory
        }
      ]
    });

    // 2. Navigate into the cloned repository to ensure the next command executes in the right place.
    // If the hang persists, this step might need to be removed, but for pip operations, it's safer.
    await cli.cd("index-tts-mps");

    // 3. CRITICAL FIX: Force Reinstall PyTorch for MPS Acceleration
    // This step must be explicit to ensure the Mac-specific binaries are pulled.
    await cli.run({
      message: "Force installing MPS-compatible PyTorch wheels...",
      method: "pip",
      params: "install torch torchaudio torchvision --force-reinstall --extra-index-url https://download.pytorch.org/whl/cpu",
    });
  },
  
  run: async (cli) => {
    // Ensure we are in the application folder before running the web UI
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
