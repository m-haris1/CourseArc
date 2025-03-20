const streamOptions = [
    '-i', '-',                        // Input is a stream (using stdin)
    '-c:v', 'libx264',                 // Video codec: H.264
    '-preset', 'ultrafast',            // Encoding preset (speed vs. compression)
    '-tune', 'zerolatency',            // Tune for low latency
    '-r', `${25}`,                     // Frame rate: 25 frames per second
    '-g', `${25 * 2}`,                 // GOP size: keyframe interval (2 * frame rate)
    '-keyint_min', 25,                 // Minimum interval between keyframes
    '-crf', '25',                      // Constant Rate Factor (controls quality; lower is better)
    '-pix_fmt', 'yuv420p',             // Pixel format (used by most players)
    '-sc_threshold', '0',              // Scene change threshold
    '-profile:v', 'main',              // H.264 profile: main
    '-level', '3.1',                   // H.264 level
    '-c:a', 'aac',                     // Audio codec: AAC
    '-b:a', '128k',                    // Audio bitrate
    '-ar', '44100',                    // Audio sample rate (changed to 44100 Hz for better compatibility)
    '-f', 'flv',                       // Output format: FLV
    `rtmp://a.rtmp.youtube.com/live2/gj22-c2ru-ex51-89ej-6f2c`
  ];
  module.exports = streamOptions;
  