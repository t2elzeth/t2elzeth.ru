import socketio
import os

io = socketio.Client()


@io.event
def connect():
    io.emit("new-project")
    io.disconnect()


def emit_new_project():
    host = os.getenv('NFT_GENERATOR_HOST', 'localhost')
    port = os.getenv('NFT_GENERATOR_PORT', '8920')
    io.connect(f"nft_generator:8920")

emit_new_project()
