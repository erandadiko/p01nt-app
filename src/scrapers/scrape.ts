import { FSHFScraper } from './fshf-scraper';
import { FSHBScraper } from './fshb-scraper';
import { FSHVScraper } from './fshv-scraper';
import { ATFScraper } from './taekwondo-scraper';
import { BaseScraper, ScrapedData } from './scraper';

type Federation = 'FSHF' | 'FSHB' | 'FSHV' | 'ATF';

const scrapers: Record<Federation, () => BaseScraper> = {
  FSHF: () => new FSHFScraper(),
  FSHB: () => new FSHBScraper(),
  FSHV: () => new FSHVScraper(),
  ATF: () => new ATFScraper(),
};

export interface ScrapeResult {
  federation: Federation;
  success: boolean;
  data?: ScrapedData;
  error?: string;
  duration: number;
}

export async function scrapeFederation(federation: Federation): Promise<ScrapeResult> {
  const startTime = Date.now();
  
  try {
    const scraperFactory = scrapers[federation];
    if (!scraperFactory) {
      throw new Error(`Unknown federation: ${federation}`);
    }

    const scraper = scraperFactory();
    const data = await scraper.scrapeAll();
    
    const duration = Date.now() - startTime;
    console.log(`[${federation}] Scraping completed in ${duration}ms`);
    console.log(`[${federation}] Results: ${data.teams.length} teams, ${data.players.length} players, ${data.matches.length} matches, ${data.news.length} news`);

    return {
      federation,
      success: true,
      data,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${federation}] Scraping failed: ${errorMessage}`);

    return {
      federation,
      success: false,
      error: errorMessage,
      duration,
    };
  }
}

export async function scrapeAllFederations(): Promise<ScrapeResult[]> {
  const federations: Federation[] = ['FSHF', 'FSHB', 'FSHV', 'ATF'];
  
  console.log('Starting scraping for all federations...');
  const startTime = Date.now();

  const results = await Promise.all(
    federations.map(federation => scrapeFederation(federation))
  );

  const totalDuration = Date.now() - startTime;
  const successCount = results.filter(r => r.success).length;
  
  console.log(`\nScraping completed in ${totalDuration}ms`);
  console.log(`Success: ${successCount}/${federations.length} federations`);

  return results;
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  const federation = args[0]?.toUpperCase() as Federation | undefined;

  if (federation && Object.keys(scrapers).includes(federation)) {
    scrapeFederation(federation).then(result => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    });
  } else if (!federation || federation === 'ALL') {
    scrapeAllFederations().then(results => {
      console.log(JSON.stringify(results, null, 2));
      const allSuccess = results.every(r => r.success);
      process.exit(allSuccess ? 0 : 1);
    });
  } else {
    console.error(`Unknown federation: ${federation}`);
    console.error('Available: FSHF, FSHB, FSHV, ATF, ALL');
    process.exit(1);
  }
}
