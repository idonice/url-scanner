import whois from 'whois-json';
import { URL } from 'url';

export const getWhoisInfo = async (url: string) => {
  try {
    const parsedUrl = new URL(url);
    let riskScore = 0;
    const domain = parsedUrl.hostname;
    const data = await whois(domain);
    if (data?.creationDate) {
      const ageInDays =
        (Date.now() - new Date(data.creationDate).getTime()) /
        (1000 * 60 * 60 * 24);

      if (ageInDays < 90) {
        riskScore += 20;
      }
    }
    return riskScore;
  } catch (error) {
    console.log('whois error: ', error);
    return null;
  }
};
