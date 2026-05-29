async function mountChunks({ chunks, req }) {
  for await (const chunk of req) {
    chunks.push(chunk);
  }
}

async function bodyMiddleware({ req, res }) {
  try {
    let chunks = [],
      buffer = {};

    await mountChunks({ chunks, req });

    buffer = Buffer.concat(chunks).toString();

    req.body = JSON.parse(buffer);
  } catch (error) {
    req.body = null;
  }
}

export { bodyMiddleware };
