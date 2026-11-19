function record() {
  const WINDOW_LENGTH_IN_MILLISECONDS = 5;  // 5 ms
  const SAMPLES = 1000; // Number of windows in a single trace
  const TRACE = new Array(SAMPLES);

  TRACE.fill(-1, 0, TRACE.length);  // Fills array with -1 so we can be sure memory is allocated

  // In the Intel Core i7-1260P Processor, the L3 cache acts as the last cache level before data is retrieved from RAM
  const LLC_SIZE = 18 * 1024 * 1024; // 18 MB
  const CACHE_LINE_SIZE = 64; // Intel Core i7-1260P Processor uses a 64-byte cache line size
  const DOUBLE_SIZE = 8; // JavaScript numbers are always stored in 64-bit binary format

  const TOTAL_CACHE_LINES = LLC_SIZE / CACHE_LINE_SIZE;
  const EIGHT_BYTES_PER_CACHE_LINE = CACHE_LINE_SIZE / DOUBLE_SIZE;

  const BUFFER = new Float64Array(TOTAL_CACHE_LINES * EIGHT_BYTES_PER_CACHE_LINE).fill(-1);

  for (let i = 0; i < SAMPLES; i++) {
    let counter = 0;
    let dummy = 0;
    let start_timestamp = performance.now();

    do {
      counter++;
      for (let j = 0; j < TOTAL_CACHE_LINES; j++) { // One full sweep over the LLC-sized buffer
        dummy += BUFFER[j * EIGHT_BYTES_PER_CACHE_LINE];
      }
    } while (performance.now() - start_timestamp < WINDOW_LENGTH_IN_MILLISECONDS);  // Runs for 5 milliseconds

    TRACE[i] = counter;
  }

  postMessage(JSON.stringify(TRACE)); // Once done recording, send result to main thread
}

self.onmessage = (e) => {
  if (e.data.type === "start") {
    setTimeout(record, 0);
  }
};