import socketio

io = socketio.Client()


@io.event
def connect():
    io.emit("new-project")
    io.disconnect()


def emit_new_project():
    io.connect("http://localhost:8920")
