// Define the interfaces
interface UrokoPrice {
    BronzeUrokoNum: number;
    GoldUrokoNum: number;
    SilverUrokoNum: number;
}

interface Badge {
    BadgeId: number;
    BadgeLevel: number;
    BadgeName: string;
    BadgeType: number;
    HowToGet: string;
    Id: number;
    Order: number;
    Season: number;
    UrokoPrice: UrokoPrice;
    UrokoUnlockLevel: number;
    __RowId: string;
}

interface TextColor {
    A: number;
    B: number;
    G: number;
    R: number;
}

interface Background {
    HowToGet: string;
    Id: number;
    Order: number;
    Season: number;
    TextColor: TextColor;
    UrokoPrice: UrokoPrice;
    UrokoUhlockLevel: number;
    __RowId: string;
}

type LanguageFile = Record<string, Record<string, string>>;
let cachedLanguageFile: LanguageFile | null = null;
let cachedLanguage: string | null = null;
let cachedBackgrounds: Background[] = [];
let cachedBadges: Badge[] = [];
let latestVersion = '';
// Define the service
export const SplatoonService = {
    async fetchLatestVersion() {
        if(latestVersion === '') {
            const response = await fetch('https://leanny.github.io/splat3/versions.json');
            const versions:string[] = await response.json();
            latestVersion = versions[versions.length - 1];
        }
    },

    async fetchBadgeInfo(): Promise<Badge[]> {
        if (cachedBadges.length === 0) {
            await this.fetchLatestVersion();
            const response = await fetch(`https://leanny.github.io/splat3//data/mush/${latestVersion}/BadgeInfo.json`);
            cachedBadges = await response.json();
        }
        return cachedBadges;
    },

    async fetchLanguageFile(language: string) {
        if (!cachedLanguageFile || cachedLanguage !== language) {
            const response = await fetch(`https://leanny.github.io/splat3/data/language/${language}.json`);
            cachedLanguageFile = await response.json();
        }
    },

    async fetchLanguageFileValue(language: string, category: string, key: string): Promise<string | null> {
        await this.fetchLanguageFile(language);
        return cachedLanguageFile?.[category]?.[key] ?? null;
    },

    async fetchLanguageFileCategory(language: string, category: string): Promise<Record<string, string> | null> {
        await this.fetchLanguageFile(language);
        return cachedLanguageFile?.[category] ?? null;
    },

    async fetchAdjectives(language: string): Promise<string[]> {
        const category = await this.fetchLanguageFileCategory(language, "CommonMsg/Byname/BynameAdjective");
        return category ? Object.values(category) : [];
    },
    
    async fetchSubjects(language: string): Promise<string[]> {
        const category = await this.fetchLanguageFileCategory(language, "CommonMsg/Byname/BynameSubject");
        return Object.entries(category ?? {}).filter(([key]) => key[5] === '0').map(([, value]) => value);
    },

    // Add other functions from bgcatalog.ts here
    async fetchBackgroundInfo(): Promise<Background[]> {
        if(cachedBackgrounds.length === 0) {
            await this.fetchLatestVersion();
            const response = await fetch(`https://leanny.github.io/splat3//data/mush/${latestVersion}/NamePlateBgInfo.json`);
            cachedBackgrounds = await response.json();
        }

        return cachedBackgrounds;        
    },
};