import axios from 'axios';
import {IApiRequestParams} from '../interfaces/IApiRequestParams';


export const getTopHeadlines = (country?: string | null, category?: string | null, sources?: string | null, q?: string | null, page?: number | null, resultFrom: string | null = 'top-headlines') => {
  const params: IApiRequestParams = {
    apiKey: process.env.NEWS_API_KEY!,
  };


  if (category) {
    params.category = category;
  }

  if (country && resultFrom === 'top-headlines') {
    params.country = country;
  }

  if (sources) {
    params.sources = sources;
  }

  if (q) {
    params.q = q;
  }

  if (page) {
    params.page = page;
  }

  return axios({
    method: 'get',
    url: `http://newsapi.org/v2/${resultFrom}`,
    params,
  })
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log(error);
        return error;
      });
};


export const getNewsByCategory = async (category: string, page?: number) => {
  return await getTopHeadlines('gb', category, null, null, page);
};


export const getNewsBySearchTerm = async (searchTerm: string) => {
  return await getTopHeadlines(null, null, null, searchTerm, null, 'everything');
};

