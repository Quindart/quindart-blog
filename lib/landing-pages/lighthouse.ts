import * as http from 'http';

export interface LighthouseResult {
  score: number;
  report: any;
}

export async function runLighthouseAudit(html: string): Promise<LighthouseResult> {
  // Use string concatenation to hide imports from webpack analysis
  const lighthouseName = 'light' + 'house';
  const chromeName = 'chrome-' + 'launcher';
  const lighthouse = (await import(lighthouseName)).default;
  const chromeLauncher = (await import(chromeName)).default;
  // Create a temporary HTTP server to serve the HTML
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  });

  let chrome: any = null;

  return new Promise((resolve, reject) => {
    // Start the server on a random available port
    server.listen(0, async () => {
      try {
        const address = server.address();
        if (!address || typeof address === 'string') {
          throw new Error('Failed to get server address');
        }

        const port = address.port;
        const url = `http://localhost:${port}`;

        // Launch Chrome
        chrome = await chromeLauncher.launch({
          chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
        });

        // Run Lighthouse audit
        const options = {
          logLevel: 'error' as const,
          output: 'json' as const,
          port: chrome.port,
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        };

        const runnerResult = await lighthouse.default(url, options);

        if (!runnerResult) {
          throw new Error('Lighthouse audit failed');
        }

        const report = runnerResult.lhr;

        // Extract scores from the report
        const categories = report.categories;
        const scores = [
          categories.performance.score,
          categories.accessibility.score,
          categories['best-practices'].score,
          categories.seo.score,
        ];

        // Calculate overall score as average (converted from 0-1 to 0-100)
        const overallScore = Math.round(
          (scores.reduce((a, b) => a + b, 0) / scores.length) * 100
        );

        resolve({
          score: overallScore,
          report: report,
        });
      } catch (error) {
        reject(error);
      } finally {
        // Close Chrome
        if (chrome) {
          await chrome.kill();
        }
        // Close the server
        server.close();
      }
    });

    // Handle server errors
    server.on('error', (error) => {
      reject(error);
    });
  });
}
