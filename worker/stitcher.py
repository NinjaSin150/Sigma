"""Simple stitcher script.

This is a starter utility. In production, this should run in a queue worker and
operate on object storage URIs.
"""

from __future__ import annotations

import subprocess
from pathlib import Path


def stitch_clips(clips: list[Path], output_file: Path) -> None:
    list_file = output_file.with_suffix(".txt")
    list_file.write_text("\n".join([f"file '{c.resolve()}'" for c in clips]))
    cmd = [
        "ffmpeg",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(list_file),
        "-c",
        "copy",
        str(output_file),
    ]
    subprocess.run(cmd, check=True)


if __name__ == "__main__":
    print("Guard stitcher scaffold. Integrate with queue + storage.")
