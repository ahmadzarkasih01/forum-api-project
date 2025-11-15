// src/Infrastructures/http/plugins/RateLimitPlugin.js

const rateMap = new Map(); // Menyimpan data sementara per IP

const RateLimitPlugin = {
  name: 'RateLimitPlugin',
  version: '1.0.0',
  register: async (server) => {
    // Ambil konfigurasi dari environment variable
    const LIMIT = parseInt(process.env.RATE_LIMIT, 10) || 90; // default: 90 request
    const WINDOW_MS = parseInt(process.env.RATE_WINDOW, 10) || 60 * 1000; // default: 1 menit

    server.ext('onPreHandler', (request, h) => {
      // Batasi hanya untuk endpoint /threads
      if (request.path.startsWith('/threads')) {
        const ip = request.info.remoteAddress;
        const now = Date.now();

        // Ambil data IP sebelumnya
        const data = rateMap.get(ip) || { count: 0, firstRequestAt: now };

        // Jika sudah lewat 1 menit, reset counter
        if (now - data.firstRequestAt > WINDOW_MS) {
          data.count = 1;
          data.firstRequestAt = now;
        } else {
          data.count++;
        }

        rateMap.set(ip, data);

        // Jika melebihi limit
        if (data.count > LIMIT) {
          return h
            .response({
              status: 'fail',
              message: 'Terlalu banyak permintaan. Coba lagi nanti.',
            })
            .code(429)
            .takeover();
        }
      }

      return h.continue;
    });
  },
};

module.exports = RateLimitPlugin;
