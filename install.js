module.exports = {
  install: async (cli) => {
    // 1. Clone the core repository using a standard shell command
    await cli.run({
      message: "Cloning IndexTTS2 core repository...",
      method: "shell",
      // Using 'git clone' via shell is generally reliable if Pinokio initializes shell correctly.
      params: "git clone https://github.com/dadleo/index-tts-mps",
    });

    // 2. Navigate into the cloned repository
    // Note: Pinokio's cli.cd changes the directory for subsequent commands within the scope.
    await cli.cd("index-tts-mps");

    // 3. Install all dependencies from requirements.txt (This will install generic PyTorch first)
    await cli.run({
      message: "Installing Python dependencies...",
      method: "pip",
      params: "install -r requirements.txt",
    });
    
    // 4. CRITICAL FIX: Force Reinstall PyTorch for MPS Acceleration
    // This step forces the installation of the MPS-compatible wheels, fixing the acceleration issue.
    await cli.run({
      message: "Force installing MPS-compatible PyTorch wheels...",
      method: "pip",
      params: "install torch torchaudio torchvision --force-reinstall --extra-index-url https://download.pytorch.org/whl/cpu",
    });
  },
  
  run: async (cli) => {
    // Navigate into the application folder to run the web UI
    await cli.cd("index-tts-mps");
    
    // Run the web UI
    await cli.run({
      message: "Starting IndexTTS2 WebUI...",
      method: "python",
      params: "webui.py --port 7860",
      daemon: true // Run as a background process
    });
  }
};
