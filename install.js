module.exports = {
  install: async (cli) => {
    
    const REPO_URL = "https://github.com/dadleo/index-tts-mps";
    const REPO_DIR = "index-tts-mps";
    const PYTORCH_INDEX = "https://download.pytorch.org/whl/cpu";

    // Execute the entire installation sequence within a single, continuous shell run.
    await cli.run({
      message: "Starting IndexTTS2 Installation (Cloning, Dependencies, and MPS Fix)...",
      method: "shell",
      params: `
        # 1. Clone the repository
        git clone ${REPO_URL} ${REPO_DIR}
        
        # Check if cloning succeeded
        if [ ! -d "${REPO_DIR}" ]; then
          echo "ERROR: Failed to clone repository ${REPO_URL}"
          exit 1
        fi
        
        # 2. Navigate to the repository directory
        cd ${REPO_DIR}
        
        # 3. Install all dependencies from requirements.txt
        pip install -r requirements.txt
        
        # 4. CRITICAL FIX: Force Reinstall PyTorch for MPS Acceleration
        # This overwrites any non-MPS binaries installed in step 3.
        pip install torch torchaudio torchvision --force-reinstall --extra-index-url ${PYTORCH_INDEX}
        
        echo "Installation complete."
      `
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
