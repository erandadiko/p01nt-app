import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedTeam {
  name: string;
  sport: string;
  federation: string;
  logoUrl?: string;
}

export interface ScrapedPlayer {
  name: string;
  age?: number;
  gender?: string;
  sport: string;
  position?: string;
  teamName?: string;
  stats?: Record<string, unknown>;
  imageUrl?: string;
}

export interface ScrapedMatch {
  team1Name: string;
  team2Name: string;
  date: Date;
  score?: string;
  status: string;
  venue?: string;
  federation: string;
}

export interface ScrapedNews {
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  link?: string;
  federation: string;
  date: Date;
}

export interface ScrapedData {
  teams: ScrapedTeam[];
  players: ScrapedPlayer[];
  matches: ScrapedMatch[];
  news: ScrapedNews[];
}

export abstract class BaseScraper {
  protected client: AxiosInstance;
  protected baseUrl: string;
  protected federation: string;

  constructor(baseUrl: string, federation: string) {
    this.baseUrl = baseUrl;
    this.federation = federation;
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        'User-Agent': 'P01NT Sports Scraper/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });
  }

  protected async fetchPage(path: string): Promise<cheerio.CheerioAPI> {
    try {
      const response = await this.client.get(path);
      return cheerio.load(response.data);
    } catch (error) {
      console.error(`Error fetching ${this.baseUrl}${path}:`, error);
      throw error;
    }
  }

  protected parseDate(dateStr: string): Date {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
  }

  protected cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  abstract scrapeTeams(): Promise<ScrapedTeam[]>;
  abstract scrapePlayers(): Promise<ScrapedPlayer[]>;
  abstract scrapeMatches(): Promise<ScrapedMatch[]>;
  abstract scrapeNews(): Promise<ScrapedNews[]>;

  async scrapeAll(): Promise<ScrapedData> {
    const [teams, players, matches, news] = await Promise.allSettled([
      this.scrapeTeams(),
      this.scrapePlayers(),
      this.scrapeMatches(),
      this.scrapeNews(),
    ]);

    return {
      teams: teams.status === 'fulfilled' ? teams.value : [],
      players: players.status === 'fulfilled' ? players.value : [],
      matches: matches.status === 'fulfilled' ? matches.value : [],
      news: news.status === 'fulfilled' ? news.value : [],
    };
  }
}
