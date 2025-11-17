module.exports = {
  install: async (cli) => {
    // --- DEBUG STEP 1: Confirm Pinokio can execute basic shell commands ---
    await cli.run({
      message: "Debug: Installation script initiated successfully.",
      method: "shell",
      params: "echo 'Script started and shell is active.'",
    });

    // --- DEBUG STEP 2: Check if 'git' command is visible in the PATH ---
    await cli.run({
      message: "Debug: Checking path for 'git'...",
      method: "shell",
      params: "which git",
    });

    // 1. Clone the core repository (Using the simplest possible clone command)
    await cli.run({
      message: "Cloning IndexTTS2 core repository...",
      method: "shell",
      // Rely on default behavior to clone into 'index-tts-mps'
      params: "git clone https://github.com/dadleo/index-tts-mps",
    });

    // 2. Navigate into the cloned repository
    await cli.cd("index-tts-mps");

    // 3. Install all dependencies from requirements.txt
    await cli.run({
      message: "Installing Python dependencies...",
      method: "pip",
      params: "install -r requirements.txt",
    });
    
    // 4. CRITICAL FIX: Force Reinstall PyTorch for MPS Acceleration
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
      daemon: true
    });
  }
};
