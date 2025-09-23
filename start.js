module.exports = {
  daemon: true,
  run: [
    {
      when: "{{platform === 'linux' && gpu === 'nvidia' && kernel.gpus && kernel.gpus.find(x => / 50.+/.test(x.model))}}",
      method: "shell.run",
      params: {
        venv: "env",
        env: { },
        path: "app",
        message: [
          "python webui.py --host 127.0.0.1 --cuda_kernel",
        ],
        on: [{
          "event": "/http:\/\/\\S+/",
          "done": true
        }]
      },
      next: "uri"
    },
    {
      when: "{{gpu !== 'nvidia'}}",
      method: "shell.run",
      params: {
        venv: "env",
        env: { },
        path: "app",
        message: [
          "python webui.py --host 127.0.0.1 ",
        ],
        on: [{
          "event": "/http:\/\/\\S+/",
          "done": true
        }]
      },
      next: "uri"
    },
    {
      when: "{{gpu === 'nvidia'}}",
      method: "shell.run",
      params: {
        venv: "env",
        env: { },
        path: "app",
        message: [
          "python webui.py --host 127.0.0.1 --cuda_kernel --deepspeed",
        ],
        on: [{
          "event": "/http:\/\/\\S+/",
          "done": true
        }]
      },
      next: "uri"
    },
    {
      id: "uri",
      method: "local.set",
      params: {
        url: "{{input.event[0]}}"
      }
    }
  ]
}
