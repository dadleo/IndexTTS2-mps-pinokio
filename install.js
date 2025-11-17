{
  "version": 1,
  "description": "IndexTTS2 MPS Application Setup",
  "dependencies": [
    {
      "method": "clone",
      "params": "https://github.com/dadleo/index-tts-mps",
      "branch": "main",
      "description": "Cloning core IndexTTS2 repository"
    }
  ],
  "runtime": {
    "method": "python",
    "version": "3.10"
  },
  "install": [
    {
      "method": "shell",
      "params": [
        {
          "method": "cd",
          "params": "index-tts-mps"
        },
        {
          "method": "pip",
          "params": "install -r requirements.txt",
          "description": "Install all dependencies"
        },
        {
          "method": "pip",
          "params": "install torch torchaudio torchvision --force-reinstall --extra-index-url https://download.pytorch.org/whl/cpu",
          "description": "Force reinstall PyTorch using the CPU/Mac index to enable MPS acceleration."
        }
      ]
    }
  ],
  "run": [
    {
      "method": "cd",
      "params": "index-tts-mps"
    },
    {
      "method": "python",
      "params": "webui.py --port 7860"
    }
  ]
}
